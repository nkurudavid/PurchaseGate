FROM python:3.13-slim-trixie

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app

# collect static in production step if needed
# CMD ["gunicorn", "purchase_gate.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]