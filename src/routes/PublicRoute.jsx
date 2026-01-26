import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function PublicRoute({ children }) {
  const { authUser, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!authUser) {
    return children;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  
  if (profile.exists === false) {
    return <Navigate to="/register" replace />;
  }

  if (!profile.registered) {
    return <Navigate to="/questionnaire" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
