import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
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
  ListItemSecondaryAction,
  Button,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  DirectionsCar as CarIcon,
  Security as InsuranceIcon,
  Build as RepairIcon,
  Image as ImageIcon,
  Assignment as ReportIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  FindInPage as InspectionIcon,
  AttachMoney as PricingIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from "@mui/icons-material";
import { getCaseById } from "../sample-data/sampleCases";

const VerificationSteps = ({ caseData }) => {
  const [checkedSteps, setCheckedSteps] = useState(new Set());

  const verificationSteps = React.useMemo(
    () => [
      {
        id: "vehicle_verification",
        title: "Vehicle Identification Verification",
        description:
          "VIN number, registration documents, ownership verification",
        icon: <CarIcon />,
        status: caseData.vehicle ? "success" : "warning",
        autoCheck: !!caseData.vehicle?.make,
      },
      {
        id: "insurance_validation",
        title: "Insurance Policy Validation",
        description: "Active policy verification, coverage confirmation",
        icon: <InsuranceIcon />,
        status:
          caseData.insurance && !caseData.insurance.isNewPolicy
            ? "success"
            : "warning",
        autoCheck: caseData.insurance && !caseData.insurance.isNewPolicy,
      },
      {
        id: "damage_assessment",
        title: "Damage Assessment Completed",
        description: "Photos uploaded, inspection report, damage evaluation",
        icon: <InspectionIcon />,
        status:
          caseData.images?.length > 0 && caseData.damage
            ? "success"
            : "warning",
        autoCheck: caseData.images?.length > 0 && caseData.damage,
      },
      {
        id: "customer_verification",
        title: "Customer Identity Verification",
        description:
          "ID verification, signature collection, contact confirmation",
        icon: <PersonIcon />,
        status:
          caseData.damage?.signatureStatus === "Completed"
            ? "success"
            : "warning",
        autoCheck: caseData.damage?.signatureStatus === "Completed",
      },
      {
        id: "parts_approval",
        title: "Parts & Labor Approval",
        description: "Cost estimation, parts sourcing, labor cost approval",
        icon: <PricingIcon />,
        status: caseData.parts?.every((part) => part.approved)
          ? "success"
          : "warning",
        autoCheck: caseData.parts?.every((part) => part.approved),
      },
      {
        id: "calibration_check",
        title: "Calibration Requirements",
        description: "ADAS systems calibration assessment and scheduling",
        icon: <RepairIcon />,
        status:
          !caseData.requiresCalibration || caseData.calibrationConfirmed
            ? "success"
            : "warning",
        autoCheck:
          !caseData.requiresCalibration || caseData.calibrationConfirmed,
      },
      {
        id: "documentation",
        title: "Final Documentation",
        description: "All paperwork complete, signed, and filed",
        icon: <ReportIcon />,
        status: "warning", // This would typically require manual verification
        autoCheck: false,
      },
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

  const handleStepToggle = (stepId) => {
    const newCheckedSteps = new Set(checkedSteps);
    if (newCheckedSteps.has(stepId)) {
      newCheckedSteps.delete(stepId);
    } else {
      newCheckedSteps.add(stepId);
    }
    setCheckedSteps(newCheckedSteps);
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
          />
        }
      />
      <CardContent>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
          color={progressPercentage === 100 ? "success" : "primary"}
        />

        <List>
          {verificationSteps.map((step, index) => {
            const isChecked = checkedSteps.has(step.id);
            const statusColor =
              step.status === "success" ? "success.main" : "warning.main";

            return (
              <ListItem
                key={step.id}
                divider={index < verificationSteps.length - 1}
              >
                <ListItemIcon>
                  <Avatar
                    sx={{
                      bgcolor: isChecked ? "success.main" : statusColor,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {step.icon}
                  </Avatar>
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={600}>
                      {step.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                      {step.autoCheck && (
                        <Chip
                          label="Auto-verified"
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  }
                />

                <ListItemSecondaryAction>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={() => handleStepToggle(step.id)}
                        icon={<UncheckedIcon />}
                        checkedIcon={<CheckIcon />}
                        color="success"
                      />
                    }
                    label=""
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>

        {progressPercentage === 100 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              All verification steps completed! Case is ready for final
              approval.
            </Typography>
          </Alert>
        )}

        {progressPercentage < 100 && (
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const allSteps = new Set(
                  verificationSteps.map((step) => step.id)
                );
                setCheckedSteps(allSteps);
              }}
            >
              Mark All Complete
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => setCheckedSteps(new Set())}
            >
              Reset All
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const CaseHeader = ({ caseData }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending approval":
        return "warning";
      case "invoice flow":
        return "info";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const calculateProgress = () => {
    let completed = 0;
    let total = 4;

    if (caseData.damage.signatureStatus === "Completed") completed++;
    if (caseData.parts.every((part) => part.approved)) completed++;
    if (!caseData.requiresCalibration || caseData.calibrationConfirmed)
      completed++;
    if (!caseData.insurance.isNewPolicy) completed++;

    return (completed / total) * 100;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              <CarIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1">
                Case #{caseData.id}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {caseData.vehicle.make} {caseData.vehicle.model} •{" "}
                {caseData.licensePlate}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Case Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={calculateProgress()}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              {Math.round(calculateProgress())}% Complete
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={2} alignItems="flex-end">
            <Chip
              label={caseData.status}
              color={getStatusColor(caseData.status)}
              size="large"
              sx={{ fontSize: "1rem", px: 2, py: 1 }}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Print Report">
                <IconButton color="primary">
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Send Email">
                <IconButton color="primary">
                  <EmailIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Call Customer">
                <IconButton color="primary">
                  <PhoneIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Case">
                <IconButton color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography variant="caption" color="text.secondary">
              Last updated:{" "}
              {new Date(caseData.lastUpdated).toLocaleDateString()}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

const CaseSection = ({
  title,
  status,
  icon,
  children,
  defaultExpanded = true,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      case "info":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckIcon fontSize="small" />;
      case "warning":
        return <WarningIcon fontSize="small" />;
      case "error":
        return <ErrorIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <Accordion defaultExpanded={defaultExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "grey.50",
            "&:hover": { backgroundColor: "grey.100" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            {icon && (
              <Avatar
                sx={{ bgcolor: "primary.main", mr: 2, width: 32, height: 32 }}
              >
                {icon}
              </Avatar>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Chip
              label={status}
              color={getStatusColor(status)}
              size="small"
              icon={getStatusIcon(status)}
              sx={{ ml: 2, textTransform: "capitalize" }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>{children}</AccordionDetails>
      </Accordion>
    </Card>
  );
};

const InfoRow = ({ label, value, highlight = false }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
    <Typography variant="body2" color="text.secondary">
      {label}:
    </Typography>
    <Typography
      variant="body2"
      fontWeight={highlight ? 600 : 400}
      color={highlight ? "primary.main" : "text.primary"}
    >
      {value}
    </Typography>
  </Box>
);

const PartCard = ({ part, index }) => (
  <Card
    variant="outlined"
    sx={{
      mb: 2,
      border: 2,
      borderColor: part.approved ? "success.main" : "error.main",
      "&:hover": { boxShadow: 3 },
    }}
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Typography variant="h6" component="h3">
          {part.name}
        </Typography>
        <Chip
          label={part.approved ? "Approved" : "Pending"}
          color={part.approved ? "success" : "error"}
          size="small"
        />
      </Box>

      <Typography variant="h5" color="primary.main" fontWeight="bold">
        {part.price.toLocaleString()} NOK
      </Typography>

      {part.warning && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {part.warning}
        </Alert>
      )}
    </CardContent>
  </Card>
);

const ImageCard = ({ image, index }) => (
  <Card sx={{ height: "100%" }}>
    <CardHeader
      title={image.type}
      subheader={`Image ${index + 1}`}
      action={
        image.aiWarning && (
          <Chip
            label="AI Warning"
            color="warning"
            size="small"
            icon={<WarningIcon />}
          />
        )
      }
    />
    <CardContent>
      <Box
        sx={{
          height: 200,
          backgroundColor: "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 1,
          mb: 2,
        }}
      >
        <ImageIcon sx={{ fontSize: 60, color: "grey.400" }} />
      </Box>

      {image.aiWarning && (
        <Alert severity="warning">{image.warningMessage}</Alert>
      )}
    </CardContent>
  </Card>
);

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
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      <CaseHeader caseData={caseData} />

      {/* Verification Steps Section */}
      <VerificationSteps caseData={caseData} />

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* Vehicle Information */}
            <CaseSection
              title="Vehicle Information"
              status={caseData.vehicle.year < 2010 ? "warning" : "success"}
              icon={<CarIcon />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoRow label="Make" value={caseData.vehicle.make} />
                  <InfoRow label="Model" value={caseData.vehicle.model} />
                  <InfoRow label="Year" value={caseData.vehicle.year} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow
                    label="License Plate"
                    value={caseData.licensePlate}
                    highlight
                  />
                  <InfoRow
                    label="Registration Date"
                    value={caseData.vehicle.registrationDate}
                  />
                  <InfoRow
                    label="Vehicle Value"
                    value={`${caseData.vehicle.value.toLocaleString()} NOK`}
                    highlight
                  />
                </Grid>
              </Grid>
              {caseData.vehicle.year < 2010 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Vehicle is older than 2010 - Additional verification may be
                  required
                </Alert>
              )}
            </CaseSection>

            {/* Insurance Coverage */}
            <CaseSection
              title="Insurance Coverage"
              status={caseData.insurance.isNewPolicy ? "warning" : "success"}
              icon={<InsuranceIcon />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoRow
                    label="Insurance Company"
                    value={caseData.insurance.company}
                  />
                  <InfoRow
                    label="Policy Number"
                    value={caseData.insurance.policyNumber}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow
                    label="Coverage Type"
                    value={caseData.insurance.coverage}
                  />
                  <InfoRow
                    label="Policy Status"
                    value={
                      caseData.insurance.isNewPolicy
                        ? "New Policy"
                        : "Existing Policy"
                    }
                  />
                </Grid>
              </Grid>
              {caseData.insurance.isNewPolicy && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  New Policy - Additional verification required
                </Alert>
              )}
            </CaseSection>

            {/* Damage Report */}
            <CaseSection
              title="Damage Report"
              status={
                caseData.damage.signatureStatus === "Completed"
                  ? "success"
                  : "warning"
              }
              icon={<ReportIcon />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoRow label="Damage Date" value={caseData.damage.date} />
                  <InfoRow label="Damage Type" value={caseData.damage.type} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow
                    label="Signature Status"
                    value={caseData.damage.signatureStatus}
                    highlight
                  />
                  <InfoRow label="Report" value="Available" />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Damage Description:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                >
                  {caseData.damage.description}
                </Typography>
              </Box>
              {caseData.damage.signatureStatus !== "Completed" && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Waiting for customer signature
                </Alert>
              )}
            </CaseSection>

            {/* Calibration */}
            {caseData.requiresCalibration && (
              <CaseSection
                title="Calibration"
                status={caseData.calibrationConfirmed ? "success" : "warning"}
                icon={<RepairIcon />}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoRow label="Requires Calibration" value="Yes" />
                    <InfoRow
                      label="Calibration Confirmed"
                      value={caseData.calibrationConfirmed ? "Yes" : "No"}
                    />
                  </Grid>
                </Grid>
                {!caseData.calibrationConfirmed && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Calibration appointment needs to be scheduled
                  </Alert>
                )}
              </CaseSection>
            )}
          </Stack>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Parts & Pricing */}
            <CaseSection
              title="Parts & Labor"
              status={
                caseData.parts.some((part) => !part.approved)
                  ? "error"
                  : "success"
              }
              icon={<RepairIcon />}
              defaultExpanded={true}
            >
              {caseData.parts.map((part, index) => (
                <PartCard key={index} part={part} index={index} />
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ p: 2, bgcolor: "primary.50", borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Total Estimate
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {caseData.parts
                    .reduce((sum, part) => sum + part.price, 0)
                    .toLocaleString()}{" "}
                  NOK
                </Typography>
              </Box>

              {caseData.parts.some((part) => !part.approved) && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Some parts require approval before proceeding
                </Alert>
              )}
            </CaseSection>

            {/* Images */}
            <CaseSection
              title="Case Images"
              status={
                caseData.images.some((img) => img.aiWarning)
                  ? "warning"
                  : "success"
              }
              icon={<ImageIcon />}
            >
              <Grid container spacing={2}>
                {caseData.images.map((image, index) => (
                  <Grid item xs={12} key={index}>
                    <ImageCard image={image} index={index} />
                  </Grid>
                ))}
              </Grid>
            </CaseSection>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseDetails;
