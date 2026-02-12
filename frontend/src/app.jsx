import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { useAuth } from './context/AuthContext';

function PrivateRoute({ children }) {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/sign-in" />;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="recent" element={<Dashboard />} />
                    <Route path="shared" element={<Dashboard />} />
                    <Route path="favorites" element={<Dashboard />} />
                    <Route path="trash" element={<Dashboard />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
