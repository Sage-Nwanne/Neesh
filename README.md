# NEESH — The OS for Indie Print

> **NEESH** is *The OS for Indie Print*: a B2B marketplace + operations layer that connects independent magazine **publishers** with boutique **retailers**. We streamline discovery, ordering, fulfillment, and payouts so indie print can scale without losing its soul.

---

##  Intro
NEESH bridges the gap between creators of high‑quality indie magazines and the retailers who want to stock them. The platform is designed to:
- Help **retailers** discover and source better
- Help **publishers** distribute more efficiently
- Reduce friction across ordering, inventory, returns, and payouts

**Mission:** Uplift the independent print community with modern software that feels intuitive for creative teams and resilient for operations.

---

## Retailer View
- Browse & discover curated indie titles
- Order from multiple publishers with one cart
- Track fulfillment status and order history
- Manage inventory
- Receive insights based on store type, audience, and location

---

##  Publisher View
- List & manage magazine titles (CRUD)
- Receive & manage retailer orders
- Set wholesale pricing and ship‑from details
- View analytics (top stores, repeat customers, geographic reach)
- Communicate with high‑performing retailers

---

##  Developer / Platform Overview
**Tech**
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT
- HTTP: Axios
- Hosting: Vercel (frontend & API), optional Firebase Hosting (frontend)

**Monorepo**
- `frontend/` - React frontend application
- `backend/` - Node.js/Express backend API
- `package.json` - Root package.json for monorepo scripts
- `README.md` - This file

**Quick Start**
1. Install all dependencies: `npm run install:all`
2. Start development servers: `npm run dev`
3. Build for production: `npm run build`

**Deployment**
- Frontend: Vercel (or Firebase Hosting)
- Backend: Vercel (or Firebase Functions, Heroku, etc.)