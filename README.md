# AfriBite 🥘

AfriBite is a premier, full-stack e-commerce marketplace tailored for authentic African groceries, spices, snacks, and specialty ingredients. Built with modern web technologies, it offers a seamless shopping experience for the African diaspora across Canada.

![AfriBite Overview](https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop)

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: [Stripe](https://stripe.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Language**: TypeScript

## ✨ Key Features

- **Modern Shopping Experience**: A fully responsive, beautifully designed frontend catalog with filtering, sorting, and persistent shopping carts.
- **Secure Authentication**: User sign-up, login, and protected routes handled seamlessly by Supabase.
- **Automated Payments**: Integrated Stripe Checkout with webhook listeners for order fulfillment and receipt generation.
- **Admin Dashboard**: A secure internal portal for store managers to add products, track inventory, upload images to Supabase Storage, and review customer orders.
- **SEO Optimized**: Metadata and semantic HTML implemented out of the box.

## 🛠️ Local Development

Follow these steps to run the AfriBite platform locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/reneineza/afribite-web.git
cd afribite-web
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add your Supabase and Stripe keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Database Schema

The `database_schema.sql` file located in the root directory contains the full PostgreSQL schema used by the application. You can execute this script directly in your Supabase SQL Editor to instantly provision your tables, Row Level Security (RLS) policies, and storage buckets.

---
*Designed and built for the love of authentic flavors.*
