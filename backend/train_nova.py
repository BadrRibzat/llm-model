import os
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    pipeline
)
from peft import LoraConfig, prepare_model_for_kbit_training, get_peft_model
from trl import SFTTrainer, SFTConfig

# Hardware Detection
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"--- Detected Device: {device} ---")

# 1. Configuration 
base_model = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
dataset_name = "tatsu-lab/alpaca" 
new_model = "nova-llm-fine-tuned"

# 2. Load dataset
# Using a very small subset for CPU speed if needed
subset_size = 5000 if device == "cuda" else 500
dataset = load_dataset(dataset_name, split=f"train[:{subset_size}]")

# 3. Quantization Config (ONLY if CUDA is available)
bnb_config = None
if device == "cuda":
    from transformers import BitsAndBytesConfig
    print("Enabling 4-bit Quantization (QLoRA)...")
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=True,
    )
else:
    print("Running on CPU: Disabling BitAndBytes quantization (CUDA only).")

# 4. Load Model and Tokenizer
model = AutoModelForCausalLM.from_pretrained(
    base_model,
    quantization_config=bnb_config,
    device_map=device if device == "cuda" else None,
    dtype=torch.float16 if device == "cuda" else torch.float32,
    low_cpu_mem_usage=True
)
model.config.use_cache = False
model.config.pretraining_tp = 1

tokenizer = AutoTokenizer.from_pretrained(base_model, trust_remote_code=True)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

# 5. PEFT Config (LoRA)
peft_config = None
if device == "cuda":
    peft_config = LoraConfig(
        lora_alpha=16,
        lora_dropout=0.1,
        r=64,
        bias="none",
        task_type="CAUSAL_LM",
    )

# 6. Training Arguments (using SFTConfig for latest TRL)
training_config = SFTConfig(
    output_dir="./results",
    num_train_epochs=1,
    per_device_train_batch_size=4 if device == "cuda" else 1,
    gradient_accumulation_steps=1 if device == "cuda" else 4,
    optim="paged_adamw_32bit" if device == "cuda" else "adamw_torch",
    save_steps=100,
    logging_steps=10,
    learning_rate=2e-4,
    weight_decay=0.001,
    fp16=(device == "cuda"),
    bf16=False,
    max_grad_norm=0.3,
    max_steps=-1,
    warmup_ratio=0.03,
    group_by_length=True,
    lr_scheduler_type="constant",
    report_to="none",
    use_cpu=(device == "cpu"),
    max_length=512,
    packing=False,
)

# 7. Formatting function for Alpaca dataset
def formatting_prompts_func(example):
    output_texts = []
    # Check if 'instruction' is a list (batch mode)
    if isinstance(example['instruction'], list):
        for i in range(len(example['instruction'])):
            text = f"<|system|>\nYou are NOVA, a helpful AI.</s>\n<|user|>\n{example['instruction'][i]} {example['input'][i]}</s>\n<|assistant|>\n{example['output'][i]}</s>"
            output_texts.append(text)
        return output_texts
    else:
        # Single example mode
        text = f"<|system|>\nYou are NOVA, a helpful AI.</s>\n<|user|>\n{example['instruction']} {example['input']}</s>\n<|assistant|>\n{example['output']}</s>"
        return text

# 8. Trainer
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    peft_config=peft_config,
    formatting_func=formatting_prompts_func,
    processing_class=tokenizer, # Renamed from tokenizer
    args=training_config,
)

# 9. Train!
print(f"Starting training on {device}...")
trainer.train()

# 10. Save Model
trainer.model.save_pretrained(new_model)
print(f"Model saved to {new_model}")
