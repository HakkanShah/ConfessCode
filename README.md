<div align="center">
  <img src="public/icons/dp.png" alt="ConfessCode Logo" width="120px" />
  <h1 align="center">&lt;ConfessCode/&gt;</h1>
  <p align="center">
    An anonymous, coder friendly platform for sharing secrets, confessions, and stories without revealing your identity.
  </p>
  <p align="center">
    <a href="https://concode.vercel.app/" target="_blank"><strong>View Live Demo »</strong></a>
  </p>
  <p align="center">
    Created by <a href="https://www.github.com/HakkanShah" target="_blank"><strong>Hakkan Shah</strong></a>
  </p>
</div>

--- 

## 🚀 Overview

*ConfessCode* is a full-stack Next.js application designed as a safe and anonymous space for users to share confessions. It features a unique "Code terminal" aesthetic, client-side anonymity management, AI-powered content moderation, and a complete admin dashboard for content management.

The platform is built to be secure and private by design—it never stores user credentials, passwords, or personal information. Anonymity is managed through a locally stored hash, ensuring user privacy.

## ✨ Core Features

- *True Anonymity*: No user accounts or logins. Activation is done via a one-time secret key, generating a client-side anonymous hash.
- *AI-Powered Moderation*: Confessions are automatically reviewed by a Genkit AI flow to check for toxic content before being sent to admins.
- *Interactive Feed*: Users can browse approved confessions, like, dislike, and comment on them.
- *Nested Comments*: Engage in discussions with threaded replies.
- *Admin Dashboard*: A secure area for administrators to review, approve, reject, or delete confessions and ban malicious users.
- *Shareable Confessions*: Easily share a confession as an image on social media using the Web Share API.
- *PWA Ready*: The application is a fully installable Progressive Web App (PWA) for a native-like experience on any device.
- *Engaging UI/UX*: A unique "terminal" theme with glitch effects, typing animations, and custom sounds for an immersive experience.

## 🛠 Tech Stack

This project is built with a modern, robust, and scalable technology stack.

- *Framework*: [Next.js](https://nextjs.org/) (App Router)
- *Language*: [TypeScript](https://www.typescriptlang.org/)
- *Styling*: [Tailwind CSS](https://tailwindcss.com/)
- *UI Components*: [ShadCN/UI](https://ui.shadcn.com/)
- *Database*: [Supabase](https://supabase.io/) (PostgreSQL)
- *Generative AI*: [GEMINI API](https://ai.google.dev/gemini-api/docs)
- *Icons*: [Lucide React](https://lucide.dev/)
- *Deployment*: Vercel, Netlify, or any Node.js compatible platform.

## ⚙ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Setup

1.  *Clone the repository:*
    sh
    git clone https://github.com/HakkanShah/ConfessCode.git
    cd confess-code
    

2.  *Install dependencies:*
    sh
    npm install
    

3.  *Set up environment variables:*
    Create a .env file in the root of the project and add the following keys. You will need to create a Supabase project to get these values.

    # env
    ## Supabase URL and Keys
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

    ## Secret key for the admin dashboard
    ADMIN_SECRET_KEY=your_super_secret_admin_key

    ## (Optional) Google AI API Key for Genkit
    GEMINI_API_KEY=your_gemini_api_key
    

4.  *Set up the Supabase database:*
    You will need to run the SQL scripts located in the /supabase directory of this project to set up the necessary tables (confessions, comments, activations, etc.) and database functions.

5.  *Run the development server:*
    sh
    npm run dev
    

The application should now be running on [http://localhost:9002](http://localhost:9002).

## 🔑 Accessing the App

-   *User Access*: Navigate to the homepage and click "Activate." Use the default key WELCOME to generate your anonymous identity.
-   *Admin Access*: Navigate to /admin/login and enter the ADMIN_SECRET_KEY you defined in your .env file.
