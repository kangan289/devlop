# ArcadeCalc Dashboard - Modern Dark Theme

A completely redesigned React dashboard with a modern dark theme, inspired by the provided UI screenshot. Built with Tailwind CSS, Framer Motion, and Recharts.

## 🎨 Features

### 🟩 Profile Section
- **User Info Card**: Displays user avatar, name, membership date, and league status
- **Profile Stats**: Shows Arcade Points, Leaderboard Rank, and Total Badges
- **Modern Design**: Gradient backgrounds, hover effects, and smooth animations

### 🟨 Swag Tier Progress
- **Progress Bars**: Animated progress indicators for each swag tier
- **Tier Rewards**: Visual display of rewards for each tier
- **Current Tier Highlight**: Special highlighting for the user's current tier

### 🟦 Weekly Progress Graph
- **Interactive Chart**: Built with Recharts showing Monday-Sunday activity
- **Custom Tooltips**: Detailed breakdown on hover
- **Summary Stats**: Total points, peak day, and average calculations

### 🟪 ArcadeCalc Integration
- **Calculation Summary**: Shows last 5 calculation results
- **Total Points**: Displays points earned this season
- **Full Report Link**: Button to view complete ArcadeCalc report

### 🟥 Badge Categories
- **Category Grid**: Visual display of badge categories with icons
- **Filter System**: Filter by category type (All, Skill, Game, etc.)
- **Progress Indicators**: Visual progress bars for each category

### 🟧 Incomplete Badges
- **Badge Cards**: Individual cards for each incomplete badge
- **Search & Filter**: Advanced filtering and search functionality
- **Difficulty Tags**: Color-coded difficulty levels
- **Start Challenge**: Direct action buttons for each badge

## 🏗️ Architecture

### Components Structure
```
src/components/dashboard/
├── ProfileCard.tsx          # User profile and stats
├── SwagTiers.tsx           # Swag tier progress and rewards
├── ProgressChart.tsx       # Weekly progress chart
├── ArcadeCalcWidget.tsx    # ArcadeCalc integration widget
├── BadgeCategories.tsx     # Badge categories grid
└── IncompleteBadges.tsx    # Incomplete badges display
```

### State Management
- **DashboardContext**: Global state management for all dashboard data
- **Mock Data**: Comprehensive mock data for testing and development
- **Real-time Updates**: Context provides refresh functionality

### Styling
- **Tailwind CSS**: Utility-first styling with custom dark theme
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Mobile-first approach with grid layouts
- **Custom CSS**: Additional utilities for line-clamp, gradients, and effects

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Navigate to Dashboard**
   ```
   http://localhost:5173/dashboard
   ```

## 📱 Responsive Design

The dashboard is fully responsive with:
- **Mobile**: Single column layout with optimized touch targets
- **Tablet**: Two-column layout for better space utilization
- **Desktop**: Full four-column layout with sidebar

## 🎯 Key Features

### Dark Theme
- Consistent dark color palette
- Purple accent colors for highlights
- Subtle gradients and shadows
- Custom scrollbar styling

### Animations
- Page load animations
- Hover effects on cards and buttons
- Progress bar animations
- Smooth transitions between states

### Data Integration
- ArcadeCalc calculation logic integration
- Mock API structure for backend simulation
- Real-time data updates
- Error handling and loading states

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus indicators

## 🔧 Customization

### Colors
The dashboard uses a consistent color scheme:
- **Primary**: Purple (#8B5CF6)
- **Background**: Dark gray (#111827)
- **Cards**: Semi-transparent dark (#1F2937)
- **Text**: White and gray variations

### Components
All components are modular and can be easily customized:
- Props-based configuration
- Theme-aware styling
- Reusable design patterns

## 📊 Data Structure

### User Data
```typescript
interface User {
  name: string;
  avatar: string;
  memberSince: string;
  league: string;
  arcadePoints: number;
  leaderboardRank: number;
  totalBadges: number;
}
```

### Badge Data
```typescript
interface IncompleteBadge {
  id: string;
  title: string;
  category: string;
  difficulty: 'Introductory' | 'Intermediate' | 'Advanced';
  labsRequired: number;
  points: number;
  image: string;
  level?: string;
}
```

## 🎨 Design System

### Typography
- **Headings**: Bold, white text with proper hierarchy
- **Body**: Gray text for secondary information
- **Accent**: Purple text for highlights and links

### Spacing
- **Consistent**: 8px base unit system
- **Responsive**: Scales with screen size
- **Comfortable**: Generous padding for readability

### Icons
- **Lucide React**: Consistent icon library
- **Semantic**: Meaningful icons for each section
- **Accessible**: Proper ARIA labels

## 🔮 Future Enhancements

- [ ] Real API integration
- [ ] Real-time notifications
- [ ] Advanced filtering options
- [ ] Export functionality
- [ ] Dark/light theme toggle
- [ ] Customizable dashboard layout
- [ ] Performance optimizations
- [ ] Unit tests coverage

## 📝 License

This project is part of the ArcadeCalc application. All rights reserved. 