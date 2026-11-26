# FixMate

FixMate is a full-stack device repair marketplace. Customers can browse and book vetted technician services, track repairs through a live status workflow, and pay securely after service. Technicians manage listings (subject to admin approval), and admins moderate services, users, and bookings.

## Live URL: https://fixmate-alpha.vercel.app

## Key Features

- Role-based authentication (customer, technician, admin) with email/password and Google OAuth (BetterAuth + JWT).
- Service marketplace with search, category filters, service modes, sorting, and pagination.
- Technician service management with image upload and admin approval/rejection workflow.
- Booking lifecycle with live status tracking and technician updates.
- Secure Stripe payments (pay after service) and downloadable PDF invoices.
- Role-specific dashboards for customers, technicians, and admins.
- Reviews and ratings on services.
- Notification bell for user interactions.
- Responsive UI built with Tailwind CSS and shadcn/ui.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui (Radix/Base UI)
- BetterAuth (MongoDB adapter, JWT, Google OAuth)
- Stripe, ImgBB (image uploads), jsPDF
- MongoDB

## npm Packages Used

Core dependencies (from `package.json`):

- `next`, `react`, `react-dom`
- `better-auth`, `@better-auth/mongo-adapter`
- `mongodb`
- `tailwindcss`, `tw-animate-css`, `shadcn`
- `@radix-ui/react-slot`, `@base-ui/react`
- `class-variance-authority`, `cn`
- `lucide-react`
- `framer-motion`
- `react-hook-form`, `@hookform/resolvers`, `zod`
- `stripe` (client publishable key; server secret via env)
- `jspdf`
- `embla-carousel-react`
- `recharts`
- `next-themes`
- `sonner`
- `zod`

Dev dependencies:

- `typescript`, `eslint`, `eslint-config-next`
- `@tailwindcss/postcss`, `postcss`
- `@types/node`, `@types/react`, `@types/react-dom`
- `prettier`, `prettier-plugin-tailwindcss`
