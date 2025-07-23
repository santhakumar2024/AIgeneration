import { AppState } from "@/lib/types";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SearchBarProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function SearchBar({ appState, updateAppState }: SearchBarProps) {
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
    queryKey: ['/api/search', debouncedQuery, appState.currentRole],
    enabled: debouncedQuery.length > 2 && !!appState.currentRole,
  });

  const handleResultClick = async (resultId: string) => {
    try {
      const response = await apiRequest('GET', `/api/topics/${resultId}`);
      const topic = await response.json();
      updateAppState({ 
        selectedTopic: topic,
        isTopicModalOpen: true,
        isSearchVisible: false
      });
    } catch (error) {
      console.error('Error fetching topic:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search: wound care, when to call the doctor, medication timing..."
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-accent-teal focus:outline-none focus:ring-4 focus:ring-accent-teal/20 transition-all duration-300"
        />
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent-teal">
          <Search className="w-6 h-6" />
        </button>
      </div>
      
      {query.length > 2 && (
        <div className="mt-4 space-y-2">
          {isLoading ? (
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
              Searching...
            </div>
          ) : searchResults && Array.isArray(searchResults) && searchResults.length > 0 ? (
            searchResults.map((result: any) => (
              <div 
                key={result.id}
                onClick={() => handleResultClick(result.id)}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:border-accent-teal cursor-pointer transition-colors flex items-center"
              >
                <Search className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">{result.title}</div>
                  <div className="text-sm text-gray-600">{result.description}</div>
                </div>
              </div>
            ))
          ) : query.length > 2 ? (
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
