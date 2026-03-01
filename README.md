# Hawes
is a digital travel platform that connects travelers, campers, and adventure seekers with destinations and tourism services across Algeria. It allows users to discover popular and hidden spots, cultural sites, and events while booking transportation, accommodation, restaurants, and local guides in one place. The platform also enables travel organizers to publish trips and allows users to connect with others visiting the same destination, creating a more social, convenient, and enriching travel experience

Although Algeria offers diverse and beautiful tourist destinations, travelers often struggle with fragmented information, difficulty finding transportation and accommodation, and limited access to reliable local guides. Many underrated locations remain unknown, and planning a trip can be complex and overwhelming, especially for those unfamiliar with the area. Additionally, travel organizers lack a centralized platform to manage and promote their trips, reducing opportunities for shared and organized travel experiences.


#### 1. Centralize Travel Services
Provide one platform to discover destinations and book accommodation, transport, restaurants, and guides.

#### 2. Promote Local Tourism
Highlight underrated spots across Algeria and support local communities and businesses.

#### 3. Enable Social Travel
Connect travelers heading to the same destination to enhance shared experiences.

#### 4. Support Trip Organizers
Allow agencies, groups, and individuals to publish and manage organized trips.

#### 5. Simplify Trip Planning
Make travel planning easier, faster, and more accessible for everyone.


---

# Hawes – Git & Commit Conventions

This document defines the commit message and branching conventions used in the Hawes project.

---

## 📌 Commit Message Format

We follow **Conventional Commits**:

```

type(scope): short description

```

### Example:
```

feat(auth): integrate supabase login
fix(booking): correct price calculation
chore(devops): add dockerfile for backend

```

---

## 🏷 Commit Types

- **feat** → New feature
- **fix** → Bug fix
- **style** → UI/style changes only
- **refactor** → Code improvement (no behavior change)
- **test** → Add/update tests
- **chore** → Config, setup, dependencies
- **docs** → Documentation updates

---

## 📂 Scopes (Hawes Modules)

Use these scopes when relevant:

- auth
- destinations
- trips
- services
- booking
- payment
- profile
- social
- frontend
- backend
- database
- devops
- ui-ux
- landing
- realtime

Example:
```

feat(trips): add trip creation endpoint

```

---

## 🎫 Jira Integration

When possible, include the Jira issue ID:

```

feat(auth): HAW-12 integrate supabase login

```

---

## 📏 Commit Rules

- Use English
- Use lowercase for type
- Keep description under 70 characters
- Avoid vague messages like:
  - "update"
  - "changes"
  - "final version"

---

## 🌿 Branch Naming Convention

Format:
```

type/short-description

```

Examples:
```

feature/auth-login
fix/booking-price-bug
chore/docker-setup

```

---

## 🚀 Workflow

1. Create a branch from `main`
2. Work on your feature
3. Commit using conventional format
4. Open a Pull Request into `main`
5. After review, merge into `main` for release

---

Keeping commits clean ensures:
- Better collaboration
- Easier debugging
- Clear project history
- Professional development workflow

---

If you want, I can also prepare a short **project README structure** (with tech stack, setup instructions, architecture overview) for Hawes.
