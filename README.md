# LendSwift – Multi‑Step Loan Application Form

A production‑grade, 8‑step loan application form built for a fictional Indian digital lending startup.  
Features real‑time validation, conditional fields, document upload with compression, e‑signature capture, auto‑save/resume, and a pre‑approval summary.

[![Cypress Tests](https://img.shields.io/badge/tests-27%20passing-brightgreen)](https://github.com/Zewotr/MULTI-STEP-LOAN-APPLICATION-FORM.git)
[![Accessibility](https://img.shields.io/badge/a11y-92%20(Lighthouse)-green)]()

## 🚀 Live Demo 
 https://lendswift.netlify.app/
 
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

```
## some screen shots
<img width="1308" height="697" alt="image" src="https://github.com/user-attachments/assets/a781c01a-222c-400d-8bf8-fa4f2298d6d9" />
<img width="1294" height="692" alt="Screenshot from 2026-06-13 20-50-40" src="https://github.com/user-attachments/assets/98530760-3437-4233-8897-e48e431ff8aa" />
<img width="1016" height="691" alt="Screenshot from 2026-06-13 20-51-15" src="https://github.com/user-attachments/assets/d3ea8c91-7fad-4fc0-9d30-022cae3b06c4" />
<img width="1016" height="691" alt="Screenshot from 2026-06-13 20-51-29" src="https://github.com/user-attachments/assets/4e541c61-763d-47b4-8161-abf47ee32d62" />
<img width="1016" height="691" alt="Screenshot from 2026-06-13 20-51-53" src="https://github.com/user-attachments/assets/dcb04f55-8398-4ac8-b9e4-5975251a2afb" />

<img width="1016" height="691" alt="Screenshot from 2026-06-13 20-51-53" src="https://github.com/user-attachments/assets/2bad5df0-ad14-4ce6-b311-8e1c17affd0b" />
<img width="1016" height="691" alt="Screenshot from 2026-06-13 20-52-01" src="https://github.com/user-attachments/assets/2664cd74-b9d0-4d50-8dc1-6c1c2e8a3080" />
<img width="999" height="696" alt="Screenshot from 2026-06-13 20-52-20" src="https://github.com/user-attachments/assets/6713e78a-72b3-4610-a0ce-c70e5fd2f617" />

<img width="999" height="696" alt="Screenshot from 2026-06-13 21-12-18" src="https://github.com/user-attachments/assets/0519ed95-3b9a-4ed5-9c47-fc0bc4417211" />
<img width="999" height="696" alt="Screenshot from 2026-06-13 21-12-07" src="https://github.com/user-attachments/assets/ec214886-02e6-4d82-a7b1-f3c5eed81ba6" />
<img width="1013" height="697" alt="Screenshot from 2026-06-13 21-13-42" src="https://github.com/user-attachments/assets/383742a9-b1a6-47f4-b41c-ad64a5b29fbf" />
<img width="919" height="698" alt="Screenshot from 2026-06-13 21-14-27" src="https://github.com/user-attachments/assets/c12bef88-b425-41c2-bc8d-61293954eae0" />
<img width="919" height="698" alt="Screenshot from 2026-06-13 21-14-38" src="https://github.com/user-attachments/assets/77b2ad27-b3cb-494a-a8de-dd298bba3fbf" />
<img width="1308" height="697" alt="image" src="https://github.com/user-attachments/assets/aeb2fd99-fe75-48f3-9521-f995494b4f81" />
