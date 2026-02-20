# MyFitnessAppV2 – Project Status

**Last updated:** 2026-02-20  
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
- [ ] Configure API to serve React static files in production (optional; done later before deploy).
- [x] Add Swagger/OpenAPI to API.
- [x] One “hello” endpoint and one React page that calls it.
- [x] Verify both run locally (API + React dev server) – builds succeed.
- [ ] **Commit:** e.g. `Project skeleton: .NET 8 API + React (Vite, TS, MUI, React Query, RHF+Zod)`.

---

### Step 2: Database

- [x] Add PostgreSQL (Npgsql) + EF Core 8 to API.
- [x] Create DbContext and base entities (User, Profile, and any needed for later modules).
- [x] Add and run initial migration(s).
- [x] Configure connection string (e.g. appsettings, User Secrets for local).
- [ ] **Commit:** e.g. `Database: PostgreSQL + EF Core + initial migration`.

---

### Step 3: Authentication

- [ ] Register and login endpoints (e.g. JWT Bearer).
- [ ] User + Profile (mandatory profile after first login).
- [ ] Protect API endpoints that require auth.
- [ ] React: login/register pages, auth context, token storage, redirect after login.
- [ ] **Commit:** e.g. `Authentication: register, login, JWT, profile gate`.

---

### Step 4: Foods & Exercises

- [ ] API: CRUD for foods and exercises (create, search; admin-only delete).
- [ ] React: list, search, create; admin delete where applicable.
- [ ] **Commit:** e.g. `Foods and Exercises module`.

---

### Step 5: Diaries (eating & workout plans)

- [ ] API: create, edit, delete eating and workout plans.
- [ ] React: UI for managing diaries.
- [ ] **Commit:** e.g. `Diaries: eating and workout plans`.

---

### Step 6: Forum

- [ ] API: forum posts, comments, search.
- [ ] React: list, create, edit, delete posts and comments (with confirmation).
- [ ] **Commit:** e.g. `Forum: posts and comments`.

---

### Step 7: Blog

- [ ] API: articles, categories.
- [ ] React: list, create, edit, delete articles.
- [ ] **Commit:** e.g. `Blog: articles`.

---

### Step 8: Social

- [ ] API: follow/unfollow users.
- [ ] Optional: email (e.g. SendGrid) for user-to-user messages.
- [ ] React: follow/unfollow UI, optional email flow.
- [ ] **Commit:** e.g. `Social: follow/unfollow, optional email`.

---

### Step 9: Admin

- [ ] Admin area: manage users, foods, exercises, articles, forum posts.
- [ ] Ban/unban users; banned users restricted from full functionality.
- [ ] React: admin routes and pages.
- [ ] **Commit:** e.g. `Admin area`.

---

### Step 10: Images and polish

- [ ] Copy images from [MyFitnessApp/wwwroot/images](https://github.com/GeorgiGradev/MyFitnessApp/tree/main/MyFitnessApp/Web/MyFitnessApp.Web/wwwroot/images) into new app (e.g. `ClientApp/public/images`).
- [ ] Use images in UI where needed.
- [ ] **Commit:** e.g. `Add images from original MyFitnessApp`.

---

### Step 11: Deployment

- [ ] Create Supabase or Neon PostgreSQL project; get connection string.
- [ ] Configure production config / env (e.g. Railway or Render).
- [ ] Deploy API (+ React static files if single deployment).
- [ ] Run migrations; verify app online.
- [ ] **Commit:** e.g. `Deployment config and docs update` (if any repo changes).

---

### Step 12: Exam assignment deliverable (Project_Requirements)

We need to fulfil and submit what the **Project_Requirements** file asks for. Deliverable is **one Google Drive Document** (shared “anyone with the link can view”), typically **3–6 pages**, containing:

- [ ] **Project topic** (up to 1 page): idea and system requirements.
- [ ] **System architecture – modules**: break the system into technological modules; for each module describe approach and how AI assisted.
- [ ] **Development process per module** (up to ½ page per module): approach & reasoning, step-by-step workflow, testing strategy, AI tool choice, 2–3 key prompts or interactions.
- [ ] **Challenges & tool comparison**: biggest challenges, which tool helped most and why, what you would improve.
- [ ] **Working system evidence**: at least **two screenshots** of the functioning system (UI, terminal, Postman, logs, etc.).
- [ ] **Repository**: link to GitHub repo (MyFitnessApp-AI).

**Submission:** One archive (.zip, .rar, or .7z) uploaded in the “Regular Exam” topic via “ИЗБОР НА ФАЙЛ” by **16:00 on 24 February 2026**. The archive should contain (or link to) the Google Doc; each new upload overwrites the previous one.

---

## Exam schedule (AI-Assisted Development course)

The exam takes place **between 21 and 24 February 2026**, as follows:

**1. Practical part**

- In the **“Regular Exam”** topic there is an uploaded file with the project requirements.
- You must submit **one** file in archive format (**.zip**, .rar, or .7z) via the **“ИЗБОР НА ФАЙЛ”** (FILE CHOICE) button in the “Regular Exam” topic.
- **Deadline:** by **16:00 on 24 February 2026**.
- You submit a **single** archive; each upload **overwrites** the previous one (only the last uploaded archive is kept).

**2. Theoretical part**

- The test is available in the **Quiz** system.
- You can **start** the exam **no earlier than 08:00 on 21 February** and **no later than 16:00 on 24 February 2026**.
- On **25 February 2026 (Wednesday)**, between **10:00 and 22:00**, the test will be **open for review** and you will be able to see the answers. The review option is provided only to participants who have passed the exam.

---

## Next step

**Step 2 done.** Commit and push, then start **Step 3: Authentication** – register, login, JWT, profile gate.

---

## How to use this file

- Update the **Last updated** date when you change this file.
- Check off items with `[x]` as they are done.
- Add a new **Commit** line after each step when you push.
- Push **Project_Status.md** with the rest of the changes so the repo always reflects current status.

---

_Exam requirements source: Project-Assignment.docx (AI for Developers – January 2026, Individual Project Assignment)._
