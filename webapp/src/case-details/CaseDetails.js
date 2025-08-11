import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Tooltip,
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
  Button,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  DirectionsCar as CarIcon,
  Security as InsuranceIcon,
  Build as RepairIcon,
  Assignment as ReportIcon,
  CheckCircle as CheckIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  FindInPage as InspectionIcon,
  AttachMoney as PricingIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from "@mui/icons-material";
import { getCaseById, sampleCases } from "../sample-data/sampleCases";

// Helper component for information rows
const InfoRow = ({ label, value, highlight = false }) => (
  <Box sx={{ mb: 1 }}>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontSize: "0.75rem", mb: 0.25 }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      fontWeight={highlight ? 700 : 600}
      color={highlight ? "primary.main" : "inherit"}
    >
      {value}
    </Typography>
  </Box>
);

// Helper function to create verification step configuration
const createVerificationStep = (id, title, description, icon, caseData) => {
  const stepConfigs = {
    vehicle_verification: {
      status:
        caseData.vehicle?.brandName && caseData.vehicle?.vin
          ? "success"
          : "warning",
      autoCheck: !!(caseData.vehicle?.brandName && caseData.vehicle?.vin),
      chipLabel:
        caseData.vehicle?.brandName && caseData.vehicle?.vin
          ? "Auto-verified"
          : "Pending",
      chipColor:
        caseData.vehicle?.brandName && caseData.vehicle?.vin
          ? "success"
          : "warning",
    },
    insurance_validation: {
      status: caseData.coverageStatus === "Approved"
        ? "success"
        : caseData.coverageStatus === "Declined" 
        ? "error" 
        : "warning",
      autoCheck: caseData.coverageStatus === "Approved",
      chipLabel: caseData.coverageStatus === "Approved"
        ? "Auto-verified"
        : caseData.coverageStatus === "Declined"
        ? "No Coverage"
        : "Pending",
      chipColor: caseData.coverageStatus === "Approved"
        ? "success"
        : caseData.coverageStatus === "Declined"
        ? "error"
        : "warning",
    },
    damage_assessment: {
      status:
        caseData.images?.length > 0 && caseData.dateOfIncident
          ? "success"
          : "warning",
      autoCheck: caseData.images?.length > 0 && caseData.dateOfIncident,
      chipLabel:
        caseData.images?.length > 0 && caseData.dateOfIncident
          ? "Auto-verified"
          : "Pending",
      chipColor:
        caseData.images?.length > 0 && caseData.dateOfIncident
          ? "success"
          : "warning",
    },
    customer_verification: {
      status:
        caseData.damageFormSignatureStatus === "SignedByCustomer"
          ? "success"
          : "warning",
      autoCheck: caseData.damageFormSignatureStatus === "SignedByCustomer",
      chipLabel:
        caseData.damageFormSignatureStatus === "SignedByCustomer"
          ? "Auto-verified"
          : "Pending",
      chipColor:
        caseData.damageFormSignatureStatus === "SignedByCustomer"
          ? "success"
          : "warning",
    },
    parts_approval: {
      status: caseData.orderLinesStatus === "Approved"
        ? "success"
        : caseData.orderLinesStatus === "Declined"
        ? "error"
        : "warning",
      autoCheck: caseData.orderLinesStatus === "Approved",
      chipLabel: caseData.orderLinesStatus === "Approved"
        ? "Approved"
        : caseData.orderLinesStatus === "Declined"
        ? "Declined"
        : "Pending",
      chipColor: caseData.orderLinesStatus === "Approved"
        ? "success"
        : caseData.orderLinesStatus === "Declined"
        ? "error"
        : "warning",
    },
    calibration_check: {
      status:
        caseData.adasStatus === "NotRequired" ||
        caseData.adasStatus === "Completed"
          ? "success"
          : caseData.adasStatus === "MustBeChecked" ||
            caseData.adasStatus === "Required"
          ? "warning"
          : "error",
      autoCheck:
        caseData.adasStatus === "NotRequired" ||
        caseData.adasStatus === "Completed",
      chipLabel:
        caseData.adasStatus === "NotRequired"
          ? "Auto-verified"
          : caseData.adasStatus === "Completed"
          ? "Approved"
          : caseData.adasStatus === "MustBeChecked" ||
            caseData.adasStatus === "Required"
          ? "Pending"
          : "Failed",
      chipColor:
        caseData.adasStatus === "NotRequired" ||
        caseData.adasStatus === "Completed"
          ? "success"
          : caseData.adasStatus === "MustBeChecked" ||
            caseData.adasStatus === "Required"
          ? "warning"
          : "error",
    },
    documentation: {
      status: caseData.status === "InvoiceApproved" ? "success" : "warning",
      autoCheck: caseData.status === "InvoiceApproved",
      chipLabel: caseData.status === "InvoiceApproved" ? "Approved" : "Pending",
      chipColor: caseData.status === "InvoiceApproved" ? "success" : "warning",
    },
  };

  return {
    id,
    title,
    description,
    icon,
    ...stepConfigs[id],
  };
};

const VerificationSteps = ({ caseData }) => {
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [expandedSteps, setExpandedSteps] = useState(new Set());

  const verificationSteps = React.useMemo(
    () => [
      createVerificationStep(
        "vehicle_verification",
        "Vehicle Identification Verification",
        "VIN number, registration documents, ownership verification",
        <CarIcon />,
        caseData
      ),
      createVerificationStep(
        "insurance_validation",
        "Insurance Policy Validation",
        "Active policy verification, coverage confirmation",
        <InsuranceIcon />,
        caseData
      ),
      createVerificationStep(
        "damage_assessment",
        "Damage Assessment Completed",
        "Photos uploaded, inspection report, damage evaluation",
        <InspectionIcon />,
        caseData
      ),
      createVerificationStep(
        "customer_verification",
        "Customer Identity Verification",
        "ID verification, signature collection, contact confirmation",
        <PersonIcon />,
        caseData
      ),
      createVerificationStep(
        "parts_approval",
        "Parts & Labor Approval",
        "Cost estimation, parts sourcing, labor cost approval",
        <PricingIcon />,
        caseData
      ),
      createVerificationStep(
        "calibration_check",
        "Calibration Requirements",
        "ADAS systems calibration assessment and scheduling",
        <RepairIcon />,
        caseData
      ),
      createVerificationStep(
        "documentation",
        "Final Documentation",
        "All paperwork complete, signed, and filed",
        <ReportIcon />,
        caseData
      ),
    ],
    [caseData]
  );

  // Initialize checked steps based on auto-check status
  React.useEffect(() => {
    const autoCheckedSteps = new Set();
    verificationSteps.forEach((step) => {
      if (step.autoCheck) {
        autoCheckedSteps.add(step.id);
      }
    });
    setCheckedSteps(autoCheckedSteps);
  }, [verificationSteps]);

  // Auto-expand sections that have warnings or errors (non-success status)
  React.useEffect(() => {
    const autoExpandedSteps = new Set();
    verificationSteps.forEach((step) => {
      if (step.status !== "success") {
        autoExpandedSteps.add(step.id);
      }
    });
    setExpandedSteps(autoExpandedSteps);
  }, [verificationSteps]);

  const handleStepToggle = (stepId) => {
    const newCheckedSteps = new Set(checkedSteps);
    if (newCheckedSteps.has(stepId)) {
      newCheckedSteps.delete(stepId);
    } else {
      newCheckedSteps.add(stepId);
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
    <Box sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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
          <InfoRow label="VIN" value={caseData.vehicle?.vin || "N/A"} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoRow
            label="License Plate"
            value={caseData.vehicle?.vehicleLicenseNumber || "N/A"}
          />
          <InfoRow
            label="Vehicle Type"
            value={caseData.vehicle?.vehicleType || "N/A"}
          />
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
    <Box sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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
        </Grid>
        <Grid item xs={12} md={6}>
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
          <InfoRow
            label="Customer Category"
            value={caseData.insuranceInformation?.customerCategory || "N/A"}
          />
        </Grid>
      </Grid>
      {!caseData.insuranceInformation?.coverage?.hasGlassCoverage && (
        <Alert severity="error" sx={{ mt: 2 }}>
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

  const getDetailContent = (stepId) => {
    switch (stepId) {
      case "vehicle_verification":
        return renderVehicleDetails();
      case "insurance_validation":
        return renderInsuranceDetails();
      case "damage_assessment":
        return renderDamageDetails();
      case "customer_verification":
        return renderCustomerDetails();
      case "parts_approval":
        return renderPartsDetails();
      case "calibration_check":
        return renderCalibrationDetails();
      case "documentation":
        return renderDocumentationDetails();
      default:
        return null;
    }
  };

  const completedSteps = checkedSteps.size;
  const totalSteps = verificationSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <Card elevation={3} sx={{ mb: 2 }}>
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
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ pt: 0 }}>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{ mb: 2, height: 6, borderRadius: 3 }}
          color={progressPercentage === 100 ? "success" : "primary"}
        />

        <List>
          {verificationSteps.map((step, index) => {
            const isChecked = checkedSteps.has(step.id);
            const isExpanded = expandedSteps.has(step.id);
            const statusColor =
              step.status === "success" ? "success.main" : "warning.main";

            return (
              <Box key={step.id}>
                <ListItem
                  divider={index < verificationSteps.length - 1 && !isExpanded}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "grey.50" },
                    bgcolor: isExpanded ? "grey.25" : "transparent",
                    py: 1.5,
                    minHeight: 64,
                  }}
                  onClick={() => handleExpandToggle(step.id)}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Avatar
                      sx={{
                        bgcolor: isChecked ? "success.main" : statusColor,
                        width: 32,
                        height: 32,
                      }}
                    >
                      {React.cloneElement(step.icon, { fontSize: "small" })}
                    </Avatar>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
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
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState(caseData.status);

  const handleStatusChange = (event) => {
    setCurrentStatus(event.target.value);
    console.log("Status changed to:", event.target.value);
  };

  const handleNextCase = () => {
    const pendingCases = sampleCases.filter(
      (caseItem) => caseItem.status === "Pending Approval"
    );
    const currentIndex = pendingCases.findIndex(
      (caseItem) => caseItem.id === caseData.id
    );

    let nextCase;
    if (currentIndex === -1) {
      nextCase = pendingCases[0];
    } else if (currentIndex < pendingCases.length - 1) {
      nextCase = pendingCases[currentIndex + 1];
    } else {
      nextCase = pendingCases[0];
    }

    if (nextCase) {
      navigate(`/case/${nextCase.id}`);
    }
  };

  const getPendingCasesCount = () => {
    return sampleCases.filter(
      (caseItem) => caseItem.status === "Pending Approval"
    ).length;
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
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
          <Button
            variant="outlined"
            size="small"
            onClick={handleNextCase}
            disabled={getPendingCasesCount() <= 1}
          >
            Next Case ({getPendingCasesCount() - 1} pending)
          </Button>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={currentStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Chip
                    label={option.label}
                    size="small"
                    color={option.color}
                    variant="filled"
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Edit Case">
            <IconButton color="primary" size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Bottom Row: Case Information */}
      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid item xs={6} sm={3} md={2.5} lg={2}>
          <InfoRow
            label="VRN (License Plate)"
            value={caseData.vehicle?.vehicleLicenseNumber}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2.5} lg={2}>
          <InfoRow
            label="Incident Date"
            value={
              caseData.dateOfIncident
                ? new Date(caseData.dateOfIncident).toLocaleDateString()
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={6} sm={3} md={3} lg={3}>
          <InfoRow label="Workshop" value={caseData.workshop?.name} />
        </Grid>
        <Grid item xs={6} sm={3} md={4} lg={5}>
          <Box
            sx={{
              textAlign: "right",
              width: "100%",
              mr: -2.5,
              pr: 2.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Last updated: {formatDateTime(caseData.lastUpdated)}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              by {caseData.lastUpdatedBy}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const CaseDetails = () => {
  const { id } = useParams();
  const caseData = getCaseById(id);

  if (!caseData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Case not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <CaseHeader caseData={caseData} />

      {/* Verification Steps Section with Expandable Details */}
      <VerificationSteps caseData={caseData} />
    </Box>
  );
};

export default CaseDetails;
