FROM python:3.12-slim

# Dependencias del sistema para psycopg2 / Postgres
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /code

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la app
COPY ./app ./app

# Para que "app" sea importable como paquete
ENV PYTHONPATH=/code

# Comando para levantar FastAPI con uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8886"]