import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class CompanyClassifier:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def classify(self, description):
        """
        Clasifica una empresa basándose en su descripción usando OpenAI.
        """
        if not self.client:
            # Simulación si no hay API Key
            return {"industry": "Technology", "category": "General"}

        prompt = f"""
        Clasifica la industria y categoría de la empresa a partir de la siguiente descripción.
        Devuelve únicamente un JSON con este formato:
        {{
            "industry": "string",
            "category": "string"
        }}

        Descripción de la empresa:
        {description}
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error en clasificación AI: {e}")
            return {"industry": "Unknown", "category": "Unknown"}
