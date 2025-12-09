FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el contenido de la carpeta app directamente en /app
COPY app ./

# Copiar .env
COPY .env .

EXPOSE 8889

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8889"]