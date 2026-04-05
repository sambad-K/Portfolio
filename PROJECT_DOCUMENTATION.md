# Sambad Portfolio Documentation

## Overview
This project is a modern personal portfolio built with Next.js and Tailwind CSS. It presents Sambad Khatiwada as an AI/ML and backend development enthusiast who enjoys building practical projects that solve real-world problems.

The site is split into two views:

- The main public page shows the portfolio content in a polished, futuristic layout.
- The hidden owner page at `/owner` lets you edit the same content directly from the browser.

## Main Features

### 1. Hero Section
The hero section introduces the portfolio owner with a short identity statement, a profile image, a quick summary, and the main call-to-action buttons.

### 2. Projects Section
The projects area displays cards for selected work. Each card opens a detailed popup containing:

- Project title
- Basic intro
- Problem statement
- Requirement analysis
- Functional requirements
- Non-functional requirements
- System architecture image
- Result and analysis images
- Snapshots
- GitHub link

### 3. Contact Section
The contact section gives quick access to email, GitHub, and LinkedIn in a clean, user-friendly layout.

### 4. Owner Editing Mode
The `/owner` route is an editing view built for fast content management. It supports inline editing for:

- Hero content
- Contact links
- Footer text
- Existing projects
- Adding new projects
- Editing and deleting project images
- Editing and deleting project sections

### 5. Persistent Updates
Edits are saved in browser storage and also mirrored to a cookie-based server snapshot. That means:

- Changes stay after a refresh.
- The main page shows the updated data.
- The owner page and main page stay in sync.

## Content Flow

### Main Page
The public portfolio page reads the latest saved portfolio content and renders it immediately.

### Owner Page
The owner page uses the same data model and updates the same shared content source. Any changes made here are reflected back on the main page.

## User Experience Priorities

- Smooth scrolling for section navigation
- Lightweight transitions for buttons and cards
- No heavy blinking effects
- Minimal lag during interaction
- Accessible modal behavior for project details and editing

## Data Storage
The project uses two layers of persistence:

- Local storage for quick browser-side saving
- Cookie-backed SSR data so the main page renders the same content after reloads and route changes

## Files of Interest

- `pages/index.tsx` - public portfolio page
- `pages/owner.tsx` - hidden owner editing page
- `context/PortfolioContext.tsx` - shared portfolio state
- `lib/portfolioPersistence.ts` - cookie and server data helpers
- `components/Projects.tsx` - project list, project detail popup, and project editing flows
- `components/Hero.tsx` - hero section and inline editing
- `components/Contact.tsx` - contact cards and editing controls
- `components/Footer.tsx` - footer text and editing controls

## How To Use The Owner Page

1. Open `/owner` in the browser.
2. Edit hero, contact, footer, or project information.
3. Add a new project by starting with a title and continuing into the structured editor.
4. Save changes.
5. Go back to `/` and the updated content will already be there.

## Notes
The project is designed to stay smooth and responsive, so the editing UI uses simple overlays and avoids overly expensive effects.
