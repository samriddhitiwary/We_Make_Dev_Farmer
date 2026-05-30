# 🌾 We Make Dev Farmer (Farm2Fork+) 🚜

Welcome to **Farm2Fork+**, an intelligent, multi-service agricultural ecosystem that connects farmers directly with consumers, provides visual AI crop quality grading, performs crop disease detection, predicts mandi (market) prices, and offers smart crop recommendations using machine learning.

The repository is structured as a monorepo containing three core services:
1. **`frontend/`**: A universal React Native application powered by Expo and TailwindCSS.
2. **`backend/`**: A Node.js & Express server connected to MongoDB for user management, transactions, and ordering.
3. **`Machine_Learning/`**: A Python & FastAPI microservice hosting multiple AI/ML models.

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [💻 Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [⚙️ Getting Started (Local Setup)](#%EF%B8%8F-getting-started-local-setup)
  - [Prerequisites](#prerequisites)
  - [1. Node.js Backend Setup](#1-nodejs-backend-setup)
  - [2. Python FastAPI ML Service Setup](#2-python-fastapi-ml-service-setup)
  - [3. React Native Expo Frontend Setup](#3-react-native-expo-frontend-setup)
- [🐳 Docker Containerization](#-docker-containerization)
  - [Building and Running Individually](#building-and-running-individually)
  - [Running with Docker Compose (Recommended)](#running-with-docker-compose-recommended)
- [🔌 API Endpoints Reference](#-api-endpoints-reference)
  - [Node.js Backend Endpoints](#nodejs-backend-endpoints)
  - [FastAPI ML Endpoints](#fastapi-ml-endpoints)
- [📝 Environment Variables Configuration](#-environment-variables-configuration)

---

## ✨ Key Features

*   🌾 **AI Crop Recommendation**: Utilizes soil characteristics (Nitrogen, Phosphorus, Potassium, pH levels), region-based average temperature, humidity, and planting month to recommend the most optimal crop using an **XGBoost Classifier**.
*   🐛 **Crop Disease Detection**: Image classification and computer vision powered by Hugging Face models to identify crop diseases from uploaded photos.
*   🍎 **Crop Quality Grading**: Analyzes crop images to determine the physical quality grade of the agricultural product (A-Grade, B-Grade, etc.) using custom neural networks.
*   📈 **AI Mandi Price Predictor**: Foresees future market prices (Mandi prices) for various crops based on historic time-series data.
*   🌱 **Soil Classification**: AI models that classify the soil type to recommend appropriate fertilizers.
*   💬 **Farmer AI Chatbot**: An LLM-powered interactive chatbot using the OpenAI API to guide farmers and consumers on agricultural issues, weather tips, and planting schedules.
*   🛒 **Farm2Fork Marketplace**: Direct trade and ordering system linking consumers to farmers (Express backend).

---

## 💻 Tech Stack

### Frontend (Expo Mobile Application)
- **Core**: React Native & React Dom (v19.1.0)
- **Framework**: Expo (v54.0.9) with file-based routing (**Expo Router**)
- **Styling**: TailwindCSS via **NativeWind** (v4.2.1) & **React Native Paper**
- **Visualization**: **React Native Chart Kit** & **Recharts**
- **Other**: Gifted Chat, React Native Gesture Handler, Expo Audio/Speech API, Axios

### Backend (Node.js API)
- **Language**: JavaScript (Node.js v22.11.0)
- **Framework**: Express (v5.1.0)
- **Database**: MongoDB (via Mongoose v8.18.1)
- **Security**: Cryptographic password hashing using `bcryptjs`
- **Development**: Nodemon

### Machine Learning (Python AI Service)
- **Language**: Python (v3.12.6)
- **Web API**: FastAPI & Uvicorn (ASGI web server)
- **Machine Learning & Analytics**: Scikit-Learn, PyTorch, TensorFlow/Keras, XGBoost, Pandas, NumPy, Matplotlib, Seaborn
- **Image Processing**: OpenCV, Pillow (PIL), Albumentations
- **AI Integrations**: OpenAI API, Hugging Face Inference API

---

## 📂 Project Structure

```text
We_Make_Dev_Farmer/
├── backend/                  # Node.js + Express + MongoDB Server
│   ├── config/               # Database and configuration files
│   ├── controllers/          # Business logic handlers
│   ├── models/               # MongoDB Mongoose schemas
│   ├── routes/               # Express API route declarations
│   ├── server.js             # Entry point of Node.js Server
│   └── Dockerfile            # Production Docker image configuration
│
├── Machine_Learning/         # AI models and FastAPI python backend
│   ├── backendpython/        # Python web backend logic
│   │   ├── api/              # API router files (disease, recommendation, etc.)
│   │   └── App.py            # FastAPI main entry point
│   ├── Crop Recommendation/  # Datasets & XGBoost training scripts
│   ├── Crop Disease Detection/
│   ├── Crop Quality Grading/
│   ├── Soil Classification/
│   ├── Dockerfile            # ML Python container instructions
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # React Native / Expo Router app
    ├── app/                  # Main Expo router routes
    ├── components/           # Reusable UI widgets
    ├── hooks/                # Custom React hooks
    ├── App.js                # React Native entry point
    └── Dockerfile            # Expo development web-server container
```

---

## ⚙️ Getting Started (Local Setup)

### Prerequisites
Before running the services, make sure you have:
*   [Node.js (v22.11.0 or higher)](https://nodejs.org/) installed.
*   [Python (v3.12.x)](https://www.python.org/) installed.
*   An active [MongoDB Atlas Cluster](https://www.mongodb.com/cloud/atlas) or a local MongoDB database instance.
*   [Expo Go app](https://expo.dev/go) installed on your mobile device (iOS/Android) if you want to test the app on physical hardware.

---

### 1. Node.js Backend Setup

1.  Navigate into the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend/` directory with the following variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    ```
4.  Start the development server using nodemon:
    ```bash
    npm run dev
    ```
    *Note: The server will run on `http://localhost:5000`.*

---

### 2. Python FastAPI ML Service Setup

1.  Navigate into the `Machine_Learning/` directory:
    ```bash
    cd Machine_Learning
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    - **Windows (Command Prompt)**:
      ```cmd
      venv\Scripts\activate.bat
      ```
    - **Windows (PowerShell)**:
      ```powershell
      .\venv\Scripts\Activate.ps1
      ```
    - **Linux/macOS**:
      ```bash
      source venv/bin/activate
      ```
4.  Install the Python requirements:
    ```bash
    pip install -r requirements.txt
    ```
5.  Start the FastAPI application:
    ```bash
    python backendpython/App.py
    ```
    *Note: The ML service will run on `http://localhost:8000`. You can access the interactive API docs at `http://localhost:8000/docs`.*

---

### 3. React Native Expo Frontend Setup

1.  Navigate into the `frontend/` directory:
    ```bash
    cd frontend
    ```
2.  Install the required packages:
    ```bash
    npm install
    ```
3.  Start the Expo dev server:
    ```bash
    npm run start
    ```
4.  Run the application:
    - **Physical Device**: Scan the QR code shown in the terminal with your phone using **Expo Go** (Android) or the **Camera app** (iOS). Make sure your computer and mobile device are on the same Wi-Fi network.
    - **Android Emulator**: Press `a` in the terminal.
    - **iOS Simulator**: Press `i` in the terminal.
    - **Web Browser**: Press `w` in the terminal to load the web deployment.

---

## 🐳 Docker Containerization

Every service contains a custom `Dockerfile` located in its respective folder, making containerization and deployment extremely simple.

### Building and Running Individually

#### **1. Node.js Backend**
```bash
cd backend
docker build -t farm_backend:latest .
docker run -d -p 5000:5000 --env-file .env farm_backend:latest
```

#### **2. Python ML Service**
```bash
cd Machine_Learning
docker build -t farm_ml:latest .
docker run -d -p 8000:8000 farm_ml:latest
```

#### **3. Expo Frontend**
```bash
cd frontend
docker build -t farm_frontend:latest .
docker run -d -p 8081:8081 farm_frontend:latest
```

---

### Running with Docker Compose (Recommended)

To launch all services together alongside a MongoDB instance, you can define a `docker-compose.yml` file in the root directory:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/farm2fork
      - PORT=5000
    depends_on:
      - mongodb

  ml_service:
    build: ./Machine_Learning
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    ports:
      - "8081:8081"
    stdin_open: true
    tty: true

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Launch the entire ecosystem with:
```bash
docker compose up --build
```

---

## 🔌 API Endpoints Reference

### Node.js Backend Endpoints
Base URL: `http://localhost:5000`

| HTTP Method | Route | Description |
| :--- | :--- | :--- |
| **POST** | `/api/users/register` | Registers a new farmer or consumer account |
| **GET** | `/api/users/:id` | Returns metadata for a user profile |
| **PUT** | `/api/users/:id` | Updates user details (profile pictures, contact, etc.) |
| **POST** | `/api/crops` | Add a new crop product for sale |
| **GET** | `/api/crops` | Fetch list of all crops available in marketplace |
| **GET** | `/api/crops/:id` | Fetch details of a single crop listing |
| **POST** | `/api/predictions` | Record ML prediction history |
| **GET** | `/api/predictions` | Retrieve prediction records by crop & region |

---

### FastAPI ML Endpoints
Base URL: `http://localhost:8000`

| HTTP Method | Route | Input Format | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/chat` | JSON Body | AI Farmer Chatbot Assistant conversation |
| **POST** | `/api/recommend_crop` | JSON Body | Returns recommended crop based on soil N-P-K & weather |
| **POST** | `/api/detect_disease` | Form-Data (Image) | Examines leaf images to classify crop diseases |
| **POST** | `/api/grade_crop` | Form-Data (Image) | Evaluates uploaded crop visual quality |
| **POST** | `/api/predict_mandi_price`| JSON Body | Forecasts regional mandi commodity prices |

---

## 📝 Environment Variables Configuration

Make sure your server environment variables are structured as follows:

### Backend Configuration (`backend/.env`)
```ini
# Database Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname

# Host Port
PORT=5000
```

> [!WARNING]
> Never commit `.env` files to git repositories. Ensure they are included in your `.gitignore` to prevent sensitive credentials leak.
