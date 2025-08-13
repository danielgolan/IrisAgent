import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import {
  Timeline as TimelineIcon,
  Comment as CommentIcon,
  Note as NoteIcon,
  Person as PersonIcon,
  Settings as SystemIcon,
  Send as SendIcon,
  Visibility as PublicIcon,
  VisibilityOff as PrivateIcon,
} from "@mui/icons-material";

// Helper function to format timestamps
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("no-NO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper function to get icon for activity type
const getActivityIcon = (type) => {
  switch (type) {
    case "system_action":
      return <SystemIcon />;
    case "status_change":
      return <TimelineIcon />;
    case "comment":
      return <CommentIcon />;
    case "note":
      return <NoteIcon />;
    default:
      return <PersonIcon />;
  }
};

// Helper function to get color for activity type
const getActivityColor = (type) => {
  switch (type) {
    case "system_action":
      return "info";
    case "status_change":
      return "primary";
    case "comment":
      return "success";
    case "note":
      return "warning";
    default:
      return "default";
  }
};

const ActivityLogEntry = ({ entry }) => (
  <ListItem sx={{ alignItems: "flex-start", py: 1.5 }}>
    <ListItemIcon sx={{ mt: 0.5 }}>
      <Chip
        icon={getActivityIcon(entry.type)}
        label=""
        size="small"
        color={getActivityColor(entry.type)}
        sx={{ minWidth: "auto", "& .MuiChip-label": { display: "none" } }}
      />
    </ListItemIcon>
    <ListItemText
      primary={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="body2" fontWeight={600}>
            {entry.actor}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTimestamp(entry.timestamp)}
          </Typography>
          {entry.type === "note" && (
            <Chip
              icon={<PrivateIcon />}
              label="Internal"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}
          {entry.type === "comment" && (
            <Chip
              icon={<PublicIcon />}
              label="Public"
              size="small"
              color="success"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}
        </Box>
      }
      secondary={
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {entry.action || entry.content}
          {entry.details && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              {entry.details}
            </Typography>
          )}
        </Typography>
      }
    />
  </ListItem>
);

const ActivityLog = ({ caseData, onAddComment, onAddNote }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newNote, setNewNote] = useState("");

  // Combine and sort all activities by timestamp
  const allActivities = React.useMemo(() => {
    const activities = [];

    // Add activity log entries
    if (caseData.activityLog) {
      activities.push(...caseData.activityLog);
    }

    // Add public comments
    if (caseData.publicComments) {
      activities.push(
        ...caseData.publicComments.map((comment) => ({
          ...comment,
          type: "comment",
          action: comment.content,
          actor: comment.author,
          timestamp: comment.timestamp,
        }))
      );
    }

    // Add internal notes
    if (caseData.internalNotes) {
      activities.push(
        ...caseData.internalNotes.map((note) => ({
          ...note,
          type: "note",
          action: note.content,
          actor: note.author,
          timestamp: note.timestamp,
        }))
      );
    }

    // Sort by timestamp (newest first)
    return activities.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [caseData]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        timestamp: new Date().toISOString(),
        author: "Current Agent", // This would come from user context
        content: newComment.trim(),
        visibility: "public",
      };
      onAddComment?.(comment);
      setNewComment("");
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        timestamp: new Date().toISOString(),
        author: "Current Agent", // This would come from user context
        content: newNote.trim(),
        visibility: "internal",
      };
      onAddNote?.(note);
      setNewNote("");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Card elevation={3} sx={{ mb: 2 }}>
      <CardHeader
        title="Aktivitetslogg og Notater"
        subheader={`${allActivities.length} oppføringer totalt`}
        action={
          <Chip
            icon={<TimelineIcon />}
            label="Live Logg"
            color="primary"
            variant="outlined"
            size="small"
          />
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pt: 0 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab
            label="Alle Aktiviteter"
            icon={<TimelineIcon />}
            iconPosition="start"
          />
          <Tab
            label="Offentlige Kommentarer"
            icon={<PublicIcon />}
            iconPosition="start"
          />
          <Tab
            label="Interne Notater"
            icon={<PrivateIcon />}
            iconPosition="start"
          />
        </Tabs>

        {/* Activity Feed */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Kronologisk oversikt over alle hendelser
            </Typography>
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {allActivities.length > 0 ? (
                allActivities.map((activity, index) => (
                  <Box key={index}>
                    <ActivityLogEntry entry={activity} />
                    {index < allActivities.length - 1 && <Divider />}
                  </Box>
                ))
              ) : (
                <Alert severity="info">Ingen aktiviteter registrert ennå</Alert>
              )}
            </List>
          </Box>
        )}

        {/* Public Comments Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Kommentarer synlige for verksted
            </Typography>

            {/* Add new comment */}
            <Box sx={{ mb: 2, p: 2, bgcolor: "success.50", borderRadius: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Skriv en offentlig kommentar som verkstedet kan se..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                color="success"
                startIcon={<SendIcon />}
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="small"
              >
                Send Kommentar
              </Button>
            </Box>

            {/* Public comments list */}
            <List sx={{ maxHeight: 300, overflow: "auto" }}>
              {caseData.publicComments?.length > 0 ? (
                caseData.publicComments
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((comment, index) => (
                    <Box key={index}>
                      <ActivityLogEntry
                        entry={{
                          ...comment,
                          type: "comment",
                          action: comment.content,
                          actor: comment.author,
                        }}
                      />
                      {index < caseData.publicComments.length - 1 && (
                        <Divider />
                      )}
                    </Box>
                  ))
              ) : (
                <Alert severity="info">Ingen offentlige kommentarer ennå</Alert>
              )}
            </List>
          </Box>
        )}

        {/* Internal Notes Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Private notater kun for agenter/forsikring
            </Typography>

            {/* Add new note */}
            <Box sx={{ mb: 2, p: 2, bgcolor: "warning.50", borderRadius: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Skriv et internt notat som kun er synlig for agenter..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                color="warning"
                startIcon={<NoteIcon />}
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                size="small"
              >
                Legg til Notat
              </Button>
            </Box>

            {/* Internal notes list */}
            <List sx={{ maxHeight: 300, overflow: "auto" }}>
              {caseData.internalNotes?.length > 0 ? (
                caseData.internalNotes
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((note, index) => (
                    <Box key={index}>
                      <ActivityLogEntry
                        entry={{
                          ...note,
                          type: "note",
                          action: note.content,
                          actor: note.author,
                        }}
                      />
                      {index < caseData.internalNotes.length - 1 && <Divider />}
                    </Box>
                  ))
              ) : (
                <Alert severity="info">Ingen interne notater ennå</Alert>
              )}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
