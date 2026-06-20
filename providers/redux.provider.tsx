"use client";

import { authApi } from "@/Redux/api/authApi";
import {
  hydrateAuth,
  setCredentials,
  tokenStorage,
  userStorage,
} from "@/Redux/features/auth/authSlice";
import { store } from "@/Redux/store/store";
import { useEffect } from "react";
import { Provider } from "react-redux";

/**
 * Runs once on the client after mount.
 * Reads the token and user from localStorage and puts them into Redux state
 * then fetches /auth/me to verify token and get latest user data
 */
function AuthHydrator() {
  useEffect(() => {
    const hydrateAndValidate = async () => {
      const token = tokenStorage.get();
      const storedUser = userStorage.get();
      if (token) {
        // Hydrate the token and stored user first
        store.dispatch(hydrateAuth({ token, user: storedUser }));
        try {
          // Fetch current user to verify token and get latest data
          const result = await store
            .dispatch(authApi.endpoints.getCurrentUser.initiate())
            .unwrap();
          if (result?.data) {
            // Update Redux state with the latest user data
            store.dispatch(
              setCredentials({ user: result.data, accessToken: token }),
            );
          }
        } catch (error) {
          // If fetching current user fails, clear auth
          const { clearAuth } = await import("@/Redux/features/auth/authSlice");
          store.dispatch(clearAuth());
        }
      }
    };

    hydrateAndValidate();
  }, []);

  return null;
}

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  );
}
