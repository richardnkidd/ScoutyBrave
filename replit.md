# Scouty the Brave - Game Development Project

## Overview

This is a 2D pixel-art adventure game called "Scouty the Brave" built with a modern web stack. The project combines a Kaboom.js-based game engine for the core gameplay with a React/TypeScript frontend for UI components. The architecture supports both traditional 2D game development and modern web development patterns.

## System Architecture

### Frontend Architecture
- **Game Engine**: Kaboom.js for 2D game mechanics and rendering
- **UI Framework**: React with TypeScript for modern component-based UI
- **Styling**: Tailwind CSS with Radix UI components for consistent design
- **3D Support**: React Three Fiber and Drei for potential 3D elements
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Management**: In-memory storage with extensible interface
- **Development**: Hot module replacement via Vite integration

### Hybrid Game Architecture
The project uses a dual approach:
1. **Kaboom.js Scene System**: Traditional game scenes (title, game, gameover)
2. **React Component System**: Modern UI overlays and interfaces

## Key Components

### Game Core (Kaboom.js)
- **Scene Management**: Title screen, main game, and game over scenes
- **Player System**: Character with movement, jumping, and cowering mechanics
- **Obstacle System**: Dynamic obstacle spawning with different types (box, bag, leaf)
- **Pickup System**: Heart collectibles that reduce fear levels
- **Audio System**: Background music and sound effects with mute controls

### React UI Layer
- **Game State Management**: Zustand stores for game phase and audio control
- **Component Library**: Comprehensive Radix UI component set
- **Mobile Responsiveness**: Mobile-first design with touch controls
- **Interface Overlays**: Game controls, score display, and menu systems

### Data Layer
- **User Schema**: Basic user authentication structure with Drizzle ORM
- **Storage Interface**: Abstracted storage layer supporting memory and database backends
- **Query Management**: TanStack Query for server state management

## Data Flow

1. **Game Initialization**: Kaboom.js initializes canvas and loads assets
2. **Scene Transitions**: State-driven scene changes between title, game, and gameover
3. **Player Input**: Keyboard controls for movement and actions
4. **Collision Detection**: Real-time collision between player, obstacles, and pickups
5. **State Updates**: Fear meter, score, and game progression tracking
6. **Audio Management**: Context-aware sound playing with user preference controls

## External Dependencies

### Core Game Dependencies
- **Kaboom.js**: 2D game engine for sprites, physics, and audio
- **React Three Fiber**: 3D rendering capabilities for future expansion
- **Web Audio API**: Browser-native audio processing

### UI Dependencies
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for UI elements

### Backend Dependencies
- **Neon Database**: PostgreSQL hosting service
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Web server framework

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit's development environment
- **Hot Reload**: Vite provides instant feedback during development
- **Port Configuration**: Express server on port 5000 with proxy support

### Production Build
- **Asset Optimization**: Vite builds optimized game assets and UI bundles
- **Server Bundle**: ESBuild creates production server bundle
- **Static Assets**: Game sprites, sounds, and fonts served statically

### Hosting Configuration
- **Autoscale Deployment**: Configured for Replit's autoscale hosting
- **Asset Loading**: Support for GLTF models, audio files, and textures
- **Environment Variables**: Database URL and other secrets via environment

## Changelog

Changelog:
- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.