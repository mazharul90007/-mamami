# Mamami Backend

A Node.js/TypeScript backend application with Express.js, Prisma ORM, and comprehensive authentication system.

## Features

- 🔐 JWT Authentication with access and refresh tokens
- 📧 Email functionality with OTP verification
- 🖼️ File upload with image processing (Sharp)
- ✅ Request validation with Zod
- 🗄️ PostgreSQL database with Prisma ORM
- 🛡️ Global error handling
- 🔒 Password hashing with bcrypt
- 📝 TypeScript support

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm package manager

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

   # Server Configuration
   NODE_ENV=development
   PORT=5000
   BASE_URL_SERVER=http://localhost:5000
   BASE_URL_CLIENT=http://localhost:3000

   # JWT Configuration
   JWT_ACCESS_SECRET=your_access_secret_key_here
   JWT_ACCESS_EXPIRES_IN=1d
   JWT_REFRESH_SECRET=your_refresh_secret_key_here
   JWT_REFRESH_EXPIRES_IN=7d

   # Email Configuration (Brevo)
   BREVO_USER=your_brevo_username
   BREVO_SENDER_EMAIL=your_verified_sender@domain.com
   BREVO_API_KEY=your_brevo_api_key

   # Password Hashing
   BCRYPT_SALT_ROUNDS=12
   ```

4. Generate Prisma client:
   ```bash
   pnpm db:generate
   ```

5. Set up the database:
   ```bash
   pnpm db:push
   ```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build the project for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio

## Project Structure

```
src/
├── app/
│   ├── errors/          # Error handling utilities
│   ├── interface/       # TypeScript interfaces
│   ├── middlewares/     # Express middlewares
│   ├── modules/         # Feature modules
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── config/              # Configuration files
├── app.ts              # Express app setup
└── server.ts           # Server entry point
```

## API Endpoints

The API is available at `/api/v1/`

## Dependencies

### Core Dependencies
- `express` - Web framework
- `@prisma/client` - Database ORM
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `nodemailer` - Email functionality
- `multer` - File upload handling
- `sharp` - Image processing
- `uuid` - Unique ID generation
- `zod` - Schema validation
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `http-status` - HTTP status codes

### Development Dependencies
- `typescript` - TypeScript compiler
- `ts-node-dev` - Development server
- `@types/*` - TypeScript type definitions

## Database

This project uses PostgreSQL with Prisma ORM. Make sure you have PostgreSQL installed and running, then update the `DATABASE_URL` in your `.env` file.

## Email Setup

For email functionality with Brevo:
1. Create a Brevo account at https://www.brevo.com
2. Get your SMTP credentials from Brevo dashboard
3. Add your verified sender email address
4. Use the credentials in your `.env` file:
   - `BREVO_USER`: Your Brevo username/API key
   - `BREVO_SENDER_EMAIL`: Your verified sender email
   - `BREVO_API_KEY`: Your Brevo API key

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Request validation with Zod
- CORS configuration
- Global error handling
- File upload security (type and size validation) 