docker build -t ml_app:latest .   
docker run -it --rm -p 8000:8000 ml_app:latest