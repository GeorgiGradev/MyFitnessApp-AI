# Deployment Plan - MyFitnessAppV2

## Overview

Deploy the application for **free** using free-tier services, allowing online testing and presentation at the university.

## Deployment Strategy

**Recommended: Single Deployment** (simplest)
- .NET 8 API serves React static files (one app, one host)
- PostgreSQL database hosted separately (free tier)

---

## Option 1: Single Deployment (Recommended)

### Architecture

```
[Railway/Render] → .NET 8 API + React Static Files
                      ↓
              [Supabase/Neon PostgreSQL]
```

### Steps

#### 1. Database Setup (Supabase or Neon)

**Supabase:**
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Copy connection string (PostgreSQL)
5. Note: Database URL format: `postgresql://user:password@host:port/dbname`

**Neon:**
1. Go to https://neon.tech
2. Sign up (free)
3. Create new project
4. Copy connection string (PostgreSQL)

#### 2. Configure .NET API

**appsettings.json / appsettings.Production.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_SUPABASE_OR_NEON_CONNECTION_STRING"
  },
  "AllowedHosts": "*"
}
```

**Program.cs:**
- Ensure React static files are served in production
- Configure CORS if needed
- Run EF Core migrations on startup (or manually)

#### 3. Build React App

```bash
cd ClientApp
npm run build
```

This creates `dist/` folder with static files.

#### 4. Configure .NET to Serve React

**Program.cs:**
```csharp
// Serve static files from React build
app.UseStaticFiles();
app.UseRouting();

// Fallback to index.html for React Router
app.MapFallbackToFile("index.html");
```

#### 5. Deploy to Railway

1. Go to https://railway.app
2. Sign up (free, $5 credit/month)
3. Connect GitHub repository
4. Create new project → Deploy from GitHub
5. Select `MyFitnessApp-AI` repository
6. Railway auto-detects .NET
7. Set environment variable: `ConnectionStrings__DefaultConnection` = your Supabase/Neon connection string
8. Deploy

**Railway will:**
- Build the .NET app
- Run migrations (if configured)
- Serve the app on a public URL

#### 6. Deploy to Render (Alternative)

1. Go to https://render.com
2. Sign up (free, 750 hours/month)
3. New → Web Service
4. Connect GitHub → Select repository
5. Settings:
   - **Build Command:** `dotnet publish -c Release -o ./publish`
   - **Start Command:** `dotnet ./publish/Api.dll`
   - **Environment:** `.NET`
6. Add environment variable: `ConnectionStrings__DefaultConnection`
7. Deploy

---

## Option 2: Separate Deployments

### Architecture

```
[Vercel/Netlify] → React Frontend
                      ↓ (API calls)
[Railway/Render] → .NET 8 API
                      ↓
              [Supabase/Neon PostgreSQL]
```

### Steps

#### 1. Database Setup
Same as Option 1 (Supabase or Neon)

#### 2. Deploy Backend (Railway/Render)
Same as Option 1, but:
- Don't serve React static files
- Configure CORS to allow frontend domain

**CORS Configuration:**
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://your-frontend.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

#### 3. Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Sign up (free)
3. Import GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `ClientApp`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable: `VITE_API_URL` = your Railway/Render API URL
6. Deploy

#### 4. Update Frontend API Base URL

**ClientApp/.env.production:**
```
VITE_API_URL=https://your-api.railway.app
```

---

## Database Migration Strategy

### Option A: Run Migrations on Startup (Recommended for free tier)

**Program.cs:**
```csharp
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}
```

### Option B: Manual Migration (More control)

SSH into Railway/Render and run:
```bash
dotnet ef database update
```

---

## Environment Variables

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT__Secret` | JWT signing key (min 32 chars) | Generate: `openssl rand -base64 32` |
| `JWT__Issuer` | JWT issuer | `MyFitnessApp` |
| `JWT__Audience` | JWT audience | `MyFitnessApp` |
| `ASPNETCORE_ENVIRONMENT` | Environment | `Production` |

### Frontend (if separate deployment)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.railway.app` |

---

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] API accessible (test Swagger endpoint)
- [ ] Frontend loads correctly
- [ ] Authentication works
- [ ] CORS configured (if separate deployments)
- [ ] HTTPS enabled (automatic on Railway/Render/Vercel)

---

## Free Tier Limits

### Railway
- $5 credit/month (usually enough for small apps)
- Auto-sleeps after inactivity (wakes on request)

### Render
- 750 hours/month free
- Auto-sleeps after inactivity (wakes on request)

### Supabase
- 500MB database storage
- 2GB bandwidth/month
- Unlimited API requests

### Neon
- 0.5GB database storage
- Good for development/testing

### Vercel
- Unlimited deployments
- 100GB bandwidth/month
- Auto HTTPS

---

## Troubleshooting

### Database Connection Issues
- Check connection string format
- Verify database is accessible (not IP-restricted)
- Test connection locally first

### CORS Errors (separate deployments)
- Verify CORS policy includes frontend URL
- Check `Access-Control-Allow-Origin` header

### Build Failures
- Check build logs in Railway/Render dashboard
- Verify all dependencies are in `.csproj` / `package.json`
- Ensure Node.js/.NET versions are compatible

### Static Files Not Loading
- Verify `UseStaticFiles()` is called before `UseRouting()`
- Check `wwwroot` or `dist` folder is included in build

---

## Cost Summary

**Total Cost: $0/month**

- Railway/Render: Free tier
- Supabase/Neon: Free tier
- Vercel (if separate): Free tier

All services offer free tiers sufficient for testing and presentation.
