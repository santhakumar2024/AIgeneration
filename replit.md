# replit.md

## Overview

This repository contains "Decode My Care", a healthcare guidance application designed to help Veterans, caregivers, and community supporters navigate post-medical visit questions and concerns. The application provides personalized guidance based on user roles, AI-powered recommendations, dual search functionality, and an integrated chatbot for interactive support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack TypeScript architecture with a React frontend and Express.js backend, using PostgreSQL with Drizzle ORM for data persistence and AWS Bedrock for AI capabilities.

### Architecture Pattern
- **Frontend**: Single Page Application (SPA) using React with TypeScript
- **Backend**: REST API built with Express.js and TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **AI Integration**: AWS Bedrock for enhanced search and recommendations
- **Build System**: Vite for frontend bundling, esbuild for backend compilation

## Key Components

### Frontend Architecture
- **UI Framework**: React 18 with TypeScript, using Wouter for client-side routing
- **State Management**: Local React state with custom AppState management pattern
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **HTTP Client**: TanStack Query for server state management and caching

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with Neon Database (PostgreSQL) - now active and fully configured
- **Storage Pattern**: Repository pattern with automatic storage selection (database when available, memory for development)
- **Data Persistence**: PostgreSQL database with automatic schema migration and seeding
- **AI Services**: AWS Bedrock integration for search enhancement and recommendations
- **Development**: Vite middleware for hot reloading in development

### Database Schema
The application uses four main entities:
- **Users**: Basic user authentication (username/password)
- **Topics**: Healthcare guidance content with role-based targeting
- **Searches**: Search query logging and results tracking  
- **Recommendations**: AI-generated personalized recommendations

### User Role System
Three distinct user roles with personalized experiences:
- **Patient**: Direct healthcare recipients
- **Caregiver**: Family members or professional caregivers
- **Supporter**: Community members (EMS, faith leaders, friends)

## Data Flow

1. **Role Selection**: Users select their role on the welcome page, no authentication required
2. **Personalized Experience**: Content and recommendations are filtered based on selected role
3. **Search Functionality**: Real-time search with AI enhancement when available
4. **Topic Discovery**: Users can browse categorized guidance topics or view AI recommendations
5. **Content Display**: Topics are presented in a structured format with normal/monitor/urgent guidance levels

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Query, React Hook Form
- **UI Components**: Radix UI primitives, Lucide React icons
- **Backend**: Express.js, Drizzle ORM, Neon Database
- **Build Tools**: Vite, esbuild, TypeScript

### AI Integration
- **AWS Bedrock**: Claude or similar models for search enhancement and recommendation generation
- **Fallback Strategy**: Basic search and recommendation algorithms when AI services are unavailable

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit environment
- **Database Management**: Drizzle Kit for migrations and schema management
- **Type Safety**: End-to-end TypeScript with shared type definitions

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Full-stack hot reloading with Vite middleware
- **Database**: Neon Database connection via environment variables

### Production Deployment
- **Build Process**: Vite builds frontend to `dist/public`, esbuild bundles backend to `dist/index.js`
- **Static Serving**: Express serves built frontend assets in production
- **Environment Configuration**: Database URL and AWS credentials via environment variables
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

### Key Architectural Decisions

1. **No Authentication Required**: Simplified user experience with role-based personalization instead of user accounts
2. **AI Enhancement with Fallbacks**: AWS Bedrock enhances search and recommendations but system functions without it
3. **In-Memory Development Storage**: Allows development without database setup, with easy migration to PostgreSQL
4. **Shared TypeScript Types**: Common type definitions between frontend and backend ensure consistency
5. **Component-Based UI**: Modular React components with consistent design system for maintainability
6. **Dual Search System**: Both general content search and topic-specific search for improved discoverability
7. **Integrated Chatbot**: AI-powered conversational interface that opens with topic-specific guidance

## Recent Changes

### Database Integration (January 2025)
- **PostgreSQL Database**: Migrated from in-memory storage to persistent PostgreSQL database with Neon
- **Database Schema**: Implemented full Drizzle ORM setup with proper table relationships
- **Automatic Seeding**: Added comprehensive data seeding with 7 medical topics and role-based recommendations
- **Dual Storage Support**: System automatically detects DATABASE_URL and switches between memory and database storage
- **Schema Migration**: Successfully pushed database schema with all required tables

### Enhanced Search Functionality (January 2025)
- **Dual Search Types**: Added toggle between "General Search" (searches all content) and "Browse Topics" (searches topic titles only)
- **Enhanced Search API**: New `/api/search-topics` endpoint for topic-specific searches
- **Topic Browsing**: Users can browse all topics for their role when not searching
- **Improved UI**: Search type indicator and better result display with priority indicators

### Integrated Chatbot System (January 2025)
- **Conversational Interface**: Full chatbot component with message history
- **Topic-Specific Initialization**: Chatbot opens with complete topic guidance when cards/recommendations are clicked
- **Contextual Responses**: AI responses tailored to user questions about specific medical topics
- **Emergency Detection**: Special handling for emergency-related queries with crisis line information
- **Role-Aware Responses**: Responses consider user role (patient, caregiver, supporter)

### Expanded Content Library (January 2025)
- **Additional Medical Topics**: Added Pain Management, Emergency Signs, Crisis Support, and Medication Side Effects
- **Veteran-Focused Content**: Enhanced mental health crisis support for Veterans
- **Role-Specific Guidance**: Content tailored for community supporters and caregivers