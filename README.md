# Strapi Multi-Tenant CMS

A production-ready multi-tenancy implementation for Strapi v5, enabling secure management of multiple websites or clients from a single backend. Features complete data isolation, JWT-based tenant identification, and automated webhook triggers for JAMstack deployments.

---

## 1. Project Overview

### The Problem

Agencies and SaaS platforms managing multiple clients face:
- Need to run separate Strapi instances per client (expensive, hard to maintain)
- Risk of data leakage between tenants without proper isolation
- Manual deployment processes when content changes
- Complex permission systems for multi-client access
- Difficulty scaling infrastructure as client base grows

### The Solution

This implementation adds robust multi-tenancy to Strapi v5 with tenant-scoped data access, automatic webhook triggers for CI/CD, and secure JWT-based tenant identification. Run one Strapi instance, serve unlimited clients with complete data isolation.

### Why It Matters

- **Cost efficiency**: Single Strapi instance serves all clients
- **Data security**: Complete tenant isolation via middleware and policies
- **Automated deployments**: Webhook triggers for Netlify/Vercel on content updates
- **Simplified operations**: One codebase, one database, many tenants
- **Scalability**: Add clients without infrastructure changes

---

## 2. Real-World Use Cases

| Scenario | Application |
|----------|-------------|
| **Digital Agencies** | Manage websites for multiple clients from one CMS |
| **Franchise Networks** | Each location has isolated content but shared templates |
| **SaaS Platforms** | Customer-specific content management |
| **Enterprise Departments** | Separate content spaces per business unit |
| **White-Label Products** | Resellable CMS with client isolation |
| **Media Networks** | Multiple publications sharing infrastructure |

---

## 3. Core Features

| Feature | Business Value |
|---------|----------------|
| **Complete Data Isolation** | Tenant-scoped queries prevent cross-tenant data access |
| **JWT Tenant Identification** | Lightweight, secure tenant detection from tokens |
| **Webhook Automation** | Auto-trigger builds on content changes per tenant |
| **Custom Policies** | Enforce tenant access at the policy layer |
| **Lifecycle Hooks** | React to create/update/delete/publish events |
| **Tenant-Aware Controllers** | All API responses automatically filtered |

---

## 4. High-Level Architecture

```
┌─────────────────┐     ┌─────────────────────────────────────────┐
│   Client Apps   │     │           Strapi v5 Backend             │
│   (Frontends)   │────▶│                                         │
└─────────────────┘     │  ┌─────────────────────────────────┐    │
                        │  │         Middleware               │    │
                        │  │   • Extract tenant_id from JWT   │    │
                        │  │   • Attach to request context    │    │
                        │  └─────────────────────────────────┘    │
                        │                   │                      │
                        │  ┌─────────────────────────────────┐    │
                        │  │          Policy Layer           │    │
                        │  │   • Verify tenant permissions   │    │
                        │  │   • Block cross-tenant access   │    │
                        │  └─────────────────────────────────┘    │
                        │                   │                      │
                        │  ┌─────────────────────────────────┐    │
                        │  │         Controllers             │    │
                        │  │   • Auto-filter by tenant_id    │    │
                        │  │   • Inject tenant on create     │    │
                        │  └─────────────────────────────────┘    │
                        │                   │                      │
                        │  ┌─────────────────────────────────┐    │
                        │  │       Lifecycle Hooks           │    │
                        │  │   • Trigger tenant webhooks     │    │
                        │  │   • Audit logging               │    │
                        │  └─────────────────────────────────┘    │
                        └─────────────────────────────────────────┘
                                            │
                        ┌───────────────────┼───────────────────┐
                        │                   │                   │
                 ┌──────▼──────┐    ┌───────▼───────┐   ┌───────▼───────┐
                 │  Database   │    │ Netlify Hook  │   │ Vercel Hook   │
                 │ (PostgreSQL)│    │  (Tenant A)   │   │  (Tenant B)   │
                 └─────────────┘    └───────────────┘   └───────────────┘
```

---

## 5. Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **CMS** | Strapi v5 | Headless content management |
| **Database** | SQLite (dev) / PostgreSQL (prod) | Data persistence |
| **Authentication** | JWT | Tenant identification |
| **Language** | JavaScript/TypeScript | Backend logic |
| **Webhooks** | Native HTTP | CI/CD triggers |

---

## 6. How the System Works

### Tenant Identification Flow

```
Client Request → JWT Extraction → Middleware → Context Attachment → Scoped Query
```

1. **Request**: Client sends request with JWT in Authorization header
2. **Extract**: Middleware extracts `tenant_id` from JWT payload
3. **Attach**: Tenant ID attached to request context (`ctx.state.tenant`)
4. **Filter**: All queries automatically scoped to tenant

### Content Lifecycle

```
Content Change → Lifecycle Hook → Webhook Trigger → Frontend Rebuild
```

1. **Create/Update/Delete**: Content modification detected
2. **Hook Fires**: Lifecycle hook captures event with tenant context
3. **Webhook**: Appropriate tenant webhook URL called
4. **Build**: JAMstack frontend rebuilds with new content

### JWT Token Structure

```javascript
{
  "id": 1,
  "tenant_id": "tenant-a",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## 7. Setup & Run

### Prerequisites

- Node.js 18+
- npm or yarn
- SQLite (dev) or PostgreSQL (prod)

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/strapi-multi-tenant-sample.git
cd strapi-multi-tenant-sample

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env with your configuration:
# DATABASE_CLIENT=sqlite
# JWT_SECRET=your-jwt-secret
# TENANT_A_WEBHOOK_URL=https://api.netlify.com/build_hooks/xxx
# TENANT_B_WEBHOOK_URL=https://api.netlify.com/build_hooks/yyy

# Build and start
npm run build && npm run develop
```

### Environment Variables

```env
# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Security
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret

# Webhooks (per tenant)
TENANT_A_WEBHOOK_URL=https://api.netlify.com/build_hooks/your-hook
TENANT_B_WEBHOOK_URL=https://api.netlify.com/build_hooks/your-hook

# Server
HOST=0.0.0.0
PORT=1337
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Admin Panel** | http://localhost:1337/admin | Strapi admin |
| **API** | http://localhost:1337/api | REST endpoints |

---

## 8. API Reference

### Content Types

Both content types include `tenant_id` for isolation:

**Articles**
- `title`, `content`, `slug`
- `tenant_id`, `author`, `published_at`

**Pages**
- `title`, `slug`
- `tenant_id`, `seo_title`, `seo_description`, `template`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/articles` | List articles (tenant-scoped) |
| `POST` | `/api/articles` | Create article |
| `GET` | `/api/pages` | List pages (tenant-scoped) |
| `POST` | `/api/pages` | Create page |
| `POST` | `/api/webhooks/trigger-build` | Manual webhook trigger |
| `GET` | `/api/webhooks/config` | Get tenant webhook config |

### Usage Examples

**Create Article for Tenant A:**

```bash
curl -X POST http://localhost:1337/api/articles \
  -H "Authorization: Bearer [JWT-tenant-a]" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "AI Trends 2024",
      "content": "Exploring the latest...",
      "slug": "ai-trends-2024"
    }
  }'
```

**Get Articles for Tenant B:**

```bash
curl -H "Authorization: Bearer [JWT-tenant-b]" \
  http://localhost:1337/api/articles
```

**Manually Trigger Webhook:**

```bash
curl -X POST http://localhost:1337/api/webhooks/trigger-build \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "tenant-a",
    "content_type": "api::article.article",
    "action": "update"
  }'
```

---

## 9. Scalability & Production Readiness

### Current Architecture Strengths

| Aspect | Implementation |
|--------|----------------|
| **Isolation** | Middleware + policies ensure complete tenant separation |
| **Automation** | Lifecycle hooks trigger deployments automatically |
| **Security** | JWT-based identification with policy enforcement |
| **Flexibility** | Easy to add new tenants via environment config |

### Production Enhancements (Recommended)

| Enhancement | Purpose |
|-------------|---------|
| **PostgreSQL** | Replace SQLite for production workloads |
| **Rate Limiting** | Protect against webhook abuse |
| **Monitoring** | Track webhook success/failure rates |
| **Audit Logging** | Record all tenant operations |
| **Tenant Admin UI** | Self-service tenant management |

### Production Environment

```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=your-prod-db-url
JWT_SECRET=your-prod-secret
```

### Security Best Practices

- Use HTTPS and restrict CORS
- Use strong, unique JWT secrets
- Secure database connections
- Enable rate limiting
- Regular security audits

---

## 10. Adding New Tenants

### Step 1: Add Webhook URL

```env
TENANT_C_WEBHOOK_URL=https://api.netlify.com/build_hooks/new-hook
```

### Step 2: Generate Tenant JWT

```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { id: userId, tenant_id: 'tenant-c' },
  process.env.JWT_SECRET
);
```

### Step 3: Configure Frontend

Point new frontend to Strapi with tenant-specific JWT.

---

## Project Structure

```
strapi-multi-tenant-sample/
├── config/
│   └── middlewares.js    # CORS and tenant middleware
├── src/
│   ├── api/
│   │   ├── article/      # Article content type
│   │   └── page/         # Page content type
│   ├── middlewares/
│   │   └── tenant.js     # Tenant extraction middleware
│   └── policies/
│       └── tenant-check.js # Tenant verification policy
├── database/
│   └── migrations/       # Database migrations
└── .env                  # Environment configuration
```

---

## Scripts

```bash
npm run develop        # Run in development mode
npm run build          # Build admin panel
npm run start          # Run in production mode
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write code and tests
4. Submit a pull request

---

## License

MIT License

---

*Secure multi-tenancy for Strapi. One instance, unlimited clients.*
