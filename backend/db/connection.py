import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """
    Establece una conexión con la base de datos PostgreSQL.
    """
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', '127.0.0.1'),
            port=os.getenv('DB_PORT', '5432'),
            database=os.getenv('DB_NAME', 'sclapp'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', '0421')
        )
        return conn
    except Exception as e:
        print(f"Error conectando a la base de datos: {e}")
        return None

def get_db_info():
    """
    Devuelve host, port y database según env (para depuración: confirmar qué DB usa el backend).
    """
    return {
        "host": os.getenv("DB_HOST", "127.0.0.1"),
        "port": os.getenv("DB_PORT", "5432"),
        "database": os.getenv("DB_NAME", "sclapp"),
    }


def execute_query(query, params=None, fetch=True):
    """
    Ejecuta una consulta SQL. Siempre hace commit tras execute para que INSERT/UPDATE persistan.
    Si fetch=True, devuelve cur.fetchall(); si fetch=False, devuelve True.
    En error: imprime el error, hace rollback y re-lanza la excepción (no silencia).
    """
    conn = get_db_connection()
    if conn is None:
        raise RuntimeError("No se pudo conectar a la base de datos (get_db_connection devolvió None).")

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query, params)
            conn.commit()
            if fetch:
                result = cur.fetchall()
            else:
                result = True
            return result
    except Exception as e:
        print(f"Error ejecutando consulta: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()
