import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";

interface CurrentUser {
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<CurrentUser | null | undefined>(undefined);
  // undefined = loading, null = not logged in, object = logged in

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  return user;
}
