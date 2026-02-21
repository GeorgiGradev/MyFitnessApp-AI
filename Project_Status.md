# MyFitnessAppV2 – Project Status

**Last updated:** 2026-02-21  
**Repo:** [GeorgiGradev/MyFitnessApp-AI](https://github.com/GeorgiGradev/MyFitnessApp-AI)  
**Purpose:** Rebuild [MyFitnessApp](https://github.com/GeorgiGradev/MyFitnessApp) with .NET 8, React, Material UI, PostgreSQL (AI-assisted). Track progress and next steps here.

**Exam assignment (reference):** Requirements are in **Project_Requirements.md** (in project). Original: Project-Assignment.docx. We must deliver according to that document (see “Exam assignment deliverable” below).

---

## Completed

### 1. Project setup and planning

- [x] Agreed tech stack: .NET 8, React (Vite), TypeScript, Material UI, PostgreSQL, React Query, React Hook Form + Zod, Swagger.
- [x] Created **Tech_Stack.md** – full stack description and project structure.
- [x] Created **AtoZ_Deployment_Plan.md** – free deployment (Railway/Render + Supabase/Neon), step-by-step.
- [x] Decided deployment: free tier, single deployment option (API serves React), suitable for university presentation.

### 2. Repository and version control

- [x] Created GitHub repo **MyFitnessApp-AI** (HTTPS remote).
- [x] Initial commit: .gitignore, Cursor rules, project-best-practices rule, SKILLS_INSTALL.md, skills (vercel-react, web-design, supabase-postgres, etc.).
- [x] Second commit: **Tech_Stack.md** and **AtoZ_Deployment_Plan.md**.
- [x] Branch: **master** (pushed to origin).

### 3. Cursor and tooling

- [x] Cursor rule **ai-assistant-guidelines.mdc** – wait for command, ask questions, no hallucination, admit when unsure.
- [x] Cursor rule **project-best-practices.mdc** – React, API, PostgreSQL, auth, errors, file structure.
- [x] Skills from skills.sh installed (React, Postgres, auth, API design, etc.) for Cursor.
- [x] **.gitignore** – .NET, React/Node, IDE, OS, docx_extract, Project-Assignment.zip.

### 4. Decisions and references

- [x] App name: **MyFitnessAppV2**; folder: `D:\SoftUni_Project_Module_01\MyFitnessAppV2`.
- [x] Reuse images from original MyFitnessApp repo (`wwwroot/images`) – to be copied into new app when frontend is created.
- [x] Module order agreed: Skeleton → Database → Auth → Foods/Exercises → Diaries → Forum → Blog → Social → Admin → Deploy.

---

## To do (by step)

### Step 1: Project skeleton

- [x] Create .NET 8 Web API project (e.g. `Api/`).
- [x] Create React app with Vite + TypeScript in `ClientApp/`.
- [x] Add Material UI, React Query, React Hook Form, Zod, React Router.
- [x] Add Swagger/OpenAPI to API.
- [x] One “hello” endpoint and one React page that calls it.
- [x] Verify both run locally (API + React dev server) – builds succeed.
- [x] **Commit:** e.g. `Project skeleton: .NET 8 API + React (Vite, TS, MUI, React Query, RHF+Zod)`.

---

### Step 2: Database

- [x] Add PostgreSQL (Npgsql) + EF Core 8 to API.
- [x] Create DbContext and base entities (User, Profile, and any needed for later modules).
- [x] Add and run initial migration(s).
- [x] Configure connection string (e.g. appsettings, User Secrets for local).
- [x] **Commit:** Database + connection string fix (User Secrets, no hardcoded password).

---

### Step 3: Authentication

- [x] Register and login endpoints (e.g. JWT Bearer).
- [x] User + Profile (mandatory profile after first login).
- [x] Protect API endpoints that require auth.
- [x] React: login/register pages, auth context, token storage, redirect after login.
- [x] **Commit:** Authentication: register, login, JWT, profile gate.

---

### Step 4: Foods & Exercises

- [x] API: CRUD for foods and exercises (create, search; admin-only delete).
- [x] React: list, search, create; admin delete where applicable.
- [x] **Commit:** e.g. `Foods and Exercises module`.

---

### Step 5: Diaries (eating & workout plans)

- [x] API: create, edit, delete eating and workout plans (and entries; by current user).
- [x] React: UI for managing diaries (date picker, eating/workout tabs, add/delete entries).
- [x] **Commit:** e.g. `Diaries: eating and workout plans`.

---

### Step 6: Forum

- [x] API: forum posts, comments, search.
- [x] React: list, create, edit, delete posts and comments (with confirmation for delete comment).
- [x] **Commit:** e.g. `Forum: posts and comments`.

---

### Step 7: Blog

- [x] API: articles, categories (CRUD; [Authorize] for create/update/delete).
- [x] React: list (with category filter), create, edit, delete articles.
- [x] **Commit:** e.g. `Blog: articles`.

---

### Step 8: Social

- [x] API: follow/unfollow users (list users with isFollowing, following/followers lists, prevent self-follow and following banned users).
- [x] React: follow/unfollow UI (Discover, Following, Followers tabs).
- [x] **Commit:** e.g. `Social: follow/unfollow`.

---

### Step 9: Admin

- [x] Admin area: manage users (list, ban/unban); admin can delete any food, exercise, article, forum post.
- [x] Ban/unban users; banned users restricted from full functionality (BannedUserMiddleware returns 403).
- [x] React: admin route /admin (admin only), Users table with Ban/Unban.
- [x] **Commit:** e.g. `Admin area`.

---

### Step 10: Images and polish

- [x] Copy images from [MyFitnessApp/wwwroot/images](https://github.com/GeorgiGradev/MyFitnessApp/tree/main/MyFitnessApp/Web/MyFitnessApp.Web/wwwroot/images) into new app (e.g. `ClientApp/public/images`).
- [x] Use images in UI where needed.
- [x] **Commit:** e.g. `Add images from original MyFitnessApp`.

---

### Step 11: Exam assignment deliverable (Project_Requirements)

We need to fulfil and submit what the **Project_Requirements** file asks for. Deliverable is **one Google Drive Document** (shared “anyone with the link can view”), typically **3–6 pages**, containing:

- [ ] **Project topic** (up to 1 page): idea and system requirements.
- [ ] **System architecture – modules**: break the system into technological modules; for each module describe approach and how AI assisted.
- [ ] **Development process per module** (up to ½ page per module): approach & reasoning, step-by-step workflow, testing strategy, AI tool choice, 2–3 key prompts or interactions.
- [ ] **Challenges & tool comparison**: biggest challenges, which tool helped most and why, what you would improve.
- [ ] **Working system evidence**: at least **two screenshots** of the functioning system (UI, terminal, Postman, logs, etc.).
- [ ] **Repository**: link to GitHub repo (MyFitnessApp-AI).

**Submission:** One archive (.zip, .rar, or .7z) uploaded in the “Regular Exam” topic via “ИЗБОР НА ФАЙЛ” by **16:00 on 24 February 2026**. The archive should contain (or link to) the Google Doc; each new upload overwrites the previous one.

---

### Step 12: Deployment

- [ ] Create Supabase or Neon PostgreSQL project; get connection string.
- [ ] Configure production config / env (e.g. Railway or Render).
- [ ] Deploy API (+ React static files if single deployment).
- [ ] Run migrations; verify app online.
- [ ] Configure API to serve React static files in production (optional; done before deploy).
- [ ] **Commit:** e.g. `Deployment config and docs update` (if any repo changes).

---

## Next step

**Step 10 done.** Commit (e.g. `Add images from original MyFitnessApp`), then start **Step 11: Exam assignment deliverable (Project_Requirements)**.

---

## How to use this file

- Update the **Last updated** date when you change this file.
- Check off items with `[x]` as they are done.
- Add a new **Commit** line after each step when you push.
- Push **Project_Status.md** with the rest of the changes so the repo always reflects current status.

---

_Exam requirements source: Project-Assignment.docx (AI for Developers – January 2026, Individual Project Assignment)._
