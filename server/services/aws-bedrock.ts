import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

interface AIRecommendationRequest {
  role: string;
  recentTopics?: string[];
  userContext?: string;
}

interface AISearchRequest {
  query: string;
  role: string;
  availableTopics: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
  }>;
}

export class AWSBedrockService {
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async generateRecommendations(request: AIRecommendationRequest): Promise<any[]> {
    const prompt = this.buildRecommendationPrompt(request);
    
    try {
      const response = await this.invokeModel(prompt);
      return this.parseRecommendationResponse(response);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      return this.getFallbackRecommendations(request.role);
    }
  }

  async enhanceSearch(request: AISearchRequest): Promise<any[]> {
    const prompt = this.buildSearchPrompt(request);
    
    try {
      const response = await this.invokeModel(prompt);
      return this.parseSearchResponse(response, request.availableTopics);
    } catch (error) {
      console.error('Error enhancing search with AI:', error);
      return this.getFallbackSearchResults(request);
    }
  }

  private async invokeModel(prompt: string): Promise<string> {
    const modelId = "anthropic.claude-3-sonnet-20240229-v1:0";
    
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    };

    const command = new InvokeModelCommand({
      modelId,
      body: JSON.stringify(payload),
      contentType: "application/json",
      accept: "application/json",
    });

    const response = await this.client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    return responseBody.content[0].text;
  }

  private buildRecommendationPrompt(request: AIRecommendationRequest): string {
    const roleContext = this.getRoleContext(request.role);
    
    return `
You are an AI assistant for DecodeMyCare, a compassionate healthcare guidance platform for Veterans and their support networks.

User Role: ${request.role}
Role Context: ${roleContext}

Generate 4 personalized topic recommendations based on this role. Focus on:
1. Common concerns for this role
2. Suicide prevention and mental health support
3. Post-care guidance and transitions
4. Plain-language, actionable topics

Return your response as a JSON array with this format:
[
  {
    "title": "Topic Title",
    "description": "Brief description",
    "priority": "high|medium|low",
    "reason": "Why this is recommended for this role"
  }
]

Keep titles under 25 characters and descriptions under 50 characters.
Focus on emotional support, clarity, and suicide prevention themes.
`;
  }

  private buildSearchPrompt(request: AISearchRequest): string {
    const topicList = request.availableTopics.map(t => 
      `${t.id}: ${t.title} - ${t.description} (${t.category})`
    ).join('\n');

    return `
You are an AI assistant for DecodeMyCare helping ${request.role} users find relevant healthcare guidance.

Search Query: "${request.query}"
User Role: ${request.role}

Available Topics:
${topicList}

Rank the most relevant topics for this search query and role. Consider:
1. Direct keyword matches
2. Semantic similarity 
3. Role-specific relevance
4. Urgency/priority for this role

Return a JSON array of topic IDs in order of relevance:
["topic_id_1", "topic_id_2", "topic_id_3"]

Maximum 6 results. Only include highly relevant matches.
`;
  }

  private getRoleContext(role: string): string {
    switch (role) {
      case 'patient':
        return 'A Veteran or individual who has recently received medical care and needs guidance on next steps, recovery, and when to seek help.';
      case 'caregiver':
        return 'Someone caring for a Veteran or patient, needing guidance on how to support recovery and recognize concerning symptoms.';
      case 'supporter':
        return 'A community member, faith leader, EMS professional, or friend providing support and needing to recognize crisis signs.';
      default:
        return 'A user seeking healthcare guidance and support.';
    }
  }

  private parseRecommendationResponse(response: string): any[] {
    try {
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error('Error parsing AI recommendation response:', error);
      return [];
    }
  }

  private parseSearchResponse(response: string, availableTopics: any[]): any[] {
    try {
      const topicIds = JSON.parse(response);
      return topicIds
        .map((id: string) => availableTopics.find(t => t.id === id))
        .filter(Boolean);
    } catch (error) {
      console.error('Error parsing AI search response:', error);
      return [];
    }
  }

  private getFallbackRecommendations(role: string): any[] {
    const fallbacks = {
      patient: [
        { title: "Post-Surgery Cough", description: "Normal recovery or concern?", priority: "medium", reason: "Common post-surgery question" },
        { title: "Medication Timing", description: "When to take prescriptions", priority: "high", reason: "Critical for recovery" },
        { title: "When to Call Doctor", description: "Recognizing urgent symptoms", priority: "high", reason: "Safety and prevention" },
        { title: "Pain Management", description: "Safe relief options", priority: "medium", reason: "Comfort and healing" }
      ],
      caregiver: [
        { title: "Supporting Recovery", description: "How to help effectively", priority: "medium", reason: "Caregiver guidance" },
        { title: "Emergency Signs", description: "When to seek immediate help", priority: "high", reason: "Safety awareness" },
        { title: "Medication Safety", description: "Helping with prescriptions", priority: "high", reason: "Prevent errors" },
        { title: "Self-Care Tips", description: "Taking care of yourself", priority: "medium", reason: "Caregiver wellbeing" }
      ],
      supporter: [
        { title: "Crisis Recognition", description: "Warning signs to watch", priority: "high", reason: "Suicide prevention" },
        { title: "Supportive Communication", description: "What to say and when", priority: "medium", reason: "Effective support" },
        { title: "Community Resources", description: "Local help options", priority: "medium", reason: "Resource awareness" },
        { title: "Emergency Response", description: "When and how to act", priority: "high", reason: "Crisis intervention" }
      ]
    };

    return fallbacks[role as keyof typeof fallbacks] || fallbacks.patient;
  }

  private getFallbackSearchResults(request: AISearchRequest): any[] {
    const query = request.query.toLowerCase();
    return request.availableTopics
      .filter(topic => 
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.tags.some(tag => tag.toLowerCase().includes(query))
      )
      .slice(0, 6);
  }
}

export const bedrockService = new AWSBedrockService();
