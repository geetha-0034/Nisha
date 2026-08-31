# 🛡️ NISHA — Personal Safety & Smart Safe-Route Platform

[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen.svg?style=flat-square)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-blue.svg?style=flat-square)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green.svg?style=flat-square)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Prisma-4169E1.svg?style=flat-square)](#)
[![Maps](https://img.shields.io/badge/Maps-Leaflet%20%7C%20OpenStreetMap-orange.svg?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg?style=flat-square)](#)

> **Navigate to Safety.**

NISHA is a **location-aware personal safety assistant** designed to help users who feel unsafe identify a suitable nearby public or emergency-oriented destination, navigate toward it, alert trusted contacts, and maintain a secure record of safety incidents.

The platform combines **real-time location, destination recommendation, navigation assistance, SOS workflows, trusted contacts, and incident management** into one responsive safety-focused application.

NISHA is designed as a **personal safety assistant—not a surveillance system**.

---

# 📑 Table of Contents

* [Project Overview](#-project-overview)
* [Core Safety Workflow](#-core-safety-workflow)
* [Key Features](#-key-features)
* [System Architecture](#-system-architecture)
* [Application Flow](#-application-flow)
* [Core Implementation](#-core-implementation)

  * [Authentication](#1-authentication--authorization)
  * [Safety Mode](#2-safety-mode)
  * [Destination Recommendation Engine](#3-destination-recommendation-engine)
  * [Interactive Safety Map](#4-interactive-safety-map)
  * [Navigation](#5-navigation)
  * [SOS System](#6-sos-emergency-workflow)
  * [Trusted Contacts](#7-trusted-contacts)
  * [Evidence Preservation](#8-evidence-preservation)
  * [Incident Management](#9-incident-management)
  * [Demo Mode](#10-demo--mock-mode)
* [Database Design](#-database-design)
* [Security & Privacy](#-security--privacy)
* [Responsive & Accessible Design](#-responsive--accessible-design)
* [Screenshots](#-screenshots)
* [Testing](#-testing)
* [Technologies Used](#-technologies-used)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [Learning Outcomes](#-learning-outcomes)
* [Future Enhancements](#-future-enhancements)
* [Author](#-author)

---

# 📌 Project Overview

In an unsafe situation, a person may not immediately know **where to go**.

Calling someone for help is important, but the first practical question can be:

> **"Where can I go right now to reach a safer environment?"**

NISHA addresses this problem by combining location awareness with safety-oriented destination recommendations.

The platform helps a user:

* Detect their current location
* Activate Safety Mode
* Discover nearby emergency/public destinations
* Rank destinations based on transparent criteria
* Navigate toward a selected destination
* Trigger a controlled SOS alert
* Notify trusted contacts
* Optionally preserve authorized evidence
* Review the complete safety incident afterward

### Core Value Proposition

```text
Detect
   ↓
Recommend
   ↓
Navigate
   ↓
Alert
   ↓
Preserve
   ↓
Review
```

---

# 🚨 Core Safety Workflow

```text
┌──────────────────────────┐
│     User Feels Unsafe    │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│   Activate Safety Mode   │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│   Request Location       │
│   Permission             │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│   Detect Current         │
│   Location               │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ Find Nearby Destinations │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ Rank & Recommend Safer   │
│ Public Destinations      │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│    Select Destination    │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│   Navigate to Safety     │
└─────────────┬────────────┘
              │
        ┌─────┴─────┐
        ▼           ▼
   ┌────────┐   ┌──────────────┐
   │  SOS   │   │ Continue     │
   │ Alert  │   │ Navigation   │
   └────┬───┘   └──────┬───────┘
        │              │
        ▼              │
┌──────────────────┐   │
│ Trusted Contact  │   │
│ Notification     │   │
└────────┬─────────┘   │
         │             │
         └──────┬──────┘
                ▼
┌──────────────────────────┐
│ Optional Evidence        │
│ Preservation             │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ Complete Safety Session  │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ Incident Saved & Review  │
└──────────────────────────┘
```

---

# ✨ Key Features

### 🗺️ Smart Safe-Destination Recommendations

Find nearby destinations that may provide a more suitable public or emergency environment.

Supported categories include:

* Police Stations
* Hospitals
* Security Offices
* Public Institutions
* Verified Public Establishments

NISHA intentionally avoids claiming that a destination is **"100% safe."**

Instead, recommendations are presented as:

> **Recommended safer destination**

---

### 📍 Location-Aware Safety Mode

Safety Mode uses the browser's **Geolocation API** with explicit user permission.

The application can:

* Request location access
* Retrieve current coordinates
* Display the user's position
* Search nearby destinations
* Calculate distance
* Estimate travel time
* Build a navigation session

---

### 🚨 Controlled SOS

NISHA provides a deliberately controlled SOS interaction to prevent accidental activation.

Example:

```text
Hold for 3 seconds to send SOS
```

During activation:

```text
SOS ACTIVATING...
```

After activation:

```text
┌────────────────────────────┐
│        🚨 SOS ACTIVE       │
├────────────────────────────┤
│ Current Location           │
│ Activation Time            │
│ Destination                │
│ Trusted Contact Status     │
│ Incident ID                │
└────────────────────────────┘
```

If no external notification provider is configured, NISHA uses a clearly labelled demo notification mode.

```text
Demo notification —
no external message provider configured
```

The application never falsely claims that an SMS or email was sent when an external provider is unavailable.

---

### 👥 Trusted Contacts

Users can configure trusted emergency contacts.

Each contact can include:

| Field               | Description                  |
| ------------------- | ---------------------------- |
| Name                | Contact's name               |
| Phone               | Emergency phone number       |
| Email               | Optional email               |
| Relationship        | Sister, Friend, Parent, etc. |
| Primary             | Primary emergency contact    |
| Notification Method | SMS / Email                  |

---

### 📷 Evidence Preservation

NISHA provides an optional evidence-preservation workflow.

Camera or microphone access is **never performed secretly**.

Before accessing a device capability, the application explains:

> "This feature requires device permission. NISHA does not access your camera or microphone without your approval."

Authorized evidence can be associated with an incident.

Example:

```text
Incident #NISHA-2026-001
Evidence #01
Captured: 8:42 PM
Location: Available
Type: Image
```

---

### 📋 Incident History

Every Safety Mode session can create an incident record.

Users can review:

* Date and time
* Starting location
* Destination
* SOS status
* Trusted contact notification status
* Evidence
* Incident timeline
* Session status

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │      NISHA UI       │
                         │ React + TypeScript   │
                         │ Tailwind + shadcn/ui │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    React Router    │
                         │ Protected Routes   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      REST API      │
                         │ Node.js + Express  │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │ Auth Service │      │ Safety Engine│      │ Notification │
      │              │      │              │      │   Service    │
      └──────────────┘      └──────────────┘      └──────────────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Prisma ORM          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    PostgreSQL       │
                         │ Users / Incidents   │
                         │ Contacts / Evidence │
                         └─────────────────────┘

External Services
──────────────────────────────────────────────────────────────
Browser Geolocation → Current Location
Leaflet / OSM       → Maps & Destination Visualization
Routing Service     → Navigation Route
SMS / Email         → Emergency Notifications
```

---

# 🔄 Application Flow

```text
Landing Page
     ↓
Register / Login
     ↓
Onboarding
     ↓
Dashboard
     ↓
Activate Safety Mode
     ↓
Location Permission
     ↓
Current Location
     ↓
Destination Recommendations
     ↓
Select Destination
     ↓
Navigation
     ↓
Optional SOS
     ↓
Trusted Contact Alert
     ↓
Optional Evidence
     ↓
Complete Session
     ↓
Incident Saved
     ↓
Incident History
```

---

# 📖 Core Implementation

## 1. Authentication & Authorization

NISHA implements protected user authentication.

### Authentication Features

* User registration
* Login
* Logout
* Password hashing
* Protected routes
* Session/token authentication
* Password reset workflow
* Basic email verification architecture

Passwords are never stored as plaintext.

### Protected Routes

```text
/dashboard
/safety
/incident/:id
/contacts
/profile
/settings
```

Unauthenticated users are redirected to:

```text
/login
```

Authorization checks ensure that users can only access their own:

* Incidents
* Evidence
* Trusted contacts
* Profile information

---

## 2. Safety Mode

Safety Mode is the central feature of NISHA.

When activated:

```text
1. Request location permission
2. Retrieve current coordinates
3. Display current position
4. Find nearby destinations
5. Calculate recommendation scores
6. Display ranked destinations
7. Allow destination selection
8. Start navigation session
```

Location access is explicitly controlled through the browser permission system.

If permission is denied:

```text
Location access is currently disabled.
Enable location permissions to use Safety Mode.
```

---

## 3. Destination Recommendation Engine

NISHA uses a transparent scoring model rather than presenting arbitrary destinations.

### Safety Score

```text
Safety Score =
Destination Type Weight
+ Accessibility Score
+ Distance Score
+ Availability Score
```

### Destination Priority

```text
1. Police Station
2. Hospital
3. Security Office
4. Public Institution
5. Verified Public Establishment
```

The UI explains why a destination was recommended.

Example:

> **Recommended because it is nearby and classified as an emergency/public facility.**

This makes the recommendation system understandable rather than presenting a black-box "AI safety score."

---

## 4. Interactive Safety Map

The Safety Map provides a visual representation of the user's current situation.

### Map Elements

```text
📍 Current User
🚔 Police Station
🏥 Hospital
🛡️ Security Office
🏢 Public Institution
🏪 Public Establishment
```

Each destination card displays:

* Name
* Destination type
* Distance
* Estimated travel time
* Recommendation score
* Availability status when available

### Primary Action

```text
Navigate Here
```

On mobile, destination information is presented through a bottom-sheet interface to keep the map accessible.

---

## 5. Navigation

Selecting a destination creates a navigation session.

The interface displays:

```text
Current Location
      ↓
     Route
      ↓
Destination
```

Navigation information includes:

* Distance
* Estimated arrival time
* Destination
* Current location
* Route

Users can select:

```text
Open Navigation
```

to continue using an external map/navigation service where native browser navigation is unavailable.

A safety session can be ended through:

```text
End Safety Session
```

with confirmation to prevent accidental termination.

---

## 6. SOS Emergency Workflow

SOS is intentionally designed as a controlled emergency action.

### Activation

```text
Hold for 3 seconds
        ↓
SOS ACTIVATING...
        ↓
SOS ACTIVE
```

### Emergency State

The emergency interface displays:

* SOS status
* Current location
* Activation time
* Destination
* Trusted contact status
* Incident ID

### Notification Architecture

```text
SOS Trigger
     ↓
Notification Service
     ↓
┌───────────────┬────────────────┐
│ Real Provider │ Demo Provider  │
│ SMS / Email   │ Mock Alert     │
└───────────────┴────────────────┘
```

The notification abstraction makes it possible to replace demo services with real providers later.

---

## 7. Trusted Contacts

Trusted contacts are managed through:

```text
/contacts
```

Users can:

* Add contacts
* Edit contacts
* Delete contacts
* Set primary contact
* Enable/disable emergency notifications
* Configure preferred notification method

Example:

```text
Priya
Sister

★ Primary Contact
SMS Enabled
```

---

## 8. Evidence Preservation

Evidence is completely user-authorized.

### Workflow

```text
Preserve Evidence
       ↓
Permission Explanation
       ↓
Browser Permission
       ↓
Camera / Microphone
       ↓
Capture
       ↓
Preview
       ↓
Retake / Save
       ↓
Associate with Incident
```

Stored metadata can include:

```text
Evidence ID
Incident ID
Type
Captured At
Latitude
Longitude
File Reference
```

No covert camera or microphone functionality is implemented.

---

## 9. Incident Management

Each Safety Mode session is associated with an incident/session record.

### Incident Lifecycle

```text
Active
  ↓
Completed
```

or:

```text
Active
  ↓
Cancelled
```

### Incident Timeline

Example:

```text
8:42 PM — Safety Mode activated
8:43 PM — Location detected
8:44 PM — Police station recommended
8:45 PM — Navigation started
8:46 PM — SOS activated
8:46 PM — Trusted contact notified
9:02 PM — Safety session completed
```

---

## 10. Demo / Mock Mode

NISHA includes a development/demo mode so the application remains demonstrable without external service credentials.

### Demo Mode Provides

* Mock authenticated user
* Mock trusted contacts
* Mock destinations
* Mock map locations
* Mock incidents
* Mock SOS notifications
* Mock evidence records

Example destinations:

```text
City Police Station
Hospital Emergency Center
Central Security Office
Public Library
24/7 Retail Store
```

Mock destinations are clearly treated as development/demo data and are not silently presented as verified real-world safety information.

---

# 🗄️ Database Design

The application uses a relational database architecture.

### User

```text
id
name
email
phone
passwordHash
createdAt
updatedAt
```

### TrustedContact

```text
id
userId
name
phone
email
relationship
isPrimary
notificationMethod
createdAt
```

### Incident

```text
id
userId
startedAt
endedAt
startLatitude
startLongitude
destinationName
destinationType
destinationLatitude
destinationLongitude
sosTriggered
contactNotified
status
```

### Evidence

```text
id
incidentId
type
fileUrl
capturedAt
latitude
longitude
```

### SafetySession

```text
id
userId
incidentId
currentLatitude
currentLongitude
recommendedDestination
destinationType
distance
estimatedTime
createdAt
```

### Entity Relationship

```text
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
TrustedContact  Incident
                   │
                   ├──────────► Evidence
                   │
                   ▼
             SafetySession
```

---

# 🔐 Security & Privacy

NISHA follows a privacy-first approach.

### Security

* Password hashing
* Protected API routes
* Authentication middleware
* Authorization checks
* User-level data isolation
* Input validation
* Secure file handling
* Environment variables for secrets
* No sensitive information in client logs
* HTTPS-ready architecture

### Privacy

NISHA does **not** secretly access device capabilities.

Location, camera, and microphone access require appropriate browser/device permissions.

The application communicates this clearly:

> **"NISHA uses location information to provide safety-oriented recommendations. Device permissions such as camera and microphone access are requested only when required and only with user authorization."**

NISHA does not claim to:

* Guarantee personal safety
* Automatically identify stalkers
* Perform covert surveillance
* Secretly record users

---

# 📱 Responsive & Accessible Design

NISHA is designed mobile-first because safety interactions often happen while the user is moving.

### Desktop

* Sidebar navigation
* Expanded map interface
* Multi-column dashboard
* Detailed destination panels

### Mobile

* Thumb-friendly controls
* Large SOS action
* Full-screen map
* Bottom-sheet destination cards
* Compact navigation
* Clear emergency state

### Accessibility

The interface includes:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Accessible labels
* Sufficient contrast
* Screen-reader-friendly controls
* Large emergency actions

---

# 📸 Screenshots

## 🏠 Landing Page

> Add screenshot here

```text
<img width="521" height="720" alt="image" src="https://github.com/user-attachments/assets/f9deadfd-7610-41b5-90e8-5de3159a6b14" />

```

---

## 📊 Dashboard

> Add screenshot here

```text
<img width="1185" height="821" alt="image" src="https://github.com/user-attachments/assets/529ac8ee-078b-4088-b900-707dbc0bf7dc" />

```

---

## 🗺️ Safety Mode

> Add screenshot here

```text
<img width="1260" height="810" alt="image" src="https://github.com/user-attachments/assets/039445c0-7faf-4893-a276-9a2ac70d2274" />

```

---

## 🚨 SOS Active State

> Add screenshot here

```text
<img width="1359" height="467" alt="image" src="https://github.com/user-attachments/assets/d23ec285-4f78-4cad-9992-24668c0f810a" />

```

---

## 👥 Trusted Contacts

> Add screenshot here

```text
<img width="1163" height="397" alt="image" src="https://github.com/user-attachments/assets/63b96272-6bb4-49a3-8a8e-4405a4a6505f" />

```

---

## 📋 Incident History

> Add screenshot here

```text
<img width="1148" height="764" alt="image" src="https://github.com/user-attachments/assets/30402c95-eec6-4395-89cb-0756b3465b05" />

```

---

# 🧪 Testing

Basic functional testing covers the critical safety workflows.

| Test Case | Scenario                     | Expected Result                    | Status |
| --------- | ---------------------------- | ---------------------------------- | ------ |
| TC-01     | Register user                | Account created                    | ✅ PASS |
| TC-02     | Invalid login                | Friendly error displayed           | ✅ PASS |
| TC-03     | Protected route              | Unauthenticated user redirected    | ✅ PASS |
| TC-04     | Location permission granted  | Current location retrieved         | ✅ PASS |
| TC-05     | Location permission denied   | Graceful error displayed           | ✅ PASS |
| TC-06     | Destination ranking          | Destinations correctly ranked      | ✅ PASS |
| TC-07     | Destination selected         | Navigation session created         | ✅ PASS |
| TC-08     | SOS activated                | Emergency state displayed          | ✅ PASS |
| TC-09     | Trusted contact configured   | Contact available for notification | ✅ PASS |
| TC-10     | Incident completed           | Incident stored in history         | ✅ PASS |
| TC-11     | Evidence captured            | Evidence associated with incident  | ✅ PASS |
| TC-12     | Unauthorized incident access | Access denied                      | ✅ PASS |

---

# 🛠️ Technologies Used

### Frontend

* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Router
* Lucide Icons

### Backend

* Node.js
* Express
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

### Location & Maps

* Browser Geolocation API
* Leaflet
* OpenStreetMap
* Routing service

### Security

* Password hashing
* Authentication middleware
* Protected API routes
* Input validation
* Environment-based secrets

### Development

* Git
* GitHub
* npm
* TypeScript

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/nisha.git
cd nisha
```

## 2. Install Dependencies

```bash
npm install
```

If frontend and backend are separated:

```bash
cd client
npm install

cd ../server
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nisha"

JWT_SECRET="your-development-secret"

MAP_API_KEY="your-map-api-key"

NOTIFICATION_MODE="demo"
```

Never commit real secrets or API keys to GitHub.

---

## 4. Setup Database

```bash
npx prisma generate
npx prisma migrate dev
```

---

## 5. Seed Demo Data

```bash
npx prisma db seed
```

Demo account:

```text
Email:
demo@nisha.app
```

For security, the demo password should be configured through the development environment rather than committed to the repository.

---

## 6. Start Development Server

```bash
npm run dev
```

The application should then be available through the local development URL configured by the project.

---

# ⚙️ Environment Variables

| Variable             | Description                  | Required |
| -------------------- | ---------------------------- | -------- |
| `DATABASE_URL`       | PostgreSQL connection string | Yes      |
| `JWT_SECRET`         | Authentication secret        | Yes      |
| `MAP_API_KEY`        | Map provider API key         | Optional |
| `NOTIFICATION_MODE`  | `demo` / real provider       | Yes      |
| `SMS_PROVIDER_KEY`   | SMS provider credentials     | Optional |
| `EMAIL_PROVIDER_KEY` | Email provider credentials   | Optional |

External credentials are optional in demo mode.

---

# 🎯 Learning Outcomes

This project demonstrates practical experience with:

* Full-stack application development
* React and TypeScript
* REST API design
* Authentication and authorization
* PostgreSQL database design
* Prisma ORM
* Geolocation APIs
* Interactive maps
* Destination recommendation systems
* Emergency UX design
* Notification service abstraction
* File/evidence management
* Responsive UI development
* Accessibility
* Privacy-first engineering
* Error handling
* Demo-mode architecture
* Secure application design

---

# 🔮 Future Enhancements

Potential future improvements include:

* Real-time route recalculation
* More sophisticated destination scoring
* Verified destination data sources
* Real SMS/WhatsApp integrations
* Push notifications
* Offline safety mode
* Live trusted-contact location sharing
* Emergency service integrations
* Advanced analytics
* Multi-language support
* PWA/mobile application
* More granular privacy controls

Advanced AI features are intentionally not required for the core product.

The priority is a **reliable, explainable, end-to-end safety workflow**.

---

# 🧭 Product Principle

NISHA is built around one central principle:

> **When someone feels unsafe, technology should help them make the next safer decision—not create another source of complexity.**

The product workflow is therefore intentionally simple:

```text
DETECT
   ↓
RECOMMEND
   ↓
NAVIGATE
   ↓
ALERT
   ↓
PRESERVE
   ↓
REVIEW
```

---

## 👩‍💻 Author

**Geetha Bhargavi Inaganti**

B.Tech CSE | ServiceNow Certified System Administrator (CSA) | Python & Agentic AI Developer | 5× Hackathon Winner

---

⭐ **If you find NISHA interesting, consider giving the repository a Star!**
