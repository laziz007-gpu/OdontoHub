# Requirements: Passwordless Authentication & PostgreSQL Migration

## Overview
Migrate OdontoHub from SQLite to PostgreSQL for persistent data storage on Render, and implement phone-only authentication to reduce user friction and prevent user loss during registration/login.

## Problem Statement
1. **Data Loss Issue**: Current SQLite database on Render gets wiped on every deployment, causing users to lose their accounts
2. **User Friction**: Password requirement during registration/login creates unnecessary friction and may cause users to abandon the registration process
3. **Multi-User Testing**: Need to support unlimited dentists using the public test link

## User Stories

### 1. Database Migration
**As a** system administrator  
**I want** the application to use PostgreSQL instead of SQLite  
**So that** user data persists across deployments on Render

**Acceptance Criteria:**
- 1.1 Backend connects to PostgreSQL database using `DATABASE_URL` environment variable
- 1.2 All existing models work correctly with PostgreSQL
- 1.3 Database tables are created automatically on first run
- 1.4 User data persists after backend redeployment
- 1.5 Local development still works with SQLite (no PostgreSQL required locally)

### 2. Passwordless Authentication - Backend
**As a** backend developer  
**I want** to remove password requirements from authentication endpoints  
**So that** users can register and login with only their phone number

**Acceptance Criteria:**
- 2.1 `/auth/register` endpoint accepts phone, email, role, and full_name (no password)
- 2.2 `/auth/login` endpoint accepts only phone number (no password)
- 2.3 User model stores phone as unique identifier (password field becomes optional or removed)
- 2.4 Authentication tokens are generated based on phone number only
- 2.5 Existing security measures (JWT tokens, token expiration) remain intact
- 2.6 Phone number validation ensures proper format (+998 XX XXX XX XX)

### 3. Passwordless Authentication - Frontend
**As a** user  
**I want** to register and login using only my phone number  
**So that** I can access the application quickly without remembering passwords

**Acceptance Criteria:**
- 3.1 Login page removes password field, shows only phone input
- 3.2 Registration page removes password field, shows only phone, email, name, and role
- 3.3 Phone input has proper formatting and validation
- 3.4 Error messages are clear when phone number is invalid or already registered
- 3.5 Login/register flow works seamlessly without password
- 3.6 UI remains clean and user-friendly

## Technical Constraints
- Backend is deployed on Render.com (free tier)
- Frontend is deployed on Netlify
- PostgreSQL database is hosted on Render: `postgresql://odonto_postgre_sql_user:ktIlPQoXTqgfmE2Fvm0YUPtZf7LZKUF3I@dpg-d69re449c44c7r38g9u50-a.oregon-postgres.render.com/odonto_postgre_sql`
- Must maintain backward compatibility with existing user data structure
- Local development should remain simple (SQLite for local, PostgreSQL for production)

## Security Considerations
- Phone numbers must be unique and validated
- JWT tokens remain the authentication mechanism
- Token expiration and refresh logic stays unchanged
- Rate limiting should be considered for login attempts (future enhancement)
- SMS verification could be added later (out of scope for this spec)

## Out of Scope
- SMS verification codes
- Two-factor authentication
- Password recovery flows
- Rate limiting for login attempts
- Phone number verification via SMS

## Success Metrics
- Users can register and login without passwords
- User data persists across backend redeployments
- No increase in authentication errors
- Reduced registration abandonment rate
- Support for unlimited concurrent users
