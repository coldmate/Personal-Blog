import { useAuth0 } from '@auth0/auth0-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  if (isLoading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!isAuthenticated) { loginWithRedirect(); return null; }
  return children;
}
