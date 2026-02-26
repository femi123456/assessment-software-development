# Nile Mart — Project Overview & Deployment Info

## Project Overview
**Nile Mart** is a student-only marketplace platform for Nile University. It allows students to buy and sell items safely within the campus community, with features including user accounts, item listings, messaging, search, and reviews.

**Key Features:**
- User registration and authentication
- Item listing creation, update, and deletion (CRUD)
- Image uploads for products
- Messaging between buyers and sellers
- Search and filter listings by category or price
- Reviews for sellers to establish trust

**Tech Stack:**
- Frontend: Next.js (React)
- Backend: Node.js serverless API routes
- Database: MongoDB Atlas
- Hosting: Vercel
- Authentication: JWT
- Storage: Cloud storage service for images

---

## Deployment Info
**Hosting Platform:** Vercel

**Steps to Deploy:**
1. Push code to GitHub repository.
2. Connect repository to Vercel.
3. Add environment variables in Vercel dashboard (MongoDB URI, JWT secret, cloud storage keys).
4. Vercel automatically builds and deploys the Next.js project.
5. Verify deployment via provided Vercel URL.

**Local Development:**
```bash
# Clone the repo
git clone <repo-url>
cd projects/nile-mart

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Run development server
npm run dev
```
Visit `http://localhost:3000` to access the app locally.

---

## Documentation Links
- [Architecture](docs/architecture.md)
- [Technical Decisions & Trade-offs](docs/decisions.md)
- [Postmortem — Challenges & Lessons Learned](docs/postmortem.md)

