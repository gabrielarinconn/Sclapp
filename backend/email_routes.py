# routes.py (Actualizado)
from flask import Flask, request, jsonify
from email_service import BrevoService
import sqlite3 # O tu ORM de preferencia

app = Flask(__name__)
email_service = BrevoService()

def log_email_to_db(company_id, brevo_message_id, template_id):
    """Guarda el intento de envío en tu DB local"""
    conn = sqlite3.connect('sclapp.db')
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO outreach_log (company_id, brevo_message_id, template_used) VALUES (?, ?, ?)",
        (company_id, brevo_message_id, template_id)
    )
    conn.commit()
    conn.close()

@app.route('/api/outreach/send', methods=['POST'])
def trigger_outreach():
    data = request.json
    company_id = data.get('company_id') # Necesitas el ID de tu DB
    company_email = data.get('email')
    company_name = data.get('company_name')
    
    TEMPLATE_ID = 1 # ID de Brevo
    params = {"NAME": company_name}
    
    result = email_service.send_outreach_email(company_email, company_name, TEMPLATE_ID, params)
    
    if result['status'] == 'success':
        # --- AQUÍ GUARDAMOS EN TU DB ---
        log_email_to_db(company_id, result['message_id'], TEMPLATE_ID)
        
        return jsonify({"message": "Correo enviado y registrado", "id": result['message_id']}), 200
    else:
        return jsonify({"message": "Error al enviar", "error": result['message']}), 500