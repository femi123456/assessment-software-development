# 🏗️ Nile Mart — System Architecture

## 1️⃣ High-Level Architecture Overview
**Architecture Style:** Full-stack web app (client–server, cloud-hosted)

```
Frontend (Next.js)
        ↓
Backend API (Node.js / Express)
        ↓
Database (MongoDB)
        ↓
Cloud Hosting (Vercel)
```
```

---

# 2️⃣ Frontend Layer
**Technology:** Next.js (React)

**Responsibilities**
- Student UI (browse items, search, chat, profile)
- Seller dashboard (post items, manage listings)
- Authentication pages
- Responsive mobile-friendly design

**Why Next.js**
- Fast rendering (SSR + SPA)
- SEO friendly for listings
- Easy deployment on Vercel/AWS
- Component-based scaling

---

# 3️⃣ Backend Layer (API Server)
**Technology:** Node.js + Express

**Responsibilities**
- User authentication & authorization
- Listings CRUD (create/read/update/delete)
- Messaging logic
- Image upload handling
- Search & filtering
- Transaction logic

**Architecture Pattern**
- REST API
- MVC structure

**Example Routes**
```
POST /auth/register
POST /listings
GET /listings
GET /listings/:id
POST /messages
```

---

# 4️⃣ Database Layer
**Technology:** MongoDB (NoSQL)

**Why MongoDB**
- Flexible schema (students, listings vary)
- JSON-like documents
- Easy scaling
- Good with Node.js

**Core Collections**
- Users
- Listings
- Messages
- Reviews
- Transactions

**Example Listing Document**
```json
{
  "title": "Engineering Calculator",
  "price": 15000,
  "sellerId": "user123",
  "category": "Electronics",
  "images": ["url"],
  "createdAt": "date"
}
```

---

# 5️⃣ Cloud & Infrastructure (Vercel)

**Hosting Strategy**

**Frontend**
- Vercel (Next.js native hosting)

**Backend**
- Vercel Serverless Functions (Node.js API routes)

**Database**
- MongoDB Atlas

**Storage**
- Cloud storage (e.g., S3-compatible or Cloudinary)

**Auth**
- JWT (custom auth)

---

# 6️⃣ Nile Mart Architecture Diagram (Text)
```
[ Student Browser ]
        ↓
[ Next.js Frontend ]
        ↓ API Calls
[ Node.js Backend ]
        ↓
[ MongoDB Database ]

Other Services:
- S3 → Images
- Auth → JWT/Cognito
- CloudFront → CDN
```

---

# 7️⃣ Key Features Supported by Architecture
- Student-only marketplace
- Secure login
- Item listings
- Chat between buyers & sellers
- Reviews & trust system
- Search & filters
- Image uploads

---

