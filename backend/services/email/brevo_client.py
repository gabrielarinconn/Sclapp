import os
import requests
from dotenv import load_dotenv

load_dotenv()

class BrevoClient:
    def __init__(self):
        self.api_key = os.getenv('BREVO_API_KEY')
        self.sender_email = os.getenv('BREVO_SENDER_EMAIL')
        self.sender_name = os.getenv('BREVO_SENDER_NAME')
        self.url = "https://api.brevo.com/v3/smtp/email"

    def send_email(self, to_email, subject, body_html):
        """
        Envía un correo electrónico usando la API de Brevo.
        """
        if not self.api_key:
            print("Simulación: Enviando correo (falta BREVO_API_KEY)")
            return {"message": "Simulación exitosa", "messageId": "sim-123"}, 200

        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": self.api_key
        }

        payload = {
            "sender": {"name": self.sender_name, "email": self.sender_email},
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": body_html
        }

        try:
            response = requests.post(self.url, json=payload, headers=headers)
            if response.status_code in [200, 201, 202]:
                return response.json(), response.status_code
            return {"error": response.text}, response.status_code
        except Exception as e:
            return {"error": str(e)}, 500
