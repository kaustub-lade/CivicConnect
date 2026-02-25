import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load all page components for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ReportIssue = lazy(() => import('./pages/ReportIssue'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CommunityMap = lazy(() => import('./pages/CommunityMap'));
const VolunteerHub = lazy(() => import('./pages/VolunteerHub'));
const Profile = lazy(() => import('./pages/Profile'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Loading fallback component
const PageLoader = () => (
  <Center h="calc(100vh - 80px)">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  </Center>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Box minH="100vh" bg="gray.50">
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route 
              path="/report" 
              element={
                <ProtectedRoute>
                  <ReportIssue />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/map" 
              element={
                <ProtectedRoute>
                  <CommunityMap />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/volunteer" 
              element={
                <ProtectedRoute>
                  <VolunteerHub />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
            </Suspense>
        </Box>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
