import { CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { AppState } from "@/lib/types";

interface GuidanceCardProps {
  card: {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
  };
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function GuidanceCard({ card, updateAppState }: GuidanceCardProps) {
  const handleCardClick = async () => {
    try {
      const response = await apiRequest('GET', `/api/topics/category/${card.category}`);
      const topics = await response.json();
      
      if (topics && topics.length > 0) {
        updateAppState({ 
          selectedTopic: topics[0],
          isChatbotOpen: true,
          chatMessages: [] // Reset chat for new topic
        });
      }
    } catch (error) {
      console.error('Error fetching topic:', error);
    }
  };

  const getCardFeatures = (category: string) => {
    switch (category) {
      case 'medications':
        return [
          { color: 'success-green', text: 'Safe to continue as prescribed' },
          { color: 'warning-yellow', text: 'Monitor for changes' },
          { color: 'alert-red', text: 'Contact provider immediately' }
        ];
      case 'follow-up':
        return [
          { color: 'success-green', text: 'Schedule follow-up appointments' },
          { color: 'success-green', text: 'Understand test results' },
          { color: 'success-green', text: 'Prepare for next visit' }
        ];
      case 'comfort-care':
        return [
          { color: 'accent-teal', text: 'Pain & symptom management' },
          { color: 'accent-teal', text: 'Safe activities at home' },
          { color: 'accent-teal', text: 'Wound & incision care' }
        ];
      default:
        return [];
    }
  };

  const features = getCardFeatures(card.category);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-accent-teal/10 rounded-xl flex items-center justify-center mr-4">
          <span className="text-xl">{card.icon}</span>
        </div>
        <h4 className="text-xl font-semibold text-primary-purple">{card.title}</h4>
      </div>
      
      <p className="text-gray-600 mb-6">
        {card.description}
      </p>
      
      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center text-sm">
            {feature.color === 'success-green' || feature.color === 'accent-teal' ? (
              <CheckCircle className={`w-4 h-4 text-${feature.color} mr-3`} />
            ) : (
              <div className={`w-3 h-3 bg-${feature.color} rounded-full mr-3`}></div>
            )}
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleCardClick}
        className="w-full bg-accent-teal/10 text-accent-teal py-3 rounded-xl font-medium hover:bg-accent-teal hover:text-white transition-all duration-300"
      >
        {card.category === 'medications' && 'Explore Medication Guidance'}
        {card.category === 'follow-up' && 'View Follow-Up Steps'}
        {card.category === 'comfort-care' && 'Access Comfort Guidance'}
      </button>
    </div>
  );
}
