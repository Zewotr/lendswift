# ARCHITECTURE.md

## Wizard Pattern

- Central `Wizard` component maintains a **step registry** (array of step objects: `id`, `title`, `component`, `validate`, `isVisible`).
- Filters visible steps based on `formData` (e.g., Step 6 appears only for home loans or high amounts).
- Manages `currentStepIndex` and global `formData`.
- Provides `FormProvider` (React Hook Form) to all steps.
- Handles `next()`: validates current step using its dynamic schema, then increments index.
- Handles `prev()`: decrements index without validation.
- Exposes `onEditStep(stepId)` for the review step to jump back.

## Schema Factory

- `schemaFactory.js` exports `getStepSchema(stepId, formData)`.
- Returns a **Zod schema** tailored to the current step and current form state.
- Enables:
  - Dynamic field constraints (e.g., loan amount max depends on loan type).
  - Conditional field requirements (e.g., rent amount required when residence type is "rented").
  - Cross‑step refinements (e.g., business loan cannot have salaried employment).
- Resolver inside `Wizard` calls `getStepSchema` before each navigation and passes it to `zodResolver`.

## Auto‑Save Flow

- **Hook:** `useAutoSave(formData, currentStep, interval = 30000)`.
- **Save:** Serialises `{ formData, currentStep, loanType, timestamp, version }`, encrypts with Web Crypto API (AES‑256‑GCM), stores in `localStorage` under `lendswift_draft`.
- **Triggers:** Every `interval` ms, on `beforeunload` (tab close/refresh), and after step change.
- **Resume:** On `Wizard` mount, checks for saved draft. If <72 hours old, shows modal with **Resume** / **Start Fresh**.
- **Resume action:** `reset(savedData)` and set `currentStep` to saved index.
- **Start Fresh:** Remove draft and reset to Step 1.
- **Cleanup:** On final submission, remove `lendswift_draft`. Drafts >72 hours purged.

## Cross‑Step Dependency Management

Four layers:

1. **Validation layer (Zod refinements)** – inside `schemaFactory`, `.refine()` rules access `formData` from earlier steps.
2. **Visibility layer (Step Registry `isVisible`)** – determines whether a step is displayed (e.g., Step 6 based on loan type and amount).
3. **UI layer (Conditional rendering within a step)** – rent amount, employment sub‑forms, document uploads depend on current values.
4. **Data synchronisation** – `useEffect` watches `formData` for changes that invalidate later steps (e.g., switching loan type resets employment type).