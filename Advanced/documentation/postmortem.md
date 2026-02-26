# Postmortem — Challenges & Lessons Learned (Nile Mart)

This document summarizes the main challenges encountered during the design and development of Nile Mart and the key lessons learned from them.

---

# 1️⃣ Scope Definition Was Initially Unclear

**Challenge**
Early in the project, the exact feature set and MVP boundaries were not clearly defined. This led to shifting ideas about whether Nile Mart should include advanced features like real-time chat, payments, or recommendation systems.

**Impact**
- Time spent exploring non-MVP ideas
- Architecture uncertainty
- Difficulty prioritizing tasks

**Lesson Learned**
Define MVP scope before architecture decisions. A clear feature boundary prevents overengineering and keeps development focused.

---

# 2️⃣ Choosing the Right Hosting Model

**Challenge**
There was initial uncertainty between traditional cloud infrastructure and platform hosting.

**Impact**
- Delayed deployment planning
- Confusion about backend structure

**Lesson Learned**
For student-scale applications, platform hosting (like Vercel) dramatically reduces infrastructure complexity and accelerates deployment.

---

# 3️⃣ Serverless Backend Constraints

**Challenge**
Designing backend logic within serverless function constraints required different thinking compared to a persistent Express server.

**Impact**
- Need for stateless API design
- Awareness of execution limits
- Consideration of cold starts

**Lesson Learned**
Serverless works best when APIs are stateless and modular. Backend architecture should be designed around function boundaries from the start.

---

# 4️⃣ Database Schema Flexibility vs Structure

**Challenge**
MongoDB’s flexible schema made early modeling easy but raised questions about data consistency and relationships (users, listings, messages).

**Impact**
- Need for manual validation rules
- Careful reference design
- Extra planning for queries

**Lesson Learned**
NoSQL flexibility speeds MVP development, but clear data models and validation rules are still essential for maintainability.

---

# 5️⃣ Feature Ambition vs MVP Reality

**Challenge**
There was a natural tendency to design Nile Mart as a fully featured marketplace from the beginning.

**Impact**
- Potential overengineering
- Risk of delayed delivery

**Lesson Learned**
An MVP marketplace only needs:
- Listings
- User accounts
- Basic messaging

Advanced features should be deferred until real usage validates demand.

---

# 6️⃣ Full-Stack Consistency Was Valuable

**Observation**
Using JavaScript across frontend and backend simplified development and reduced context switching.

**Lesson Learned**
For small teams and student projects, a unified language stack significantly improves velocity and maintainability.

---

# 7️⃣ Architecture Should Match Scale

**Observation**
Early thoughts about microservices and high-scale architecture were unnecessary for a university marketplace.

**Lesson Learned**
Architecture should match expected user scale. Overly complex systems add cost without benefit at early stages.

---

# Overall Reflection

Nile Mart reinforced that successful early-stage architecture prioritizes:
- Simplicity
- Clear scope
- Fast deployment
- Low operational overhead

The project demonstrated that platform-native full-stack architectures are highly effective for student-built marketplace applications.

