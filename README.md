This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

DMify - Auto DM Tool

Project Overview

DMify is a Next.js frontend project that integrates with Supabase for authentication.
Users must log in to access the Welcome page and then can navigate to Home, All Posts, or Dashboard.

Folder structure



src/
 └─ app/
 
     ├─ Header
     ├─ allposts
     ├─ dashboard/[id]
     ├─ home
     ├─ login/Signup 
     ├─ welcomePage
     ├─ globals.css
     ├─ layout.js        # Main layout wrapper
     └─ page.js          # Default redirect to /login


---

Prerequisites

Node.js >= 18

npm or yarn

Git

Supabase account (for authentication)



---

Getting Started

1. Clone the repository

git clone https://github.com/Techplement-dev/DMify.git
cd DMify

2. Install dependencies
   
npm install
# or
yarn install

3. Environment Variables

Create a .env file in the root folder and add your Supabase keys:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

> Do not commit .env to GitHub. It is already added to .gitignore.

4. Run the development server



npm run dev
# or
yarn dev

Open http://localhost:3000 to view in the browser.

By default, it redirects to /login.



---

Project Flow

1. Login / Signup (src/app/login/)

User enters email and password

Auth handled by Supabase



2. Welcome Page (src/app/welcomePage/)

Accessible only after login

Shows a “Connect to Instagram” button



3. Home, All Posts, Dashboard

Navigation via Header component (src/app/Header/)

Dashboard uses dynamic route [id]





---

Scripts

Command	Description

npm run dev	Start development server
npm run build	Build production version
npm start	Start production server
npm run lint	Run linting



---

Notes

Make sure eslint.config.zip or other large files are not in the repo.

Team members can safely clone and start without conflicts.
