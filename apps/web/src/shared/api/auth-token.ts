const AUTH_TOKEN_KEY = "expense-tracker.auth-token";

export const getAuthToken = (): string | null =>
  window.localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token: string): void => {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
};
