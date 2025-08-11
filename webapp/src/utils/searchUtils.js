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

// Multi-field search capability with optimizations
export const enhancedSearchCases = (cases, query) => {
  if (!query || !query.trim()) return cases;

  const searchTerm = query.toLowerCase().trim();

  // Check cache first
  const cacheKey = `search:${searchTerm}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  const results = cases.filter((caseItem) => {
    // Early exit for exact matches
    if (
      caseItem.caseNumber?.toLowerCase() === searchTerm ||
      caseItem.vehicle?.vehicleLicenseNumber?.toLowerCase() === searchTerm
    ) {
      return true;
    }

    // Search only in case number and license plate fields
    const searchableFields = [
      caseItem.caseNumber,
      caseItem.vehicle?.vehicleLicenseNumber,
    ];

    return searchableFields.some((field) =>
      field?.toString().toLowerCase().includes(searchTerm)
    );
  });

  // Cache the results
  clearCacheIfNeeded();
  searchCache.set(cacheKey, results);

  return results;
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
