import React from "react";
import StatusCard from "./StatusCard";
import DescriptionIcon from "@mui/icons-material/Description";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ErrorIcon from "@mui/icons-material/Error";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

const StatusCardsGrid = ({ counts, onStatusClick }) => {
  const statusCards = [
    {
      label: "For Approval",
      value: counts["For Approval"],
      icon: <DescriptionIcon />,
      status: "For Approval",
    },
    {
      label: "Invoice Control",
      value: counts["Invoice Control"],
      icon: <ReceiptIcon />,
      status: "Invoice Control",
    },
    {
      label: "Failed",
      value: counts["Failed"],
      icon: <ErrorIcon />,
      status: "Failed",
    },
    {
      label: "On Hold",
      value: counts["On Hold"],
      icon: <PauseCircleIcon />,
      status: "On Hold",
    },
  ];

  return (
    <div className="modern-status-cards">
      {statusCards.map((card) => (
        <StatusCard
          key={card.status}
          label={card.label}
          value={card.value}
          icon={card.icon}
          selected={false}
          onClick={() => onStatusClick(card.status)}
        />
      ))}
    </div>
  );
};

export default StatusCardsGrid;
