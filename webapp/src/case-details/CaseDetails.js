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
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
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
  ZoomIn as ZoomInIcon,
  Close as CloseIcon,
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
      sx={{
        fontSize: "0.75rem",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        mb: 0.25,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      fontWeight={500}
      sx={{
        color: highlight ? "primary.main" : "text.primary",
        fontSize: "0.875rem",
      }}
    >
      {typeof value === "object" && value !== null
        ? JSON.stringify(value)
        : value}
    </Typography>
  </Box>
);

// Image Preview Component for Images Step
const ImagesStepContent = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Create image URL placeholder (in real app, this would be actual image URLs)
  const getImageUrl = (image) => {
    // For demo purposes, using placeholder images with better fallbacks
    const placeholderImages = {
      VehicleFront: "https://picsum.photos/400/300?random=1",
      VehicleSide: "https://picsum.photos/400/300?random=2",
      Injury: "https://picsum.photos/400/300?random=3",
      AfterRepair: "https://picsum.photos/400/300?random=4",
      Misc: "https://picsum.photos/400/300?random=5",
    };

    // Use image ID to make URLs more unique and consistent
    const imageId = image.id
      ? image.id.slice(-2)
      : Math.floor(Math.random() * 100);
    const fallbackUrl = `https://picsum.photos/400/300?random=${imageId}`;

    return placeholderImages[image.imageType] || fallbackUrl;
  };

  const isDamageImage = (image) => {
    return (
      image.feature === "damage" ||
      image.checked ||
      image.imageType === "Injury"
    );
  };

  const handleImageClick = (image, event) => {
    // Prevent event bubbling when clicking on checkbox area
    if (event.target.closest(".damage-checkbox")) {
      return;
    }
    setSelectedImage(image);
  };

  const handleDamageToggle = (imageId, event) => {
    event.stopPropagation();
    // Here you would update the image's damage status
    console.log(`Toggle damage status for image ${imageId}`);
  };

  return (
    <>
      <Box sx={{ mt: 1, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        {/* Images Grid and Upload Button */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Images Grid */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {images.length > 0 ? (
              <Grid container spacing={2}>
                {images.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={image.id || index}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        position: "relative",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                        transition: "all 0.2s ease-in-out",
                        border: 1,
                        borderColor: "grey.200",
                      }}
                      onClick={(e) => handleImageClick(image, e)}
                    >
                      {/* Damage Checkbox - positioned like production */}
                      <Box
                        className="damage-checkbox"
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          left: 8,
                          zIndex: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          bgcolor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        <Checkbox
                          checked={isDamageImage(image)}
                          onChange={(e) => handleDamageToggle(image.id, e)}
                          size="small"
                          sx={{
                            p: 0,
                            color: isDamageImage(image)
                              ? "success.main"
                              : "grey.400",
                            "&.Mui-checked": {
                              color: "success.main",
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          fontWeight={500}
                          sx={{ fontSize: "0.75rem" }}
                        >
                          Skade
                        </Typography>
                      </Box>

                      {/* Image */}
                      <Box
                        sx={{
                          width: "100%",
                          height: 180,
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: 1,
                          backgroundColor: "grey.100",
                        }}
                      >
                        {/* Actual image */}
                        <Box
                          component="img"
                          src={getImageUrl(image)}
                          alt={image.name}
                          onError={(e) => {
                            // Show fallback if image fails to load
                            e.target.style.display = "none";
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = "flex";
                          }}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />

                        {/* Fallback content - hidden by default */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: "grey.100",
                            display: "none", // Hidden by default, shown only if image fails
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <ImageIcon
                            sx={{ fontSize: "2rem", color: "grey.400", mb: 1 }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            textAlign="center"
                            sx={{ px: 1 }}
                          >
                            {image.name}
                          </Typography>
                        </Box>

                        {/* Hover overlay with zoom icon */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: "rgba(0, 0, 0, 0)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background-color 0.2s ease-in-out",
                            "&:hover": {
                              bgcolor: "rgba(0, 0, 0, 0.1)",
                              "& .zoom-icon": {
                                opacity: 1,
                              },
                            },
                          }}
                        >
                          <ZoomInIcon
                            className="zoom-icon"
                            sx={{
                              color: "white",
                              fontSize: "1.5rem",
                              opacity: 0,
                              transition: "opacity 0.2s ease-in-out",
                            }}
                          />
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 180,
                  border: 2,
                  borderStyle: "dashed",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  bgcolor: "grey.50",
                }}
              >
                <ImageIcon
                  sx={{ fontSize: "3rem", color: "grey.400", mb: 2 }}
                />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Ingen bilder lastet opp ennå
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Klikk "Legg til bilder" for å laste opp
                </Typography>
              </Box>
            )}
          </Box>

          {/* Upload Button - styled like production but with better design */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 180,
              minWidth: 160,
              border: 2,
              borderStyle: "dashed",
              borderColor: "primary.main",
              borderRadius: 2,
              bgcolor: "primary.50",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: "primary.dark",
                bgcolor: "primary.100",
                transform: "translateY(-2px)",
              },
            }}
            onClick={() => console.log("Upload images clicked")}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 48,
                height: 48,
                mb: 2,
              }}
            >
              <ImageIcon fontSize="medium" />
            </Avatar>
            <Typography
              variant="body2"
              fontWeight={600}
              color="primary.main"
              textAlign="center"
              sx={{ px: 1 }}
            >
              LEGG TIL BILDER
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 0.5, px: 1 }}
            >
              Klikk for å laste opp
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Image Detail Dialog */}
      {selectedImage && (
        <Dialog
          open={Boolean(selectedImage)}
          onClose={() => setSelectedImage(null)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ImageIcon />
              <Typography variant="h6">{selectedImage.name}</Typography>
              {isDamageImage(selectedImage) && (
                <Chip label="Skade" size="small" color="success" />
              )}
            </Box>
            <IconButton onClick={() => setSelectedImage(null)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box
              sx={{
                width: "100%",
                height: "70vh",
                backgroundImage: `url(${getImageUrl(selectedImage)})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                bgcolor: "grey.100",
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Helper function to get step status based on 4-status model
const getStepStatus = (stepModule, caseData) => {
  // First check if there's a manual status override in the case data
  const manualStatusField = stepModule.statusField || `${stepModule.id}Status`;
  const manualStatus = caseData[manualStatusField];

  // If agent has set a manual status, use it
  if (manualStatus === "approved" || manualStatus === "declined") {
    return {
      status: manualStatus,
      isReadOnly: manualStatus === "approved",
      statusChip: manualStatus === "approved" ? "success" : "error",
      label: manualStatus === "approved" ? "Approved" : "Declined",
    };
  }

  // Otherwise, apply auto-status logic from step module
  if (stepModule.statusLogic) {
    if (
      stepModule.statusLogic.autoApproved &&
      stepModule.statusLogic.autoApproved(caseData)
    ) {
      return {
        status: "auto-approved",
        isReadOnly: true,
        statusChip: "success",
        label: "Auto-approved",
      };
    }

    if (
      stepModule.statusLogic.autoWarning &&
      stepModule.statusLogic.autoWarning(caseData)
    ) {
      return {
        status: "auto-warning",
        isReadOnly: false,
        statusChip: "warning",
        label: "Auto-warning",
      };
    }
  }

  // Default to pending if no logic matches
  return {
    status: "pending",
    isReadOnly: false,
    statusChip: "default",
    label: "Pending",
  };
};

// Helper function to get step icon
const getStepIcon = (iconName) => {
  const iconMap = {
    Security: InsuranceIcon,
    Build: RepairIcon,
    Assignment: ReportIcon,
    PersonOutline: PersonIcon,
    FindInPage: InspectionIcon,
    AttachMoney: PricingIcon,
    Image: ImageIcon,
    Receipt: InvoiceIcon,
    Tune: CalibrationIcon,
    Car: CarIcon,
  };
  const IconComponent = iconMap[iconName] || ReportIcon;
  return <IconComponent />;
};

// Helper function to safely get nested object values
const getFieldValue = (obj, path) => {
  if (!path || !obj) return undefined;

  // Special handling for .length properties
  if (path.endsWith(".length")) {
    const arrayPath = path.slice(0, -7); // Remove '.length'
    const array = arrayPath
      .split(".")
      .reduce((current, key) => current?.[key], obj);
    return Array.isArray(array) ? array.length : 0;
  }

  return path.split(".").reduce((current, key) => current?.[key], obj);
};

const CaseDetails = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(() => getCaseById(id));
  // Progress state for steps
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [expandedSteps, setExpandedSteps] = useState(new Set());
  // Get all step modules and create verification steps (copied from VerificationSteps)
  const verificationSteps = React.useMemo(() => {
    const steps = Object.keys(STEP_MODULES)
      .map((stepId) => createVerificationStep(stepId, caseData))
      .filter((step) => step !== null)
      .sort((a, b) => a.order - b.order);
    return steps;
  }, [caseData]);
  const completedSteps = checkedSteps.size;
  const totalSteps = verificationSteps.length;
  const progressPercentage =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

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
      <CaseHeader caseData={caseData} progressPercentage={progressPercentage} />

      {/* Verification Steps Section with Expandable Details */}
      <VerificationSteps
        caseData={caseData}
        checkedSteps={checkedSteps}
        setCheckedSteps={setCheckedSteps}
        expandedSteps={expandedSteps}
        setExpandedSteps={setExpandedSteps}
        completedSteps={completedSteps}
        totalSteps={totalSteps}
        progressPercentage={progressPercentage}
      />

      {/* Activity Log and Notes Section */}
      <ActivityLog
        caseData={caseData}
        onAddComment={handleAddComment}
        onAddNote={handleAddNote}
      />
    </Box>
  );
};

// Helper function to create verification step objects
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

const VerificationSteps = ({
  caseData,
  checkedSteps,
  setCheckedSteps,
  expandedSteps,
  setExpandedSteps,
  completedSteps,
  totalSteps,
  progressPercentage,
}) => {
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
  }, [verificationSteps, setCheckedSteps]);

  // Auto-expand sections that have warnings or errors
  React.useEffect(() => {
    const autoExpandedSteps = new Set();
    verificationSteps.forEach((step) => {
      if (step.status === "auto-warning" || step.status === "declined") {
        autoExpandedSteps.add(step.id);
      }
    });
    setExpandedSteps(autoExpandedSteps);
  }, [verificationSteps, setExpandedSteps]);

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

    // Special case for images step - use images preview component
    if (stepId === "images") {
      return <ImagesStepContent images={caseData.images} />;
    }

    // Find the step in our verification steps array
    const step = verificationSteps.find((s) => s.id === stepId);
    if (!step) return null;

    // Use the generic step content renderer for modular steps
    return renderStepContent(step);
  };

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
  { value: "ForApproval", label: "For Approval", color: "warning" },
  { value: "AwaitingInvoice", label: "Awaiting Invoice", color: "info" },
  { value: "InvoiceControl", label: "Invoice Control", color: "primary" },
  { value: "InvoiceApproved", label: "Invoice Approved", color: "success" },
  { value: "ApprovedArchived", label: "Approved Archived", color: "success" },
  { value: "RejectedArchived", label: "Rejected Archived", color: "error" },
];

// Helper function to get next status and determine if buttons should be shown
const getStatusTransition = (currentStatus, caseData) => {
  const hasInvoice =
    caseData.invoice ||
    (caseData.attachments &&
      caseData.attachments.some((att) => att.attachmentType === "Invoice"));

  switch (currentStatus) {
    case "ForApproval":
      return {
        nextStatus: hasInvoice ? "InvoiceControl" : "AwaitingInvoice",
        nextStatusLabel: hasInvoice ? "Invoice Control" : "Awaiting Invoice",
        showButtons: true,
        canReject: true,
      };
    case "AwaitingInvoice":
      return {
        nextStatus: "InvoiceControl",
        nextStatusLabel: "Invoice Control",
        showButtons: hasInvoice,
        canReject: true,
      };
    case "InvoiceControl":
      return {
        nextStatus: "InvoiceApproved",
        nextStatusLabel: "Invoice Approved",
        showButtons: true,
        canReject: true,
      };
    case "InvoiceApproved":
      return {
        nextStatus: "ApprovedArchived",
        nextStatusLabel: "Approved Archived",
        showButtons: true,
        canReject: true,
      };
    case "ApprovedArchived":
    case "RejectedArchived":
      return {
        showButtons: false,
        canReject: false,
      };
    default:
      return {
        showButtons: false,
        canReject: false,
      };
  }
};

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

const CaseHeader = ({ caseData, progressPercentage }) => {
  const [currentStatus, setCurrentStatus] = useState(caseData.status);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState("");

  const handleNextStatus = () => {
    const transition = getStatusTransition(currentStatus, caseData);
    if (transition.nextStatus) {
      setCurrentStatus(transition.nextStatus);
      console.log("Status changed to:", transition.nextStatus);
      // TODO: Update case status in backend
    }
  };

  const handleReject = () => {
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (rejectComment.trim()) {
      setCurrentStatus("Open");
      console.log("Status changed to: Open, Comment:", rejectComment);
      // TODO: Update case status in backend with comment
      setRejectDialogOpen(false);
      setRejectComment("");
    }
  };

  const handleRejectCancel = () => {
    setRejectDialogOpen(false);
    setRejectComment("");
  };

  const statusTransition = getStatusTransition(currentStatus, caseData);
  const currentStatusOption = STATUS_OPTIONS.find(
    (option) => option.value === currentStatus
  );

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
          {/* Current Status Display */}
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Status:
          </Typography>
          <Chip
            label={currentStatusOption?.label || currentStatus}
            color={currentStatusOption?.color || "default"}
            size="medium"
            sx={{
              mr: 2,
              fontWeight: 600,
              borderRadius: 2,
              px: 1,
              transition: "all 0.3s ease-in-out",
              "& .MuiChip-label": {
                px: 2,
              },
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: (theme) =>
                  `0 2px 8px ${
                    theme.palette[currentStatusOption?.color || "primary"].main
                  }33`,
              },
            }}
          />

          {/* Status Transition Buttons */}
          {statusTransition.showButtons && (
            <>
              <Button
                variant="contained"
                color="success"
                size="medium"
                onClick={handleNextStatus}
                disabled={!statusTransition.nextStatus}
                sx={{
                  minWidth: 160,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  boxShadow: "0 2px 8px rgba(46, 125, 50, 0.3)",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(46, 125, 50, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Move to {statusTransition.nextStatusLabel}
              </Button>
              {statusTransition.canReject && (
                <Button
                  variant="outlined"
                  color="error"
                  size="medium"
                  onClick={handleReject}
                  sx={{
                    minWidth: 120,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      backgroundColor: "rgba(211, 47, 47, 0.04)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Move to Open
                </Button>
              )}
            </>
          )}
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

      {/* Progress Bar at Bottom */}
      <Box sx={{ mt: 2, mb: 0 }}>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{ height: 8, borderRadius: 4, width: "100%" }}
          color={progressPercentage === 100 ? "success" : "primary"}
        />
      </Box>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleRejectCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="div">
            Reject Case to Workshop
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Please provide a reason for rejecting this case back to the workshop
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            label="Rejection Reason"
            placeholder="Describe what needs to be fixed or improved..."
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleRejectCancel}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectConfirm}
            variant="contained"
            color="error"
            disabled={!rejectComment.trim()}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              ml: 1,
            }}
          >
            Reject to Workshop
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CaseDetails;
