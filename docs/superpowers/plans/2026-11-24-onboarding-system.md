# JobHub 2-Stage Onboarding System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cohesive, industry-standard 2-stage onboarding system for JobHub: a pre-auth 3-slide visual walkthrough with Storyset illustrations and a post-register 3-step profile calibration wizard.

**Architecture:** 
- Stage 1 route `/onboarding`: 3-slide carousel with Storyset SVG illustrations, dynamic lime indicator pills, "Skip" and "Get started" actions.
- Stage 2 route `/setup-profile`: 3-step one-tap chip wizard (Target Role, Tech Stack, Work Mode) calibrating the candidate profile upon registration.
- State persistence in `src/modules/onboarding/onboarding.store.ts` driving dynamic candidate role and radar data on the Explore dashboard.

**Tech Stack:** React Native, Expo Router v4, React Native Reanimated 4, React Native SVG, Expo Haptics, Zustand

**Spec:** [onboarding-system-design-plan.md](file:///C:/Users/MyBook%20Hype%20AMD/.gemini/antigravity-cli/brain/0fcc5ec7-1f75-4a4d-90f9-e725cde631fe/onboarding-system-design-plan.md)

## Global Constraints

- **Visual Art Style:** Authentic unDraw / Storyset flat 2D vector style. Pure white skin (`#FFFFFF`), solid dark outline (`#121212`), obsidian hair/pants (`#1E293B`), Electric Lime accents (`#B8F23E`).
- **Typography & Color:** Deep Obsidian `#121212`, JobHub Electric Lime `#B8F23E`, Pure White `#FFFFFF`, Slate text `#64748B`.
- **Anti-Slop:** Zero unnecessary text, no generic AI borders, buttons must be solid borderless lime (`borderWidth: 0`), one-tap chips instead of tedious forms.
- **Accessibility:** Minimum 44px tap targets, accessible roles for buttons and tabs, haptic feedback on touch.
- **Type Safety:** `bunx tsc --noEmit` must pass with 0 errors after every milestone.

## Review Focus

1. **First-launch routing:** Initial app launch lands on `/onboarding` if walkthrough is not yet completed; returning users bypass directly to `/login` or `/`.
2. **Skip capability:** Users can skip at any slide or step without getting trapped.
3. **Registration handoff:** Registering successfully navigates to `/setup-profile` rather than prematurely loading default dashboard data.
4. **Data reflection:** Roles and skills selected in `/setup-profile` immediately reflect in the Explore Dashboard header and Daily Match summary.
5. **Responsive layout:** Mobile displays edge-to-edge cards with bottom action pills; desktop centers the card with elegant max-width boundaries.

---

### Task 1: Onboarding State Store

**Files:**
- Create: `src/modules/onboarding/onboarding.store.ts`
- Create: `src/modules/onboarding/index.ts`

- [ ] **Step 1: Write the Onboarding Store interface and Zustand store**
  - State: `hasCompletedWalkthrough: boolean`, `hasCompletedProfileSetup: boolean`, `candidateProfile: { role: string, seniority: string, techStack: string[], workMode: 'remote' | 'hybrid' | 'onsite' }`.
  - Actions: `completeWalkthrough()`, `saveProfile(partial)`, `resetOnboarding()`.
- [ ] **Step 2: Export from barrel file `src/modules/onboarding/index.ts`**
- [ ] **Step 3: Verify TypeScript compilation**
  - Run: `Set-Location "D:\Jobhub\jobhub-fe"; bunx tsc --noEmit`

---

### Task 2: Flat Vector Storyset SVG Illustrations

**Files:**
- Create: `src/components/atoms/onboarding-jobs-illustration.tsx`
- Create: `src/components/atoms/onboarding-hunter-illustration.tsx`
- Create: `src/components/atoms/onboarding-cv-illustration.tsx`

- [ ] **Step 1: Create `OnboardingJobsIllustration` (Slide 1: Curated Tech Opportunities)**
  - Developer relaxing with laptop, floating curated job card, filter funnel icon, JobHub lime accents.
- [ ] **Step 2: Create `OnboardingHunterIllustration` (Slide 2: Autonomous AI Hunter)**
  - Developer accompanied by an intelligent scanning radar element, tracking application stages.
- [ ] **Step 3: Create `OnboardingCvIllustration` (Slide 3: ATS-Ready CV Studio)**
  - Developer holding a tailored resume document with green checkmark and PDF export badge.
- [ ] **Step 4: Verify TypeScript compilation**
  - Run: `Set-Location "D:\Jobhub\jobhub-fe"; bunx tsc --noEmit`

---

### Task 3: Pre-Auth Walkthrough Screen (`/onboarding`)

**Files:**
- Create: `src/app/onboarding.tsx`
- Modify: `src/app/_layout.tsx` (register route)

- [ ] **Step 1: Implement 3-slide carousel in `src/app/onboarding.tsx`**
  - Top Header: Brand mark `jobhub •` + "Skip" button.
  - Slide Content: Illustration + Bold title + Subtitle.
  - Bottom Controls: Pill indicators (expanding Lime dot) + "Continue" / "Get started" button + "Sign in" link.
- [ ] **Step 2: Handle button actions**
  - "Skip": calls `completeWalkthrough()` and navigates to `/login`.
  - "Get started": calls `completeWalkthrough()` and navigates to `/register`.
  - "Sign in": calls `completeWalkthrough()` and navigates to `/login`.
- [ ] **Step 3: Verify TypeScript compilation**
  - Run: `Set-Location "D:\Jobhub\jobhub-fe"; bunx tsc --noEmit`

---

### Task 4: Post-Register Profile Calibration Wizard (`/setup-profile`)

**Files:**
- Create: `src/app/setup-profile.tsx`
- Modify: `src/app/register.tsx` (redirect on submit)

- [ ] **Step 1: Implement 3-step interactive chip wizard in `src/app/setup-profile.tsx`**
  - Progress bar at the top (Step 1/3, Step 2/3, Step 3/3).
  - Step 1: Target Role & Seniority (Role chips + Seniority level chips).
  - Step 2: Core Tech Stack (Chips for React Native, TypeScript, Node.js, Go, Python, etc.).
  - Step 3: Work Mode (Full Remote, Hybrid, On-site).
  - Primary button: "Continue" -> "Finish & enter JobHub" (solid lime `#B8F23E`).
- [ ] **Step 2: Save selections to `useOnboardingStore` on completion and navigate to `/`**
- [ ] **Step 3: Update `src/app/register.tsx`**
  - On submit success: navigate to `/setup-profile` instead of `/`.
- [ ] **Step 4: Verify TypeScript compilation**
  - Run: `Set-Location "D:\Jobhub\jobhub-fe"; bunx tsc --noEmit`

---

### Task 5: Dynamic Reflection in Explore Dashboard & Layout Gatekeeper

**Files:**
- Modify: `src/app/index.tsx` (Explore Header)
- Modify: `src/app/_layout.tsx` (Route checks)

- [ ] **Step 1: Connect `candidateProfile` to `src/app/index.tsx`**
  - Read `role` and `seniority` from `useOnboardingStore`.
  - Fall back to "Michel Clark" / "Senior Mobile Engineer" if not yet set.
- [ ] **Step 2: Add initial walkthrough check in `src/app/_layout.tsx`**
- [ ] **Step 3: Verify TypeScript compilation**
  - Run: `Set-Location "D:\Jobhub\jobhub-fe"; bunx tsc --noEmit`

---

### Task 6: Visual Verification & End-to-End Testing

**Files:**
- Verify in browser via Playwright MCP tools

- [ ] **Step 1: Playwright visual verification of `/onboarding` (Mobile & Desktop)**
  - Capture Slide 1, Slide 2, Slide 3.
- [ ] **Step 2: Playwright visual verification of `/setup-profile` (Mobile & Desktop)**
  - Capture Step 1, Step 2, Step 3.
- [ ] **Step 3: Playwright test of end-to-end user flow**
  - Onboarding -> Register -> Setup Profile -> Explore Dashboard.
- [ ] **Step 4: Final commit and push to remote repository**
