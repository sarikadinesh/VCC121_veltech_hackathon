# Institutional Event Resource Management System

Full-stack, real-time, conflict-aware institutional workflow system.

## Stack
- Frontend: React (Vite), Tailwind CSS, Recharts, Socket.io client
- Backend: Node.js, Express, MongoDB (Mongoose), Socket.io
- Auth: JWT + RBAC

## Features by Role

### 🎯 Event Coordinator
✅ **Can:**
- Create new event requests
- Edit events (if rejected)
- Add/modify resource requirements
- Submit for approval
- Mark events as Started
- Mark events as Completed
- Release resources after completion

👀 **Can View:**
- Own event status (Pending/Approved/Rejected/Running/Completed)
- Approval stage tracker (HOD → Dean → Head)
- Allocated venue & resources
- Risk alerts & Event health score

❌ **Cannot:**
- View global venue occupancy
- View other department events
- Modify system resources
- Skip approval flow

### 🏫 HOD (Head of Department)
✅ **Can:**
- Approve/Reject/Request modification
- Add comments/rejection reason
- View department-level conflicts

👀 **Can View:**
- All events from their department
- Department venue occupancy
- Pending approval queue
- Conflict alerts for department

❌ **Cannot:**
- Override hard capacity
- Edit institutional resources

### 🎓 Dean
✅ **Can:**
- Approve/Reject events
- Adjust priority score
- Resolve cross-department conflicts

👀 **Can View:**
- All school-level events
- Cross-department conflict matrix
- Resource utilization charts
- Venue occupancy across departments

❌ **Cannot:**
- Break hard constraints
- Modify total resource count

### 🏛 Institutional Head
✅ **Can:**
- Final approval
- Override priorities (not capacity)
- Resolve institutional-level conflicts

👀 **Can View:**
- Institution-wide venue occupancy
- All event schedules
- Global resource usage
- Fairness analytics (dept-wise usage)
- Live running events

❌ **Cannot:**
- Exceed physical capacity

### 🛠 Admin / ITC
✅ **Can:**
- Add/Update/Remove venues
- Add/Update/Remove resources
- Change equipment quantity
- Toggle maintenance mode
- Force release resources
- Run simulation mode
- Update occupancy state manually

👀 **Can View:**
- Full system occupancy
- Resource availability state
- Allocation logs
- System audit logs

❌ **Cannot:**
- Participate in approval workflow

## Core Features

### 1. Strict Multi-Level Approval Workflow
- Enforced approval order: EventCoordinator → HOD → Dean → InstitutionalHead
- Cannot skip levels
- If rejected: resources released, event returned to coordinator
- Each decision stores: Role, Decision, Timestamp, Justification

### 2. Smart Resource Allocation Engine
**Resources:**
- Venues
- Equipment (mic, projector, speaker, laptop)
- Food supplies
- Facilities (tables, sockets)
- ITC services

**Hard Constraints:**
- No double booking of venue
- Venue capacity ≥ participant count
- Resource allocation ≤ total available
- Time overlaps must be validated
- Hard capacity limits NEVER overridden

### 3. Conflict Explanation Engine
Detailed error messages:
```
"Projector unavailable from 2PM–4PM because Event E102 (CSE Dept) 
already allocated 2 units. Only 2 units exist."
```

Identifies:
- Minimal conflicting set
- Conflicting events
- Resource involved
- Time slot

### 4. Minimal Disruption Reallocation
When new request conflicts:
- Try reassigning alternate venue
- Suggest alternate time slot
- Suggest reduced quantity
- Suggest swapping low-priority event

**Priority Score Formula:**
```
PriorityScore = 
  (EventTypeWeight × Importance) +
  (DepartmentWeight) +
  (ApprovalLevelWeight)
```

### 5. Real-Time Venue Occupancy & Resource State
Maintains via Socket.io:
- **Venue Occupancy:** venueId, timeSlot, allocatedParticipants, eventId
- **Resource Availability:** resourceId, totalQuantity, allocatedQuantity, availabilityWindow

Updates reflect within 2 seconds.

### 6. Event Health Score System
Calculated using:
- Approval delays
- Conflict likelihood
- Resource utilization ratio
- Risk flags

Display:
- 🟢 Healthy
- 🟡 Risky
- 🔴 Critical

### 7. Predictive Risk Detection
Before event starts:
- Food shortage risk
- Equipment near max usage
- Venue near capacity
- Delayed approvals

### 8. What-If Simulation Mode (Admin)
Simulate:
- Equipment count reduction
- Venue becoming unavailable
- Event time extension

Shows affected events.

### 9. Clean Event Closure
When coordinator marks event complete:
- Explicitly release resources
- Update allocation records
- Update occupancy state
- Log usage
- Restore availability

Admin can force release if forgotten.

## Setup

### Server
Create [server/.env](server/.env):
```env
MONGO_URI=mongodb://localhost:27017/vcc_hackathon
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=12h
PORT=4000
```

### Client
Create [client/.env](client/.env):
```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

## Scripts

### Server
```bash
cd server
npm install
npm run seed        # Populate test data
npm run dev         # Start development server
```

### Client
```bash
cd client
npm install
npm run dev         # Start dev server (http://localhost:5173)
npm run build       # Build for production
```

## Test Credentials (after seed)

| Role | Email | Password |
|------|-------|----------|
| Event Coordinator | coord@uni.edu | Password@123 |
| HOD | hod@uni.edu | Password@123 |
| Dean | dean@uni.edu | Password@123 |
| Institutional Head | head@uni.edu | Password@123 |
| Admin/ITC | admin@uni.edu | Password@123 |

## Architecture

### Backend Structure
- [server/src/models](server/src/models) - MongoDB schemas
- [server/src/routes](server/src/routes) - API endpoints
- [server/src/middleware](server/src/middleware) - Auth & RBAC
- [server/src/services](server/src/services) - Business logic
  - `workflow.js` - Approval workflow
  - `allocationEngine.js` - Resource allocation
  - `conflictDetection.js` - Conflict detection
  - `priority.js` - Priority scoring
  - `healthScore.js` - Event health calculation
- [server/src/sockets](server/src/sockets) - Socket.io setup
- [server/src/seed](server/src/seed) - Test data

### Frontend Structure
- [client/src/pages](client/src/pages) - Auth pages
- [client/src/dashboards](client/src/dashboards) - Role-based dashboards
- [client/src/components](client/src/components) - Reusable components
- [client/src/services](client/src/services) - API & Socket clients

## Security

✔ JWT authentication with expiration  
✔ Role-based access control on all routes  
✔ Audit logging for all decisions  
✔ Secrets in .env (excluded from git)  
✔ No visibility across unauthorized boundaries  
✔ MongoDB unique indexes on email  

## Performance

- Real-time updates under 2 seconds
- Scalable for 200+ parallel events
- Atomic allocation updates
- Proper MongoDB indexing on timestamps and references

## Notes

- Allocation locking prevents double-booking after final approval
- Health scores update on every status change
- Risk flags trigger notifications
- Socket.io broadcasts state changes to connected clients

