import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Welcome from "@/pages/welcome";
import Home from "@/pages/home";
import { AppState, UserRole } from "./lib/types";
import NotFound from "@/pages/not-found";

function Router() {
  const [appState, setAppState] = useState<AppState>({
    currentRole: null,
    selectedTopic: null,
    searchQuery: '',
    searchResults: [],
    recommendations: [],
    isSearchVisible: false,
    isTopicModalOpen: false,
    isChatbotOpen: false,
    chatMessages: [],
    searchType: 'general',
  });

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const selectRole = (role: UserRole) => {
    updateAppState({ currentRole: role });
  };

  const resetRole = () => {
    updateAppState({ 
      currentRole: null,
      selectedTopic: null,
      searchQuery: '',
      searchResults: [],
      recommendations: [],
      isSearchVisible: false,
      isTopicModalOpen: false,
      isChatbotOpen: false,
      chatMessages: [],
      searchType: 'general',
    });
  };

  return (
    <Switch>
      <Route path="/">
        {appState.currentRole ? (
          <Home 
            appState={appState} 
            updateAppState={updateAppState}
            resetRole={resetRole}
          />
        ) : (
          <Welcome onSelectRole={selectRole} />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
