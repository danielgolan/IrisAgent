import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Grid,
  IconButton,
  Link,
} from "@mui/material";
import {
  UploadFile as UploadFileIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

const InvoiceStepContent = ({ caseData, isApproved = false }) => {
  const [isInvoiceUploading, setIsInvoiceUploading] = useState(false);
  const [invoiceUploadResponse, setInvoiceUploadResponse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  // Check if there's already an invoice uploaded
  const hasInvoice =
    caseData.attachments?.some((att) => att.attachmentType === "Invoice") ||
    caseData.invoice;
  const invoiceApiResponse = caseData.invoiceApiResponse;

  // Use the checkbox status to determine if invoice is approved (not the invoiceStatus field)
  // isApproved comes from the step checkbox in the verification process

  // Get current invoice data - extract the 5 required fields
  const invoiceData = {
    caseID: caseData.id || caseData.caseNumber || "-",
    vehicleLicenseNumber: caseData.vehicle?.vehicleLicenseNumber || "-",
    senderOrganizationNumber:
      caseData.caseWorker?.organizationName || caseData.caseWorker?.id || "-",
    totalAmount:
      caseData.invoice?.totalSum || caseData.approvedTotals?.totalSum || 0,
    recipientName: caseData.legalOwner?.name || "-",
  };

  // Initialize edited data with current values
  React.useEffect(() => {
    if (!isEditing) {
      setEditedData({
        caseID: caseData.id || caseData.caseNumber || "-",
        vehicleLicenseNumber: caseData.vehicle?.vehicleLicenseNumber || "-",
        senderOrganizationNumber:
          caseData.caseWorker?.organizationName ||
          caseData.caseWorker?.id ||
          "-",
        totalAmount:
          caseData.invoice?.totalSum || caseData.approvedTotals?.totalSum || 0,
        recipientName: caseData.legalOwner?.name || "-",
      });
    }
  }, [isEditing, caseData]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(invoiceData);
  };

  const handleSave = () => {
    // Update the case data immediately (in state)
    // In a real app, this would trigger an API call
    console.log("Saving invoice data:", editedData);
    setIsEditing(false);
    // Here you would normally update the parent component's state or make an API call
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(invoiceData);
  };

  const handleFieldChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generate fake PDF download URL
  const pdfDownloadUrl = `https://example.com/invoices/${
    caseData.id || "sample"
  }.pdf`;

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsInvoiceUploading(true);

    try {
      // Simulate API call for invoice validation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate different responses based on file name or random
      const fileName = file.name.toLowerCase();
      let mockResponse;

      if (fileName.includes("correct") || fileName.includes("approved")) {
        mockResponse = {
          status: "approved",
          message:
            "Invoice validated successfully. All amounts and details match the case requirements.",
          validatedAmount: caseData.approvedTotals?.totalSum || 750,
          issues: [],
        };
      } else if (fileName.includes("wrong") || fileName.includes("error")) {
        mockResponse = {
          status: "error",
          message:
            "Invoice validation failed. Please review and upload a corrected invoice.",
          expectedAmount: caseData.approvedTotals?.totalSum || 750,
          actualAmount: (caseData.approvedTotals?.totalSum || 750) + 100,
          issues: [
            "Invoice amount does not match approved total",
            "Missing required VAT breakdown",
          ],
        };
      } else {
        // Random response for demo
        const isApproved = Math.random() > 0.5;
        mockResponse = isApproved
          ? {
              status: "approved",
              message:
                "Invoice validated successfully. All amounts and details match the case requirements.",
              validatedAmount: caseData.approvedTotals?.totalSum || 750,
              issues: [],
            }
          : {
              status: "warning",
              message:
                "Invoice requires manual review. Minor discrepancies detected.",
              expectedAmount: caseData.approvedTotals?.totalSum || 750,
              actualAmount: (caseData.approvedTotals?.totalSum || 750) - 50,
              issues: [
                "Invoice date is outside expected range",
                "Customer information formatting differs",
              ],
            };
      }

      setInvoiceUploadResponse(mockResponse);
    } catch (error) {
      setInvoiceUploadResponse({
        status: "error",
        message: "Upload failed. Please try again.",
        issues: ["Network error or file processing failed"],
      });
    } finally {
      setIsInvoiceUploading(false);
    }
  };

  const renderInvoiceFields = () => {
    const currentData = isEditing ? editedData : invoiceData;

    return (
      <Grid container spacing={2} sx={{ alignItems: "center", mb: 2 }}>
        {/* Case ID */}
        <Grid item xs={2}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              Case ID
            </Typography>
            {isEditing && !isApproved ? (
              <TextField
                size="small"
                value={currentData.caseID}
                onChange={(e) => handleFieldChange("caseID", e.target.value)}
                variant="outlined"
                fullWidth
              />
            ) : (
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontSize: "0.875rem" }}
              >
                {currentData.caseID}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Vehicle License Number */}
        <Grid item xs={2}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              Vehicle License
            </Typography>
            {isEditing && !isApproved ? (
              <TextField
                size="small"
                value={currentData.vehicleLicenseNumber}
                onChange={(e) =>
                  handleFieldChange("vehicleLicenseNumber", e.target.value)
                }
                variant="outlined"
                fullWidth
              />
            ) : (
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontSize: "0.875rem" }}
              >
                {currentData.vehicleLicenseNumber}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Sender Organization */}
        <Grid item xs={2}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              Sender Organization
            </Typography>
            {isEditing && !isApproved ? (
              <TextField
                size="small"
                value={currentData.senderOrganizationNumber}
                onChange={(e) =>
                  handleFieldChange("senderOrganizationNumber", e.target.value)
                }
                variant="outlined"
                fullWidth
              />
            ) : (
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontSize: "0.875rem" }}
              >
                {currentData.senderOrganizationNumber}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Total Amount */}
        <Grid item xs={2}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              {isApproved ? "Approved Amount" : "Total Amount"}
            </Typography>
            {isEditing && !isApproved ? (
              <TextField
                size="small"
                type="number"
                value={currentData.totalAmount}
                onChange={(e) =>
                  handleFieldChange(
                    "totalAmount",
                    parseFloat(e.target.value) || 0
                  )
                }
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" color="text.secondary">
                      NOK
                    </Typography>
                  ),
                }}
              />
            ) : (
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontSize: "0.875rem" }}
                color={isApproved ? "success.main" : "inherit"}
              >
                {currentData.totalAmount?.toLocaleString()} NOK
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Recipient Name */}
        <Grid item xs={1.5}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              Recipient Name
            </Typography>
            {isEditing && !isApproved ? (
              <TextField
                size="small"
                value={currentData.recipientName}
                onChange={(e) =>
                  handleFieldChange("recipientName", e.target.value)
                }
                variant="outlined"
                fullWidth
              />
            ) : (
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontSize: "0.875rem" }}
              >
                {currentData.recipientName}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Download Link */}
        <Grid item xs={1.5}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              Faktura
            </Typography>
            <Link
              href={pdfDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <Button
                variant="text"
                size="small"
                startIcon={<DownloadIcon />}
                sx={{
                  textTransform: "none",
                  p: 0.5,
                  minWidth: "auto",
                  fontSize: "0.875rem",
                }}
              >
                Last ned
              </Button>
            </Link>
          </Box>
        </Grid>

        {/* Edit Button - Far Right */}
        <Grid item xs={1} sx={{ textAlign: "right" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {!isApproved && (
              <>
                {!isEditing ? (
                  <IconButton onClick={handleEdit} size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton
                      onClick={handleSave}
                      size="small"
                      color="success"
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={handleCancel}
                      size="small"
                      color="error"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ mt: 1, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
      {/* Main Invoice Fields Display */}
      {hasInvoice && (
        <Box sx={{ mb: 2 }}>
          {/* Invoice Fields */}
          {renderInvoiceFields()}

          {invoiceApiResponse && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                API Validation Details:
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {invoiceApiResponse.message ||
                  "No additional details available"}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Upload Section - Only shown when no invoice exists */}
      {!hasInvoice && !invoiceUploadResponse && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
            Upload Invoice
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            Please upload the final invoice for this case. The system will
            automatically validate the amounts and details.
          </Typography>
          <input
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            id="invoice-upload"
            type="file"
            onChange={handleFileUpload}
            disabled={isInvoiceUploading}
          />
          <label htmlFor="invoice-upload">
            <Button
              variant="contained"
              component="span"
              disabled={isInvoiceUploading}
              startIcon={
                isInvoiceUploading ? (
                  <CircularProgress size={20} />
                ) : (
                  <UploadFileIcon />
                )
              }
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              {isInvoiceUploading ? "Processing..." : "Upload Invoice"}
            </Button>
          </label>
        </Box>
      )}

      {/* Upload Response */}
      {invoiceUploadResponse && (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor:
                invoiceUploadResponse.status === "approved"
                  ? "success.light"
                  : invoiceUploadResponse.status === "error"
                  ? "error.light"
                  : "warning.light",
              border: "1px solid",
              borderColor:
                invoiceUploadResponse.status === "approved"
                  ? "success.main"
                  : invoiceUploadResponse.status === "error"
                  ? "error.main"
                  : "warning.main",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {invoiceUploadResponse.status === "approved"
                ? "Invoice Approved"
                : invoiceUploadResponse.status === "error"
                ? "Invoice Rejected"
                : "Manual Review Required"}
            </Typography>
            <Typography variant="body2">
              {invoiceUploadResponse.message}
            </Typography>

            {invoiceUploadResponse.validatedAmount && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Validated Amount:</strong>{" "}
                {invoiceUploadResponse.validatedAmount} NOK
              </Typography>
            )}

            {invoiceUploadResponse.expectedAmount &&
              invoiceUploadResponse.actualAmount && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Expected:</strong>{" "}
                    {invoiceUploadResponse.expectedAmount} NOK
                  </Typography>
                  <Typography variant="body2">
                    <strong>Invoice Amount:</strong>{" "}
                    {invoiceUploadResponse.actualAmount} NOK
                  </Typography>
                </Box>
              )}

            {invoiceUploadResponse.issues &&
              invoiceUploadResponse.issues.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Issues Found:
                  </Typography>
                  <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                    {invoiceUploadResponse.issues.map((issue, index) => (
                      <li key={index}>
                        <Typography variant="body2">{issue}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
          </Box>

          {invoiceUploadResponse.status !== "approved" && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <input
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: "none" }}
                id="invoice-reupload"
                type="file"
                onChange={handleFileUpload}
                disabled={isInvoiceUploading}
              />
              <label htmlFor="invoice-reupload">
                <Button
                  variant="outlined"
                  component="span"
                  disabled={isInvoiceUploading}
                  startIcon={<UploadFileIcon />}
                  sx={{ mr: 2 }}
                >
                  Upload New Invoice
                </Button>
              </label>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default InvoiceStepContent;
