# HealthGuard AI GCP Deployment

This repo deploys as two Cloud Run services:

- `healthguard-backend`: Express API
- `healthguard-frontend`: Vite static frontend served by nginx

Current deployed URLs:

- Frontend: `https://healthguard-frontend-808293038514.us-central1.run.app`
- Backend: `https://healthguard-backend-808293038514.us-central1.run.app`

## Required Secrets / Environment

Backend Cloud Run environment variables:

```env
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://healthguard-frontend-808293038514.us-central1.run.app
DATABASE_URL=postgres://avnadmin:REDACTED@healthguard-healthguard.j.aivencloud.com:16930/defaultdb?sslmode=require
DB_SSLMODE=require
JWT_SECRET=REPLACE_WITH_LONG_RANDOM_SECRET
GROQ_API_KEY=REPLACE_WITH_GROQ_KEY
WEATHER_API_KEY=REPLACE_WITH_OPENWEATHER_KEY
```

Frontend build variable:

```env
VITE_API_URL=https://healthguard-backend-808293038514.us-central1.run.app
```

## One-Time GCP Setup

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
gcloud artifacts repositories create healthguard --repository-format=docker --location=us-central1
```

## Deploy Backend

```bash
gcloud builds submit --config cloudbuild.backend.yaml --substitutions _REGION=us-central1,_SERVICE=healthguard-backend
```

Then set secrets/env on Cloud Run:

```bash
gcloud run services update healthguard-backend \
  --region us-central1 \
  --set-env-vars NODE_ENV=production,PORT=8080,DB_SSLMODE=require \
  --set-env-vars DATABASE_URL='postgres://avnadmin:REDACTED@healthguard-healthguard.j.aivencloud.com:16930/defaultdb?sslmode=require' \
  --set-env-vars JWT_SECRET='REPLACE' \
  --set-env-vars GROQ_API_KEY='REPLACE' \
  --set-env-vars WEATHER_API_KEY='REPLACE' \
  --set-env-vars CORS_ORIGIN='https://YOUR_FRONTEND_CLOUD_RUN_URL'
```

## Deploy Frontend

After the backend URL is known:

```bash
gcloud builds submit --config cloudbuild.frontend.yaml \
  --substitutions _REGION=us-central1,_SERVICE=healthguard-frontend,_VITE_API_URL=https://healthguard-backend-808293038514.us-central1.run.app
```

Then update backend CORS with the final frontend URL.
