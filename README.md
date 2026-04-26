# iCARE++

A scalable machine learning-driven clinical competency assessment and adaptive learning system for nursing students at Batangas State University – TNEU ARASOF Nasugbu.

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API (optional for development)

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment:**
   Copy `.env.local` and update variables:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Run development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   <http://localhost:3000>

## Project Structure

```
app/
├── admin/           # Dean/Super Admin portal
│   ├── page.tsx           # Overview dashboard
│   ├── analytics/         # Cohort analytics
│   ├── student-management/# Student management
│   ├── rooms/             # Room management
│   ├── faculty/           # Faculty management
│   ├── users/             # User accounts
│   ├── reports/           # Reports & audit logs
│   └── settings/           # Dean settings
├── login/           # Authentication
├── dashboard/       # Student dashboard
├── patients/        # Patient management
├── quizzes/         # Adaptive quizzes
├── performance/     # Performance tracking
└── lib/api.ts      # API utilities
```

## User Roles

| Role | Portal | Access |
|------|--------|--------|
| **Super Admin (Dean)** | `/admin` | Full system, analytics, user management, data privacy |
| **Faculty** | `/admin/faculty` | Student monitoring, grading, room oversight |
| **Student** | `/dashboard` | Clinical tasks, quizzes, patient monitoring |

## Key Features

- **ML-Powered Analytics** - Early identification of at-risk students
- **Adaptive Quizzes** - Personalized learning recommendations
- **Clinical Simulation** - Patient vital signs monitoring
- **Role-Based Access Control** - Secure multi-role system
- **Data Privacy Compliance** - Philippine Data Privacy Act 2012

## Design System

- **Primary Color**: `#1B6B7B` (Teal)
- **Safe/Positive**: Emerald
- **At-Risk/Warning**: Rose

## Commands

```bash
npm run dev       # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run typecheck # Run TypeScript check
```

## Documentation

- [Codebase Summary](./CODEBASE_SUMMARY.md) - Technical overview

