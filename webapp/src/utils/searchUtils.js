// Enhanced search utilities with optimizations
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Memoization cache for search results
const searchCache = new Map();
const maxCacheSize = 100;

// Clear cache when it gets too large
const clearCacheIfNeeded = () => {
  if (searchCache.size > maxCacheSize) {
    const keysToDelete = Array.from(searchCache.keys()).slice(
      0,
      maxCacheSize / 2
    );
    keysToDelete.forEach((key) => searchCache.delete(key));
  }
};

// Multi-field search capability with weighted ranking and wildcard matching
export const enhancedSearchCases = (cases, query) => {
  if (!query || !query.trim() || query.trim().length < 2) return cases;

  // Strip spaces and prepare search term with wildcard behavior
  const searchTerm = query.toLowerCase().replace(/\s+/g, "");

  // Check cache first
  const cacheKey = `search:${searchTerm}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  // Create scored results to handle priority and deduplication
  const scoredResults = new Map();

  cases.forEach((caseItem) => {
    let score = 0;
    let matchType = "";
    let matchedValue = "";

    // Priority 1: Case Number (exact match)
    if (caseItem.caseNumber?.toLowerCase().replace(/\s+/g, "") === searchTerm) {
      score = 1000;
      matchType = "case-exact";
      matchedValue = caseItem.caseNumber;
    }
    // Priority 2: VRN (exact match)
    else if (
      caseItem.vehicle?.vehicleLicenseNumber
        ?.toLowerCase()
        .replace(/\s+/g, "") === searchTerm
    ) {
      score = 900;
      matchType = "vrn-exact";
      matchedValue = caseItem.vehicle.vehicleLicenseNumber;
    }
    // Priority 3: Case Number (partial match with wildcard)
    else if (
      caseItem.caseNumber
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchTerm)
    ) {
      score = 800;
      matchType = "case-partial";
      matchedValue = caseItem.caseNumber;
    }
    // Priority 4: VRN (partial match with wildcard)
    else if (
      caseItem.vehicle?.vehicleLicenseNumber
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchTerm)
    ) {
      score = 700;
      matchType = "vrn-partial";
      matchedValue = caseItem.vehicle.vehicleLicenseNumber;
    }
    // Priority 5: Vehicle Make (with wildcard)
    else if (
      caseItem.vehicle?.brandName
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchTerm)
    ) {
      score = 600;
      matchType = "make";
      matchedValue = caseItem.vehicle.brandName;
    }
    // Priority 6: Vehicle Model (with wildcard)
    else if (
      caseItem.vehicle?.model
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchTerm)
    ) {
      score = 500;
      matchType = "model";
      matchedValue = caseItem.vehicle.model;
    }
    // Priority 7: Workshop Name (with wildcard)
    else if (
      caseItem.workshop?.name
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchTerm)
    ) {
      score = 400;
      matchType = "workshop";
      matchedValue = caseItem.workshop.name;
    }
    // Priority 8: Case Worker Organization (with wildcard)
    else if (
      caseItem.caseWorker?.organizationName
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchTerm)
    ) {
      score = 300;
      matchType = "organization";
      matchedValue = caseItem.caseWorker.organizationName;
    }

    // If we found a match, add to results (avoiding duplicates)
    if (score > 0) {
      const existingEntry = scoredResults.get(caseItem.id);
      // Keep the highest scoring match for each case
      if (!existingEntry || score > existingEntry.score) {
        scoredResults.set(caseItem.id, {
          caseItem: {
            ...caseItem,
            _searchMatch: {
              type: matchType,
              value: matchedValue,
              query: searchTerm,
            },
          },
          score,
        });
      }
    }
  });

  // Convert to sorted array by score (highest first)
  const results = Array.from(scoredResults.values())
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.caseItem);

  // Cache the results
  clearCacheIfNeeded();
  searchCache.set(cacheKey, results);

  return results;
};

// Highlight matching text with underlines
export const highlightMatch = (text, query) => {
  if (!text || !query || query.length < 2) return text;

  const searchTerm = query.toLowerCase().replace(/\s+/g, "");
  const textLower = text.toLowerCase().replace(/\s+/g, "");
  const originalText = text.toString();

  // Find the match position in the normalized text
  const matchIndex = textLower.indexOf(searchTerm);
  if (matchIndex === -1) return originalText;

  // Map back to original text positions (accounting for spaces)
  let originalIndex = 0;
  let normalizedIndex = 0;

  // Find start position in original text
  while (normalizedIndex < matchIndex && originalIndex < originalText.length) {
    if (originalText[originalIndex] !== " ") {
      normalizedIndex++;
    }
    originalIndex++;
  }

  const startPos = originalIndex;

  // Find end position in original text
  let matchLength = 0;
  while (
    matchLength < searchTerm.length &&
    originalIndex < originalText.length
  ) {
    if (originalText[originalIndex] !== " ") {
      matchLength++;
    }
    originalIndex++;
  }

  const endPos = originalIndex;

  // Return text with underlined match
  return (
    originalText.substring(0, startPos) +
    "<u>" +
    originalText.substring(startPos, endPos) +
    "</u>" +
    originalText.substring(endPos)
  );
};

// Get search match context for display
export const getSearchMatchContext = (caseItem) => {
  if (!caseItem._searchMatch) return null;

  const { type } = caseItem._searchMatch;

  switch (type) {
    case "case-exact":
      return { label: "Case Number (exact)", icon: "🎯", priority: "high" };
    case "case-partial":
      return { label: "Case Number", icon: "📋", priority: "high" };
    case "vrn-exact":
      return { label: "VRN (exact)", icon: "🎯", priority: "high" };
    case "vrn-partial":
      return { label: "License Plate", icon: "🚗", priority: "medium" };
    case "make":
      return { label: "Vehicle Make", icon: "🏭", priority: "low" };
    case "model":
      return { label: "Vehicle Model", icon: "🚙", priority: "low" };
    case "workshop":
      return { label: "Workshop", icon: "🔧", priority: "low" };
    case "organization":
      return { label: "Organization", icon: "🏢", priority: "low" };
    default:
      return null;
  }
};

// Optimized search suggestions generator with deduplication
export const generateSearchSuggestions = (cases, query) => {
  if (!query || query.length < 2) return [];

  const searchTerm = query.toLowerCase();
  const cacheKey = `suggestions:${searchTerm}`;

  // Check cache first
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  const suggestionMap = new Map(); // Use Map for better performance than Set

  // Limit cases to process for performance
  const casesToProcess = cases.slice(0, 50); // Process only first 50 cases

  casesToProcess.forEach((caseItem) => {
    // Case Number - highest priority
    if (caseItem.caseNumber?.toLowerCase().includes(searchTerm)) {
      const key = `case-${caseItem.caseNumber}`;
      if (!suggestionMap.has(key)) {
        suggestionMap.set(key, {
          type: "case",
          value: caseItem.caseNumber,
          label: `Case: ${caseItem.caseNumber}`,
          case: caseItem,
          priority: 4,
        });
      }
    }

    // License plates - high priority
    if (
      caseItem.vehicle?.vehicleLicenseNumber?.toLowerCase().includes(searchTerm)
    ) {
      const key = `plate-${caseItem.vehicle.vehicleLicenseNumber}`;
      if (!suggestionMap.has(key)) {
        suggestionMap.set(key, {
          type: "plate",
          value: caseItem.vehicle.vehicleLicenseNumber,
          label: `License: ${caseItem.vehicle.vehicleLicenseNumber}`,
          case: caseItem,
          priority: 3,
        });
      }
    }

    // Insurance companies - medium priority
    if (
      caseItem.insuranceInformation?.insuranceProvider?.name
        ?.toLowerCase()
        .includes(searchTerm)
    ) {
      const key = `insurer-${caseItem.insuranceInformation.insuranceProvider.name}`;
      if (!suggestionMap.has(key)) {
        suggestionMap.set(key, {
          type: "insurer",
          value: caseItem.insuranceInformation.insuranceProvider.name,
          label: `Insurer: ${caseItem.insuranceInformation.insuranceProvider.name}`,
          case: caseItem,
          priority: 2,
        });
      }
    }

    // Vehicle make/model - lower priority
    if (caseItem.vehicle?.brandName?.toLowerCase().includes(searchTerm)) {
      const key = `make-${caseItem.vehicle.brandName}`;
      if (!suggestionMap.has(key)) {
        suggestionMap.set(key, {
          type: "vehicle",
          value: caseItem.vehicle.brandName,
          label: `Vehicle: ${caseItem.vehicle.brandName}`,
          case: caseItem,
          priority: 1,
        });
      }
    }

    if (caseItem.vehicle?.model?.toLowerCase().includes(searchTerm)) {
      const key = `model-${caseItem.vehicle.model}`;
      if (!suggestionMap.has(key)) {
        suggestionMap.set(key, {
          type: "vehicle",
          value: caseItem.vehicle.model,
          label: `Model: ${caseItem.vehicle.model}`,
          case: caseItem,
          priority: 1,
        });
      }
    }
  });

  // Convert to array, sort by priority, and limit results
  const suggestions = Array.from(suggestionMap.values())
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 8)
    .map(({ priority, ...suggestion }) => suggestion); // Remove priority from final result

  // Cache the results
  clearCacheIfNeeded();
  searchCache.set(cacheKey, suggestions);

  return suggestions;
};

// Search result ranking/scoring
export const rankSearchResults = (cases, query) => {
  if (!query) return cases;

  const searchTerm = query.toLowerCase();

  return cases
    .map((caseItem) => {
      let score = 0;

      // Higher score for exact matches in important fields
      if (caseItem.caseNumber?.toLowerCase() === searchTerm) score += 100;
      else if (caseItem.caseNumber?.toLowerCase().includes(searchTerm))
        score += 50;

      if (caseItem.vehicle?.vehicleLicenseNumber?.toLowerCase() === searchTerm)
        score += 90;
      else if (
        caseItem.vehicle?.vehicleLicenseNumber
          ?.toLowerCase()
          .includes(searchTerm)
      )
        score += 40;

      if (
        caseItem.insuranceInformation?.insuranceProvider?.name
          ?.toLowerCase()
          .includes(searchTerm)
      )
        score += 30;
      if (caseItem.vehicle?.brandName?.toLowerCase().includes(searchTerm))
        score += 20;
      if (caseItem.vehicle?.model?.toLowerCase().includes(searchTerm))
        score += 20;
      if (caseItem.cause?.toLowerCase().includes(searchTerm)) score += 15;
      if (caseItem.placeOfIncident?.toLowerCase().includes(searchTerm))
        score += 10;

      return { ...caseItem, searchScore: score };
    })
    .sort((a, b) => b.searchScore - a.searchScore)
    .map(({ searchScore, ...caseItem }) => caseItem); // Remove score from final result
};

// Search history management
export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem("searchHistory");
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading search history:", error);
    return [];
  }
};

export const addToSearchHistory = (query) => {
  if (!query || query.trim().length < 2) return;

  try {
    const history = getSearchHistory();
    const newHistory = [
      query.trim(),
      ...history.filter((item) => item !== query.trim()),
    ].slice(0, 10); // Keep only last 10 searches

    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error saving search history:", error);
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem("searchHistory");
  } catch (error) {
    console.error("Error clearing search history:", error);
  }
};

// Highlight matching terms in text
export const highlightText = (text, query) => {
  if (!query || !text) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
};
