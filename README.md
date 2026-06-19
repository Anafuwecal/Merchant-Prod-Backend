# Merchant Backend API

A robust, type-safe RESTful API built to manage merchants, products, and order processing. This system features Role-Based Access Control (RBAC), robust error handling, and optimized data aggregation for merchant analytics.

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB & Mongoose
* **Validation:** Zod

---

## 1. Setup Instructions

Follow these steps to get the project running on your local machine.

### Prerequisites
* Node.js (v16+)
* MongoDB (Local instance or MongoDB Atlas cluster)

### Installation

1. **Clone the repository:**
```bash
   git clone <your-repository-url>
   cd <your-project-folder>
```

### install dependencies
```bash

   npm install

```

## Configure Environment Variables:

Create a .env file in the root directory and add the following variables:

NODE_ENV=development
PORT=7000
MONGO_URI=mongodb://localhost:27017/your_db_name
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=90d

## Run the Development Server:
```bash

npm run dev

```

The server should now be running on http://localhost:7000.