# KrishiMitra Backend API

**कृषि मित्र** — Smart Crop Advisory System for Small & Marginal Farmers

Node.js + Express + PostgreSQL + Sequelize ORM

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | PostgreSQL 14+ |
| ORM | Sequelize 6 |
| Auth | JWT (access + refresh tokens) |
| Validation | express-validator |
| Security | helmet, cors, express-rate-limit |

## Free 3rd Party APIs Used

| API | Purpose | Free Tier |
|---|---|---|
| **OpenWeatherMap** | Current weather conditions | 1,000 calls/day free |
| **Open-Meteo** | 7-day forecast, historical weather | Unlimited, no key needed |
| **data.gov.in** | Live mandi/commodity prices (Agmarknet) | Free, requires registration |

> The advisory engine is fully rule-based (local) — no paid ML API required.

---

## Project Structure

```
krishimitra-backend/
├── server.js               # Entry point
├── app.js                  # Express app + middleware + routes
├── .env                    # Environment variables (create from .env.example)
├── config/
│   └── database.js         # Sequelize connection config
├── models/                 # Sequelize models (MVC — Model layer)
│   ├── index.js            # Model loader + associations
│   ├── farmer.model.js
│   ├── land.model.js
│   ├── advisory.model.js
│   ├── cropRecommendation.model.js
│   ├── mandi.model.js
│   ├── marketPrice.model.js
│   ├── pest.model.js
│   ├── pestOutbreak.model.js
│   ├── scheme.model.js
│   ├── schemeApplication.model.js
│   ├── notification.model.js
│   └── refreshToken.model.js
├── controllers/            # MVC — Controller layer (request/response only)
│   ├── auth.controller.js
│   ├── farmer.controller.js
│   ├── advisory.controller.js
│   ├── weather.controller.js
│   ├── market.controller.js
│   ├── pest.controller.js
│   ├── scheme.controller.js
│   └── notification.controller.js
├── services/               # MVC — Service layer (all business logic)
│   ├── auth.service.js
│   ├── farmer.service.js
│   ├── advisory.service.js   ← Rule-based crop engine (local, free)
│   ├── weather.service.js    ← OpenWeatherMap + Open-Meteo
│   ├── market.service.js     ← data.gov.in Agmarknet API
│   ├── pest.service.js
│   ├── scheme.service.js
│   └── notification.service.js
├── routes/                 # Express routers
│   ├── auth.routes.js
│   ├── farmer.routes.js
│   ├── advisory.routes.js
│   ├── weather.routes.js
│   ├── market.routes.js
│   ├── pest.routes.js
│   ├── scheme.routes.js
│   └── notification.routes.js
├── middlewares/
│   ├── auth.middleware.js   # JWT Bearer token guard
│   └── validate.middleware.js
├── seeders/
│   └── index.js            # Full database seed
└── utils/
    └── response.js
```

---

## Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Create PostgreSQL database
```sql
CREATE DATABASE krishimitra_db;
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env and fill in DB credentials + API keys
```

### 4. Seed the database
```bash
npm run seed
```

### 5. Start dev server
```bash
npm run dev
```

API runs at: `http://localhost:8080/api/v1`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new farmer |
| POST | `/auth/login` | Login → returns JWT tokens |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/profile` | 🔒 Get logged-in farmer |
| PUT | `/auth/profile` | 🔒 Update profile |

### Farmers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/farmers` | 🔒 List farmers (paginated) |
| GET | `/farmers/:id` | 🔒 Get farmer + lands |
| PUT | `/farmers/:id` | 🔒 Update farmer |
| DELETE | `/farmers/:id` | 🔒 Soft-delete farmer |
| GET | `/farmers/:id/lands` | 🔒 Get farmer's fields |

### Advisory
| Method | Endpoint | Description |
|---|---|---|
| POST | `/advisory/recommend` | 🔒 Generate AI crop recommendations |
| GET | `/advisory/farmer/:id` | 🔒 All advisories for farmer |
| GET | `/advisory/:id` | 🔒 Specific advisory |
| GET | `/advisory/calendar` | 🔒 Seasonal crop calendar |
| GET | `/advisory/sowing-schedule?crop=wheat` | 🔒 Sowing/harvest timing |

### Weather (OpenWeatherMap + Open-Meteo)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/weather/current?lat=22.71&lng=75.85` | 🔒 Current conditions |
| GET | `/weather/forecast?lat=22.71&lng=75.85&days=7` | 🔒 7-day agri forecast |
| GET | `/weather/historical?lat=..&from=..&to=..` | 🔒 Historical weather |
| GET | `/weather/agri-alerts?lat=22.71&lng=75.85` | 🔒 Farming alerts |

### Market Prices (data.gov.in + DB cache)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/market/prices?state=MP&crop=soybean` | 🔒 Live mandi prices |
| GET | `/market/prices/history?crop=soybean` | 🔒 6-month price trend |
| GET | `/market/prices/forecast/:cropId` | 🔒 Price forecast |
| GET | `/market/mandis?state=MP` | 🔒 List mandis |

### Pests
| Method | Endpoint | Description |
|---|---|---|
| GET | `/pests?crop=soybean&season=kharif` | 🔒 List pests |
| POST | `/pests/identify` | 🔒 Symptom-based identification |
| GET | `/pests/:id/treatments` | 🔒 Treatment options |
| POST | `/pests/outbreak` | 🔒 Report outbreak |
| GET | `/pests/outbreaks/nearby?lat=..&lng=..` | 🔒 Nearby outbreaks |

### Schemes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/schemes` | 🔒 All government schemes |
| GET | `/schemes/:id` | 🔒 Scheme details |
| GET | `/schemes/eligible/:farmerId` | 🔒 Eligible schemes for farmer |
| POST | `/schemes/:id/apply` | 🔒 Apply for scheme |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications` | 🔒 All notifications |
| PATCH | `/notifications/:id/read` | 🔒 Mark one read |
| PATCH | `/notifications/read-all` | 🔒 Mark all read |
| PUT | `/notifications/preferences` | 🔒 Update preferences |

🔒 = Requires `Authorization: Bearer <token>` header

---

## Auth Flow (matches frontend api.js)

```
POST /api/v1/auth/login
Body: { "phone": "9826012345", "password": "krishimitra123" }

Response:
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": { "id": "...", "name": "Ramesh Patel", ... }
}

Store: km_token = access_token, km_refresh = refresh_token
Use:   Authorization: Bearer <access_token>
```

---

## Seed Data Summary

- 4 farmers (Indore, Bhopal, Ujjain, Dewas)
- 6 land parcels across farmers
- 6 mandis (MP)
- ~2,100+ market price records (6-month history for 6 crops × 6 mandis)
- 6 pests/diseases (YMV, Pink Bollworm, Pod Borer, Yellow Rust, Stem Borer, Whitefly)
- 3 pest outbreaks
- 5 government schemes (PM-KISAN, PMFBY, KCC, eNAM, PMKSY)
- 3 scheme applications
- 1 sample advisory with crop recommendations
- 4 notifications for farmer Ramesh

**All test passwords:** `krishimitra123`
