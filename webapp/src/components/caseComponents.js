// Additional Components Configuration for Case Details
// Components that are not verification steps but part of the case management interface

export const CASE_COMPONENTS = {
  // Activity Log & Notes Component
  activity_log: {
    id: "activity_log",
    name: "Logg",
    nameEn: "Activity Log",
    description: "Activity timeline, public communication, and internal notes",
    type: "component", // Not a verification step

    // Data field mappings to case data
    dataFields: {
      activityLog: "activityLog", // Array of system actions and status changes
      publicComments: "publicComments", // Array of public notes/comments visible to workshop
      internalNotes: "internalNotes", // Array of private notes visible only to agents/insurance
    },

    // Activity log entry structure
    activityLogEntry: {
      timestamp: "ISO timestamp",
      actor: 'Username or "Automatic Agent"',
      action: "Description of action taken",
      type: "system_action | status_change | comment | note",
      details: "Additional context or data",
    },

    // Public comment structure
    publicCommentEntry: {
      timestamp: "ISO timestamp",
      author: "Agent username",
      content: "Comment text",
      visibility: "public",
    },

    // Internal note structure
    internalNoteEntry: {
      timestamp: "ISO timestamp",
      author: "Agent username",
      content: "Note text",
      visibility: "internal",
    },

    // UI components
    uiComponents: {
      activityFeed: "Scrollable chronological timeline of all actions",
      publicCommentInput:
        "Text field for adding public comments (visible to workshop)",
      internalNoteInput:
        "Text field for adding internal notes (private to agents)",
      visualSeparation: "Clear distinction between public/private content",
    },

    // Features
    features: {
      communication: "Public comments for workshop communication",
      auditTrail: "Complete history of all case actions and changes",
      internalNotes: "Private notes for agent use only",
      chronological: "Timeline view with timestamps and actors",
    },

    // Field labels for UI
    fieldLabels: {
      activityLog: "Aktivitetslogg",
      publicComments: "Offentlige kommentarer",
      internalNotes: "Interne notater",
      addPublicComment: "Legg til offentlig kommentar",
      addInternalNote: "Legg til intern notat",
    },
  },
};

// Helper function to add activity log entry
export const addActivityLogEntry = (activityLog, entry) => {
  return [
    ...(activityLog || []),
    {
      ...entry,
      timestamp: new Date().toISOString(),
    },
  ];
};

// Helper function to add public comment
export const addPublicComment = (publicComments, author, content) => {
  return [
    ...(publicComments || []),
    {
      timestamp: new Date().toISOString(),
      author,
      content,
      visibility: "public",
    },
  ];
};

// Helper function to add internal note
export const addInternalNote = (internalNotes, author, content) => {
  return [
    ...(internalNotes || []),
    {
      timestamp: new Date().toISOString(),
      author,
      content,
      visibility: "internal",
    },
  ];
};
