import os
from dotenv import load_dotenv

load_dotenv()

print("OPENAI_API_KEY exists:", bool(os.getenv("OPENAI_API_KEY")))
print("OPENAI_MODEL:", os.getenv("OPENAI_MODEL"))