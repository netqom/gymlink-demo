
# GymLink – Fitness Comparison (Prototype)

A simple fitness comparison platform (gyms, studios, classes). Built as a proof of concept for searching and filtering businesses based on category, location, price, vibe, and services.

---

## 🚀 Quick Start

### Requirements

* Node.js v14+
* npm

### Run

**Backend**

```bash
cd backend
npm install
npm start
```

API → `http://localhost:3001`

**Frontend**

```bash
cd frontend
npm install
npm start
```

App → `http://localhost:3000`

---

## 🔍 Features

* Search by name, category, or location
* Filters: category, vibe, price range, services
* Natural language search (e.g. `cheap yoga in Melbourne with Meditation`)
* Card  views for results
* Bot : Try below terms=>
        How much price in Perth ?
        what gym in Perth ?
        best gym in Perth ? 
        Hi, how are you?
        What is GymLink?
        Cheap yoga in Melbourne with meditation 
        Help me find fitness options
        What categories do you have? 
        Thank you for your help
        Goodbye
* Responsive layout (desktop + mobile)

---

## 📡 API

* `GET /api/businesses` → list businesses (+ query params)
* `POST /api/search/natural` → keyword-based NLP search
* `GET /api/filters` → available filter options
* `GET /api/businesses/:id` → details by ID

---

## 🛠️ Tech

* **Backend:** Node.js + Express, JSON dataset (no DB)
* **Frontend:** React 18, hooks, Axios
* **Data:** 8 mock fitness businesses across AU

---

## 📄 License

MIT – free to use and modify.

---

 
