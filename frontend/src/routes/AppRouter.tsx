import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { MainLayout } from '../components/MainLayout';
import UsersPage from '../pages/admin/UsersPage';

// Mock dashboard page for now
const Dashboard = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your Shipment Management dashboard.</p>
    </div>
);

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/admin/users" element={<UsersPage />} />
                        {/* Add more protected routes here */}
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
