# API Endpoints

All endpoints used by this frontend, targeting the backend version defined in `backendApiVersion` in `package.json`. The client SDK is auto-generated from the backend OpenAPI spec — run `npm run generate-client` to regenerate after backend changes.

## Authentication

| Method | Endpoint | Used in |
|--------|----------|---------|
| `POST` | `/api/v1/users/login` | `LoginComponent` |
| `POST` | `/api/v1/users/signup` | `SignupComponent` |
| `POST` | `/api/v1/users/logout` | `TopNavbar` |

## Bets

| Method | Endpoint | Used in |
|--------|----------|---------|
| `GET` | `/api/v1/bets/` | `store/index` — fetched once at login and on page reload if store is empty, cached in Pinia |
| `GET` | `/api/v1/bets/groups/rank/{group_id}` | `GroupComponent` — fetched per group navigation |
| `GET` | `/api/v1/bets/phases/{phase_code}` | `FinalePhaseComponent` |
| `PATCH` | `/api/v1/score_bets/{bet_id}` | `GroupComponent` |
| `PATCH` | `/api/v1/binary_bets/{bet_id}` | `FinalePhaseComponent` |

## Results & Scoreboard

| Method | Endpoint | Used in |
|--------|----------|---------|
| `GET` | `/api/v1/results` | `HomeComponent` |
| `GET` | `/api/v1/score_board` | `ScoreBoardComponent` |

## Rules

| Method | Endpoint | Used in |
|--------|----------|---------|
| `POST` | `/api/v1/rules/{rule_id}` | `TopNavbar` (compute points, admin only), `FinalePhaseComponent` |
