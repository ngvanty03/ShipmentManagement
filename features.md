## 1. Handover Logs (AI Context Persistence)

### Frontend (Agent-1) Handover to Backend (Agent-2) - Initial Setup
**Date:** 2026-05-13
**Status:** Waiting for API Contract

- **Completed Tasks:**
  - Initialized React + TypeScript + Tailwind CSS using Vite in `/frontend` directory.
  - Setup routing with `react-router-dom`.
  - Created a `ProtectedRoute` component and a basic `MainLayout` shell.
  - Implemented an in-memory `Zustand` store for authentication (`useAuthStore`).
  - Created a `useAuth` hook and a `LoginPage` with mock data for testing.
- **Pending Tasks:**
  - Update `useAuth` hook logic with actual API calls using Axios.
- **Action Required from Agent-2:**
  - Please define the Authentication API endpoints (e.g., `/api/auth/login`).
  - Provide the JSON schema/contract for the expected Request payload and Response payload in `features.md`.
  - We expect the Response payload to contain a `token` (JWT) and basic `user` details (`id`, `email`, `role`, `name`).

### Backend (Agent-2) Handover to Frontend (Agent-1) - Architecture & API Contract
**Date:** 2026-05-13
**Status:** Completed (Backend Scaffolding and Auth Logic Done)

- **Summary:** Initialized the 4-layer Clean Architecture solution (Domain, Application, Infrastructure, API). Implemented MediatR commands, EF Core configurations, and JwtTokenGenerator for `Login` and `RefreshToken` endpoints. Initial EF migration generated.
*Note: As per security requirements, the JWT token is delivered via HttpOnly Cookies, not in the JSON response body.*
- **Contract:**
  - `POST /api/auth/login`
    - **Request:** `{ "email": "customer@example.com", "password": "Password123!" }`
    - **Response (200 OK):** 
      ```json
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "email": "customer@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "Customer" // "Admin" or "Customer"
      }
      ```
      *Note: `accessToken` and `refreshToken` are set via `Set-Cookie` headers.*
  - `POST /api/auth/refresh`
    - **Request:** No body needed, `refreshToken` is sent automatically via cookies.
    - **Response (200 OK):** Same user profile as Login, and sets new token cookies.

### Frontend (Agent-1) Update - API Integration
**Date:** 2026-05-13
**Status:** Completed (Login Integration)

- **Completed Tasks:**
  - Configured `config.json` for base URL API (`https://localhost:2026/api`).
  - Implemented `axiosInstance.ts` with `withCredentials: true` to manage HttpOnly cookies for tokens automatically.
  - Updated `authStore.ts` to match the new `User` DTO (`firstName`, `lastName`) and removed explicit token storage.
  - Refactored `useAuth.ts` hook to integrate with `POST /api/auth/login`.

### Frontend (Agent-1) Update - UI Enhancements
**Date:** 2026-05-13
**Status:** Completed (Menu Layout & Loaders)

- **Completed Tasks:**
  - Designed and implemented role-based menu logic (Admin vs Customer items) in `MainLayout`.
  - Added layout state to toggle between vertical (Sidebar) and horizontal (Top Navigation) menus.
  - Developed a reusable `Spinner` component.
  - Integrated `Spinner` into the login button to handle network latency feedback visually.

### Backend (Agent-2) Update - Users API
**Date:** 2026-05-13
**Status:** Completed (Get Users Endpoint)

- **Completed Tasks:**
  - Added `IsActive` column to the `User` entity (default: true).
  - Generated and applied EF Core migration `AddUserIsActive`.
  - Implemented generic pagination with `PagedResult<T>`.
  - Added `GET /api/users` endpoint with filtering, sorting, and pagination support.
- **Contract:**
  - `GET /api/users`
    - **Query Parameters:**
      - `email` (string, optional)
      - `isActive` (boolean, optional)
      - `pageNumber` (int, default: 1)
      - `pageSize` (int, default: 10)
      - `sortBy` (string, optional) - e.g., "email", "firstName", "lastName", "isActive"
      - `sortDirection` (string, optional) - "asc" or "desc"
    - **Response (200 OK):**
      ```json
      {
        "items": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "email": "admin@example.com",
            "firstName": "System",
            "lastName": "Admin",
            "isActive": true
          }
        ],
        "totalCount": 1,
        "pageNumber": 1,
        "pageSize": 10,
        "totalPages": 1
      }
      ```

### Backend (Agent-2) Update - User CRUD APIs
**Date:** 2026-05-13
**Status:** Completed (Create, Update, Delete, ChangePassword)

- **Summary:** Implemented 4 new User management endpoints. All passwords are now hashed using `PasswordHasher<User>`. The Login handler was updated to verify hashed passwords. The seed admin user now uses a hashed password.
- **Contract:**
  - `POST /api/users` — Create User
    - **Request:** `{ "email": "...", "password": "...", "firstName": "...", "lastName": "...", "isActive": true }`
    - **Response (201 Created):** `UserDTO { id, email, firstName, lastName, isActive }`
  - `PUT /api/users/{id}` — Update User (no password change)
    - **Request:** `{ "email": "...", "firstName": "...", "lastName": "...", "isActive": true }`
    - **Response (200 OK):** `UserDTO { id, email, firstName, lastName, isActive }`
  - `DELETE /api/users/{id}` — Delete User
    - **Response:** `204 NoContent`
  - `PUT /api/users/{id}/change-password` — Change Password
    - **Request:** `{ "email": "...", "password": "..." }`
    - **Response:** `204 NoContent`

### Backend (Agent-2) Update - JWT Bearer Token & Serilog
**Date:** 2026-05-14
**Status:** Completed

- **Summary:**
  1. **JWT Bearer Token (hybrid):** Access token is now returned in JSON body. Frontend must store it and send via `Authorization: Bearer <token>` header. Refresh token stays in HttpOnly cookie.
  2. **Serilog:** Configured file-only logging in `appsettings.json`. All Microsoft/System logs suppressed to Warning. Custom app logs at Information level. Logs written to `Logs/log-YYYYMMDD.txt` with 30-day retention.
- **Breaking Contract Change (Auth):**
  - `POST /api/auth/login`
    - **Response (200 OK):**
      ```json
      {
        "accessToken": "eyJ...",
        "user": { "id", "email", "firstName", "lastName", "role" }
      }
      ```
      *Note: `refreshToken` is still set via `Set-Cookie` header (HttpOnly).*
  - `POST /api/auth/refresh`
    - **Request:** No body. `refreshToken` sent via cookie automatically.
    - **Response (200 OK):** Same shape as login. New `refreshToken` cookie is set.
  - **Action Required from Agent-1:** Store `accessToken` from response body. Send it in `Authorization: Bearer <token>` header on all API calls. Remove `withCredentials` if it was only for the access token cookie (keep it for refresh token cookie).