# Pulse

A Threads-inspired social platform built with Next.js, TypeScript, Prisma, and PostgreSQL.

**Live Demo:** https://pulse-next-app.vercel.app

## Overview

Pulse is a full-stack social platform where users can share posts, participate in threaded conversations, join communities, and interact with other users.

## Features

- Authentication and user onboarding
- Create and delete posts
- Nested comments and replies
- Create, join, and explore communities
- User profiles and profile editing
- User search with pagination
- Activity notifications
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** Next.js Server Actions
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** Clerk
- **Storage:** Supabase Storage
- **Validation:** Zod, React Hook Form
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database
- Clerk and Supabase accounts

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zainWebDeveloper86/Pulse.git
   cd Pulse
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure Environment Variables

    Copy the `.env.example` file to `.env.local`:
    
    ```bash
    cp .env.example .env.local
    ```
    
    Open `.env.local` and replace the placeholder values with your own credentials.
  
    **Note:** Never commit `.env.local` or expose your secret credentials publicly.

4. Set up the database:

   ```bash
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

Open http://localhost:3000 to view the application.

## License

This project was built for learning and portfolio purposes.
