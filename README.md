# Institutional Event Resource Management System

Full-stack, real-time, conflict-aware institutional workflow system.

## Stack
- Frontend: React (Vite), Tailwind CSS, Recharts, Socket.io client
- Backend: Node.js, Express, MongoDB (Mongoose), Socket.io
- Auth: JWT + RBAC

## Setup
1. Create a MongoDB database and set the URI.
2. Add environment variables.

### Server
Create [server/.env](server/.env) with:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=4000
```

### Client
Create [client/.env](client/.env) with:
```
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

## Scripts
### Server
- `npm install`
- `npm run seed`
- `npm run dev`

### Client
- `npm install`
- `npm run dev`

## Roles
EventCoordinator, HOD, Dean, InstitutionalHead, AdminITC

## Notes
- Workflow approvals are enforced in [server/src/services/workflow.js](server/src/services/workflow.js)
- Allocation and conflict detection live in [server/src/services/allocationEngine.js](server/src/services/allocationEngine.js)
