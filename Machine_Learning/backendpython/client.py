from huggingface_hub import InferenceClient

# Your Hugging Face API key
API_KEY = ""

# Initialize Hugging Face Inference client
client = InferenceClient(
    provider="hf-inference",  # Correct provider
    api_key=API_KEY
)

# Conversation history for multi-turn chat
conversation_history = []

print("Welcome to TinyLlama GPT-style chat! Type 'exit' to quit.")

while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        break

    # Append user message to conversation
    conversation_history.append(f"User: {user_input}")

    # Build prompt with full conversation
    prompt = "\n".join(conversation_history) + "\nAssistant:"

    try:
        # Generate response
        result = client.text_generation(
            prompt,
            model="TheBloke/TinyLlama-1.1B-Chat-v1.0",
            max_new_tokens=150,
            temperature=0.7,  # slightly creative
            top_p=0.9,
            do_sample=True
        )

        # Extract generated text
        if isinstance(result, dict) and "generated_text" in result:
            response_text = result["generated_text"]
        elif isinstance(result, str):
            response_text = result
        elif isinstance(result, list) and len(result) > 0 and "generated_text" in result[0]:
            response_text = result[0]["generated_text"]
        else:
            response_text = str(result)

        # Only take assistant's reply (after last "Assistant:" marker)
        if "Assistant:" in response_text:
            response_text = response_text.split("Assistant:")[-1].strip()

        print("Assistant:", response_text)

        # Append assistant reply to conversation
        conversation_history.append(f"Assistant: {response_text}")

    except Exception as e:
        print("Error while generating text:", e)
