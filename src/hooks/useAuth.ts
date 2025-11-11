/* eslint-disable @typescript-eslint/no-explicit-any */

import { getCurrentUser } from "../services/auth";

export function useAuth() {
  const currentUser = getCurrentUser();
  return currentUser;
}
