'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import API from '@/services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const refresh = useCallback(async () => {
    try {
      const { data } = await API.get('/auth/me');
      setUser(data.user);
      setError('');
    } catch (err) {
      setUser(null);
      if (err.response?.status === 401) router.replace('/login');
      else setError('Unable to verify your session. Please retry.');
    }
  }, [router]);

  useEffect(() => {
    const controller = new AbortController();
    API.get('/auth/me', { signal: controller.signal }).then(({ data }) => {
      setUser(data.user);
      setError('');
    }).catch(err => {
      if (controller.signal.aborted) return;
      setUser(null);
      if (err.response?.status === 401) router.replace('/login');
      else setError('Unable to verify your session. Please retry.');
    });
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      controller.abort();
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh, pathname, router]);

  const can = permission => Boolean(user?.permissions?.includes(permission));
  const denied = user && ((pathname === '/dashboard' && !can('data.write')) || (pathname === '/users' && !can('users.manage')));
  useEffect(() => {
    if (denied) router.replace('/history');
  }, [denied, router]);

  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      router.replace('/login');
    } catch {
      setError('Sign out failed. Please retry.');
    }
  };

  if (error) return <div role="alert">{error} <button onClick={refresh}>Retry</button></div>;
  if (!user || denied) return <p role="status">Checking access...</p>;
  return <AuthContext.Provider value={{ user, can, logout }}>{children}</AuthContext.Provider>;
}
