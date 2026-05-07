# 🛡️ HealthGuard AI - API Testing Guide

The server runs by default on `http://localhost:5000`.

## 1. Authentication (User Management)
| Method | Endpoint | Description | Body (JSON) |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/users/register` | Create a new user profile | `{ "email": "test@user.com", "password": "password123", "profile": { "age": 25, "gender": "female" } }` |
| **POST** | `/api/users/login` | Get JWT access token | `{ "email": "test@user.com", "password": "password123" }` |
| **GET** | `/api/users/profile` | View user profile (Auth Req) | *Header: Authorization: Bearer <token>* |
| **POST** | `/api/users/checkin` | Add daily health log (Auth Req) | `{ "log": { "mood": "Energetic", "symptoms": ["headache"] } }` |

## 2. AI Health Analysis Pipeline
| Method | Endpoint | Description | Body (JSON) |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/health/analyze` | Run multi-agent health analysis | `{ "symptoms": "I have a cough and chest pain", "location": "London" }` |
| **POST** | `/api/health/upload-lab` | OCR Lab Analysis (Form-Data) | *Key: 'file' (Image/PDF), Key: 'age': 30* |
| **POST** | `/api/health/download` | Generate SBAR PDF Report | Pass the JSON object returned from `/analyze` |

## 3. Quick Test Command (cURL)
```bash
# Health Check
curl http://localhost:5000/

# Basic Analysis (No Auth Required for demo)
curl -X POST http://localhost:5000/api/health/analyze \
     -H "Content-Type: application/json" \
     -d '{"symptoms": "shortness of breath", "location": "New York"}'
```
