# email_service.py
import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class BrevoService:
    def __init__(self):
        self.configuration = sib_api_v3_sdk.Configuration()
        self.configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')
        self.api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(self.configuration))
        self.sender = {"name": os.getenv('SENDER_NAME'), "email": os.getenv('SENDER_EMAIL')}

    def send_outreach_email(self, recipient_email, recipient_name, template_id, params):
        """
        Envía un correo usando una plantilla de Brevo generada con IA.
        
        :param recipient_email: Email de la empresa destino
        :param recipient_name: Nombre de la empresa destino
        :param template_id: ID de la plantilla configurada en Brevo
        :param params: Diccionario con variables dinámicas (ej: {"COMPANY": "TechCorp"})
        """
        
        to = [{"email": recipient_email, "name": recipient_name}]
        
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=to,
            sender=self.sender,
            template_id=int(template_id),
            params=params
        )

        try:
            response = self.api_instance.send_transac_email(send_smtp_email)
            return {"status": "success", "message_id": response.message_id}
        except ApiException as e:
            print(f"Exception when calling SMTPApi->send_transac_email: {e}")
            return {"status": "error", "message": str(e)}