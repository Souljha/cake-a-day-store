# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Prerequisites:** Node.js and a Gemini API key

### Setup
```bash
npm install
# Set GEMINI_API_KEY in .env.local to your Gemini API key
```

### Development
```bash
npm run dev        # Start development server
npm run build      # Build for production  
npm run preview    # Preview production build
```

## Architecture

This is a React + TypeScript cake bakery website that integrates with Google's Gemini AI for custom cake design generation.

### Core Structure
- **App.tsx**: Main app component with cart state management and section navigation
- **components/**: React components for different sections (Header, Menu, CustomCakeDesigner, etc.)
- **services/geminiService.ts**: Google Gemini AI integration for generating custom cake details and images
- **constants.ts**: Menu data and business contact information
- **types.ts**: TypeScript interfaces for menu items, orders, and customer data

### Key Features
- **Cart System**: Shopping cart with quantity management and checkout modal
- **Custom Cake Designer**: Uses Gemini AI to generate cake descriptions, names, pricing, and images based on user prompts
- **Menu System**: Pre-defined cake categories with pricing in South African Rand
- **Order History**: Local storage-based order tracking
- **Smooth Navigation**: Ref-based scrolling between sections

### AI Integration
- Uses `@google/genai` package for Gemini API calls
- Two main AI functions:
  - `generateCakeDetails()`: Creates structured cake data (name, description, price)
  - `generateCakeImage()`: Generates realistic cake photos using Imagen 4.0
- Error handling with user-friendly messages for API failures and safety filters

### Environment Configuration
- Vite build system with environment variable injection
- API key configured in `.env.local` as `GEMINI_API_KEY`
- Path alias `@/*` maps to project root

### State Management
- React hooks for cart, modal states, and navigation
- Local storage for order history persistence
- No external state management library used

## Important Notes
- All pricing is in South African Rand (R)
- Business located in Durban, South Africa (contact info in constants.ts:4-5)
- Images use placeholder service (picsum.photos) for menu items
- Custom cake images generated via Gemini's Imagen model