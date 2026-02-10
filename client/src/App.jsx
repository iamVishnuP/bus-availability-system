import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LoginRegister from './components/Auth/LoginRegister';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserDashboard from './components/User/UserDashboard';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginRegister />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user"
                        element={
                            <ProtectedRoute>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;

