docker build -t ml_backend:latest .
docker run -it --rm -p 5000:5000 ml_backend:latest