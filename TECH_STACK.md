# Tech Stack - MyFitnessAppV2

## Backend

- **.NET 8** - Web API (Controllers pattern)
- **Entity Framework Core 8** - ORM
- **PostgreSQL** - Database (via Npgsql)
- **JWT Bearer Authentication** - For API authentication
- **ASP.NET Core Identity** (optional) - User management
- **Swagger/OpenAPI** - API documentation

## Frontend

- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material UI (MUI)** - Component library
- **TanStack Query (React Query)** - Server state management, caching, data fetching
- **React Hook Form** - Form handling
- **Zod** - Schema validation (used with React Hook Form)
- **React Router v6** - Client-side routing
- **Axios** or **Fetch API** - HTTP client

## Database

- **PostgreSQL** - Primary database
- **EF Core Migrations** - Database versioning

## Development Tools

- **Git** - Version control
- **GitHub** - Repository hosting
- **Cursor** - AI-assisted development IDE

## Deployment (Free Tier)

- **Railway** or **Render** - Hosting for .NET API + React static files (single deployment)
- **Supabase** or **Neon** - Free PostgreSQL hosting

## Architecture

- **RESTful API** - Backend API design
- **SPA (Single Page Application)** - Frontend architecture
- **JWT-based authentication** - Stateless auth
- **Repository Pattern** (optional) - Data access abstraction

## Code Quality

- **TypeScript** - Type safety on frontend
- **C#** - Strongly typed backend
- **ESLint** - Frontend linting
- **StyleCop** (optional) - Backend code style

## Project Structure

```
MyFitnessAppV2/
├── Api/                    # .NET 8 Web API
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Services/
│   └── Program.cs
├── ClientApp/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Key Features

- **TypeScript** for type safety
- **React Query** for efficient data fetching and caching
- **React Hook Form + Zod** for form validation
- **Material UI** for consistent, modern UI components
- **Swagger** for API testing and documentation
- **PostgreSQL** for reliable, scalable data storage
