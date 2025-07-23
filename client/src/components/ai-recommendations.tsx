import { UserRole, AIRecommendation, AppState } from "@/lib/types";
import { Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AIRecommendationsProps {
  role: UserRole;
  recommendations: AIRecommendation[];
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function AIRecommendations({ role, updateAppState }: AIRecommendationsProps) {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['/api/recommendations', role],
    enabled: !!role,
  });

  const handleRecommendationClick = async (recommendationId: string) => {
    try {
      const response = await apiRequest('GET', `/api/recommendations/${recommendationId}/topic`);
      const topic = await response.json();
      
      updateAppState({ 
        selectedTopic: topic,
        isChatbotOpen: true,
        chatMessages: [] // Reset chat for new topic
      });
    } catch (error) {
      console.error('Error fetching recommendation topic:', error);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading AI recommendations...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-purple/5 to-accent-teal/5 rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <Bot className="text-accent-teal text-2xl mr-4 w-8 h-8" />
            <h3 className="text-2xl font-bold text-primary-purple">AI-Powered Recommendations</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Based on your role and recent activity, our AI suggests these helpful topics:
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations && Array.isArray(recommendations) && recommendations.length > 0 ? (
              recommendations.map((rec: any) => (
                <div 
                  key={rec.id}
                  onClick={() => handleRecommendationClick(rec.id)}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-accent-teal transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-2 h-2 ${
                      rec.priority === 'high' ? 'bg-alert-red' : 
                      rec.priority === 'medium' ? 'bg-warning-yellow' : 
                      'bg-success-green'
                    } rounded-full mr-2`}></div>
                    <span className="text-sm font-medium text-primary-purple">{rec.title}</span>
                  </div>
                  <p className="text-xs text-gray-600">{rec.description}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                No recommendations available at this time.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
