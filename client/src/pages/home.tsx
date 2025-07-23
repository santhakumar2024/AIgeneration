import { AppState, UserRole } from "@/lib/types";
import EnhancedSearchBar from "@/components/enhanced-search-bar";
import GuidanceCard from "@/components/guidance-card";
import AIRecommendations from "@/components/ai-recommendations";
import TopicModal from "@/components/topic-modal";
import Chatbot from "@/components/chatbot";
import { UserCircle, Play, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface HomeProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
  resetRole: () => void;
}

export default function Home({ appState, updateAppState, resetRole }: HomeProps) {
  const { data: recommendations } = useQuery({
    queryKey: ['/api/recommendations', appState.currentRole],
    enabled: !!appState.currentRole,
  });

  const roleLabels: Record<UserRole, string> = {
    patient: 'Patient',
    caregiver: 'Caregiver',
    supporter: 'Community Supporter'
  };

  const handleStartGuidance = () => {
    // TODO: Implement guided experience flow
    alert('Starting personalized guidance based on your role...');
  };

  const handleShowSearch = () => {
    updateAppState({ isSearchVisible: !appState.isSearchVisible });
  };

  const featuredCards = [
    {
      id: 'medications',
      title: 'Medications',
      description: 'Clear guidance on taking your medications safely, managing side effects, and knowing when to contact your care team.',
      icon: '💊',
      category: 'medications'
    },
    {
      id: 'follow-up',
      title: 'Follow-Up Instructions',
      description: 'Step-by-step guidance for appointments, tests, and ongoing care to ensure nothing falls through the cracks.',
      icon: '📅',
      category: 'follow-up'
    },
    {
      id: 'comfort-care',
      title: 'Comfort & Daily Care',
      description: 'Practical advice for recovery, pain management, wound care, and daily activities to support healing.',
      icon: '❤️',
      category: 'comfort-care'
    }
  ];

  return (
    <div className="min-h-screen bg-soft-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-purple">Decode My Care™</h1>
              {appState.currentRole && (
                <span className="ml-4 px-3 py-1 bg-accent-teal/10 text-accent-teal rounded-full text-sm font-medium">
                  {roleLabels[appState.currentRole]}
                </span>
              )}
            </div>
            <button 
              onClick={resetRole}
              className="text-gray-500 hover:text-primary-purple transition-colors flex items-center"
            >
              <UserCircle className="w-5 h-5 mr-2" />
              Change Role
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-purple/5 to-accent-teal/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-4">
            Your calm companion after any medical visit
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plain-language guidance to help you move forward with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={handleStartGuidance}
              className="bg-accent-teal text-white px-8 py-3 rounded-xl font-semibold hover:bg-accent-teal/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your Guidance
            </button>
            <button 
              onClick={handleShowSearch}
              className="bg-white text-primary-purple border-2 border-primary-purple px-8 py-3 rounded-xl font-semibold hover:bg-primary-purple hover:text-white transition-all duration-300 flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Topics
            </button>
          </div>

          {appState.isSearchVisible && (
            <EnhancedSearchBar 
              appState={appState}
              updateAppState={updateAppState}
            />
          )}
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-primary-purple text-center mb-8">
            Featured Guidance Areas
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredCards.map((card) => (
              <GuidanceCard 
                key={card.id}
                card={card}
                updateAppState={updateAppState}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      {appState.currentRole && (
        <AIRecommendations 
          role={appState.currentRole}
          recommendations={Array.isArray(recommendations) ? recommendations : []}
          updateAppState={updateAppState}
        />
      )}

      {/* Topic Modal */}
      {appState.isTopicModalOpen && appState.selectedTopic && (
        <TopicModal 
          topic={appState.selectedTopic}
          onClose={() => updateAppState({ isTopicModalOpen: false, selectedTopic: null })}
        />
      )}

      {/* Chatbot */}
      {appState.isChatbotOpen && (
        <Chatbot
          appState={appState}
          updateAppState={updateAppState}
          onClose={() => updateAppState({ isChatbotOpen: false, chatMessages: [] })}
          initialTopic={appState.selectedTopic || undefined}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Decode My Care™ - Supporting you through every step of your care journey
            </p>
            <p className="text-sm text-gray-500">
              This tool provides general guidance and does not replace professional medical advice.
              Always contact your healthcare provider for specific medical concerns.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
