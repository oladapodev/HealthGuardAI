# HealthGuard AI Frontend UI Specification

## 1. Design Intent

HealthGuard AI should feel clean, minimal, international, mobile-first, and medically trustworthy without feeling heavy or clinical. The interface should look carefully composed, with quiet spacing, soft borders, clear hierarchy, and smooth motion.

The UI must not surround users with long blocks of text. Every screen should be simple enough to understand at a glance. Use concise labels, numbers, status chips, icons, and short helper lines only where they are truly needed.

## 2. Design Language

### Visual Style

- Minimal, calm, modern, and premium.
- Mobile-first layout with desktop expanding naturally from the mobile structure.
- Clean white or off-white surfaces with subtle borders.
- No busy backgrounds, heavy gradients, large marketing sections, or decorative blobs.
- Avoid text-heavy cards. Prefer compact data, icons, status tags, and clear actions.
- Use generous whitespace, but keep screens efficient and practical.

### Shape And Surface

- Use soft 8px radius for cards, panels, inputs, and buttons.
- Use 1px borders around primary surfaces instead of heavy shadows.
- Shadows should be rare and very soft.
- Cards must feel like functional containers, not decoration.
- Do not place cards inside other cards.
- Keep the app shell clean with visible page edges and consistent padding.

### Color

- Background: off-white or near-white.
- Surface: white.
- Text: deep navy, charcoal, or near-black.
- Primary: deep teal or clean medical blue-green.
- Success: green.
- Warning: amber.
- Urgent: red, used only for high-risk alerts.
- Borders: light neutral gray.

Color must support status, not dominate the screen.

### Typography

- Use a highly readable sans-serif.
- Keep headings short.
- Use small, clear section titles.
- Avoid paragraph-heavy explanations.
- Patient-facing copy should be plain and brief.
- Clinician-facing copy can be denser but still structured and scannable.

### Motion

- Use smooth, subtle animation for page transitions, card entry, tab changes, drawer opening, and button feedback.
- Prefer 150-250ms duration.
- Motion should feel soft and intentional, never flashy.
- Respect reduced-motion settings.

## 3. Global UI Rules

### Minimal Text Rule

Every screen should use the least text needed to guide action.

Use:

- Short labels.
- Status chips.
- Icons.
- One-line helper text.
- Progressive disclosure for details.

Avoid:

- Long educational paragraphs in the main UI.
- Repeating disclaimers in large blocks.
- Explaining obvious controls.
- Technical AI process language.

### Loading Rule

Loading states must be visual, not text-heavy.

Use:

- Centered spinner.
- Skeleton cards for content areas.
- Optional one-word label only when needed, such as "Analyzing".

Do not use:

- Multi-step loading checklists.
- Long loading explanations.
- Agent names or technical processing steps.

### Safety Rule

The app must never sound like it is diagnosing the user.

Use compact safety language:

- "Educational only."
- "For clinician review."
- "Seek urgent care if symptoms are severe."

Avoid:

- "You have..."
- "This confirms..."
- "You are safe."
- "Ignore this."

### Mobile-First Rule

Design the mobile screen first. Desktop should add width and columns, not new complexity.

Mobile:

- Single-column layout.
- Sticky bottom or top primary action when useful.
- Large tap targets.
- Compact page headers.
- Bottom navigation for primary sections.

Desktop:

- Max-width content shell.
- Two-column dashboard where helpful.
- Side navigation is allowed only if it improves scanning.

## 4. App Navigation

Primary navigation:

1. Dashboard
2. Upload
3. Check-in
4. Reports
5. Chat
6. Settings

Primary flow:

1. Welcome
2. Sign in / create account
3. Profile setup
4. Optional health context
5. Dashboard
6. Lab upload or manual entry
7. Spinner / skeleton loading
8. Patient result
9. Doctor note
10. PDF export

The dashboard is the home base. All flows should return there cleanly.

## 5. Screen Specifications

### 1. Welcome

**Goal:** Establish trust and start the user quickly.

**UI:**

- Product name.
- One short value line.
- Primary button: "Get started".
- Secondary button: "Sign in".
- Small footer disclaimer.

**Feel:** quiet, premium, simple.

### 2. Sign In / Create Account

**Goal:** Secure access with minimal friction.

**UI:**

- Clean form.
- Email.
- Password.
- Password visibility icon.
- Compact error messages.
- No extra marketing text.

**Feel:** private and focused.

### 3. Profile Setup

**Goal:** Collect only the health context needed for personalization.

**UI:**

- Stepper with minimal labels.
- Age.
- Gender.
- Blood group.
- Height and weight.
- Conditions.
- Allergies.
- Medications.
- Skip option for optional fields.

**Feel:** respectful and fast.

### 4. Optional Health Context

**Goal:** Let users opt into sensitive context without pressure.

**UI:**

- Compact consent panel.
- Toggle or segmented choice.
- Menstrual context fields only after opt-in.
- Clear skip action.

**Feel:** private, calm, controlled.

### 5. Dashboard

**Goal:** Show current health context and next action.

**UI:**

- Compact greeting.
- Health summary card.
- Status chips for lab, check-in, environment, and alerts.
- Four icon-led quick actions:
  - Upload
  - Check-in
  - Note
  - Chat
- Recent report row list.
- Environment mini card.

**Feel:** clean, useful, not crowded.

### 6. Lab Upload

**Goal:** Upload a lab report quickly.

**UI:**

- Large bordered drop zone.
- Upload icon.
- File preview.
- Primary button: "Analyze".
- Secondary link: "Enter manually".
- One-line privacy note.

**Feel:** simple and confident.

### 7. Manual Lab Entry

**Goal:** Enter values without a file.

**UI:**

- Test date.
- Compact editable marker rows.
- Add marker button.
- Analyze button.
- Inline validation.

**Feel:** structured and forgiving.

### 8. Analysis Loading

**Goal:** Wait state while analysis runs.

**UI:**

- Centered spinner.
- Optional short label: "Analyzing".
- Skeleton result cards if staying on the result page shell.
- No checklist.
- No paragraphs.

**Feel:** calm and fast.

### 9. Patient Result

**Goal:** Make lab results understandable at a glance.

**UI:**

- Compact safety line.
- Summary status row.
- Green / amber / red status chips.
- Marker cards grouped by status.
- One-line insight per marker.
- Context chips for profile, check-in, and environment.
- Primary action: "Doctor note".
- Secondary actions: Chat, Export, Details.

**Feel:** clear, light, non-alarming.

### 10. Marker Detail

**Goal:** Explain one marker without overwhelming the user.

**UI:**

- Marker name.
- Status chip.
- Value and range.
- Small trend or range visual.
- Three compact sections:
  - Meaning
  - Context
  - Ask your doctor

**Feel:** focused and useful.

### 11. Doctor Note

**Goal:** Create a shareable clinical bridge.

**UI:**

- Tabs:
  - Patient
  - Clinician
- Patient tab uses short cards.
- Clinician tab uses structured clinical sections.
- Export button fixed near the top or bottom.
- Disclaimer kept compact.

**Feel:** professional, clean, printable.

### 12. PDF Export

**Goal:** Control what goes into the report.

**UI:**

- Simple preview.
- Toggle list:
  - Patient summary
  - Clinician summary
  - Lab values
  - Check-ins
  - Environment
  - Disclaimer
- Primary button: "Download".

**Feel:** controlled and polished.

### 13. Daily Check-In

**Goal:** Finish in under 20 seconds.

**UI:**

- Emoji mood row.
- Symptom chips.
- Sleep selector.
- Exercise selector.
- Short optional note.
- Save button.

**Feel:** quick and friendly.

### 14. Trends

**Goal:** Show patterns without visual noise.

**UI:**

- Date range selector.
- Clean line or bar charts.
- Key status chips.
- Marker trend cards.
- No dense chart legends.

**Feel:** calm and analytical.

### 15. Environment

**Goal:** Show local context that may affect health.

**UI:**

- Location row.
- AQI card.
- Weather card.
- Pollutant chips.
- Short relevance note.

**Feel:** grounded and compact.

### 16. Chat

**Goal:** Conversational help that routes into real workflows.

**UI:**

- Minimal chat thread.
- Message bubbles with clean spacing.
- Suggested action chips.
- Input fixed at bottom on mobile.
- Compact disclaimer.

**Feel:** helpful, safe, and uncluttered.

### 17. Urgent Alert

**Goal:** Make urgent guidance unmistakable.

**UI:**

- Red bordered alert block.
- Short heading.
- Immediate action line.
- Related result or symptom.
- Button to add to doctor note.

**Feel:** serious, direct, not dramatic.

### 18. Settings

**Goal:** Let users manage profile, privacy, and permissions.

**UI:**

- List-style grouped settings.
- Profile.
- Location.
- Sensitive health context.
- Export preferences.
- Account security.
- Delete data.

**Feel:** transparent and controlled.

## 6. Reusable Components

### Component Library Rule

- Use existing `src/components/ui` shadcn components first.
- Use existing `src/components/ai-elements` components for AI chat, reasoning, sources, artifacts, attachments, voice, and prompt input UI.
- Do not create a custom UI primitive when a matching shadcn or AI Elements component already exists.
- New reusable product components must live in `src/components`.
- Page-only composition can live near the page, but shared UI must be promoted into `src/components`.
- Keep shadcn primitives in `src/components/ui` and AI Elements in `src/components/ai-elements`.
- Wrap the app with required providers, including `TooltipProvider`, before using tooltip-based controls.

### Installed UI Foundation

The frontend must include the full shadcn and AI Elements component sets:

```bash
npx shadcn@latest add --all
npx ai-elements@latest add
```

These commands provide the base UI system for the app. Implementers should compose screens from these files before introducing new component code.

### App Shell

- Mobile bottom navigation.
- Desktop constrained page width.
- Clean top header.
- Consistent page padding.
- Smooth route transitions.

### Cards

- White surface.
- 1px border.
- 8px radius.
- Clear title row.
- Minimal content.
- Optional icon.

### Buttons

- Clear hierarchy: primary, secondary, ghost, destructive.
- Icons where useful.
- Pointer cursor enabled.
- Subtle press and hover animation.

### Inputs

- Large touch targets.
- Clear border.
- Minimal helper text.
- Inline errors.
- No clutter around fields.

### Status Chips

- Small, readable, icon-supported.
- Used for lab status, AQI, safety level, completion state, and report readiness.

### Spinner

- Used for global loading and analysis loading.
- Centered in the available space.
- No long loading copy.

### Skeletons

- Used for dashboard cards, result cards, and report previews.
- Match final layout dimensions to avoid layout shift.

## 7. Empty, Error, And Loading States

### Empty States

Keep empty states short:

- "No reports yet."
- "No check-ins yet."
- "No doctor note yet."

Each empty state gets one action button.

### Error States

Errors should be compact and recoverable:

- Short title.
- One-line reason.
- Retry or replace action.

### Loading States

Use spinner or skeleton only. Avoid loading paragraphs and multi-step text.

## 8. Acceptance Criteria

- UI is mobile-first and works cleanly on small screens.
- Main screens use minimal text and strong visual hierarchy.
- Loading states use spinner or skeleton, not process checklists.
- Cards have clean borders and restrained styling.
- Animations are smooth, subtle, and not distracting.
- Patient result screens are scannable within seconds.
- Doctor note remains professional and printable.
- Safety language is compact but visible.
- No screen feels crowded, noisy, or over-explained.

## 9. Implementation Defaults

- Build with React, Vite, shadcn, Tailwind, and the generated template structure.
- Use the PRD as product truth.
- Use this spec as the frontend design truth.
- Ignore the deleted frontend design.
- Prefer simple reusable layout components over one-off page styling.
- Keep UI copy short by default.
- Use progressive disclosure for detail-heavy health information.
