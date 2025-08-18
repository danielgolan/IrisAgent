// Utility functions for homepage components

// Calculate completion steps based on status fields
export const calculateSteps = (caseItem) => {
  const statusFields = [
    caseItem.coverageStatus,
    caseItem.imagesStatus,
    caseItem.orderStatus,
    caseItem.invoiceStatus,
    caseItem.orderLinesStatus,
    caseItem.damageFormSignatureStatus,
    caseItem.adasStatus,
  ];

  const totalSteps = statusFields.length;
  const completedSteps = statusFields.filter(
    (status) =>
      status === "Approved" ||
      status === "SignedByCustomer" ||
      status === "NotRequired" ||
      status === "Completed"
  ).length;

  return { completedSteps, totalSteps };
};

// Map case status to display status
export const mapCaseStatusToDisplay = (caseStatus) => {
  switch (caseStatus) {
    case "InvoiceApproved":
      return "Completed";
    case "ReadyForApproval":
      return "Pending Approval";
    case "Failed":
      return "Failed";
    default:
      return "Open";
  }
};

// Status options configuration
export const STATUS_OPTIONS = [
  { value: "Open", label: "Open", color: "info" },
  { value: "Pending Approval", label: "Pending Approval", color: "warning" },
  { value: "Invoice Flow", label: "Waiting Invoice", color: "info" },
  { value: "Waiting Payment", label: "Waiting Payment", color: "primary" },
  { value: "Failed", label: "Failed", color: "error" },
  { value: "Completed", label: "Completed", color: "success" },
];

// Status styling helper
export const getStatusColors = (statusColor) => {
  const colorMap = {
    success: { bg: "rgba(76, 175, 80, 0.08)", text: "#2e7d32" },
    warning: { bg: "rgba(255, 152, 0, 0.08)", text: "#ed6c02" },
    error: { bg: "rgba(244, 67, 54, 0.08)", text: "#d32f2f" },
    info: { bg: "rgba(33, 150, 243, 0.08)", text: "#0288d1" },
    primary: { bg: "rgba(25, 118, 210, 0.08)", text: "#1976d2" },
  };
  return (
    colorMap[statusColor] || {
      bg: "rgba(158, 158, 158, 0.08)",
      text: "#616161",
    }
  );
};
