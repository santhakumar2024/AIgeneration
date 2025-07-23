import { ChatMessage, AppState, Topic } from "@/lib/types";
import { X, Send, MessageCircle, Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";

interface ChatbotProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
  onClose: () => void;
  initialTopic?: Topic;
}

export default function Chatbot({ appState, updateAppState, onClose, initialTopic }: ChatbotProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [appState.chatMessages]);

  useEffect(() => {
    // Initialize with topic content if provided
    if (initialTopic && appState.chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        content: `Hello! I'm here to help you with "${initialTopic.title}". 

${initialTopic.content.introduction}

Here's a quick overview:

**${initialTopic.content.normal.title}**
${initialTopic.content.normal.items.map(item => `• ${item}`).join('\n')}
${initialTopic.content.normal.advice}

**${initialTopic.content.monitor.title}**
${initialTopic.content.monitor.items.map(item => `• ${item}`).join('\n')}
${initialTopic.content.monitor.advice}

**${initialTopic.content.urgent.title}**
${initialTopic.content.urgent.items.map(item => `• ${item}`).join('\n')}
${initialTopic.content.urgent.advice}

What specific questions do you have about this topic?`,
        sender: 'assistant',
        timestamp: new Date(),
        topicId: initialTopic.id.toString()
      };

      updateAppState({
        chatMessages: [welcomeMessage]
      });
    }
  }, [initialTopic, appState.chatMessages.length, updateAppState]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...appState.chatMessages, userMessage];
    updateAppState({ chatMessages: updatedMessages });
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response for now (would use AWS Bedrock in production)
      const response = await generateChatResponse(inputMessage, initialTopic, appState.currentRole || undefined);
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        content: response,
        sender: 'assistant',
        timestamp: new Date()
      };

      updateAppState({
        chatMessages: [...updatedMessages, assistantMessage]
      });
    } catch (error) {
      console.error('Error generating chat response:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I'm having trouble responding right now. Please try asking your question again, or contact your healthcare provider if this is urgent.",
        sender: 'assistant',
        timestamp: new Date()
      };

      updateAppState({
        chatMessages: [...updatedMessages, errorMessage]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="text-accent-teal mr-3 w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold text-primary-purple">DecodeMyCare Assistant</h2>
              {initialTopic && (
                <p className="text-sm text-gray-600">{initialTopic.title}</p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {appState.chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-accent-teal text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your care..."
              className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:border-accent-teal focus:outline-none resize-none"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-accent-teal text-white px-6 py-3 rounded-xl hover:bg-accent-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function generateChatResponse(message: string, topic?: Topic, role?: string): Promise<string> {
  // In production, this would call AWS Bedrock
  // For now, provide contextual responses based on the message content
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('911')) {
    return `If this is a medical emergency, please call 911 or go to your nearest emergency room immediately.

For mental health emergencies or if you're having thoughts of suicide, please call:
• 988 Suicide & Crisis Lifeline (call or text)
• Veterans Crisis Line: 1-800-273-8255, Press 1

If this is not an emergency, I'm here to help answer your questions about your care. What specific concerns do you have?`;
  }

  if (lowerMessage.includes('pain')) {
    return `I understand you're asking about pain. This is very important to address properly.

**When pain is normal:**
• Mild to moderate pain that gradually improves each day
• Pain that responds well to prescribed medications
• Discomfort that improves with rest and recommended comfort measures

**When to contact your provider:**
• Pain that's getting worse instead of better
• Pain that interferes with sleep or daily activities
• Need for more medication than prescribed

**When to seek immediate help:**
• Sudden, severe pain that's much worse than before
• Pain with fever, redness, or swelling
• Pain that doesn't respond to any medication

Can you tell me more about the type of pain you're experiencing?`;
  }

  if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
    return `Medication questions are very important for your safety and recovery.

**For medication timing and dosing:**
• Take medications exactly as prescribed
• Try to take them at the same time each day
• Use a pill organizer or medication log to stay organized

**Common side effects that are usually manageable:**
• Mild nausea (try taking with food)
• Temporary drowsiness
• Minor digestive changes

**Contact your provider immediately if you experience:**
• Allergic reactions (rash, swelling, difficulty breathing)
• Severe side effects
• Signs of medication interactions

What specific questions do you have about your medications?`;
  }

  if (lowerMessage.includes('wound') || lowerMessage.includes('incision')) {
    return `Wound care is crucial for proper healing. Let me help you understand what to watch for.

**Normal healing signs:**
• Mild swelling that decreases over time
• Light pink or red color around the wound
• Minimal clear or slightly yellow drainage

**Signs that need monitoring:**
• Increased swelling after the first few days
• Wound edges pulling apart slightly
• Increased drainage or change in color

**Seek immediate care for:**
• Red streaks leading away from the wound
• Foul-smelling discharge
• Wound edges separating significantly
• Fever with wound changes

These could be signs of infection. Can you describe what you're seeing with your wound?`;
  }

  // Default response
  return `Thank you for your question. I'm here to provide guidance based on medical best practices, but remember that I can't replace your healthcare provider's advice.

${topic ? `Since we're discussing "${topic.title}", here are some key points to consider:

${topic.content.normal.advice}

${topic.content.monitor.advice}

**Important:** ${topic.content.urgent.advice}` : ''}

Could you provide more details about your specific situation so I can give you more targeted guidance? 

And remember: if you're ever unsure about symptoms or have concerns, it's always best to contact your healthcare provider directly.`;
}