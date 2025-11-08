import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthGuard({ children }) {
  const user = useAuth();

  if (user === undefined) {
    return <p className="p-6">Loading...</p>;
  }

  if (user === null) {
    return <Navigate to="/account" replace />;
  }

  return children;
}
