import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { bedrockService } from "./services/aws-bedrock";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search topics (general search)
  app.get('/api/search/:query/:role', async (req, res) => {
    try {
      const { query, role } = req.params;
      
      if (!query || query.length < 2) {
        return res.json([]);
      }

      // Get basic search results
      const searchResults = await storage.searchTopics(query, role as any);
      
      // Enhance with AI if available
      try {
        const enhancedResults = await bedrockService.enhanceSearch({
          query,
          role,
          availableTopics: searchResults.map(topic => ({
            id: topic.id.toString(),
            title: topic.title,
            description: topic.description,
            category: topic.category,
            tags: topic.tags || []
          }))
        });
        
        res.json(enhancedResults.length > 0 ? enhancedResults : searchResults);
      } catch (aiError) {
        console.error('AI enhancement failed, using basic search:', aiError);
        res.json(searchResults);
      }

      // Log the search
      await storage.createSearch({
        query,
        role: role as any,
        results: searchResults
      });

    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // Search topics by title only
  app.get('/api/search-topics/:query/:role', async (req, res) => {
    try {
      const { query, role } = req.params;
      
      if (!query || query.length < 2) {
        return res.json([]);
      }

      const searchResults = await storage.searchByTopicTitle(query, role as any);
      res.json(searchResults);

      // Log the search
      await storage.createSearch({
        query: `topic: ${query}`,
        role: role as any,
        results: searchResults
      });

    } catch (error) {
      console.error('Topic search error:', error);
      res.status(500).json({ error: 'Topic search failed' });
    }
  });

  // Get all topics for a role
  app.get('/api/topics/role/:role', async (req, res) => {
    try {
      const { role } = req.params;
      const topics = await storage.getTopicsByRole(role as any);
      res.json(topics);
    } catch (error) {
      console.error('Get topics by role error:', error);
      res.status(500).json({ error: 'Failed to get topics' });
    }
  });

  // Get topic by ID
  app.get('/api/topics/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const topic = await storage.getTopic(id);
      
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }
      
      res.json(topic);
    } catch (error) {
      console.error('Get topic error:', error);
      res.status(500).json({ error: 'Failed to get topic' });
    }
  });

  // Get topics by category
  app.get('/api/topics/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const topics = await storage.getTopicsByCategory(category);
      res.json(topics);
    } catch (error) {
      console.error('Get topics by category error:', error);
      res.status(500).json({ error: 'Failed to get topics' });
    }
  });

  // Get AI recommendations for role
  app.get('/api/recommendations/:role', async (req, res) => {
    try {
      const { role } = req.params;
      
      // Get stored recommendations
      const storedRecs = await storage.getRecommendationsByRole(role as any);
      
      // Get AI-enhanced recommendations
      try {
        const aiRecs = await bedrockService.generateRecommendations({
          role,
          recentTopics: [], // Could be enhanced with user activity
        });
        
        // Combine stored and AI recommendations
        const combinedRecs = await Promise.all(
          storedRecs.map(async (rec) => {
            const topic = await storage.getTopic(rec.topicId!);
            return {
              id: rec.id,
              title: topic?.title || 'Unknown Topic',
              description: topic?.description || '',
              priority: topic?.priority || 'medium',
              reason: rec.reason
            };
          })
        );

        // Add AI recommendations if available
        const allRecs = [...combinedRecs, ...aiRecs.slice(0, 4 - combinedRecs.length)];
        
        res.json(allRecs.slice(0, 4));
      } catch (aiError) {
        console.error('AI recommendations failed, using stored only:', aiError);
        
        const basicRecs = await Promise.all(
          storedRecs.slice(0, 4).map(async (rec) => {
            const topic = await storage.getTopic(rec.topicId!);
            return {
              id: rec.id,
              title: topic?.title || 'Unknown Topic',
              description: topic?.description || '',
              priority: topic?.priority || 'medium',
              reason: rec.reason
            };
          })
        );
        
        res.json(basicRecs);
      }

    } catch (error) {
      console.error('Recommendations error:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  });

  // Get recommendation with full topic data
  app.get('/api/recommendations/:id/topic', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const recWithTopic = await storage.getRecommendationWithTopic(id);
      
      if (!recWithTopic) {
        return res.status(404).json({ error: 'Recommendation not found' });
      }
      
      res.json(recWithTopic.topic);
    } catch (error) {
      console.error('Get recommendation topic error:', error);
      res.status(500).json({ error: 'Failed to get recommendation topic' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
