// Step Modules Configuration for Case Verification
// This file defines the modular step structure for case verification process

export const STEP_MODULES = {
  // Step 1: Policy Holder (Forsikringstaker)
  policy_holder: {
    id: "policy_holder",
    name: "Forsikringstaker",
    nameEn: "Policy Holder",
    description: "Insurance policy holder verification and contact information",
    icon: "Security",
    order: 1,

    // Data field mappings to case data
    dataFields: {
      name: "insuranceInformation.insuranceOwner.name",
      phoneNumber: "insuranceInformation.insuranceOwner.phoneNumber",
      email: "insuranceInformation.insuranceOwner.email",
      policyNumber: "insuranceInformation.policyNumber",
      policyStartDate: "insuranceInformation.insuranceStart",
    },

    // Status determination logic
    statusLogic: {
      // Auto-approved: Policy start date is 30+ days ago
      // Auto-warning: Policy start date is less than 30 days ago (new policy)
      autoApproved: (caseData) => {
        const policyStartString = caseData.insuranceInformation?.insuranceStart;
        if (
          !policyStartString ||
          policyStartString === "0001-01-01T00:00:00Z"
        ) {
          return false; // Invalid or missing date
        }
        const policyStart = new Date(policyStartString);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return policyStart <= thirtyDaysAgo;
      },

      autoWarning: (caseData) => {
        const policyStartString = caseData.insuranceInformation?.insuranceStart;
        if (
          !policyStartString ||
          policyStartString === "0001-01-01T00:00:00Z"
        ) {
          return true; // Invalid or missing date triggers warning
        }
        const policyStart = new Date(policyStartString);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return policyStart > thirtyDaysAgo;
      },
    },

    // Status field in case data (if different from default)
    statusField: "policyHolderStatus", // Will need to be added to case data

    // Dependencies (warnings/recommendations only)
    dependencies: [],

    // Field labels for UI
    fieldLabels: {
      name: "Navn",
      phoneNumber: "Mobilnummer",
      email: "Epost",
      policyNumber: "Polisenummer",
      policyStartDate: "Policy Start Date",
    },
  },

  // Step 2: Vehicle & Owner (Kjøretøy & Eier)
  vehicle: {
    id: "vehicle",
    name: "Kjøretøy & Eier",
    nameEn: "Vehicle & Owner",
    description:
      "Vehicle identification, specification verification and owner information",
    icon: "DirectionsCar",
    order: 2,

    // Data field mappings to case data
    dataFields: {
      make: "vehicle.brandName",
      model: "vehicle.model",
      firstRegistered: "vehicle.firstRegistered",
      vehicleType: "vehicle.vehicleType",
      vin: "vehicle.vin",
      legenticPrice: "vehicle.legenticPrice", // From Legentic API when vehicle is older than 15 years
      ownerName: "legalOwner.name",
      ownerCheckDate: "vehicle.ownerCheckDate", // New field to be added to case data
    },

    // Status determination logic
    statusLogic: {
      // Auto-approved: Vehicle is 15 years or newer (no additional checks needed)
      autoApproved: (caseData) => {
        const registrationString = caseData.vehicle?.firstRegistered;
        if (!registrationString) {
          return false; // Missing date
        }
        const registrationDate = new Date(registrationString);
        const fifteenYearsAgo = new Date();
        fifteenYearsAgo.setFullYear(fifteenYearsAgo.getFullYear() - 15);
        return registrationDate >= fifteenYearsAgo;
      },

      // Auto-warning: Vehicle older than 15 years (triggers Legentic price check, shows warning)
      autoWarning: (caseData) => {
        const registrationString = caseData.vehicle?.firstRegistered;
        if (!registrationString) {
          return true; // Missing date triggers warning
        }
        const registrationDate = new Date(registrationString);
        const fifteenYearsAgo = new Date();
        fifteenYearsAgo.setFullYear(fifteenYearsAgo.getFullYear() - 15);
        return registrationDate < fifteenYearsAgo;
      },
    },

    // Status field in case data (if different from default)
    statusField: "vehicleStatus", // Will need to be added to case data

    // Dependencies (warnings/recommendations only)
    dependencies: [],

    // Field labels for UI
    fieldLabels: {
      make: "Merke",
      model: "Modell",
      firstRegistered: "Førstegangsregistrert",
      vehicleType: "Type",
      vin: "Chassisnummer",
      legenticPrice: "List Price (Legentic)",
      ownerName: "Eier navn",
      ownerCheckDate: "Eier sjekket pr.",
    },
  },

  // Step 3: Coverage (Dekning)
  coverage: {
    id: "coverage",
    name: "Dekning",
    nameEn: "Coverage",
    description: "Insurance coverage verification and deductible information",
    icon: "Security",
    order: 3,

    // Data field mappings to case data
    dataFields: {
      customerCategory: "insuranceInformation.customerCategory",
      requiresVAT: "requiresVAT",
      deductible: "insuranceInformation.coverage.deductible",
      deductiblePercentage:
        "insuranceInformation.coverage.deductiblePercentage",
      deductibleCurrency: "insuranceInformation.coverage.deductibleCurrency",
      hasGlassCoverage: "insuranceInformation.coverage.hasGlassCoverage",
    },

    // Status determination logic
    statusLogic: {
      // Status based on coverageStatus field
      approved: (caseData) => caseData.coverageStatus === "Approved",
      declined: (caseData) => caseData.coverageStatus === "Declined",

      // Auto-warning: N/A currently for coverage
      autoWarning: (caseData) => false,

      // Auto-approved: Not used for this step (only manual approval)
      autoApproved: (caseData) => false,
    },

    // Status field in case data
    statusField: "coverageStatus",

    // Dependencies (warnings/recommendations only)
    dependencies: ["policy_holder"],

    // Special actions
    actions: {
      requestNewCoverage: {
        label: "Request New Coverage",
        action: "REQUEST_NEW_COVERAGE",
        setsStatusToPending: true,
      },
    },

    // Field labels for UI
    fieldLabels: {
      customerCategory: "Type",
      requiresVAT: "MVA-pliktig kunde",
      deductible: "Egenandel",
      deductiblePercentage: "Egenandel (%)",
      deductibleCurrency: "Currency",
      hasGlassCoverage: "Glass Coverage",
    },
  },

  // Step 4: Images/Attachments (Bilder/Vedlegg)
  images: {
    id: "images",
    name: "Bilder/Vedlegg",
    nameEn: "Images/Attachments",
    description: "Photo documentation of vehicle and damage before dismounting",
    icon: "PhotoCamera",
    order: 4,

    // Data field mappings to case data
    dataFields: {
      totalImages: "images.length", // Total number of images
      imagesStatus: "imagesStatus", // Status of image requirements
      photoNote: "photoNote", // Note about photo requirements
    },

    // Status determination logic
    statusLogic: {
      // Currently: Nothing auto-approved - all require manual review
      // Future: Will have auto-approved/auto-warning logic

      // No auto-approved currently
      autoApproved: (caseData) => false,

      // No auto-warning currently
      autoWarning: (caseData) => false,

      // Manual approval based on requirements validation
      approved: (caseData) => caseData.imagesStatus === "Approved",
      declined: (caseData) => caseData.imagesStatus === "Declined",
    },

    // Validation requirements
    requirements: {
      minImages: 3,
      minDamageImages: 1,
      note: "NB! Alle bilder skal tas før demontering og utskjæring",
    },

    // Status field in case data
    statusField: "imagesStatus",

    // Dependencies (warnings/recommendations only)
    dependencies: ["vehicle"],

    // Field labels for UI
    fieldLabels: {
      totalImages: "Totalt antall bilder",
      imagesStatus: "Status bilder",
      photoNote: "Notat om bilder",
    },

    // Future enhancement notes
    futureEnhancements: {
      autoApproval:
        "Future: Images will be auto-approved/auto-warning based on AI analysis",
      uiImprovements: "UI should make scanning and zooming easier",
    },
  },

  // Step 5: Damage Report (Skademelding)
  damage_report: {
    id: "damage_report",
    name: "Skademelding",
    nameEn: "Damage Report",
    description: "Incident details, job information and damage documentation",
    icon: "Assignment",
    order: 5,

    // Data field mappings to case data
    dataFields: {
      damageDate: "dateOfIncident",
      jobPerformed: "jobExecutionDate", // Date/calendar field (not required)
      jobType: "jobType",
      cause: "cause",
      wear: "wear",
      location: "placeOfIncident",
      attachmentCount: "attachments.length", // Number of attachments
    },

    // Status determination logic
    statusLogic: {
      // Currently: Always manual approval (like images step)
      // No auto-approval/auto-warning logic today

      // No auto-approved currently
      autoApproved: (caseData) => false,

      // No auto-warning currently
      autoWarning: (caseData) => false,

      // Manual approval only
      approved: (caseData) => caseData.damageReportStatus === "Approved",
      declined: (caseData) => caseData.damageReportStatus === "Declined",
    },

    // Status field in case data
    statusField: "damageReportStatus", // Will need to be added to case data

    // Dependencies (warnings/recommendations only)
    dependencies: ["images"],

    // Field labels for UI
    fieldLabels: {
      damageDate: "Skadedato",
      jobPerformed: "Jobb utført", // Date/calendar field
      jobType: "Type jobb",
      cause: "Årsak",
      wear: "Slitasje",
      location: "Sted",
      attachmentCount: "Antall vedlegg",
    },

    // Field types for UI
    fieldTypes: {
      damageDate: "date",
      jobPerformed: "date", // Calendar field, not required
      jobType: "dropdown",
      cause: "dropdown",
      wear: "dropdown",
      location: "text",
      damageReportAttachment: "file",
    },
  },

  // Step 6: Parts & Labor (Deler og arbeidstid)
  parts_labor: {
    id: "parts_labor",
    name: "Deler og arbeidstid",
    nameEn: "Parts & Labor",
    description:
      "Order lines, pricing verification and automated approval workflow",
    icon: "Build",
    order: 6,

    // Data field mappings to case data
    dataFields: {
      orderLines: "orderLines", // Array of order line objects
      approvedTotals: "approvedTotals", // Summary totals object
      priceComparison: "priceComparison", // From API - price database comparison
    },

    // Order line structure (for reference)
    orderLineFields: {
      id: "id",
      category: "category",
      articleNumber: "articleNumber",
      quantity: "quantity",
      articlePrice: "articlePrice",
      discountPercent: "discountPercent",
      total: "total",
      approvalStatus: "priceAgreementResponse.comment.status",
      approvalText: "priceAgreementResponse.comment.text",
    },

    // Status determination logic
    statusLogic: {
      // Auto-approved: All lines have priceAgreementResponse.comment.status === "Approved"
      autoApproved: (caseData) => {
        const orderLines = caseData.orderLines || [];
        return (
          orderLines.length > 0 &&
          orderLines.every(
            (line) =>
              line.priceAgreementResponse?.comment?.status === "Approved"
          )
        );
      },

      // Auto-warning: Any lines with failed priceAgreementResponse (agent needs manual review)
      autoWarning: (caseData) => {
        const orderLines = caseData.orderLines || [];
        return orderLines.some(
          (line) => line.priceAgreementResponse?.comment?.status !== "Approved"
        );
      },

      // Manual approval
      approved: (caseData) => caseData.orderLinesStatus === "Approved",
      declined: (caseData) => caseData.orderLinesStatus === "Declined",
    },

    // Status field in case data
    statusField: "orderLinesStatus",

    // Dependencies (warnings/recommendations only)
    dependencies: ["damage_report", "coverage"],

    // Agent override rules
    overrideRules: {
      canEdit: "Only when line status is not approved",
      toEdit: "Must set to declined first, then edit",
      applies: "Individual line level and overall step level",
    },

    // UI improvement requirements
    uiRequirements: {
      layout: "Compact rows with better spacing",
      visualization: "Clear status badges, clean typography",
      scanning: "Easy to scan table with proper whitespace",
      priceComparison: "Better presentation of price database comparison",
    },

    // Field labels for UI
    fieldLabels: {
      orderLines: "Orderlinjer",
      category: "Kategori",
      articleNumber: "Artikkelnummer",
      quantity: "Antall",
      articlePrice: "Veil. Pris",
      discountPercent: "Rabatt",
      total: "Total",
      approvalStatus: "Status",
      sum: "Sum",
      vat: "MVA",
      deductible: "Egenandel",
      toInsurance: "Til forsikring",
    },
  },

  // Step 7: Calibration (Kalibrering) - Only for windshield replacement
  calibration: {
    id: "calibration",
    name: "Kalibrering",
    nameEn: "Calibration",
    description:
      "ADAS calibration requirements and confirmation for windshield replacement",
    icon: "Settings",
    order: 7,

    // Conditional display - only show for windshield work
    conditionalDisplay: {
      condition: (caseData) => caseData.jobType === "Replace",
      description: "Only visible for windshield replacement jobs",
    },

    // Data field mappings to case data
    dataFields: {
      adasStatus: "adasStatus",
      adasOperator: "adasOperator",
      workshopConfirmed: "adasWorkshopConfirmed", // New field - workshop confirmation checkbox
      noCalibrationNeeded: "adasNoCalibrationNeeded", // New field - "should not be calibrated" checkbox
      technicianName: "adasTechnicianName", // New field - technician name input
      calibrationReport: "adasCalibrationReport", // New field - uploaded calibration report
    },

    // Status determination logic
    statusLogic: {
      // Auto-approved: No calibration required
      autoApproved: (caseData) => caseData.adasStatus === "NotRequired",

      // Auto-warning: Needs checking/decision
      autoWarning: (caseData) => caseData.adasStatus === "MustBeChecked",

      // Manual approval states
      approved: (caseData) => caseData.adasStatus === "Completed",
      required: (caseData) => caseData.adasStatus === "Required",
    },

    // Status field in case data
    statusField: "adasStatus",

    // Dependencies (warnings/recommendations only)
    dependencies: ["parts_labor"],

    // Field labels for UI
    fieldLabels: {
      adasStatus: "ADAS - Kommentar",
      adasOperator: "ADAS Operator",
      workshopConfirmed:
        "Jeg bekrefter at verkstedet har utført nødvendig arbeid etter bilfabrikantens krav og instruks",
      noCalibrationNeeded: "Denne bilen skal ikke kalibreres",
      technicianName: "Skriv inn navn",
      calibrationReport: "Last opp kalibringsrapport om ønskelig",
    },

    // Field types for UI
    fieldTypes: {
      adasStatus: "dropdown",
      adasOperator: "text",
      workshopConfirmed: "checkbox",
      noCalibrationNeeded: "checkbox",
      technicianName: "text",
      calibrationReport: "file",
    },
  },

  // Step 8: Invoice (Faktura) - Simplified
  invoice: {
    id: "invoice",
    name: "Faktura",
    nameEn: "Invoice",
    description: "Invoice upload and automated API validation",
    icon: "Receipt",
    order: 8,

    // Data field mappings to case data
    dataFields: {
      invoiceFile: "attachments", // Filter for invoice attachments
      invoiceStatus: "invoiceStatus",
      apiResponse: "invoiceApiResponse", // New field - API validation response
    },

    // Status determination logic
    statusLogic: {
      // Auto-approved: API approves the invoice
      autoApproved: (caseData) => caseData.invoiceStatus === "Approved",

      // Auto-warning: API flags invoice for review
      autoWarning: (caseData) =>
        caseData.invoiceStatus === "Pending" ||
        caseData.invoiceStatus === "Warning",

      // Manual approval states
      approved: (caseData) => caseData.invoiceStatus === "Approved",
      declined: (caseData) => caseData.invoiceStatus === "Declined",
    },

    // Status field in case data
    statusField: "invoiceStatus",

    // Dependencies (warnings/recommendations only)
    dependencies: ["parts_labor"],

    // Simplified UI components
    uiComponents: {
      uploadButton: "Invoice file upload",
      informationField: "API response and validation status display",
    },

    // Field labels for UI
    fieldLabels: {
      invoiceFile: "Last opp faktura",
      invoiceStatus: "Faktura status",
      apiResponse: "API validering",
    },

    // Field types for UI
    fieldTypes: {
      invoiceFile: "file",
      invoiceStatus: "readonly",
      apiResponse: "readonly",
    },
  },

  // Additional steps will be added here as we analyze them...
};

// Helper function to get nested value from object
export const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

// Helper function to determine step status
export const determineStepStatus = (stepModule, caseData) => {
  if (stepModule.statusLogic.autoApproved?.(caseData)) {
    return "auto-approved";
  }
  if (stepModule.statusLogic.autoWarning?.(caseData)) {
    return "auto-warning";
  }
  return "pending";
};
