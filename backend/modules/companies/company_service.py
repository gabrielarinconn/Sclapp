from backend.db.connection import execute_query

class CompanyService:
    @staticmethod
    def list_companies(filters=None):
        """
        Lista todas las empresas con filtros opcionales.
        """
        query = "SELECT * FROM company"
        params = []
        
        if filters:
            conditions = []
            if 'sector' in filters:
                conditions.append("sector = %s")
                params.append(filters['sector'])
            if 'id_status' in filters:
                conditions.append("id_status = %s")
                params.append(filters['id_status'])
            
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
        
        query += " ORDER BY created_at DESC"
        return execute_query(query, params), 200

    @staticmethod
    def get_company(id_company):
        """
        Obtiene los detalles de una empresa.
        """
        query = "SELECT * FROM company WHERE id_company = %s"
        result = execute_query(query, (id_company,))
        
        if result:
            return result[0], 200
        return {"error": "Empresa no encontrada"}, 404

    @staticmethod
    def update_company(id_company, data):
        """
        Actualiza los datos de una empresa.
        """
        fields = []
        params = []
        for key, value in data.items():
            if key in ['name', 'sector', 'email', 'phone', 'address', 'url', 'country', 'description', 'category', 'score', 'id_status']:
                fields.append(f"{key} = %s")
                params.append(value)
        
        if not fields:
            return {"error": "No hay campos válidos para actualizar"}, 400
            
        params.append(id_company)
        query = f"UPDATE company SET {', '.join(fields)}, updated_at = CURRENT_TIMESTAMP WHERE id_company = %s"
        
        result = execute_query(query, params, fetch=False)
        if result:
            return {"message": "Empresa actualizada exitosamente"}, 200
        return {"error": "Error al actualizar empresa"}, 500
