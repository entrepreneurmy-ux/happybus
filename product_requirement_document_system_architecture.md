# Product Requirement Document (PRD) & System Architecture

**Project Title:** HappyBus  
**Document Version:** 1.1  
**Target Audience:** Engineering, Product, and Business Stakeholders  
**Product Vision:** An all-in-one Smart School Transport Management & Fintech Platform that streamlines route optimization, daily fleet contingencies, automated parent payment collection, and driver-parent communications.

---

## 1. Executive Summary & Value Proposition

Traditional school bus operators struggle with three major manual bottlenecks:

1. **Inefficient Route Planning:** Redrawing routes every school term manually, leading to high fuel consumption and vehicle wear.
2. **Payment Collection Pain:** Chasing parents manually for monthly fees, verifying bank transfer screenshots, and managing delayed cash flows.
3. **Operational Contingency Chaos:** Dealing with unexpected driver sick leaves, vehicle breakdowns, and endless "Where is the bus?" calls from parents.

HappyBus solves these challenges by combining:
* **Algorithmic Route Optimization:** Powered locally by Google OR-Tools (Apache 2.0 open source license).
* **Integrated Fintech Checkout:** Automated monthly invoicing and checkout gateways via Stripe.
* **Driver Mobile App / PWA:** Low-barrier phone GPS tracking combined with interactive student attendance verification.
* **Instant Automated Notifications:** Automated updates via Telegram Bot API with manual WhatsApp Web fallback links.

---

## 2. User Roles & Personas

| Persona | System Access | Primary Needs |
| :--- | :--- | :--- |
| **Bus Operator / Admin** | Web Admin Dashboard | Automated routing, emergency reassignment, automated invoicing, revenue analytics. |
| **Bus Driver** | Mobile App (Android PWA / Native) | Simple stop-by-stop navigation list, 1-tap student check-in/out, live GPS streaming. |
| **Parent** | Web Portal / PWA & Telegram | Live bus tracking, receiving delay/breakdown alerts, paying monthly fees online. |

---

## 3. Tech Stack Architecture

* **Backend Engine:** Python 3.11+, FastAPI (Async framework)
* **Authentication Provider:** [Clerk Auth](https://clerk.com/react-authentication) (JWT validation via headers)
* **Database & Realtime:** [Supabase / PostgreSQL](https://supabase.com) (WAL mode & WebSockets enabled)
* **Optimization Solver:** Google OR-Tools (Local Python package running on the backend)
* **Mobile / Frontend:** React Native / Flutter / HTML5 PWA (Tailwind CSS, Service Workers)
* **Payments & Integrations:** Stripe Webhooks, Telegram Bot API (`httpx`), WhatsApp Deep Links (`https://wa.me/`)

---

## 4. System Architecture & Component Flow

```
               ┌──────────────────────────────────────────────┐
               │                 Mobile App                   │
               │   (React Native / Flutter / Android PWA)     │
               └──────┬───────────────┬───────────────┬───────┘
                      │               │               │
            Authenticates           Queries         Initiates
               Tokens                Data            Payment
                      │               │               │
                      ▼               ▼               ▼
                 ┌─────────┐     ┌───────────┐   ┌───────────┐
                 │  Clerk  │     │ Supabase  │   │  Stripe   │
                 │  Auth   │────►│ Database  │◄──│ Webhooks  │
                 └─────────┘     └───────────┘   └───────────┘
               (Passes JWT via     (Verifies       (Updates
                   Header)         Clerk JWT)    Payment Status)
```

---

## 5. Detailed Functional Requirements

### 5.1 Module 1: Admin Dashboard & Fleet Operations

#### 5.1.1 Dashboard Overview (KPI Metrics)
* **Operational Cards:**
  * Active Buses (Active / Total)
  * Today's Student Pickups (Picked Up / Total)
  * Monthly Revenue Collected (RM Amount / Total Invoiced)
  * System Alerts Counter (Driver Absence, Overdue Invoices)
* **Real-time Trip Matrix:** Live status table of active morning/afternoon runs (`Not Started`, `In Progress`, `Completed`, `Disrupted`).

#### 5.1.2 Fleet & Driver Registry
* **Buses:** Maintain plate number, seat capacity, status (`Operational`, `Maintenance`, `Broken Down`).
* **Drivers:** Maintain name, phone number, license info, status (`Active`, `On Leave`, `Inactive`).

#### 5.1.3 Contingency & Disruption Action ("Panic Engine")
* **Trigger:** Admin clicks "Report Absence / Breakdown".
* **System Logic:**
  1. Identifies affected route assignment on the target date.
  2. Queries the database for active standby drivers or operational backup buses not assigned to overlapping time slots.
  3. Executes a 1-click database swap (assignments table update).
  4. Triggers an automated notification to affected parents and drivers via Telegram.

---

### 5.2 Module 2: Smart Route Optimization Engine (Google OR-Tools)

#### 5.2.1 Data Processing & Inputs
* **Student Geocodes:** Latitude/longitude coordinates for pickup and dropoff points.
* **School Location:** Destination matrix anchor point.
* **Bus Fleet Capabilities:** Available vehicles and maximum student seat capacities.

#### 5.2.2 Algorithmic Execution
* Backend passes distance matrix and vehicle capacity rules to local Python `ortools` solver.
* **Constraints Enforced:**
  * Maximum seat capacity per bus (Strict hard constraint).
  * Unique pickup assignment per student.
  * Optimal stop sequence minimizing total travel time/distance.

#### 5.2.3 Route Preview & Approval
* **UI Output:** Visual map/list preview showing before/after route metrics:
  * Total Distance Saved (KM)
  * Estimated Loop Duration
* Admin clicks "Approve & Push to Drivers" to finalize active route assignments.

---

### 5.3 Module 3: Driver Application & Attendance Tracking

#### 5.3.1 GPS Tracking
* Operates via HTML5 Geolocation API (`navigator.geolocation.watchPosition`) or native location services.
* Pushes latitude, longitude, speed, and timestamp payloads to `/api/fleet/telemetry` via `POST` or `WebSocket` every 10–15 seconds.
* Uses Screen Wake Lock API to keep driver screen active while the app is in operation.

#### 5.3.2 Digital Attendance Sheet
* Stop-by-stop view displaying student names assigned to the current stop.
* **Action Buttons:**
  * **`[ Boarded ]` (Green):** Updates database timestamp via `PATCH /api/students/:id/status`; triggers optional parent arrival alert.
  * **`[ Absent ]` (Red):** Marks student absent for the session; advances bus to next stop.

---

### 5.4 Module 4: Integrated Payments & Automated Invoicing

#### 5.4.1 Invoicing Engine
* Admin triggers monthly fee generation.
* System creates invoice records linked to student/parent profiles based on tier or distance rate.

#### 5.4.2 Online Checkout Flow (Stripe)
* Parent opens invoice link leading to hosted payment page.
* On successful transaction, Stripe fires an asynchronous HTTP POST webhook to `/api/webhook`.
* Webhook verifies signature, updates database status from `pending` to `paid`, and sends a digital receipt to parent via Telegram.

#### 5.4.3 Fee Reminders
* 1-click admin action to filter all pending or overdue invoices and broadcast payment reminder messages to parents.

---

### 5.5 Module 5: Automated Alerts & Communications

* **Primary Notifications (Telegram Bot API):**
  * 100% free automated push updates for payment receipts, schedule shifts, and emergency alerts.
  * Automatically maps `telegram_chat_id` during parent onboarding via deep link (`https://t.me/HappyBusBot?start=USER_ID`).
* **Fallback Communications (WhatsApp Web Deep Links):**
  * Provides admin with standard `https://wa.me/` quick-links pre-populated with alert text for direct manual messaging without API overhead.

---

## 6. API Endpoints & Feature Mapping

### 6.1 Authentication (Clerk)

| # | Front-End Feature | HTTP Method | API Endpoint | Description |
|---|-------------------|-------------|--------------|-------------|
| 1 | Login / Auth | `POST` | `/api/auth/login` | Validates credentials & returns JWT token |
| 2 | Registration Code | `POST` | `/api/auth/registration-code` | Records and verifies used 4-digit code for registration |

### 6.2 Backend Services & Database (Supabase / FastAPI)

| # | Front-End Feature | HTTP Method | API Endpoint | Description |
|---|-------------------|-------------|--------------|-------------|
| 1 | Driver Location | `POST` / `WebSocket` | `/api/fleet/telemetry` | Sends real-time GPS coordinates |
| 2 | Parent Live Map | `GET` / `WebSocket` | `/api/bus/:id/live` | Subscribes to bus movement updates |
| 3 | Student Roster | `PATCH` | `/api/students/:id/status` | Toggles student `boarded`/`dropped_off` status |
| 4 | Admin Route Add | `POST` | `/api/routes` | Saves a newly created route |
| 5 | Payment Webhook | `POST` | `/api/webhook` | Listens for Stripe webhooks and updates payment status |

---

## 7. Monetization & SaaS Business Model

HappyBus operates on a **Hybrid SaaS + Take-Rate Model**:

1. **Monthly Fleet SaaS Subscription:**
   * **Starter Tier (1–5 Buses):** ~RM 150 – RM 250 / month
   * **Growth Tier (6–15 Buses):** ~RM 400 – RM 600 / month
   * **Enterprise Tier (16+ Buses):** ~RM 800+ / month
2. **Fintech Transaction Convenience Fee:**
   * 1.0% – 1.5% take-rate (or flat RM 1.00 – RM 2.00 convenience fee per monthly fare invoice processed online).

---

## 8. Non-Functional Requirements (NFRs)

* **Performance:** Route optimization for up to 500 stops and 20 vehicles must complete execution in $< 10$ seconds.
* **Data Security & Privacy:** Student coordinates and phone numbers must be encrypted at rest and transmitted over HTTPS.
* **Reliability:** Background location updates from drivers must tolerate brief network dropouts, queueing data locally on the app/PWA and re-syncing upon reconnection.

---

## 9. Implementation Roadmap & Phases

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT ROADMAP                             │
├──────────┬─────────────────────────────────────────────────────────────┤
│ Phase 1  │ Database Schema Setup & Admin Dashboard UI Layout           │
│ Phase 2  │ Driver App/PWA + Live GPS & Attendance Check-In            │
│ Phase 3  │ Google OR-Tools Backend Route Optimization Engine Integration│
│ Phase 4  │ Stripe Payment Webhook & Invoice Ledger                     │
│ Phase 5  │ Telegram Bot Integration & Contingency Panic Handler        │
└──────────┴─────────────────────────────────────────────────────────────┘
```

## 10. Domain Name

```
Register auralink.my @ exabytes



```