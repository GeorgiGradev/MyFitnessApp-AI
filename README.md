# MyFitnessAppV2

MyFitnessApp rebuilt with .NET 8, React, Material UI, and PostgreSQL (AI-assisted development).

## Run locally

### Database (PostgreSQL)

1. Create a database named `MyFitnessApp` (or use your own name).
2. Set the connection string **via User Secrets** (so the password is never in the repo):

   ```bash
   cd Api
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=MyFitnessApp;Username=postgres;Password=YOUR_ACTUAL_PASSWORD"
   ```

   Or set it in `Api/appsettings.json` for local-only use (do not commit real passwords).
3. Apply migrations:

```bash
cd Api
dotnet ef database update
```

(If the API is running, stop it first.)

### API (.NET 8)

```bash
cd Api
dotnet run
```

API: http://localhost:5185  
Swagger: http://localhost:5185/swagger

### Client (React + Vite)

```bash
cd ClientApp
npm install
npm run dev
```

Client: http://localhost:5173 (proxies `/api` to the API)

Run both; open http://localhost:5173 and the home page will call the API hello endpoint.

## Stack

- **Backend:** .NET 8 Web API, Swagger
- **Frontend:** React 18, TypeScript, Vite, Material UI, React Query, React Hook Form, Zod, React Router

See **Tech_Stack.md** and **Project_Status.md** for full details.
