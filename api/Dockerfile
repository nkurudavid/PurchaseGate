# Image selection
FROM python:3.14-slim

# Working directory
WORKDIR /app

# Install system dependencies (if any)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . /app

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt


# Expose the port the app runs on
EXPOSE 8000


# development
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# production,
CMD ["gunicorn", "purchage_gate.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]