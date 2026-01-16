import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import logging
from typing import Optional, Dict, Any, List
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
        Generate a contextual response using the loaded AI model.

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
            # Analyze the prompt to determine the type of response needed
            prompt_lower = prompt.lower()

            # Enhanced prompt engineering based on content type
            enhanced_prompt = self._enhance_prompt(prompt)

            # Generate response using pipeline
            if self.pipeline:
                outputs = self.pipeline(
                    enhanced_prompt,
                    max_new_tokens=100,  # Allow longer responses
                    num_return_sequences=1,
                    truncation=True,
                    return_full_text=True,
                    repetition_penalty=1.2,
                    temperature=0.7,  # More focused responses
                    do_sample=True
                )

                if outputs and len(outputs) > 0:
                    full_response = outputs[0].get('generated_text', '').strip()

                    # Clean up response for conversational models
                    if "DialoGPT" in self.model_name and "Assistant:" in enhanced_prompt:
                        # Remove any remaining prompt parts
                        if full_response.startswith(enhanced_prompt):
                            response = full_response[len(enhanced_prompt):].strip()
                        else:
                            response = full_response
                    else:
                        response = full_response

                    # Post-process response for better quality
                    response = self._post_process_response(response, prompt)

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

    def _enhance_prompt(self, prompt: str) -> str:
        """
        Enhance the prompt based on its content type for better responses.
        """
        prompt_lower = prompt.lower()

        # Code-related prompts
        if any(keyword in prompt_lower for keyword in ['code', 'program', 'function', 'script', 'python', 'javascript', 'html', 'css']):
            enhanced = f"User: {prompt}\nAssistant: I can help you with coding. Here's what you need:"
        # Content creation prompts
        elif any(keyword in prompt_lower for keyword in ['write', 'create', 'generate', 'make', 'design', 'build']):
            enhanced = f"User: {prompt}\nAssistant: I'll help you create that content. Here's my response:"
        # Question prompts
        elif any(keyword in prompt_lower for keyword in ['what', 'how', 'why', 'when', 'where', 'who', '?']):
            enhanced = f"User: {prompt}\nAssistant: Let me answer your question:"
        # File/document prompts
        elif any(keyword in prompt_lower for keyword in ['file', 'document', 'pdf', 'upload', 'attachment']):
            enhanced = f"User: {prompt}\nAssistant: I can help you with your files and documents:"
        else:
            enhanced = f"User: {prompt}\nAssistant:"

        return enhanced

    def _post_process_response(self, response: str, original_prompt: str) -> str:
        """
        Post-process the response to improve quality and relevance.
        """
        if not response:
            return response

        # Remove excessive repetition
        sentences = response.split('.')
        if len(sentences) > 3:
            response = '.'.join(sentences[:3]) + '.'

        # Ensure response is not just repeating the prompt
        prompt_words = set(original_prompt.lower().split())
        response_words = set(response.lower().split())

        if len(prompt_words.intersection(response_words)) / len(prompt_words) > 0.8:
            return "I understand your request. Let me provide a more detailed response."

        # Clean up common artifacts from DialoGPT
        response = response.replace('User:', '').replace('Assistant:', '').strip()

        # Ensure response ends properly
        if not response.endswith(('.', '!', '?')):
            response += '.'

        return response.strip()

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

    def parse_artifacts(self, response: str) -> List[Dict[str, Any]]:
        """
        Parse response text for artifacts like code blocks, etc.

        Args:
            response: The response text to parse

        Returns:
            List of artifact dictionaries
        """
        artifacts = []
        import re

        # Parse code blocks (```language\ncode\n```)
        code_block_pattern = r'```(\w+)?\n?(.*?)\n?```'
        matches = re.findall(code_block_pattern, response, re.DOTALL)

        for match in matches:
            language, code = match
            if not language:
                language = 'text'

            artifacts.append({
                'type': 'code',
                'language': language.lower(),
                'content': code.strip(),
                'filename': f'code.{language.lower()}' if language != 'text' else 'code.txt'
            })

        # Parse inline code (`code`)
        inline_code_pattern = r'`([^`]+)`'
        inline_matches = re.findall(inline_code_pattern, response)

        for code in inline_matches:
            if len(code.strip()) > 10:  # Only consider substantial inline code
                artifacts.append({
                    'type': 'code',
                    'language': 'text',
                    'content': code.strip(),
                    'filename': 'inline_code.txt'
                })

        return artifacts

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