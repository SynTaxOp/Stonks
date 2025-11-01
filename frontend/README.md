# Stonks Frontend

A modern React application for managing mutual fund investments with user authentication and dashboard functionality.

## Features

### Authentication
- **Login Page**: Secure login with loginId and password
- **SignUp Page**: User registration with validation and duplicate loginId checking
- **Persistent Sessions**: User sessions stored in localStorage
- **Protected Routes**: Dashboard only accessible after authentication

### Dashboard
- **User Dashboard**: Personalized dashboard with user information
- **Fund Search**: Search for mutual funds using the API
- **Portfolio Summary**: View investment summaries and performance
- **Navigation**: Multi-section navigation (Dashboard, Transactions, Fund Details, Profile)

### Components Structure
```
src/
├── components/
│   ├── Auth/
│   │   ├── Auth.jsx          # Main auth wrapper
│   │   ├── Login.jsx         # Login form
│   │   └── SignUp.jsx        # Registration form
│   ├── Dashboard/
│   │   ├── UserDashboard.jsx # Main user dashboard
│   │   ├── DashboardNavigation.jsx # Navigation component
│   │   ├── FundSearch.jsx    # Fund search functionality
│   │   ├── FundSummaryCard.jsx # Individual fund display
│   │   └── PortfolioSummary.jsx # Portfolio overview
│   └── common/
│       ├── LoadingSpinner.jsx # Loading indicator
│       └── ErrorMessage.jsx   # Error display
├── contexts/
│   └── AuthContext.jsx       # Authentication state management
├── services/
│   └── api.js                # API service functions
└── types/
    └── index.ts              # TypeScript type definitions
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## API Integration

The frontend integrates with the following backend APIs:

- `POST /api/users/login` - User authentication
- `POST /api/users` - User registration
- `GET /api/dashboard?userId={id}` - Dashboard data
- `GET /api/dashboard/searchFund?searchText={text}` - Fund search

## Authentication Flow

1. **Login**: User enters loginId and password
2. **Validation**: Credentials are validated against the backend
3. **Session**: User data is stored in localStorage
4. **Dashboard**: User is redirected to personalized dashboard
5. **Logout**: User session is cleared and redirected to login

## SignUp Flow

1. **Registration**: User enters name, loginId, password, and confirmation
2. **Validation**: Client-side validation for all fields
3. **Duplicate Check**: Backend validates unique loginId
4. **Success**: User is automatically logged in and redirected to dashboard
5. **Error Handling**: Clear error messages for duplicate loginId or validation failures

## Technologies Used

- **React 18** - Frontend framework
- **Tailwind CSS** - Styling and responsive design
- **Axios** - HTTP client for API calls
- **Context API** - State management
- **Local Storage** - Session persistence

## Development Notes

- All components are functional components with hooks
- TypeScript interfaces are defined for type safety
- Responsive design works on desktop and mobile
- Error handling is implemented throughout the application
- Loading states provide good user experience