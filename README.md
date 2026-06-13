# LendSwift – Multi‑Step Loan Application Form

A production‑grade, 8‑step loan application form built for a fictional Indian digital lending startup.  
Features real‑time validation, conditional fields, document upload with compression, e‑signature capture, auto‑save/resume, and a pre‑approval summary.

[![Cypress Tests](https://img.shields.io/badge/tests-27%20passing-brightgreen)](https://github.com/Zewotr/MULTI-STEP-LOAN-APPLICATION-FORM.git)
[![Accessibility](https://img.shields.io/badge/a11y-92%20(Lighthouse)-green)]()

## 🚀 Live Demo (if deployed)
[Insert your Vercel/Netlify URL here]

## 📋 Table of Contents
- [Project Description](#project-description)
- [Architecture Decisions](#architecture-decisions)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Running Tests](#running-tests)
- [Screenshots](#screenshots)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## 📖 Project Description

LendSwift is a fictional RBI‑registered NBFC serving tier‑2/3 Indian cities. Their original monolithic form had a 55% completion rate due to complexity, poor validation, and no auto‑save.

**This rebuild achieves:**
- ✅ 85%+ completion rate (target)
- ✅ Auto‑save every 30 seconds with encrypted localStorage
- ✅ 15+ E2E user journeys (27 actual tests)
- ✅ WCAG 2.1 AA accessibility (Lighthouse 92)
- ✅ Responsive on all devices (320px – 1920px)

**Form Steps:**
1. Loan Type & Basic Info  
2. Personal Information  
3. KYC (PAN/Aadhaar with verification simulation)  
4. Address (PIN code auto‑fill)  
5. Employment & Income (dynamic sub‑forms)  
6. Co‑Applicant (conditional)  
7. Document Upload & E‑Signature  
8. Review & Pre‑Approval Summary

---

## 🏗️ Architecture Decisions

### Why Wizard Pattern (Step Registry)
- **Scalability** – Each step is an independent component with its own schema and visibility logic.
- **Conditional steps** – Step 6 (co‑applicant) appears only when loan amount exceeds thresholds.
- **Separation of concerns** – The `Wizard` component handles navigation, progress, and state; steps only worry about their own UI.

### Why React Hook Form (RHF) over Formik
- **Performance** – RHF uses uncontrolled components internally via `ref`, drastically reducing re‑renders on keystrokes (critical for 50+ fields).
- **Integration with Zod** – `@hookform/resolvers` works out of the box.
- **Lightweight** – No dependency on external state managers like Redux.

### Why Zod over Yup
- **TypeScript‑first** – Zod infers TypeScript types directly from schemas, eliminating duplication.
- **Composable refinements** – `.refine()` and `.superRefine()` make cross‑field validation (e.g., EMI ≤ 50% income) clean.
- **Better error messages** – Zod provides detailed, customisable error paths.

### Why Tailwind CSS
- **Utility‑first** – No custom CSS files; rapid responsive styling.
- **Accessibility utilities** – `focus:ring`, `focus:visible`, dark mode support.
- **Small bundle** – PurgeCSS removes unused styles.

---

## 💻 Tech Stack

| Area | Technology |
|------|------------|
| Framework | React 18 + Vite |
| Form State | React Hook Form 7 |
| Validation | Zod + `@hookform/resolvers` |
| Styling | Tailwind CSS |
| File Upload | React Dropzone + Canvas compression |
| E‑Signature | react‑signature‑canvas |
| Persistence | Web Crypto API (AES‑256) |
| E2E Tests | Cypress + cypress‑axe |

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
git clone https://github.com/Zewotr/MULTI-STEP-LOAN-APPLICATION-FORM.git
cd loan-application
npm install


## some screen shots

