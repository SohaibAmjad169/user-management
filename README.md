# User Management Application

A modern React TypeScript application for managing users with a clean, intuitive interface built using Feature-Sliced Design architecture.

## 🚀 Features

- **User Management**: Complete CRUD operations for users
- **Advanced Filtering**: Filter users by email and role
- **Sorting & Pagination**: Built-in table sorting and pagination
- **Role Management**: Inline role updates with dropdown
- **Status Management**: Visual status indicators with colored tags
- **Responsive Design**: Clean, modern UI that works on all devices
- **Real-time Updates**: Optimistic UI updates for better UX
- **Mock Backend**: MSW for API simulation during development

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **Data Fetching**: Apollo Client + GraphQL
- **UI Library**: Ant Design
- **Table Component**: AG Grid
- **Styling**: Emotion + Custom Theme
- **Build Tool**: Vite
- **Mock API**: Mock Service Worker (MSW)
- **Architecture**: Feature-Sliced Design (FSD)

## 📁 Project Structure

```
src/
├── app/
│   └── providers/          # Apollo Client, Theme, MSW providers
├── pages/
│   └── users/              # User list page
├── features/
│   ├── user-form/          # Add/Edit user modal
│   └── user-delete/        # Delete confirmation modal
├── entities/
│   └── user/               # User entity (types, queries, store)
├── shared/
│   ├── ui/                 # Reusable UI components
│   ├── lib/                # Utilities and mocks
│   └── config/             # Constants and theme
```

## 🎯 Core Functionality

### User List (Main Page)
- Display users in an AG Grid table with columns: ID, Name, Email, Role, Status, Creation Date
- Filter by email and role
- Sort by name and date
- Pagination support
- Action column with "Edit" and "Delete" buttons
- "Add User" button

### Add/Edit User
- Modal with form validation
- Fields: name, email, role (select), status (select)
- Save/Cancel buttons
- Success notifications
- Automatic table refresh

### Delete User
- Confirmation modal with user details
- Safe deletion with error handling
- Success notification

### Custom Table Features

**Status Column:**
- Values: active, banned, pending
- Colored tags: green, red, yellow

**Registration Date Column:**
- Format: DD.MM.YYYY, HH:mm
- Tooltip with full ISO date

**Role Column:**
- Values: admin, user, moderator
- Inline dropdown for role changes
- Real-time updates

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Theme Configuration
The application uses a custom Ant Design theme configured in `src/shared/config/theme.ts`. You can modify:
- Primary colors
- Border radius
- Font family
- Component-specific styling

### Mock Data
Mock user data is configured in `src/shared/lib/mocks.ts`. You can:
- Add more sample users
- Modify user properties
- Add custom GraphQL responses

## 🔧 Development Features

- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety throughout the application
- **Path Aliases**: Clean imports with `@` prefixes
- **ESLint**: Code quality enforcement
- **Mock Service Worker**: API simulation without backend

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built application will be in the `dist/` folder, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request
