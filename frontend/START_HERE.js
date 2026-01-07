#!/usr/bin/env node

/**
 * InterviewAI Frontend - Installation & Setup Guide
 * 
 * This file documents the exact steps to get the frontend running
 */

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        🎓 InterviewAI Frontend - Getting Started Guide         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

📍 Project Location: frontend/

🎯 Quick Start (3 steps):

1️⃣  Navigate to frontend directory:
    cd frontend

2️⃣  Install dependencies:
    npm install

3️⃣  Start development server:
    npm run dev

🌐 Access at: http://localhost:3000

═══════════════════════════════════════════════════════════════════

✅ PREREQUISITES:
   • Node.js 18+ installed
   • Backend running on http://localhost:8000
   • npm or yarn package manager

═══════════════════════════════════════════════════════════════════

📦 SETUP OPTIONS:

Option A: Manual Setup
──────────────────────
  cd frontend
  npm install
  npm run dev

Option B: Windows Batch Script
──────────────────────────────
  cd frontend
  .\\setup.bat
  npm run dev

Option C: Linux/Mac Shell Script
────────────────────────────────
  cd frontend
  chmod +x setup.sh
  ./setup.sh
  npm run dev

═══════════════════════════════════════════════════════════════════

🔧 ENVIRONMENT CONFIGURATION:

The .env.local file should contain:

  NEXT_PUBLIC_API_URL=http://localhost:8000

If not present, create it manually or run setup script.

═══════════════════════════════════════════════════════════════════

📂 PROJECT STRUCTURE:

frontend/
├── src/
│   ├── app/                    # 8 Page components
│   │   ├── page.tsx           # Landing page (/)
│   │   ├── login/page.tsx     # Login (/login)
│   │   ├── signup/page.tsx    # Signup (/signup)
│   │   ├── dashboard/         # Dashboard (/dashboard)
│   │   ├── resume-upload/     # Resume upload
│   │   ├── interview-setup/   # Interview type selection
│   │   ├── interview/         # Chat interface
│   │   └── feedback/          # Feedback display
│   │
│   ├── components/            # 7 Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   └── lib/                   # Utilities
│       ├── api.ts            # Axios config
│       └── auth.ts           # Auth helpers
│
├── public/                    # Static assets
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
├── next.config.ts            # Next.js config
└── .env.local               # Environment variables

═══════════════════════════════════════════════════════════════════

🚀 AVAILABLE COMMANDS:

  npm run dev      # Start development server
  npm run build    # Build for production
  npm start        # Run production build
  npm run lint     # Check code quality

═══════════════════════════════════════════════════════════════════

🧪 TESTING THE FLOW:

1. Landing Page (http://localhost:3000)
   └─ Click "Get Started"

2. Sign Up (/signup)
   └─ Create account with name, email, password

3. Dashboard (/dashboard)
   └─ Auto-loaded after signup

4. Upload Resume (/resume-upload)
   └─ Select and upload a PDF file

5. Interview Setup (/interview-setup)
   └─ Select interview type (Technical/HR/Aptitude)

6. Interview Chat (/interview)
   └─ Answer 5 AI questions

7. Feedback (/feedback)
   └─ View detailed analysis and suggestions

═══════════════════════════════════════════════════════════════════

🔐 AUTHENTICATION FLOW:

┌─────────────────────────────────────────────────────────┐
│ 1. User enters credentials                              │
│ 2. Form submitted to /auth/login or /auth/signup       │
│ 3. Backend returns access_token                        │
│ 4. Token stored in localStorage                         │
│ 5. Axios interceptor auto-adds token to requests       │
│ 6. ProtectedRoute validates token on protected pages   │
│ 7. 401 response triggers logout & redirect to /login   │
└─────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

📊 TECH STACK:

✅ Next.js 15          - React framework with App Router
✅ React 19            - UI library with hooks
✅ Tailwind CSS        - Utility-first CSS framework
✅ Axios               - HTTP client with interceptors
✅ TypeScript          - Type-safe JavaScript
✅ Responsive Design   - Mobile to desktop

═══════════════════════════════════════════════════════════════════

🎨 DESIGN FEATURES:

• Professional SaaS-style UI
• Gradient backgrounds and text
• Smooth animations and transitions
• Responsive mobile-first design
• Error handling throughout
• Loading states on async operations
• Accessibility-friendly components

═══════════════════════════════════════════════════════════════════

⚠️ TROUBLESHOOTING:

Issue: CORS Error in Console
→ Ensure backend allows http://localhost:3000

Issue: API not responding
→ Check NEXT_PUBLIC_API_URL in .env.local
→ Verify backend running on port 8000

Issue: Can't login
→ Verify credentials are correct
→ Check browser localStorage is enabled

Issue: Page shows blank
→ Check browser console for errors
→ Clear browser cache and reload

Issue: File upload fails
→ Verify file is PDF format
→ Check file size (max 10MB)
→ Ensure /resume/upload endpoint exists

═══════════════════════════════════════════════════════════════════

📚 DOCUMENTATION:

Read these files for more information:

1. FRONTEND_SETUP.md
   └─ Quick start, troubleshooting, overview

2. IMPLEMENTATION_COMPLETE.md
   └─ Full technical details, architecture, APIs

3. QUICK_REFERENCE.md
   └─ Handy lookup for files, routes, commands

4. MANIFEST.md
   └─ Complete inventory of all built files

═══════════════════════════════════════════════════════════════════

🎯 DEPLOYMENT:

For production deployment:

1. Build the project:
   npm run build

2. Deploy to Vercel (recommended):
   npx vercel

3. Set environment variable:
   NEXT_PUBLIC_API_URL=<your-production-api-url>

═══════════════════════════════════════════════════════════════════

🎓 LEARNING RESOURCES:

• Next.js Docs: https://nextjs.org/docs
• React Docs: https://react.dev
• Tailwind CSS: https://tailwindcss.com
• Axios: https://axios-http.com
• TypeScript: https://www.typescriptlang.org

═══════════════════════════════════════════════════════════════════

✨ YOU'RE ALL SET!

Your InterviewAI frontend is ready to use. Run:

  cd frontend && npm install && npm run dev

Then open http://localhost:3000 in your browser.

═══════════════════════════════════════════════════════════════════

🚀 Happy Interviewing!

For support, check the documentation files or the code comments.

`);
