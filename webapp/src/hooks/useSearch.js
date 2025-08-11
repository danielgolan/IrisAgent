import { useState, useEffect, useCallback, useMemo } from "react";
import {
  enhancedSearchCases,
  generateSearchSuggestions,
  rankSearchResults,
  getSearchHistory,
  addToSearchHistory,
} from "../utils/searchUtils";
import { sampleCases } from "../sample-data/sampleCases";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Memoize search history to avoid re-reading localStorage on every render
  const memoizedSearchHistory = useMemo(() => {
    return getSearchHistory();
  }, []);

  // Load search history on mount only once
  useEffect(() => {
    setSearchHistory(memoizedSearchHistory);
  }, [memoizedSearchHistory]);

  // Optimized search function with reduced delay
  const performSearch = useCallback((searchQuery) => {
    setIsLoading(true);

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      if (searchQuery.trim()) {
        const filteredCases = enhancedSearchCases(sampleCases, searchQuery);
        const rankedResults = rankSearchResults(filteredCases, searchQuery);
        const searchSuggestions = generateSearchSuggestions(
          sampleCases,
          searchQuery
        );

        setResults(rankedResults);
        setSuggestions(searchSuggestions);
      } else {
        setResults([]);
        setSuggestions([]);
      }
      setIsLoading(false);
    });
  }, []);

  // Optimized debouncing with shorter delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      }
    }, 200); // Reduced from 300ms to 200ms

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Update query and trigger search
  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
    setSelectedSuggestionIndex(-1);

    if (newQuery.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setResults([]);
      setSuggestions([]);
      setIsLoading(false);
    }
  }, []);

  // Execute search and add to history
  const executeSearch = useCallback(
    (searchQuery = query) => {
      if (searchQuery.trim()) {
        addToSearchHistory(searchQuery);
        setSearchHistory(getSearchHistory());
        setShowSuggestions(false);

        // Return search parameters for navigation
        return {
          query: searchQuery.trim(),
          results: enhancedSearchCases(sampleCases, searchQuery),
        };
      }
      return null;
    },
    [query]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsLoading(false);
    setSelectedSuggestionIndex(-1);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event) => {
      if (!showSuggestions) return;

      const totalSuggestions = suggestions.length + searchHistory.length;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev < totalSuggestions - 1 ? prev + 1 : -1
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev > -1 ? prev - 1 : totalSuggestions - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (selectedSuggestionIndex >= 0) {
            let selectedQuery;
            if (selectedSuggestionIndex < suggestions.length) {
              selectedQuery = suggestions[selectedSuggestionIndex].value;
            } else {
              selectedQuery =
                searchHistory[selectedSuggestionIndex - suggestions.length];
            }
            setQuery(selectedQuery);
            return executeSearch(selectedQuery);
          } else if (query.trim()) {
            return executeSearch();
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
          break;
        default:
          break;
      }
    },
    [
      showSuggestions,
      suggestions,
      searchHistory,
      selectedSuggestionIndex,
      query,
      executeSearch,
    ]
  );

  // Select suggestion
  const selectSuggestion = useCallback(
    (suggestion) => {
      const selectedQuery =
        typeof suggestion === "string" ? suggestion : suggestion.value;
      setQuery(selectedQuery);
      return executeSearch(selectedQuery);
    },
    [executeSearch]
  );

  return {
    query,
    results,
    suggestions,
    isLoading,
    showSuggestions,
    searchHistory,
    selectedSuggestionIndex,
    updateQuery,
    executeSearch,
    clearSearch,
    handleKeyDown,
    selectSuggestion,
    setShowSuggestions,
  };
};
