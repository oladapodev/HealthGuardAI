# HealthGuard AI API Testing Guide

Server default: `http://localhost:5000`

Docs:

- Swagger UI: `GET /api/docs`
- OpenAPI JSON: `GET /api/docs.json`
- API health: `GET /api/v1/health`

## Auth

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@healthguard.ai","password":"password123","profile":{"firstName":"Alex","age":29,"gender":"female","location":"Lagos"}}'
```

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@healthguard.ai","password":"password123"}'
```

Set `TOKEN` from the response before testing protected routes.

## Profile And Check-Ins

```bash
curl http://localhost:5000/api/v1/profile \
  -H "Authorization: Bearer $TOKEN"
```

```bash
curl -X PUT http://localhost:5000/api/v1/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"profile":{"bloodGroup":"O+","conditions":["asthma"],"allergies":["pollen"],"medications":[],"menstrualCycle":{"lastPeriod":"2026-05-01","cycleLength":28,"symptoms":["cramps"]}}}'
```

```bash
curl -X POST http://localhost:5000/api/v1/checkins \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"log":{"mood":"Tired","notes":"Headache after poor sleep","symptoms":["headache"],"foodTags":["coffee"],"sleep":{"hours":5},"exercise":{"minutes":20}}}'
```

## Lab Upload And Analysis

```bash
curl -X POST http://localhost:5000/api/v1/labs/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/lab.pdf"
```

```bash
curl -X POST http://localhost:5000/api/v1/analyses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"symptoms":["cough","chest tightness"],"location":"Lagos","labResults":{"hemoglobin":{"value":11.2,"unit":"g/dL"}}}'
```

```bash
curl -X POST http://localhost:5000/api/v1/analyses \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/lab.pdf" \
  -F "text=I feel tired and short of breath" \
  -F "location=Lagos"
```

## Report

```bash
curl -X POST http://localhost:5000/api/v1/analyses/ANALYSIS_ID/report \
  -H "Authorization: Bearer $TOKEN" \
  --output HealthGuard_Report.pdf
```

## Conversational Chat

Use chat as a continuing intake flow. It asks follow-up questions first and only runs full multi-agent analysis when `runAnalysis` is `true` or `intent` is `full_analysis` / `doctor_note`.

```bash
curl -X POST http://localhost:5000/api/v1/chat/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Cough and fatigue"}'
```

Set `CONVERSATION_ID` from the response.

```bash
curl -X POST http://localhost:5000/api/v1/chat/sessions/$CONVERSATION_ID/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"I have had a cough and feel tired today","location":"Lagos"}'
```

```bash
curl -X POST http://localhost:5000/api/v1/chat/sessions/$CONVERSATION_ID/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Please run the full analysis and doctor note now","intent":"doctor_note","runAnalysis":true}'
```

Convenience endpoint, creates or continues a session:

```bash
curl -X POST http://localhost:5000/api/v1/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"I have a cough and feel tired today","location":"Lagos"}'
```
