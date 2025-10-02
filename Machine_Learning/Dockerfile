# Use official Python 3.12.6 image
FROM python:3.12.6-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .
EXPOSE 8000
# Set the default command to run the app
CMD ["python", "backendpython/App.py"]
