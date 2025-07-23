import { AppState } from "@/lib/types";
import { Search, Filter, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface EnhancedSearchBarProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function EnhancedSearchBar({ appState, updateAppState }: EnhancedSearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: [
      appState.searchType === 'topics' ? '/api/search-topics' : '/api/search', 
      debouncedQuery, 
      appState.currentRole
    ],
    enabled: debouncedQuery.length > 2 && !!appState.currentRole,
  });

  const { data: allTopics } = useQuery({
    queryKey: ['/api/topics/role', appState.currentRole],
    enabled: !!appState.currentRole && appState.searchType === 'topics' && query.length === 0,
  });

  const handleResultClick = async (resultId: string) => {
    try {
      const response = await apiRequest('GET', `/api/topics/${resultId}`);
      const topic = await response.json();
      updateAppState({ 
        selectedTopic: topic,
        isChatbotOpen: true,
        isSearchVisible: false,
        chatMessages: [] // Reset chat for new topic
      });
    } catch (error) {
      console.error('Error fetching topic:', error);
    }
  };

  const toggleSearchType = () => {
    updateAppState({ 
      searchType: appState.searchType === 'general' ? 'topics' : 'general' 
    });
    setQuery('');
    setDebouncedQuery('');
  };

  const displayResults = query.length > 2 ? searchResults : (appState.searchType === 'topics' ? allTopics : []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Type Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-white rounded-xl p-1 shadow-md border border-gray-200">
          <button
            onClick={toggleSearchType}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              appState.searchType === 'general'
                ? 'bg-accent-teal text-white shadow-md'
                : 'text-gray-600 hover:text-accent-teal'
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            General Search
          </button>
          <button
            onClick={toggleSearchType}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              appState.searchType === 'topics'
                ? 'bg-accent-teal text-white shadow-md'
                : 'text-gray-600 hover:text-accent-teal'
            }`}
          >
            <Filter className="w-4 h-4 inline mr-2" />
            Browse Topics
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            appState.searchType === 'topics' 
              ? "Search topics: wound care, pain management, medications..."
              : "Search anything: symptoms, questions, concerns..."
          }
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-accent-teal focus:outline-none focus:ring-4 focus:ring-accent-teal/20 transition-all duration-300"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            appState.searchType === 'topics' ? 'bg-primary-purple' : 'bg-accent-teal'
          }`}></div>
          <Search className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Search Type Description */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          {appState.searchType === 'topics' 
            ? `${query.length === 0 ? 'Showing all available topics for your role' : 'Searching topic titles'}`
            : 'Searching all content including descriptions and guidance'
          }
        </p>
      </div>
      
      {/* Results */}
      {(query.length > 2 || (appState.searchType === 'topics' && query.length === 0)) && (
        <div className="space-y-3">
          {isLoading ? (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-accent-teal border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            </div>
          ) : displayResults && Array.isArray(displayResults) && displayResults.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {displayResults.map((result: any) => (
                <div 
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-accent-teal hover:shadow-md cursor-pointer transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          result.priority === 'high' ? 'bg-alert-red' : 
                          result.priority === 'medium' ? 'bg-warning-yellow' : 
                          'bg-success-green'
                        }`}></div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-purple transition-colors">
                          {result.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{result.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {result.category?.replace('-', ' ')}
                        </span>
                        <MessageCircle className="w-4 h-4 text-accent-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length > 2 ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No results found for "{query}"</p>
              <p className="text-sm text-gray-400">
                Try different keywords or switch to {appState.searchType === 'topics' ? 'General Search' : 'Browse Topics'}
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>💡 Tip: Click any topic to start a helpful conversation with our AI assistant</p>
      </div>
    </div>
  );
}