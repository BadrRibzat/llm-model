import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import logging
from typing import Optional, Dict, Any
from pathlib import Path

logger = logging.getLogger(__name__)

class AIModelService:
    """
    Service class for loading and using the AI Chat Model.
    Handles model loading, inference, and error handling.
    """

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.pipeline = None
        self.model_loaded = False
        self.model_path = Path(__file__).parent / "models"

        # Model configuration
        self.model_name = "microsoft/DialoGPT-medium"  # Better conversational model
        self.max_length = 512
        self.temperature = 0.7
        self.top_p = 0.9
        self.do_sample = True

    def load_model(self) -> bool:
        """
        Load the AI model from the models directory or Hugging Face Hub.
        Returns True if successful, False otherwise.
        """
        try:
            logger.info("Loading AI model...")

            # First try to load from Hugging Face Hub (since local model may not be available)
            try:
                logger.info("Attempting to load model from Hugging Face Hub...")
                self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)

                # Add padding token if it doesn't exist
                if self.tokenizer.pad_token is None:
                    self.tokenizer.pad_token = self.tokenizer.eos_token

                self.model = AutoModelForCausalLM.from_pretrained(
                    self.model_name,
                    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                    device_map="auto" if torch.cuda.is_available() else None,
                    low_cpu_mem_usage=True
                )

                # Create pipeline for conversational AI
                self.pipeline = pipeline(
                    "text-generation",
                    model=self.model,
                    tokenizer=self.tokenizer,
                    device=0 if torch.cuda.is_available() else -1,
                    max_new_tokens=50,  # Generate fewer new tokens for conversation
                    temperature=0.8,    # Slightly higher temperature for more variety
                    top_p=self.top_p,
                    do_sample=self.do_sample,
                    pad_token_id=self.tokenizer.eos_token_id,
                    repetition_penalty=1.2  # Penalize repetition
                )

                self.model_loaded = True
                logger.info("AI model loaded successfully from Hugging Face Hub")
                return True

            except Exception as hf_error:
                logger.error(f"Failed to load model from Hugging Face Hub: {hf_error}")

                # Fallback: try to load from local directory
                if self.model_path.exists():
                    model_files = list(self.model_path.glob("*"))
                    if model_files:
                        try:
                            self.tokenizer = AutoTokenizer.from_pretrained(str(self.model_path))
                            self.model = AutoModelForCausalLM.from_pretrained(
                                str(self.model_path),
                                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                                device_map="auto" if torch.cuda.is_available() else None,
                                low_cpu_mem_usage=True
                            )

                            self.pipeline = pipeline(
                                "text-generation",
                                model=self.model,
                                tokenizer=self.tokenizer,
                                device=0 if torch.cuda.is_available() else -1,
                                max_length=self.max_length,
                                temperature=self.temperature,
                                top_p=self.top_p,
                                do_sample=self.do_sample,
                                pad_token_id=self.tokenizer.eos_token_id
                            )

                            self.model_loaded = True
                            logger.info("AI model loaded successfully from local directory")
                            return True

                        except Exception as local_error:
                            logger.error(f"Failed to load model from local directory: {local_error}")
                            return False
                    else:
                        logger.warning("No model files found in models directory")
                        return False
                else:
                    logger.warning(f"Model directory {self.model_path} does not exist")
                    return False

        except Exception as e:
            logger.error(f"Error loading AI model: {e}")
            return False

    def generate_response(self, prompt: str, max_length: Optional[int] = None) -> str:
        """
        Generate a response using the loaded AI model.

        Args:
            prompt: Input text prompt
            max_length: Maximum length of generated response

        Returns:
            Generated response text
        """
        if not self.model_loaded:
            if not self.load_model():
                return "I'm sorry, but the AI model is not currently available. Please try again later."

        try:
            # Format prompt for conversational AI
            if "DialoGPT" in self.model_name:
                # DialoGPT works better with conversational format
                formatted_prompt = f"User: {prompt}\nAssistant:"
            else:
                formatted_prompt = prompt

            # Generate response using pipeline
            if self.pipeline:
                outputs = self.pipeline(
                    formatted_prompt,
                    max_new_tokens=50,  # Generate only new tokens, not including prompt
                    num_return_sequences=1,
                    truncation=True,
                    return_full_text=True,
                    repetition_penalty=1.2
                )

                if outputs and len(outputs) > 0:
                    full_response = outputs[0].get('generated_text', '').strip()
                    # Remove the original prompt from the response
                    if full_response.startswith(formatted_prompt):
                        response = full_response[len(formatted_prompt):].strip()
                    else:
                        response = full_response
                    
                    # Clean up the response - take only the first sentence or reasonable chunk
                    if response:
                        # Split on sentence endings and take first meaningful response
                        sentences = response.split('.')
                        if sentences and sentences[0].strip():
                            response = sentences[0].strip() + '.'
                        else:
                            response = response[:100] + '...' if len(response) > 100 else response
                    
                    return response if response else "I apologize, but I couldn't generate a meaningful response."

            # Fallback method using direct model inference
            elif self.model and self.tokenizer:
                inputs = self.tokenizer(prompt, return_tensors="pt")

                if torch.cuda.is_available():
                    inputs = {k: v.cuda() for k, v in inputs.items()}
                    self.model = self.model.cuda()

                with torch.no_grad():
                    outputs = self.model.generate(
                        **inputs,
                        max_length=max_length,
                        temperature=self.temperature,
                        top_p=self.top_p,
                        do_sample=self.do_sample,
                        pad_token_id=self.tokenizer.eos_token_id,
                        num_return_sequences=1
                    )

                response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                # Remove the original prompt from response
                if response.startswith(prompt):
                    response = response[len(prompt):].strip()

                return response if response else "I apologize, but I couldn't generate a response."

            else:
                return "AI model components are not properly initialized."

        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "I apologize, but I encountered an error while processing your request. Please try again."

    def get_model_info(self) -> Dict[str, Any]:
        """
        Get information about the loaded model.

        Returns:
            Dictionary containing model information
        """
        info = {
            "model_loaded": self.model_loaded,
            "model_path": str(self.model_path),
            "cuda_available": torch.cuda.is_available(),
            "device": "cuda" if torch.cuda.is_available() else "cpu"
        }

        if self.model_loaded and self.model:
            info.update({
                "model_type": type(self.model).__name__,
                "tokenizer_type": type(self.tokenizer).__name__,
                "max_position_embeddings": getattr(self.model.config, 'max_position_embeddings', 'Unknown'),
                "vocab_size": getattr(self.model.config, 'vocab_size', 'Unknown'),
            })

        return info

    def unload_model(self):
        """
        Unload the model from memory to free up resources.
        """
        if self.model:
            del self.model
            self.model = None

        if self.tokenizer:
            del self.tokenizer
            self.tokenizer = None

        if self.pipeline:
            del self.pipeline
            self.pipeline = None

        self.model_loaded = False

        # Force garbage collection
        import gc
        gc.collect()

        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        logger.info("AI model unloaded from memory")

# Global instance
ai_service = AIModelService()