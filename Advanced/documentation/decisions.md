# Technical Decisions & Trade-offs — Nile Mart

This document explains the key architectural and technical decisions made in Nile Mart, including the reasoning behind each choice and the associated trade-offs.

---

# 1️⃣ Frontend Framework — Next.js

**Decision**
Use Next.js (React) for the web frontend.

**Why**
- Built-in routing and layouts
- Server-side rendering support
- Optimized performance
- Seamless deployment on Vercel
- Large ecosystem (React)

**Trade-offs**
- More complex than plain React SPA
- SSR not fully utilized in MVP
- Learning curve for routing/data fetching patterns

---

# 2️⃣ Backend Architecture — Node.js with API Routes

**Decision**
Use Node.js backend via serverless API routes.

**Why**
- Same language across stack (JavaScript)
- Easy integration with Next.js
- Fast MVP development
- Native support on Vercel

**Trade-offs**
- Less control than dedicated Express server
- Cold starts possible in serverless
- Harder to scale into microservices later

---

# 3️⃣ Database — MongoDB Atlas

**Decision**
Use MongoDB (NoSQL document database).

**Why**
- Flexible schema for listings
- JSON-like data model fits marketplace
- Easy integration with Node.js
- Managed hosting (Atlas)

**Trade-offs**
- No relational joins like SQL
- Data consistency enforcement is manual
- Complex queries less efficient than SQL

---

# 4️⃣ Hosting Platform — Vercel

**Decision**
Host application on Vercel.

**Why**
- Native Next.js support
- Automatic deployments from GitHub
- Serverless backend included
- Global CDN
- Simple scaling for student traffic

**Trade-offs**
- Vendor lock-in to Vercel platform
- Serverless execution limits
- Less infrastructure control than VPS/cloud VM

---

# 5️⃣ Image Storage — Cloud Storage Service

**Decision**
Store listing images in external cloud storage.

**Why**
- Keeps database lightweight
- Faster image delivery
- Scalable media storage
- Standard marketplace pattern

**Trade-offs**
- Additional service dependency
- Upload handling complexity
- Possible storage costs

---

# 6️⃣ Authentication — JWT (Custom Auth)

**Decision**
Use JSON Web Tokens for authentication.

**Why**
- Stateless sessions
- Works well with serverless
- Simple implementation for MVP
- Frontend/backend separation

**Trade-offs**
- Token revocation complexity
- Manual security handling
- No built-in user management UI

---

# 7️⃣ Monolithic MVP Architecture

**Decision**
Keep Nile Mart as a single deployable app (frontend + backend together).

**Why**
- Fastest to build
- Simplest deployment
- Small initial user base
- Lower operational complexity

**Trade-offs**
- Harder to scale components independently
- Tight coupling of features
- Refactoring needed for microservices later

---

# Summary

The Nile Mart architecture prioritizes:
- Fast MVP delivery
- Low operational complexity
- Full-stack JavaScript consistency
- Seamless deployment

These decisions intentionally favor speed and simplicity over maximum scalability, which is appropriate for an early-stage university marketplace platform.

