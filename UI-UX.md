# Preapix UI/UX

Preapix is a developer-first mock API workspace for building frontend features before the backend is ready. The interface should feel focused, fast, and technical. Neutral surfaces carry most of the UI; color is reserved for actions, selection, HTTP methods, and response status.

## Product principles

- Keep APIs and their responses more prominent than analytics.
- Use compact, scannable layouts with clear hierarchy and restrained borders.
- Keep common actions visible and advanced details progressively disclosed.
- Give immediate, specific feedback for validation, network requests, and copy actions.
- Support keyboard use, visible focus, and narrow mobile screens.
- Avoid decorative gradients, excess shadows, oversized cards, and unnecessary saturated color.

## Color tokens

### Dark theme (default)

| Purpose | Value |
| --- | --- |
| Background | `#08090C` |
| Surface | `#0D1117` |
| Raised surface | `#11161D` |
| Hover surface | `#151B23` |
| Border | `#202630` |
| Strong border | `#2A323D` |
| Primary | `#3B82F6` |
| Primary hover | `#2563EB` |
| Primary soft | `rgba(59, 130, 246, 0.10)` |
| Cyan accent | `#06B6D4` |
| Primary text | `#F5F7FA` |
| Secondary text | `#A1A9B5` |
| Muted text | `#667085` |
| Disabled text | `#475467` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Danger | `#EF4444` |
| Info | `#38BDF8` |

### Light theme

| Purpose | Value |
| --- | --- |
| Background | `#F8FAFC` |
| Surface | `#FFFFFF` |
| Raised surface | `#F1F5F9` |
| Hover surface | `#F8FAFC` |
| Border | `#E2E8F0` |
| Strong border | `#CBD5E1` |
| Primary | `#2563EB` |
| Primary hover | `#1D4ED8` |
| Primary soft | `rgba(37, 99, 235, 0.08)` |
| Primary text | `#0F172A` |
| Secondary text | `#334155` |
| Muted text | `#64748B` |
| Disabled text | `#94A3B8` |
| Success | `#16A34A` |
| Warning | `#D97706` |
| Danger | `#DC2626` |
| Info | `#0284C7` |

Use neutral colors for most of the interface. Blue indicates an actionable or selected element; cyan is reserved for small technical accents. Do not use color as the only way to convey status.

### HTTP method colors

Use compact, low-saturation badges with a subtle background:

| Method | Color |
| --- | --- |
| GET | Blue |
| POST | Green |
| PUT | Amber |
| PATCH | Violet |
| DELETE | Red |

### Response status colors

- `2xx`: success green
- `3xx`: informational blue/cyan
- `4xx`: warning amber
- `5xx`: danger red

## Typography and spacing

- UI font: Geist; code font: Geist Mono.
- Page title: approximately 24px / 600.
- Section title: approximately 16px / 600.
- Body: 14px; metadata: 12px; code: 12–13px.
- Follow a 4px/8px spacing rhythm. Dashboard padding: 32px desktop, 24px tablet, 16px mobile.
- Buttons and inputs use an 8px radius; cards and large panels use approximately 10–12px.
- Use borders for separation. Reserve shadows for overlays and floating UI.

## Application structure

The dashboard uses a compact workspace navigation for Overview, Projects, APIs, Requests, and Documentation. The top bar holds the workspace identity, command search, theme control, and home link. On mobile, navigation collapses to a compact icon row and content stacks vertically.

### Overview

Show compact API/active/request counts, a readable list of recent APIs, and recent request activity. Keep API definitions—not charts—as the primary content.

### APIs and creation

The API view includes API search, method/path/status/active state, endpoint testing, response scenarios, and recent requests. Creation keeps the configuration and live response preview side-by-side on wider screens and stacked on mobile.

Response body and headers are JSON-validated before creation. Validation errors should identify the invalid field and explain that it must be corrected. The preview reflects the current response body, status, and configured delay.

### Requests

Use a compact table with method, endpoint, status, latency, and time. Each row can expand to show request headers, query parameters, request body, response headers, and response body. Empty states explain how traffic appears.

### Documentation

Generate endpoint details and code examples from the selected API. Provide JavaScript, cURL, Python, and TypeScript examples with one-click copy feedback.

### Scenarios

Treat scenarios as alternate responses for QA. Show their names, status, delay, and enabled state; allow the tester to select an enabled scenario using the `?scenario=name` query parameter.

## Interaction and accessibility

- `Ctrl+K` / `Cmd+K` opens the command menu; arrow keys navigate, Enter selects, and Escape closes it.
- Use visible focus indicators and accessible labels for icon-only controls and form fields.
- Disable submit actions while a related request is pending and show a local loading indicator.
- Use non-blocking success toasts for creation and copy actions. Explain errors with an actionable next step.
- Confirm destructive project/API deletions and state what will be removed.
- Avoid horizontal page overflow on mobile; allow technical tables and code to scroll within their own containers.

## Current implementation

The application includes the landing page and interactive dashboard; Supabase account registration/sign-in; single-user projects and APIs stored in Supabase; scenarios; request testing and inspection; request analytics from dashboard previews; API/scenario import/export; versioned docs; and persistent theme preference. Team membership and external request logging are not implemented.

Public mock endpoints are intentionally shareable by short URL and their response definitions are public to anyone with the project key. Production setup still needs deployment-specific backups/monitoring, account recovery, and distributed abuse protection. See `README.md` and `PROJECT-STATUS-AND-REMAINING-WORK.md`.
