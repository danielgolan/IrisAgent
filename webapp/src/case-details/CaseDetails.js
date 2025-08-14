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

// Helper component for information rows
const InfoRow = ({ label, value, highlight = false }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontSize: "0.875rem", mb: 0.5, fontWeight: 500 }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      fontWeight={highlight ? 700 : 600}
      color={highlight ? "primary.main" : "inherit"}
      sx={{ fontSize: "0.95rem", lineHeight: 1.4 }}
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
  const renderVehicleDetails = () => (
    <Box sx={{ mt: 1, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <InfoRow label="Make" value={caseData.vehicle?.brandName || "N/A"} />
          <InfoRow label="Model" value={caseData.vehicle?.model || "N/A"} />
          <InfoRow
            label="First Registered"
            value={
              caseData.vehicle?.firstRegistered
                ? new Date(
                    caseData.vehicle.firstRegistered
                  ).toLocaleDateString()
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoRow label="VIN" value={caseData.vehicle?.vin || "N/A"} />
          <InfoRow
            label="License Plate"
            value={caseData.vehicle?.vehicleLicenseNumber || "N/A"}
          />
          <InfoRow
            label="Vehicle Type"
            value={caseData.vehicle?.vehicleType || "N/A"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoRow label="Color" value={caseData.vehicle?.color || "N/A"} />
          <InfoRow
            label="Commercial Van"
            value={caseData.vehicle?.isCommercialVan ? "Yes" : "No"}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderInsuranceDetails = () => (
    <Box sx={{ mt: 1, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <InfoRow
            label="Insurance Company"
            value={
              caseData.insuranceInformation?.insuranceProvider?.name || "N/A"
            }
          />
          <InfoRow
            label="Coverage Level"
            value={
              caseData.insuranceInformation?.coverage?.coverageLevel || "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoRow
            label="Policy Number"
            value={caseData.insuranceInformation?.policyNumber || "N/A"}
          />
          <InfoRow
            label="Glass Coverage"
            value={
              caseData.insuranceInformation?.coverage?.hasGlassCoverage
                ? "Yes"
                : "No"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoRow
            label="Deductible"
            value={
              caseData.insuranceInformation?.coverage?.deductible
                ? `${caseData.insuranceInformation.coverage.deductible} ${
                    caseData.insuranceInformation.coverage.deductibleCurrency ||
                    "NOK"
                  }`
                : "N/A"
            }
          />
          <InfoRow
            label="Customer Category"
            value={caseData.insuranceInformation?.customerCategory || "N/A"}
          />
        </Grid>
      </Grid>
      {!caseData.insuranceInformation?.coverage?.hasGlassCoverage && (
        <Alert severity="error" sx={{ mt: 3 }}>
          No glass coverage - customer will pay full amount
        </Alert>
      )}
    </Box>
  );

  const renderDamageDetails = () => (
    <Box sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoRow
            label="Incident Date"
            value={
              caseData.dateOfIncident
                ? new Date(caseData.dateOfIncident).toLocaleDateString()
                : "N/A"
            }
          />
          <InfoRow
            label="Place of Incident"
            value={caseData.placeOfIncident || "N/A"}
          />
          <InfoRow label="Cause" value={caseData.cause || "N/A"} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoRow
            label="Signature Status"
            value={caseData.damageFormSignatureStatus || "N/A"}
          />
          <InfoRow label="Job Type" value={caseData.jobType || "N/A"} />
          <InfoRow
            label="Mileage"
            value={
              caseData.mileage
                ? `${caseData.mileage.toLocaleString()} ${
                    caseData.mileageUnit || "km"
                  }`
                : "N/A"
            }
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 1.5 }}>
        <Typography variant="subtitle2" gutterBottom>
          Multiple Glasses:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            p: 1.5,
            bgcolor: "white",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.300",
          }}
        >
          {caseData.multipleGlasses?.length > 0
            ? caseData.multipleGlasses.join(", ")
            : "No multiple glass damage"}
        </Typography>
      </Box>
      {caseData.damageFormSignatureStatus !== "SignedByCustomer" && (
        <Alert severity="warning" sx={{ mt: 1.5 }}>
          Waiting for customer signature
        </Alert>
      )}
    </Box>
  );

  const renderCustomerDetails = () => (
    <Box sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoRow
            label="Legal Owner"
            value={caseData.legalOwner?.name || "N/A"}
          />
          <InfoRow
            label="Owner Phone"
            value={caseData.legalOwner?.phoneNumber || "N/A"}
          />
          <InfoRow
            label="Owner Address"
            value={
              caseData.legalOwner?.address &&
              caseData.legalOwner?.postalCode &&
              caseData.legalOwner?.postalArea
                ? `${caseData.legalOwner.address}, ${caseData.legalOwner.postalCode} ${caseData.legalOwner.postalArea}`
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoRow
            label="Contact Person"
            value={caseData.contact?.name || "N/A"}
          />
          <InfoRow
            label="Contact Phone"
            value={caseData.contact?.phoneNumber || "N/A"}
          />
          <InfoRow
            label="Signature Status"
            value={caseData.damageFormSignatureStatus || "Pending"}
          />
        </Grid>
      </Grid>
      {caseData.damageFormSignatureStatus !== "SignedByCustomer" && (
        <Alert severity="warning" sx={{ mt: 1.5 }}>
          Customer signature pending
        </Alert>
      )}
    </Box>
  );

  const renderPartsDetails = () => (
    <Box sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
      {caseData.orderLines?.map((orderLine, index) => (
        <Card
          key={orderLine.id || index}
          variant="outlined"
          sx={{
            mb: 1.5,
            border: 1,
            borderColor: orderLine.priceAgreementResponse?.isSuccessfull
              ? "success.main"
              : "error.main",
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 0.5,
              }}
            >
              <Typography variant="subtitle1" component="h3" fontWeight={600}>
                {orderLine.priceAgreementResponse?.newCategory ||
                  orderLine.articleNumber}
              </Typography>
              <Chip
                label={
                  orderLine.priceAgreementResponse?.comment?.status || "Pending"
                }
                color={
                  orderLine.priceAgreementResponse?.isSuccessfull
                    ? "success"
                    : "error"
                }
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Article: {orderLine.articleNumber} | Qty: {orderLine.quantity}
            </Typography>
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              {orderLine.total?.toLocaleString()} NOK
            </Typography>
            {orderLine.priceAgreementResponse?.comment?.text && (
              <Alert
                severity={
                  orderLine.priceAgreementResponse?.isSuccessfull
                    ? "success"
                    : "error"
                }
                sx={{ mt: 1, py: 0.5 }}
              >
                <Typography variant="body2">
                  {orderLine.priceAgreementResponse.comment.text}
                </Typography>
              </Alert>
            )}
            {orderLine.foundOEM && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                OEM: {orderLine.foundOEM}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ p: 1.5, bgcolor: "primary.50", borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Total Estimate
        </Typography>
        <Typography variant="h5" color="primary.main" fontWeight="bold">
          {caseData.orderLines
            ?.reduce((sum, orderLine) => sum + (orderLine.total || 0), 0)
            .toLocaleString()}{" "}
          NOK
        </Typography>
        {caseData.approvedTotals && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Approved Total: {caseData.approvedTotals.totalSum?.toLocaleString()}{" "}
            NOK
            {caseData.approvedTotals.deductible > 0 && (
              <span>
                {" "}
                (Deductible:{" "}
                {caseData.approvedTotals.deductible?.toLocaleString()} NOK)
              </span>
            )}
          </Typography>
        )}
      </Box>

      {caseData.orderLines?.some(
        (orderLine) => !orderLine.priceAgreementResponse?.isSuccessfull
      ) && (
        <Alert severity="error" sx={{ mt: 1.5 }}>
          Some items require approval before proceeding
        </Alert>
      )}
    </Box>
  );

  const renderCalibrationDetails = () => (
    <Box sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoRow label="ADAS Status" value={caseData.adasStatus || "N/A"} />
          <InfoRow
            label="Update Calibration"
            value={caseData.invoice?.updateKalibrering ? "Yes" : "No"}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoRow
            label="ADAS Operator"
            value={caseData.invoice?.adasOperator || "N/A"}
          />
          <InfoRow
            label="Job Execution Date"
            value={
              caseData.jobExecutionDate
                ? new Date(caseData.jobExecutionDate).toLocaleDateString()
                : "Not scheduled"
            }
          />
        </Grid>
      </Grid>
      {caseData.adasStatus === "Required" && !caseData.jobExecutionDate && (
        <Alert severity="warning" sx={{ mt: 1.5 }}>
          ADAS calibration required - appointment needs to be scheduled
        </Alert>
      )}
      {caseData.adasStatus === "MustBeChecked" && (
        <Alert severity="info" sx={{ mt: 1.5 }}>
          ADAS system must be checked before completion
        </Alert>
      )}
    </Box>
  );

  const renderDocumentationDetails = () => (
    <Box sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoRow
            label="Coverage Status"
            value={caseData.coverageStatus || "Pending"}
          />
          <InfoRow
            label="Images Status"
            value={caseData.imagesStatus || "Pending"}
          />
          <InfoRow
            label="Order Status"
            value={caseData.orderStatus || "Pending"}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoRow
            label="Invoice Status"
            value={caseData.invoiceStatus || "Pending"}
          />
          <InfoRow
            label="Order Lines Status"
            value={caseData.orderLinesStatus || "Pending"}
          />
          <InfoRow
            label="Last Modified"
            value={
              caseData.lastModified
                ? new Date(caseData.lastModified).toLocaleDateString()
                : "N/A"
            }
          />
        </Grid>
      </Grid>

      {caseData.attachments && caseData.attachments.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Attachments:
          </Typography>
          {caseData.attachments.map((attachment, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: "text.secondary", mb: 0.5 }}
            >
              • {attachment.name} ({attachment.attachmentType})
            </Typography>
          ))}
        </Box>
      )}

      {caseData.status !== "InvoiceApproved" && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Documentation requires approval before completion
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
                        <Chip
                          label={step.chipLabel}
                          size="small"
                          color={step.chipColor}
                          variant="outlined"
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
  { value: "Invoice Flow", label: "Waiting Invoice", color: "info" },
  { value: "Waiting Payment", label: "Waiting Payment", color: "primary" },
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
        p: 2,
        mb: 2,
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
                    <Chip
                      label={option.label}
                      size="small"
                      color={option.color}
                      variant="filled"
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
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: { xs: 2, sm: 3, md: 4 },
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, sm: 3, md: 4 },
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ minWidth: { xs: 120, sm: 140 } }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              VRN (License Plate)
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ fontSize: "0.95rem" }}
            >
              {caseData.vehicle?.vehicleLicenseNumber || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ minWidth: { xs: 120, sm: 140 } }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              Incident Date
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ fontSize: "0.95rem" }}
            >
              {caseData.dateOfIncident
                ? new Date(caseData.dateOfIncident).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Box>
          <Box sx={{ minWidth: { xs: 120, sm: 140 } }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              Job Type
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ fontSize: "0.95rem" }}
            >
              {caseData.jobType || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ minWidth: { xs: 120, sm: 140 } }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              Coverage Status
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ fontSize: "0.95rem" }}
            >
              {caseData.insuranceInformation?.coverage?.hasGlassCoverage
                ? "Covered"
                : "Not Covered"}
            </Typography>
          </Box>
          <Box sx={{ minWidth: { xs: 120, sm: 140 } }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              Deductible
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ fontSize: "0.95rem" }}
            >
              {caseData.insuranceInformation?.coverage?.deductible
                ? `${caseData.insuranceInformation.coverage.deductible} ${
                    caseData.insuranceInformation.coverage.deductibleCurrency ||
                    "NOK"
                  }`
                : "N/A"}
            </Typography>
          </Box>
          <Box sx={{ minWidth: { xs: 120, sm: 140 } }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.75rem" }}
            >
              VAT Required
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {caseData.requiresVAT ? "Yes" : "No"}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.75rem" }}
            >
              Workshop
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {caseData.workshop?.name || "N/A"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
          <Typography variant="caption" color="text.secondary">
            Last updated:{" "}
            {caseData.lastModified
              ? formatDateTime(caseData.lastModified)
              : caseData.registrationDate
              ? formatDateTime(caseData.registrationDate)
              : "N/A"}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            by {caseData.caseWorker?.name || "System"}
          </Typography>
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
        p: { xs: 2, sm: 3, md: 4 },
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
