import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
