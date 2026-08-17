# Design System

## Objective

The project provides a single shared Enterprise Design System consumed by all
applications in the monorepo.

The Design System is the contract between UX and development and provides:

- Visual consistency.
- Reusable components.
- Accessibility.
- Stable APIs.
- Form integration.
- Design tokens.
- Living documentation.
- Visual and accessibility testing.

It is not a collection of components; it is a UI platform.

---

# Philosophy

The Design System follows these principles:

- Platform First.
- Accessibility by Default.
- Semantic HTML First.
- Headless when possible.
- Components only when they add value.
- Stable public APIs.
- Design Tokens as the single styling contract.
- AI-friendly architecture.

---

# Architecture

```text
                    ┌──────────────┐
                    │ Applications │
                    └──────┬───────┘
                           │
                           ▼
                 @ae/design-system
                           │
          ┌────────────────┴───────────────┐
          │                                │
          ▼                                ▼
    Angular Aria                     Angular CDK
 Accessibility                Infrastructure / Behaviors
          │                                │
          └────────────────┬───────────────┘
                           ▼
                    Semantic HTML
                           │
                           ▼
                    Browser Platform
```

Storybook acts as another consumer of the Design System:

```text
                 ┌── Enterprise Apps
                 │
Design System ───┤
                 │
                 └── Storybook
```

---

# Technology Stack

The Design System uses:

- Semantic HTML.
- CSS Variables.
- SCSS.
- Angular Aria.
- Angular CDK.
- Storybook.
- Strict TypeScript.

Angular implementation conventions are governed by the official Angular
Developer Agent Skill; this document defines ownership and boundaries of the
Design System.

Angular Material will not be used as a base.

---

# Responsibilities

| Need           | Solution                   |
| -------------- | -------------------------- |
| Button         | Native HTML                |
| Input          | Native HTML                |
| Checkbox       | Native HTML                |
| Link           | Native HTML                |
| Badge          | HTML                       |
| Tabs           | Angular Aria               |
| Accordion      | Angular Aria               |
| Menu           | Angular Aria               |
| Select         | Angular Aria + CDK Overlay |
| MultiSelect    | Angular Aria + CDK Overlay |
| Dialog         | Angular CDK                |
| Tooltip        | Angular CDK                |
| Overlay        | Angular CDK                |
| Drag & Drop    | Angular CDK                |
| Virtual Scroll | Angular CDK                |

The general rule is:

```text
HTML
   ↓
Angular Aria
   ↓
Angular CDK
```

The simplest possible solution will always be used.

---

# Design Principles

## HTML first

Whenever possible, native HTML elements are used.

Correct

```html
<button aeButton></button>
```

Incorrect

```html
<ae-button></ae-button>
```

Native semantics are part of accessibility.

---

## Components only when they add value

No abstractions without behavior.

There are no components like:

```html
<ae-div>
  <ae-container> <ae-span></ae-span></ae-container
></ae-div>
```

A component enters the Design System only when it provides:

- behavior
- accessibility
- API
- reuse
- integration
- semantics

---

## Components without business logic

The Design System will never know about:

- users
- permissions
- APIs
- use cases
- domain entities
- stores
- authentication

Components receive data.

Components emit events.

Nothing else.

---

# Design Tokens

All visual aspects of the system are governed by Design Tokens.

Tokens are organized in three levels.

```text
Primitive Tokens
        ↓
Semantic Tokens
        ↓
Component Tokens
```

Example

```text
blue-600
      ↓
color-action-primary
      ↓
button-primary-background
```

Components consume only Component Tokens or Semantic Tokens.

Never hard-coded values.

Correct

```css
background: var(--ae-button-primary-background);
```

Incorrect

```css
background: #2457d6;
```

---

# Design System Interoperability

The project will not be coupled to a specific design tool.

The architecture introduces a layer called:

```text
Design Bridge
```

```text
            Design Tool
                 │
                 ▼
         Design Bridge
                 │
                 ▼
        Design Contract
                 │
     ┌───────────┼────────────┐
     ▼           ▼            ▼
 Storybook   Angular      AI Agents
```

The first planned adapter is Figma, but the architecture will allow replacing
it with any other tool.

---

# Design Contract

The Design Contract represents the common language between UX and development.

It includes:

- Design Tokens
- Components
- Variants
- States
- Accessibility
- Versioning
- Mappings

It belongs neither to Angular nor to Figma.

---

# Design Tool Integration

Synchronization between design and code will be handled through adapters.

The initial evaluation will cover:

- Figma Variables
- Figma Code Connect
- Figma MCP

The goal is not to automatically sync code from Figma, but to share a common
contract that reduces manual work and improves collaboration between UX,
development, and AI tools.

Design changes must follow the standard engineering workflow:

```text
Design change
        ↓
Design Contract update
        ↓
Pull Request
        ↓
Review
        ↓
Tests
        ↓
Release
```

---

# Storybook

Storybook is a consumer of the Design System.

Its responsibilities are:

- Living documentation
- Component catalog
- Playground
- Examples
- States
- Responsive testing
- Interaction testing
- Accessibility testing
- Visual regression

Storybook represents the actual implementation of the Design System.

---

# Structure

```text
libs/

    ae-design-tokens/

    ae-design-system/
        button/
        dialog/
        accordion/
        form-field/
        multi-select/
        testing/
```

Each component is published through a Secondary Entry Point.

Example

```text
@ae/design-system/button

@ae/design-system/dialog

@ae/design-system/testing
```

A global barrel exposing the entire library is not permitted.

---

# Accessibility

Accessibility is part of the component contract.

Every interactive component must define:

- keyboard navigation
- focus management
- screen readers
- disabled states
- error states
- high contrast
- reduced motion

Accessibility will never be a later enhancement.

---

# Testing

The Design System will include:

- Unit Tests
- Interaction Tests
- Accessibility Tests
- Visual Regression Tests

Every new component must include its corresponding tests before being
considered complete.

---

# Relationship with AI

The architecture is designed so that AI agents can easily understand the
Design System.

The goals are:

- Stable APIs.
- Well-documented components.
- Shared Design Contract.
- Storybook as the source of examples.
- Code Connect to map design to code.
- Harness Engineering to provide architectural context.

The purpose is to reduce the distance between design, implementation, and
AI-assisted development.

---

# Summary

The AE Design System is built on five fundamental pillars:

1. Semantic HTML before abstractions.
2. Accessibility as part of the contract.
3. Design Tokens as the single source of styles.
4. Storybook as the implementation truth.
5. Design Bridge as the bridge between UX, development, and AI.

This architecture allows maintaining a scalable design system, decoupled from
specific tools, and prepared to evolve alongside the Angular ecosystem and AI
capabilities.
