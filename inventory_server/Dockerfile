# Dockerfile

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Ensure all project files including inventory app are copied
COPY . /app/

# Set PYTHONPATH for Django to discover modules
ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["gunicorn", "inventory_server.wsgi:application", "--bind", "0.0.0.0:8080"]

# Add this to Dockerfile
COPY .env /app/.env

# Dump environment vars for debugging
RUN echo "DEBUG ENV:" && env

