from app import app, db
from models import User

with app.app_context():
    db.create_all()
    # Crear un usuario de prueba
    if not User.query.filter_by(username='testuser').first():
        user = User(username='testuser')
        user.set_password('testpass')
        db.session.add(user)
        db.session.commit()
        print("Usuario de prueba creado: testuser / testpass")
    else:
        print("Usuario de prueba ya existe")