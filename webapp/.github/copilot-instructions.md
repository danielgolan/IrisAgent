# GitHub Copilot Instructions for IrisAgent WebApp

## Project Overview

This is a React web application built with Create React App for managing and searching case data. The application features a case management system with search functionality, case details views, and archiving capabilities.

## Technology Stack

- **Framework**: React 19.1.1 with React Router DOM 7.8.0
- **UI Library**: Material-UI (MUI) 7.3.1 with Emotion for styling
- **Styling**: Combination of Material-UI components, CSS modules, and styled-components
- **Testing**: React Testing Library with Jest
- **Build Tool**: React Scripts (Create React App)

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── case-details/       # Case detail views and related components
├── case-list/          # Case listing components
├── homepage/           # Homepage components
├── archive/            # Archive functionality
├── search/             # Search-related components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── data/               # Data management
└── sample-data/        # Mock/sample data
```

## Coding Standards & Conventions

### React Component Structure

- Use functional components with hooks
- Prefer destructuring props in function parameters
- Use React.memo() for performance optimization when appropriate
- Keep components focused on single responsibilities

### File Naming

- Component files: PascalCase (e.g., `CaseDetails.js`, `SearchComponent.js`)
- Utility files: camelCase (e.g., `searchUtils.js`)
- CSS files: Match component name (e.g., `Header.css` for `Header.js`)
- Hook files: Start with "use" (e.g., `useSearch.js`)

### Import Organization

1. React and React-related imports
2. Third-party libraries (MUI, styled-components, etc.)
3. Local components and utilities
4. CSS imports (always last)

Example:

```javascript
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "./components/Sidebar";
import HomePage from "./homepage/HomePage";
import "./App.css";
```

### Material-UI Usage

- Use MUI components as the primary UI building blocks
- Utilize the custom theme defined in `App.js` with primary color `#1976d2`
- Use `Box` component for layout and spacing
- Apply `sx` prop for component-specific styling
- Maintain responsive design with MUI's responsive utilities

### State Management

- Use React hooks (useState, useEffect, useContext) for state management
- Custom hooks for reusable stateful logic (see `hooks/useSearch.js`)
- Pass data through props and context when appropriate

### Styling Approach

- Primary: Material-UI's `sx` prop and theme system
- Secondary: CSS modules for component-specific styles
- Use styled-components for complex styled components
- Maintain consistent spacing using MUI's spacing system

### Component Patterns

- **Page Components**: Located in `pages/` directory, handle routing and high-level state
- **Feature Components**: Grouped by feature (case-details, search, etc.)
- **Shared Components**: Reusable UI elements in `components/`
- **Layout Components**: Sidebar navigation, headers, containers

### Case Details Implementation

The case details page (`case-details/CaseDetails.js`) features an innovative expandable verification checklist that consolidates all case information into a space-efficient, user-friendly interface.

#### **Expandable Verification Checklist**

- **Structure**: Single checklist component that replaces multiple separate sections
- **Expandable Items**: Click on any checklist item title to reveal detailed content
- **Smart Auto-Expansion**:
  - ✅ **Success status**: Sections auto-collapse (green checkmarks)
  - ⚠️ **Warning status**: Sections auto-expand (orange warnings)
  - ❌ **Error status**: Sections auto-expand (red errors)

#### **Status Chip System**

- **Auto-verified**: Green chips for automatically verified items
- **Auto-warning**: Orange chips for automatic warnings (e.g., new insurance policies)
- **Approved**: Green chips for manually approved items
- **Declined**: Red chips for declined/rejected items
- **Pending**: Warning chips for items awaiting action

#### **Integrated Content Sections**

Each expandable item contains detailed information previously shown in separate sections:

1. **Vehicle Verification**: VIN, registration, ownership details
2. **Insurance Validation**: Policy information, coverage details, new policy warnings
3. **Damage Assessment**: Photos, inspection reports, damage descriptions
4. **Customer Verification**: ID verification, signatures, contact confirmation
5. **Parts & Labor**: Individual part cards, pricing, approval status, total estimates
6. **Calibration**: ADAS system requirements, scheduling, confirmations
7. **Documentation**: Paperwork status, filing information

#### **Implementation Notes**

- **State Management**: Uses `expandedSteps` and `checkedSteps` state for tracking
- **Progressive Disclosure**: Information revealed only when needed
- **Responsive Design**: All expanded content adapts to mobile/tablet layouts
- **Accessibility**: Proper ARIA labels, keyboard navigation support
- **Performance**: Lazy rendering of expanded content to optimize performance

### Search Functionality

- Centralized search logic in `search/` directory
- Use `SearchDropdown` component for consistent search UI
- Implement search utilities in `utils/searchUtils.js`
- Custom search hook pattern in `hooks/useSearch.js`

### Data Handling

- Sample data stored in `sample-data/` directory
- Actual data management in `data/` directory
- Use consistent data structures for cases and search results

### Testing Guidelines

- Use React Testing Library for component testing
- Test files should be co-located or in `__tests__` directories
- Focus on user behavior rather than implementation details
- Mock external dependencies appropriately

## Code Generation Guidelines

### When Creating New Components:

1. Use functional components with arrow function syntax
2. Include proper prop types or TypeScript interfaces if applicable
3. Follow the established import order
4. Use Material-UI components for UI elements
5. Include responsive design considerations
6. Add appropriate ARIA labels for accessibility

### When Adding Routing:

- Use React Router DOM v7 syntax
- Define routes in the main `App.js` file
- Ensure proper navigation in the `Sidebar` component

### When Working with Forms:

- Use Material-UI form components
- Implement proper validation
- Handle form state with React hooks
- Provide user feedback for form actions

### When Creating Expandable/Collapsible Components:

- Use the case details checklist pattern as a reference
- Implement smart auto-expansion based on status (warnings/errors expand, success collapses)
- Include smooth animations with CSS transitions
- Use Material-UI's `List`, `ListItem`, and `Box` components for structure
- Handle both manual expansion (click) and automatic expansion (status-based)
- Prevent event bubbling between expand/collapse and other actions (e.g., checkboxes)
- Include visual indicators (chevron icons) for expandable state

### When Implementing Status Systems:

- Use consistent chip colors: success (green), warning (orange), error (red), pending (grey)
- Implement auto-verification logic where appropriate
- Provide clear status labels: "Auto-verified", "Auto-warning", "Approved", "Declined", "Pending"
- Use status to drive UI behavior (auto-expansion, visual hierarchy)

### When Adding Search Features:

- Extend the existing search infrastructure
- Use the established `SearchDropdown` pattern
- Update search utilities as needed
- Maintain search state consistency

## Performance Considerations

- Use React.memo() for expensive components
- Implement lazy loading for route-based code splitting
- Optimize Material-UI bundle size by importing only needed components
- Use proper dependency arrays in useEffect hooks

## Accessibility

- Include proper ARIA labels and roles
- Ensure keyboard navigation support
- Maintain proper heading hierarchy
- Use semantic HTML elements
- Test with screen readers when possible

## Browser Support

- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Follow Create React App's browser support guidelines
- Test responsive design on mobile devices

## Development Workflow

- Use `npm start` for development server
- Use `npm test` for running tests
- Use `npm run build` for production builds
- Follow the existing folder structure when adding new features

## Important Interaction Guidelines

1. **Always ask clarifying questions** before starting implementation if any requirements are unclear or ambiguous
2. **Complete one task at a time** - focus on implementing one feature or fix completely before moving to the next
3. **Seek confirmation** on approach and implementation details when multiple solutions are possible
4. **Break down complex requests** into smaller, manageable tasks and tackle them sequentially
