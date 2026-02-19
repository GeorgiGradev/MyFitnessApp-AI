# Skills.sh – Install Commands (run locally)

The `npx skills add` CLI is **interactive** (it asks which agent to install to). Run these in your terminal from the project root and choose **Cursor** when prompted.

```powershell
cd "d:\SoftUni_Project_Module_01\MyFitnessAppV2"

# React & frontend
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines

# PostgreSQL & database
npx skills add https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices
npx skills add https://github.com/wshobson/agents --skill postgresql-table-design

# API, auth, errors, testing
npx skills add https://github.com/wshobson/agents --skill api-design-principles
npx skills add https://github.com/wshobson/agents --skill auth-implementation-patterns
npx skills add https://github.com/wshobson/agents --skill error-handling-patterns
npx skills add https://github.com/anthropics/skills --skill frontend-design
npx skills add https://github.com/anthropics/skills --skill webapp-testing
```

Optional (Better Auth is TypeScript-focused; we use .NET auth, so skip unless you want the patterns):
```powershell
npx skills add https://github.com/better-auth/skills --skill better-auth-best-practices
```

When asked "Which agents do you want to install to?", select **Cursor** (and any others you use).
