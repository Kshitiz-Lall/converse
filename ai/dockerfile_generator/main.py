import subprocess
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Define the structure for conversation
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

# Store the conversation context in memory (a simple list for this example)
conversation_context = []

# API endpoint to handle the conversation
@app.post("/conversation")
async def conversation(messages: List[Message]):
    global conversation_context

    # Append new messages to the conversation context
    for message in messages:
        conversation_context.append({"role": message.role, "content": message.content})

    # Prepare the conversation context for the model input
    conversation_input = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation_context])

    # Run the Ollama command to get a response from the model
    result = subprocess.run(
        ["ollama", "run", "deepseek", "--input", conversation_input],
        capture_output=True,
        text=True,
    )

    # Get the response from the model
    response = result.stdout.strip()

    # Append assistant's reply to the conversation context
    conversation_context.append({"role": "assistant", "content": response})

    return {"response": response}

