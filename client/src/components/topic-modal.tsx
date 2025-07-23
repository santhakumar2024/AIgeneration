import { Topic } from "@/lib/types";
import { X, Printer, Bookmark, CheckCircle, Eye, AlertTriangle } from "lucide-react";

interface TopicModalProps {
  topic: Topic;
  onClose: () => void;
}

export default function TopicModal({ topic, onClose }: TopicModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    // Save to localStorage for future reference
    const savedTopics = JSON.parse(localStorage.getItem('savedTopics') || '[]');
    const newSavedTopics = [...savedTopics, topic].filter(
      (t, index, arr) => arr.findIndex(item => item.id === t.id) === index
    );
    localStorage.setItem('savedTopics', JSON.stringify(newSavedTopics));
    alert('Topic saved for easy access later!');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary-purple">{topic.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-primary-purple mb-4">
              {topic.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {topic.content.introduction}
            </p>
          </div>

          <div className="space-y-6">
            {/* Normal/Green Section */}
            <div className="border-l-4 border-success-green bg-success-green/5 p-6 rounded-r-xl">
              <div className="flex items-center mb-3">
                <div className="w-4 h-4 bg-success-green rounded-full mr-3"></div>
                <h4 className="font-semibold text-success-green">{topic.content.normal.title}</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {topic.content.normal.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success-green mt-0.5 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mt-3 font-medium">
                {topic.content.normal.advice}
              </p>
            </div>

            {/* Monitor/Yellow Section */}
            <div className="border-l-4 border-warning-yellow bg-warning-yellow/5 p-6 rounded-r-xl">
              <div className="flex items-center mb-3">
                <div className="w-4 h-4 bg-warning-yellow rounded-full mr-3"></div>
                <h4 className="font-semibold text-warning-yellow">{topic.content.monitor.title}</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {topic.content.monitor.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Eye className="w-4 h-4 text-warning-yellow mt-0.5 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mt-3 font-medium">
                {topic.content.monitor.advice}
              </p>
            </div>

            {/* Urgent/Red Section */}
            <div className="border-l-4 border-alert-red bg-alert-red/5 p-6 rounded-r-xl">
              <div className="flex items-center mb-3">
                <div className="w-4 h-4 bg-alert-red rounded-full mr-3"></div>
                <h4 className="font-semibold text-alert-red">{topic.content.urgent.title}</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {topic.content.urgent.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-alert-red mt-0.5 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mt-3 font-medium">
                {topic.content.urgent.advice}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handlePrint}
              className="flex-1 bg-primary-purple text-white py-3 px-6 rounded-xl font-medium hover:bg-primary-purple/90 transition-colors flex items-center justify-center"
            >
              <Printer className="w-5 h-5 mr-2" />
              Printer Guidance
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 bg-accent-teal text-white py-3 px-6 rounded-xl font-medium hover:bg-accent-teal/90 transition-colors flex items-center justify-center"
            >
              <Bookmark className="w-5 h-5 mr-2" />
              Save for Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
