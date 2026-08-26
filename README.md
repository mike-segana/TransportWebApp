# TransitFlow

TransitFlow is a cloud-hosted operations platform built to power modern transport companies. It brings together the workflows, data, and processes that drive the business, from customer acquisition and management through to operational delivery, within a secure, intelligent, role-based environment.

Built for scale, TransitFlow gives transport companies the tools to connect teams, streamline processes, and run their operations with greater visibility, control, and efficiency.

---

## Features

- **Secure Authentication:** JWT-based authentication with HTTP-only cookies and protected sessions
- **Role-Based Access Control:** Granular User/Admin authorisation enforced at the API layer
- **RESTful Backend:** FastAPI-based API with structured services, Pydantic validation, and SQLAlchemy
- **Proxy & Middleware Architecture:** Next.js proxy and middleware for request handling, routing, and controlled backend communication
- **Database Migrations:** Version-controlled PostgreSQL schema management using Alembic
- **Automated Testing:** pytest integration suite covering authentication, authorisation, validation, and core operational workflows
- **Continuous Integration:** GitHub Actions provisions PostgreSQL and runs the backend test suite
- **Continuous Deployment:** Render automatically deploys changes pushed to the `main` branch
- **Cloud Infrastructure:** Cloud-hosted application and managed PostgreSQL infrastructure using Render and Neon
- **Operations Dashboard:** Responsive, role-aware interfaces for monitoring and managing transport operations

---

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Axios
- Tailwind CSS

### Backend
- FastAPI
- Python
- SQLAlchemy
- Pydantic
- Alembic

### Database
- PostgreSQL
- Neon PostgreSQL

### Authentication & Security
- JWT
- HTTP-only Cookies
- Role-Based Access Control (RBAC)
- Protected API Endpoints
- Next.js Proxy & Middleware

### Testing & DevOps
- pytest
- Git & GitHub
- GitHub Actions
- Continuous Integration (CI)
- Continuous Deployment (CD)
- Render

---

## Architecture

TransitFlow uses a separated frontend and backend architecture. The Next.js application communicates with the FastAPI REST API through a controlled proxy layer, with middleware handling request processing and routing.

```
Next.js Frontend
      │
      ▼
Proxy / Middleware
      │
      ▼
FastAPI REST API
      │
      ├── Authentication & RBAC
      ├── Transport Operations
      ├── Driver Management
      └── Shipment Operations
      │
      ▼
  PostgreSQL
```

---

## CI/CD

TransitFlow uses automated CI/CD workflows to validate and deploy changes.

```
Git Push / Pull Request
         │
         ▼
   GitHub Actions
         │
         ▼
 Automated Test Suite
         │
     Tests Pass
         │
         ▼
    Merge / Push
      to main
         │
         ▼
  Production Deployment
```

- GitHub Actions provisions an isolated PostgreSQL environment and runs the backend test suite on pushes and pull requests targeting `main`.
- Changes pushed to `main` are automatically deployed through Render.

---

## Testing

The backend includes an automated pytest integration suite covering:

- Authentication
- Authorisation
- Transport requests
- Driver management
- Shipment operations
- Driver assignments
- Input validation
- Error handling

Tests run against a dedicated PostgreSQL test database and use Alembic migrations to establish the database schema.

---

## Engineering Practices

TransitFlow is built around practical software engineering principles, including:

- Secure authentication and authorisation
- Separation of frontend and backend responsibilities
- Service-oriented backend architecture
- Version-controlled database migrations
- Strong API validation with Pydantic
- Role-Based Access Control
- Automated integration testing
- Continuous Integration and Deployment
- Cloud-based infrastructure
- Maintainable and scalable application architecture

---

## Deployment

| Component       | Technology                                |
|------------------|--------------------------------------------|
| Frontend         | Next.js, React, TypeScript, Tailwind CSS    |
| Backend          | FastAPI, Python                             |
| Database         | Neon PostgreSQL                             |
| CI               | GitHub Actions                              |
| CD               | Render                                      |
| Source Control   | GitHub                                      |
