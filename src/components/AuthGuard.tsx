
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const user = useAuth();

  if (user === undefined) {
    return <p className="p-6">Loading...</p>;
  }

  if (user === null) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
}