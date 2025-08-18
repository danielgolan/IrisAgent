import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Alert,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Avatar,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  DirectionsCar as CarIcon,
  Security as InsuranceIcon,
  Build as RepairIcon,
  Assignment as ReportIcon,
  CheckCircle as CheckIcon,
  Person as PersonIcon,
  FindInPage as InspectionIcon,
  AttachMoney as PricingIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Image as ImageIcon,
  Receipt as InvoiceIcon,
  Tune as CalibrationIcon,
} from "@mui/icons-material";
import { getCaseById } from "../sample-data/sampleCases";
import { STEP_MODULES } from "../steps/stepModules";
import ActivityLog from "../components/ActivityLog";
import StatusChip from "../components/StatusChip";

// Helper component for information rows
const InfoRow = ({ label, value, highlight = false }) => (
  <Box sx={{ mb: 1 }}>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontSize: "0.75rem", mb: 0.25, fontWeight: 400 }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      fontWeight={highlight ? 600 : 500}
      color={highlight ? "primary.main" : "#373737"}
      sx={{ fontSize: "0.825rem", lineHeight: 1.4 }}
    >
      {value}
    </Typography>
  </Box>
);

// Helper function to get step status based on 4-status model
const getStepStatus = (stepModule, caseData) => {
  // First check if there's a manual status override in the case data
  const manualStatusField = stepModule.statusField || `${stepModule.id}Status`;
  const manualStatus = caseData[manualStatusField];

  // If agent has manually set status, use that
  if (manualStatus === "Approved" || manualStatus === "Declined") {
    return {
      status:
        manualStatus.toLowerCase() === "approved" ? "approved" : "declined",
      chipLabel: manualStatus,
      chipColor:
        manualStatus.toLowerCase() === "approved" ? "success" : "error",
      isAutomatic: false,
      isReadOnly: manualStatus.toLowerCase() === "approved",
    };
  }

  // Check for automatic status determination
  if (stepModule.statusLogic?.autoApproved?.(caseData)) {
    return {
      status: "auto-approved",
      chipLabel: "Auto-approved",
      chipColor: "success",
      isAutomatic: true,
      isReadOnly: true,
    };
  }

  if (stepModule.statusLogic?.autoWarning?.(caseData)) {
    return {
      status: "auto-warning",
      chipLabel: "Auto-warning",
      chipColor: "warning",
      isAutomatic: true,
      isReadOnly: false,
    };
  }

  // Default to pending if no status can be determined
  return {
    status: "pending",
    chipLabel: "Pending",
    chipColor: "default",
    isAutomatic: false,
    isReadOnly: false,
  };
};

// Helper function to get step field value from case data using dot notation
const getFieldValue = (caseData, fieldPath) => {
  const value = fieldPath.split(".").reduce((obj, key) => {
    if (obj === null || obj === undefined) return undefined;
    return obj[key];
  }, caseData);

  // Handle null/undefined
  if (value === null || value === undefined) {
    return "N/A";
  }

  // Handle objects - convert to string representation
  if (typeof value === "object") {
    // Handle arrays
    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} items` : "None";
    }
    // Handle objects with name property
    if (value.name) {
      return value.name;
    }
    // Handle objects - return JSON string or a readable format
    return JSON.stringify(value);
  }

  // Format dates for display
  if (typeof value === "string" && value.includes("T") && value.includes("Z")) {
    const date = new Date(value);
    if (!isNaN(date.getTime()) && value !== "0001-01-01T00:00:00Z") {
      return date.toLocaleDateString("no-NO");
    }
  }

  // Handle boolean values
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

// Icon mapping for step modules
const getStepIcon = (iconName) => {
  const iconMap = {
    Security: <InsuranceIcon />,
    DirectionsCar: <CarIcon />,
    Assignment: <ReportIcon />,
    Person: <PersonIcon />,
    AttachMoney: <PricingIcon />,
    Tune: <CalibrationIcon />,
    Image: <ImageIcon />,
    Receipt: <InvoiceIcon />,
    Build: <RepairIcon />,
    FindInPage: <InspectionIcon />,
  };
  return iconMap[iconName] || <CheckIcon />;
};

// Helper function to create verification step configuration using step modules
const createVerificationStep = (stepId, caseData) => {
  const stepModule = STEP_MODULES[stepId];
  if (!stepModule) {
    console.warn(`Step module not found for: ${stepId}`);
    return null;
  }

  const statusInfo = getStepStatus(stepModule, caseData);

  return {
    id: stepModule.id,
    title: stepModule.name,
    description: stepModule.description,
    icon: getStepIcon(stepModule.icon),
    order: stepModule.order,
    ...statusInfo,
    stepModule, // Include the full step module for detailed rendering
  };
};

const VerificationSteps = ({ caseData }) => {
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [expandedSteps, setExpandedSteps] = useState(new Set());

  // Get all step modules and create verification steps
  const verificationSteps = React.useMemo(() => {
    const steps = Object.keys(STEP_MODULES)
      .map((stepId) => createVerificationStep(stepId, caseData))
      .filter((step) => step !== null) // Remove any steps that failed to create
      .sort((a, b) => a.order - b.order); // Sort by order

    return steps;
  }, [caseData]);

  // Initialize checked steps based on approved status
  React.useEffect(() => {
    const approvedSteps = new Set();
    verificationSteps.forEach((step) => {
      if (step.status === "auto-approved" || step.status === "approved") {
        approvedSteps.add(step.id);
      }
    });
    setCheckedSteps(approvedSteps);
  }, [verificationSteps]);

  // Auto-expand sections that have warnings or errors
  React.useEffect(() => {
    const autoExpandedSteps = new Set();
    verificationSteps.forEach((step) => {
      if (step.status === "auto-warning" || step.status === "declined") {
        autoExpandedSteps.add(step.id);
      }
    });
    setExpandedSteps(autoExpandedSteps);
  }, [verificationSteps]);

  const handleStepToggle = (stepId) => {
    // This function now handles agent override between Approved/Declined
    // Based on our 4-status model business rules
    const step = verificationSteps.find((s) => s.id === stepId);
    if (!step) return;

    const newCheckedSteps = new Set(checkedSteps);

    // Toggle between checked (approved) and unchecked (declined)
    if (newCheckedSteps.has(stepId)) {
      newCheckedSteps.delete(stepId);
      // Here we would call API to set status to 'Declined'
      console.log(`Setting step ${stepId} to Declined`);
    } else {
      newCheckedSteps.add(stepId);
      // Here we would call API to set status to 'Approved'
      console.log(`Setting step ${stepId} to Approved`);
    }

    setCheckedSteps(newCheckedSteps);
  };

  const handleExpandToggle = (stepId) => {
    const newExpandedSteps = new Set(expandedSteps);
    if (newExpandedSteps.has(stepId)) {
      newExpandedSteps.delete(stepId);
    } else {
      newExpandedSteps.add(stepId);
    }
    setExpandedSteps(newExpandedSteps);
  };

  // Detailed content components for each section
  const renderPartsDetails = () => (
    <Box
      sx={{
        mt: 1,
        bgcolor: "white",
        borderRadius: 2,
        border: 1,
        borderColor: "grey.200",
      }}
    >
      {/* Clean Table Layout */}
      <Box sx={{ overflow: "hidden" }}>
        {/* Header Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "40px 3fr 80px 120px 80px 120px 100px",
            bgcolor: "#f8fafc",
            borderBottom: 1,
            borderColor: "grey.200",
            py: 1.5,
            px: 2,
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          <Box></Box>
          <Typography variant="body2" fontWeight={600}>
            Article
          </Typography>
          <Typography variant="body2" fontWeight={600} textAlign="center">
            Qty
          </Typography>
          <Typography variant="body2" fontWeight={600} textAlign="right">
            Unit Price
          </Typography>
          <Typography variant="body2" fontWeight={600} textAlign="center">
            Discount
          </Typography>
          <Typography variant="body2" fontWeight={600} textAlign="right">
            Amount
          </Typography>
          <Typography variant="body2" fontWeight={600} textAlign="center">
            Status
          </Typography>
        </Box>

        {/* Data Rows */}
        {caseData.orderLines?.map((orderLine, index) => (
          <Box
            key={orderLine.id || index}
            sx={{
              display: "grid",
              gridTemplateColumns: "40px 3fr 80px 120px 80px 120px 100px",
              py: 2,
              px: 2,
              borderBottom: index < caseData.orderLines.length - 1 ? 1 : 0,
              borderColor: "grey.100",
              "&:hover": {
                bgcolor: "#f8fafc",
              },
              alignItems: "center",
            }}
          >
            {/* Row number/icon */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: orderLine.priceAgreementResponse?.isSuccessfull
                    ? "success.light"
                    : "warning.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color={
                    orderLine.priceAgreementResponse?.isSuccessfull
                      ? "success.dark"
                      : "warning.dark"
                  }
                >
                  {index + 1}
                </Typography>
              </Box>
            </Box>

            {/* Article */}
            <Box>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 0.25 }}>
                {orderLine.priceAgreementResponse?.newCategory || "Reparasjon"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {orderLine.articleNumber}
              </Typography>
              {orderLine.foundOEM && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  OEM: {orderLine.foundOEM}
                </Typography>
              )}
            </Box>

            {/* Quantity */}
            <Typography variant="body2" textAlign="center">
              {orderLine.quantity}
            </Typography>

            {/* Unit Price */}
            <Typography variant="body2" textAlign="right">
              {orderLine.articlePrice?.toLocaleString()} NOK
            </Typography>

            {/* Discount */}
            <Box sx={{ textAlign: "center" }}>
              {orderLine.discountPercent > 0 ? (
                <Chip
                  label={`-${orderLine.discountPercent}%`}
                  size="small"
                  color="success"
                  sx={{ fontSize: "0.75rem", height: 20 }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
              )}
            </Box>

            {/* Amount */}
            <Typography variant="body2" fontWeight={600} textAlign="right">
              {orderLine.total?.toLocaleString()} NOK
            </Typography>

            {/* Status */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Chip
                label={
                  orderLine.priceAgreementResponse?.comment?.status || "Pending"
                }
                size="small"
                color={
                  orderLine.priceAgreementResponse?.comment?.status ===
                  "Approved"
                    ? "success"
                    : orderLine.priceAgreementResponse?.comment?.status ===
                      "Declined"
                    ? "error"
                    : "warning"
                }
                sx={{ fontSize: "0.75rem", height: 22, minWidth: 70 }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Enhanced Summary Section with Norwegian calculations */}
      <Box
        sx={{ bgcolor: "#f8fafc", borderTop: 1, borderColor: "grey.200", p: 3 }}
      >
        <Box sx={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
          {/* Left Column: Price Comparison (Informational) */}
          {caseData.approvedTotals?.priceComparison && (
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ mb: 2, color: "text.secondary" }}
              >
                Total Pris (Markedsinfo)
              </Typography>

              {/* Minimum */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Minimum:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="text.secondary"
                >
                  {caseData.approvedTotals.priceComparison.minimum?.toLocaleString()}{" "}
                  NOK
                </Typography>
              </Box>

              {/* Maximum */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Maksimum:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="text.secondary"
                >
                  {caseData.approvedTotals.priceComparison.maximum?.toLocaleString()}{" "}
                  NOK
                </Typography>
              </Box>

              {/* Count */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Antall:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="text.secondary"
                >
                  {caseData.approvedTotals.priceComparison.count}
                </Typography>
              </Box>

              {/* Average */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Gjennomsnitt:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="text.secondary"
                >
                  {caseData.approvedTotals.priceComparison.average?.toLocaleString()}{" "}
                  NOK
                </Typography>
              </Box>
            </Box>
          )}

          {/* Right Column: Calculation Breakdown (Agent Focus) */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ mb: 2, color: "primary.main" }}
            >
              Calculation Breakdown
            </Typography>

            {/* Sum */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" fontWeight={500}>
                Sum:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {caseData.orderLines
                  ?.reduce((sum, orderLine) => sum + (orderLine.total || 0), 0)
                  .toLocaleString()}{" "}
                NOK
              </Typography>
            </Box>

            {/* MVA-pliktig kunde (VAT liable customer) */}
            {caseData.requiresVAT && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" fontWeight={500}>
                  MVA-pliktig kunde:
                </Typography>
                <Typography variant="body2" fontWeight={600} color="error.main">
                  {(
                    caseData.orderLines?.reduce(
                      (sum, orderLine) => sum + (orderLine.total || 0),
                      0
                    ) * 0.25
                  ).toLocaleString()}{" "}
                  NOK
                </Typography>
              </Box>
            )}

            {/* Egenandel (Deductible) - Always show for this case */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" fontWeight={500}>
                Egenandel:
              </Typography>
              <Typography variant="body2" fontWeight={600} color="warning.main">
                -
                {(
                  caseData.approvedTotals?.deductible || 3000
                )?.toLocaleString()}{" "}
                NOK
              </Typography>
            </Box>

            {/* Til forsikring (To insurance) */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
                pt: 1,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="body1" fontWeight={600}>
                Til forsikring:
              </Typography>
              <Typography variant="body1" fontWeight={700} color="success.main">
                {(
                  caseData.approvedTotals?.amountToInsurance ||
                  (caseData.orderLines?.reduce(
                    (sum, orderLine) => sum + (orderLine.total || 0),
                    0
                  ) || 0) - 3000
                )?.toLocaleString()}{" "}
                NOK
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Total with border */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            Total:{" "}
            {(
              caseData.orderLines?.reduce(
                (sum, orderLine) => sum + (orderLine.total || 0),
                0
              ) * (caseData.requiresVAT ? 1.25 : 1)
            ).toLocaleString()}{" "}
            NOK
          </Typography>

          {/* Note about price guidance */}
          {caseData.approvedTotals?.priceComparison && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              IRIS gjør det nå lettere å velge riktig rute med autosøk på OEM og
              Eurokode. Det kan også søkes på en del leverandørkoder. Dersom et
              rutenummer ikke finnes, kan det manuelt legges inn.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Status alerts */}
      {caseData.orderLines?.some(
        (orderLine) => !orderLine.priceAgreementResponse?.isSuccessfull
      ) && (
        <Alert severity="warning" sx={{ m: 2, mb: 0 }}>
          Some items require approval before proceeding
        </Alert>
      )}
    </Box>
  );

  // Generic function to render step content based on step module configuration
  const renderStepContent = (step) => {
    const { stepModule } = step;
    const dataFields = stepModule.dataFields || {};
    const fieldLabels = stepModule.fieldLabels || {};

    // Get field values from case data
    const fieldValues = Object.entries(dataFields).map(
      ([fieldKey, fieldPath]) => ({
        key: fieldKey,
        label: fieldLabels[fieldKey] || fieldKey,
        value: getFieldValue(caseData, fieldPath) || "N/A",
      })
    );

    // Split into four columns for even better horizontal space usage
    const fieldsPerColumn = Math.ceil(fieldValues.length / 4);
    const column1 = fieldValues.slice(0, fieldsPerColumn);
    const column2 = fieldValues.slice(fieldsPerColumn, fieldsPerColumn * 2);
    const column3 = fieldValues.slice(fieldsPerColumn * 2, fieldsPerColumn * 3);
    const column4 = fieldValues.slice(fieldsPerColumn * 3);

    return (
      <Box sx={{ mt: 1, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            {column1.map((field) => (
              <InfoRow
                key={field.key}
                label={field.label}
                value={field.value}
              />
            ))}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {column2.map((field) => (
              <InfoRow
                key={field.key}
                label={field.label}
                value={field.value}
              />
            ))}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {column3.map((field) => (
              <InfoRow
                key={field.key}
                label={field.label}
                value={field.value}
              />
            ))}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {column4.map((field) => (
              <InfoRow
                key={field.key}
                label={field.label}
                value={field.value}
              />
            ))}
          </Grid>
        </Grid>
      </Box>
    );
  };

  const getDetailContent = (stepId) => {
    // Special case for parts_labor step - use custom render function
    if (stepId === "parts_labor") {
      return renderPartsDetails();
    }

    // Find the step in our verification steps array
    const step = verificationSteps.find((s) => s.id === stepId);
    if (!step) return null;

    // Use the generic step content renderer for modular steps
    return renderStepContent(step);
  };

  const completedSteps = checkedSteps.size;
  const totalSteps = verificationSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardHeader
        title="Case Verification Checklist"
        subheader={`${completedSteps} of ${totalSteps} steps completed`}
        action={
          <Chip
            label={`${Math.round(progressPercentage)}% Complete`}
            color={progressPercentage === 100 ? "success" : "primary"}
            variant={progressPercentage === 100 ? "filled" : "outlined"}
            size="small"
          />
        }
        sx={{ pb: 1, px: 3, pt: 3 }}
      />
      <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
          color={progressPercentage === 100 ? "success" : "primary"}
        />

        <List>
          {verificationSteps.map((step, index) => {
            const isChecked = checkedSteps.has(step.id);
            const isExpanded = expandedSteps.has(step.id);
            const statusColor =
              step.chipColor === "success"
                ? "success.main"
                : step.chipColor === "error"
                ? "error.main"
                : "warning.main";

            return (
              <Box key={step.id}>
                <ListItem
                  divider={index < verificationSteps.length - 1 && !isExpanded}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "grey.50" },
                    bgcolor: isExpanded ? "grey.25" : "transparent",
                    py: 2,
                    px: 3,
                    minHeight: 72,
                  }}
                  onClick={() => handleExpandToggle(step.id)}
                >
                  <ListItemIcon sx={{ minWidth: 56 }}>
                    <Avatar
                      sx={{
                        bgcolor: isChecked ? "success.main" : statusColor,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {React.cloneElement(step.icon, { fontSize: "medium" })}
                    </Avatar>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ fontSize: "1.1rem" }}
                        >
                          {step.title}
                        </Typography>
                        <StatusChip
                          label={step.chipLabel}
                          status={step.chipLabel}
                          isEditable={!step.isReadOnly}
                          onClick={
                            step.isReadOnly
                              ? undefined
                              : () =>
                                  console.log(`Edit status for ${step.title}`)
                          }
                        />
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {step.description}
                      </Typography>
                    }
                  />

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      sx={{ color: "text.secondary" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isExpanded ? (
                        <ExpandMoreIcon sx={{ transform: "rotate(180deg)" }} />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStepToggle(step.id);
                          }}
                          icon={<UncheckedIcon />}
                          checkedIcon={<CheckIcon />}
                          color="success"
                          size="small"
                        />
                      }
                      label=""
                      onClick={(e) => e.stopPropagation()}
                      sx={{ m: 0 }}
                    />
                  </Box>
                </ListItem>

                {isExpanded && (
                  <Box
                    sx={{
                      px: 2,
                      pb: 1.5,
                      borderBottom:
                        index < verificationSteps.length - 1
                          ? "1px solid"
                          : "none",
                      borderColor: "divider",
                      animation: "fadeIn 0.3s ease-in-out",
                    }}
                  >
                    {getDetailContent(step.id)}
                  </Box>
                )}
              </Box>
            );
          })}
        </List>

        {progressPercentage === 100 && (
          <Alert severity="success" sx={{ m: 2, mt: 1 }}>
            <Typography variant="body2">
              All verification steps completed! Case is ready for final
              approval.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

// Constants for status options
const STATUS_OPTIONS = [
  { value: "Open", label: "Open", color: "info" },
  { value: "Pending Approval", label: "Pending Approval", color: "warning" },
  { value: "ReadyForApproval", label: "Ready for Approval", color: "warning" },
  { value: "Invoice Flow", label: "Waiting Invoice", color: "info" },
  { value: "Waiting Payment", label: "Waiting Payment", color: "primary" },
  { value: "InvoiceApproved", label: "Invoice Approved", color: "success" },
  { value: "Failed", label: "Failed", color: "error" },
  { value: "Completed", label: "Completed", color: "success" },
];

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("no-NO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const dateStr = formatDate(dateString);
  const timeStr = date.toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${dateStr} ${timeStr}`;
};

const CaseHeader = ({ caseData }) => {
  const [currentStatus, setCurrentStatus] = useState(caseData.status);

  const handleStatusChange = (event) => {
    setCurrentStatus(event.target.value);
    console.log("Status changed to:", event.target.value);
    // TODO: Update case status in backend
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1, // Reduced padding from 2 to 1
        mb: 1, // Reduced margin bottom from 2 to 1
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderBottomColor: "divider",
      }}
    >
      {/* Top Row: Case Title and Status */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ bgcolor: "primary.main", mr: 1.5, width: 36, height: 36 }}
          >
            <CarIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1">
              Case #{caseData.caseNumber}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {caseData.vehicle?.brandName} {caseData.vehicle?.model} (
              {caseData.vehicle?.firstRegistered
                ? new Date(caseData.vehicle.firstRegistered).getFullYear()
                : "N/A"}
              )
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            mr: -2.5, // Negative margin to offset Paper padding
            pr: 2.5, // Add padding back for content
          }}
        >
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={currentStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StatusChip
                      label={option.label}
                      status={option.label}
                      size="small"
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Single Row: Case Information */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 2 },
          width: "100%",
          py: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          {/* Headers Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              mb: 0.5,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                flex: "0 0 12%",
                textAlign: "center",
              }}
            >
              VRN
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                flex: "0 0 14%",
                textAlign: "center",
              }}
            >
              Incident Date
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                flex: "0 0 10%",
                textAlign: "center",
              }}
            >
              Job Type
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                flex: "0 0 12%",
                textAlign: "center",
              }}
            >
              Coverage
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                flex: "0 0 14%",
                textAlign: "center",
              }}
            >
              Deductible
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                flex: "0 0 8%",
                textAlign: "center",
              }}
            >
              VAT
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                flex: "0 0 15%",
                textAlign: "center",
              }}
            >
              Workshop
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                flex: "0 0 15%",
                textAlign: "center",
              }}
            >
              Last Updated
            </Typography>
          </Box>

          {/* Values Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                flex: "0 0 12%",
                textAlign: "center",
              }}
            >
              {caseData.vehicle?.vehicleLicenseNumber || "N/A"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                flex: "0 0 14%",
                textAlign: "center",
              }}
            >
              {caseData.dateOfIncident
                ? new Date(caseData.dateOfIncident).toLocaleDateString()
                : "N/A"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                flex: "0 0 10%",
                textAlign: "center",
              }}
            >
              {caseData.jobType || "N/A"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                flex: "0 0 12%",
                textAlign: "center",
              }}
            >
              {caseData.insuranceInformation?.coverage?.hasGlassCoverage
                ? "Covered"
                : "Not Covered"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                flex: "0 0 14%",
                textAlign: "center",
              }}
            >
              {caseData.insuranceInformation?.coverage?.deductible
                ? `${caseData.insuranceInformation.coverage.deductible} ${
                    caseData.insuranceInformation.coverage.deductibleCurrency ||
                    "NOK"
                  }`
                : "N/A"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                flex: "0 0 8%",
                textAlign: "center",
              }}
            >
              {caseData.requiresVAT ? "Yes" : "No"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                flex: "0 0 15%",
                textAlign: "center",
              }}
            >
              {caseData.workshop?.name || "N/A"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                flex: "0 0 15%",
                textAlign: "center",
              }}
            >
              {caseData.lastModified
                ? formatDateTime(caseData.lastModified)
                : caseData.registrationDate
                ? formatDateTime(caseData.registrationDate)
                : "N/A"}{" "}
              by {caseData.caseWorker?.name || "System"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

const CaseDetails = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(() => getCaseById(id));

  if (!caseData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Case not found</Alert>
      </Box>
    );
  }

  // Handlers for activity log
  const handleAddComment = (comment) => {
    setCaseData((prevData) => ({
      ...prevData,
      publicComments: [...(prevData.publicComments || []), comment],
      // Also add to activity log
      activityLog: [
        ...(prevData.activityLog || []),
        {
          timestamp: comment.timestamp,
          actor: comment.author,
          action: `Added public comment: "${comment.content}"`,
          type: "comment",
          details: "Visible to workshop",
        },
      ],
    }));
  };

  const handleAddNote = (note) => {
    setCaseData((prevData) => ({
      ...prevData,
      internalNotes: [...(prevData.internalNotes || []), note],
      // Also add to activity log
      activityLog: [
        ...(prevData.activityLog || []),
        {
          timestamp: note.timestamp,
          actor: note.author,
          action: `Added internal note: "${note.content}"`,
          type: "note",
          details: "Internal only",
        },
      ],
    }));
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1400px",
        mx: "auto",
        pt: 0, // Remove top padding completely
        px: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <CaseHeader caseData={caseData} />

      {/* Verification Steps Section with Expandable Details */}
      <VerificationSteps caseData={caseData} />

      {/* Activity Log and Notes Section */}
      <ActivityLog
        caseData={caseData}
        onAddComment={handleAddComment}
        onAddNote={handleAddNote}
      />
    </Box>
  );
};

export default CaseDetails;
