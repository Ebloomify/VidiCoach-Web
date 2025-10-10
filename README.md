# VidiCoach Web

A modern drone video management platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎥 Video upload and management
- 🔐 User authentication
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 📊 Dashboard with statistics
- 🔄 Real-time upload progress

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **UI Components**: Ant Design
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd VidiCoach-Web
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── videos/            # Video pages
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── features/         # Feature components
│   └── layout/           # Layout components
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── store/                # Zustand stores
├── types/                # TypeScript types
└── constants/            # Constants
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Development Guidelines

### Component Structure
- Use functional components with TypeScript
- Follow the container/view pattern for complex components
- Keep components small and focused on single responsibility

### State Management
- Use Zustand for global state
- Keep local state in components when possible
- Use custom hooks for shared logic

### Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use consistent spacing and color scheme

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.