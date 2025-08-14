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
│   └── ActivityLog.js   # ✅ Activity log and communication component
├── pages/              # Page-level components
├── case-details/       # Case detail views and related components
├── case-list/          # Case listing components
├── homepage/           # Homepage components
├── archive/            # Archive functionality
├── search/             # Search-related components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── data/               # Data management
├── steps/              # ✅ Modular step system configuration
│   └── stepModules.js   # Step definitions and logic
└── sample-data/        # Mock/sample data
```

## Modular Step System Architecture ✅ IMPLEMENTED

### Overview

The case verification system has been redesigned with a fully modular architecture that separates step configuration from UI rendering. This enables dynamic, API-driven case verification with consistent behavior across all verification steps.

### Core Files

- **`/src/steps/stepModules.js`**: Central configuration defining all 8 verification steps
- **`/src/case-details/CaseDetails.js`**: Main implementation with helper functions for modular rendering
- **`/src/components/ActivityLog.js`**: Activity tracking and communication component

### Step Configuration Model

Each step in `STEP_MODULES` follows this structure:

```javascript
{
  id: "vehicle_verification",           // Unique step identifier
  title: "Vehicle Verification",        // Display title
  icon: "car",                         // Icon identifier
  statusField: "vehicleStatus",        // Optional: custom status field name
  statusLogic: {                       // Auto-status determination logic
    autoApproved: (caseData) => boolean,
    autoWarning: (caseData) => boolean
  },
  dataFields: ["vehicle.vin", "vehicle.licensePlate"], // Fields to display
  fieldLabels: {                       // Custom field labels
    "vehicle.vin": "VIN Number",
    "vehicle.licensePlate": "License Plate"
  }
}
```

### 4-Status Model ✅ IMPLEMENTED

The system uses a sophisticated 4-status model for each verification step:

- **`Auto-approved`** - System automatically verified and approved (read-only, agent can override)
- **`Auto-warning`** - System detected issues needing attention (editable)
- **`Approved`** - Agent manually approved the step (read-only)
- **`Declined`** - Agent manually declined the step (editable to fix issues)

### Status Transition Rules

- **System sets**: Only `Auto-approved` or `Auto-warning` statuses
- **Agents can only set**: `Approved` or `Declined` statuses
- **Agent override behavior**: Button toggles between `Approved`/`Declined`
- **Once agent touches a step**: It can never return to auto-status
- **Read-only when**: Status is `Auto-approved` or `Approved`
- **Editable when**: Status is `Auto-warning` or `Declined`

### Helper Functions ✅ IMPLEMENTED

The modular system includes these key helper functions in `CaseDetails.js`:

- **`getStepStatus(stepModule, caseData)`**: Determines current step status and UI properties
- **`getFieldValue(obj, path)`**: Safe nested object property access
- **`getStepIcon(iconName)`**: Maps icon names to Material-UI components
- **`createVerificationStep(stepModule, caseData)`**: Creates complete step object with status
- **`renderStepContent(step)`**: Generic content renderer for all modular steps

### Current Implementation Status

✅ **Fully Implemented (8 Steps)**:

1. Vehicle Verification
2. Insurance Validation
3. Damage Assessment
4. Customer Verification
5. Parts & Labor
6. ADAS Calibration
7. Documentation
8. Invoice Processing

✅ **Activity Log Component**: Complete 3-tab interface for communication and audit trail

### Usage Pattern

```javascript
// Import the step configuration
import { STEP_MODULES } from "../steps/stepModules";

// Create verification steps with current case data
const verificationSteps = STEP_MODULES.map((stepModule) =>
  createVerificationStep(stepModule, caseData)
);

// Render step content dynamically
const content = renderStepContent(step);
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

- **Development Server**: The npm development server is always running and available for testing
- Use `npm test` for running tests
- Use `npm run build` for production builds
- Follow the existing folder structure when adding new features
- **Debugging Support**: Console logs and screenshots are available upon request for troubleshooting

## Modular Step System Architecture

### Step Status Model

The case verification system uses a 4-status model for each verification step:

- **`Auto-approved`** - System automatically verified and approved the step (read-only, but agent can override)
- **`Auto-warning`** - System detected something needing attention but didn't fail validation (editable)
- **`Approved`** - Agent manually approved the step (read-only)
- **`Declined`** - Agent manually declined the step (editable to fix issues)

### Status Transition Rules

- **System sets**: `Auto-approved` or `Auto-warning` only
- **Agents can only set**: `Approved` or `Declined`
- **Agent override behavior**: Button toggles between `Approved`/`Declined`
- **Once agent touches a step**: It can never return to auto-status
- **Read-only when**: Status is `Auto-approved` or `Approved`
- **Editable when**: Status is `Auto-warning` or `Declined`

### UI Behavior Guidelines

- All steps remain expandable/collapsible regardless of status
- Agent override button always visible (no separate override mode)
- When status is approved (auto or manual), data fields become read-only
- Use existing checkbox/button pattern for manual status changes
- No visual lock indicators needed - read-only state is sufficient

### Step Structure

- Keep verification steps at high level (8 current steps implemented)
- Design for easy addition/removal of steps via configuration
- Support step dependencies as warnings/recommendations only (not enforcement)
- Each step should be self-contained and modular for API updates

### Images/Attachments Step Requirements

- **Current Status**: Manual approval only - no auto-approval implemented yet
- **Minimum Requirements**: 3 images required, at least 1 marked as damage
- **Damage Indication**: Images marked with `feature: "damage"` or `checked: true`
- **Future Enhancement**: Will implement auto-approved/auto-warning based on AI analysis
- **UI Requirement**: Interface should support easy scanning and zooming of images
- **Important Note**: "NB! Alle bilder skal tas før demontering og utskjæring" (All images must be taken before dismounting and cutting)

### Parts & Labor Step Requirements

- **Most Complex Step**: Handles order lines, pricing verification, and automated approval workflow
- **Auto-Approval Logic**: Auto-approved when ALL lines have `priceAgreementResponse.comment.status === "Approved"`
- **Auto-Warning Logic**: Auto-warning when ANY lines have failed automated checks
- **Agent Override Rules**:
  - Can edit lines unless already approved
  - Must set to "declined" first to edit approved lines
  - Applies to both individual lines and overall step
- **Data Structure**: Array of order lines with category, article number, quantity, price, discount, total
- **Price Comparison**: API provides min/max/average from price database for validation
- **UI Requirements**:
  - Compact, scannable table layout with proper spacing
  - Clear status badges and clean typography
  - Better presentation of price comparison data
- **Summary Totals**: Includes sum, VAT, deductible, and amount to insurance

### Invoice Step Requirements

- **Simplified Interface**: Only upload button and information field needed
- **API-Driven**: Status determined by automated API validation of uploaded invoice
- **Auto-Approval Logic**: Auto-approved when API validates invoice successfully
- **Auto-Warning Logic**: Auto-warning when API flags invoice for manual review
- **Upload Only**: Workshop uploads invoice file, API handles all validation and data extraction
- **Status Display**: Clear display of API response and validation results

### Activity Log & Notes Component ✅ IMPLEMENTED

- **Fully Implemented**: Separate component for case management and communication
- **Component Location**: `/src/components/ActivityLog.js`
- **Integration**: Integrated into case details page with state management
- **Three Main Functions**:
  - **Activity Timeline**: Scrollable chronological log of all system actions and status changes
  - **Public Comments**: Communication visible to workshop (like current log usage)
  - **Internal Notes**: Private notes visible only to agents/insurance
- **Data Structure**:
  - `activityLog` array for system actions with timestamp, actor, action, type
  - `publicComments` array for workshop communication
  - `internalNotes` array for private agent notes
- **UI Implementation**:
  - ✅ Three-tab interface with Material-UI Tabs component
  - ✅ Visual separation between public (green) and private (orange) content
  - ✅ Chronological timeline format with timestamps and actors
  - ✅ Interactive text input fields for adding new comments/notes
  - ✅ Real-time state updates with proper React state management
  - ✅ Activity type icons and color coding (system, status_change, comment, note)
- **Sample Data**: First case includes comprehensive activity log data for testing
- **Use Cases**: Audit trail, workshop communication, internal case notes

### Activity Log Usage Guidelines

- **Adding Activity Entries**: Use the `onAddComment` and `onAddNote` callbacks to add new entries
- **State Management**: Component receives `caseData` and updates parent state through callbacks
- **Activity Types**:
  - `system_action` (blue) - Automated system events
  - `status_change` (primary) - Verification step updates
  - `comment` (green) - Public workshop communication
  - `note` (orange) - Private agent notes
- **Data Integration**: Activity log automatically tracks when comments/notes are added
- **UI Patterns**: Follow established Material-UI patterns with Cards, Lists, and proper spacing

## Implementation Status & Next Steps

### ✅ Completed Features

1. **Modular Step System**: Complete 8-step verification system with dynamic configuration
2. **4-Status Model**: Auto-approved, Auto-warning, Approved, Declined status logic
3. **Activity Log Component**: Full 3-tab interface for communication and audit trail
4. **Helper Functions**: Complete set of utilities for modular rendering and status management
5. **Sample Data**: Comprehensive test data with activity logs, comments, and notes
6. **UI Integration**: Seamless integration between verification steps and activity log

### 🔧 Available Improvements

1. **Code Cleanup**: Remove unused legacy render functions from CaseDetails.js
2. **API Integration**: Connect step status updates to backend services
3. **Enhanced Validation**: Add more sophisticated auto-approval logic for each step
4. **Mobile Optimization**: Improve responsive design for mobile and tablet devices
5. **Performance**: Optimize rendering for cases with large amounts of data
6. **Testing**: Add comprehensive unit tests for step modules and helper functions
7. **Accessibility**: Enhance screen reader support and keyboard navigation
8. **Real-time Updates**: Implement WebSocket connections for live case updates

### 🎯 Priority Recommendations

**High Priority:**

- Code cleanup to remove technical debt
- Enhanced mobile responsiveness for field agents
- API integration planning and implementation

**Medium Priority:**

- Performance optimizations for complex cases
- Additional validation logic for auto-status determination
- Unit testing coverage for critical functions

**Low Priority:**

- Advanced accessibility features
- Real-time collaborative editing
- Advanced analytics and reporting

### 📋 Development Workflow

When working on improvements:

1. **Start Small**: Focus on one specific improvement at a time
2. **Test Thoroughly**: Verify changes work with existing sample data
3. **Maintain Compatibility**: Preserve existing functionality while adding new features
4. **Follow Patterns**: Use established architectural patterns and conventions
5. **Document Changes**: Update instructions and comments as needed

## Important Interaction Guidelines

1. **Always ask clarifying questions** before starting implementation if any requirements are unclear or ambiguous
2. **Complete one task at a time** - focus on implementing one feature or fix completely before moving to the next
3. **Seek confirmation** on approach and implementation details when multiple solutions are possible
4. **Break down complex requests** into smaller, manageable tasks and tackle them sequentially
