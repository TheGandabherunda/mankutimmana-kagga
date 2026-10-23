import React, { createContext, useContext, useState, useEffect } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'explore'; theme?: string; query?: string; page?: number }
  | { name: 'reader'; id: number }
  | { name: 'bookmarks' }
  | { name: 'about' }
  | { name: 'api-docs' }
  | { name: 'not-found' };

interface RouterContextValue {
  route: Route;
  navigate: (to: string | Route) => void;
  getBaseUrl: () => string;
}

const RouterContext = createContext<RouterContextValue | null>(null);

/**
 * Normalizes URL path according to Vite's configured BASE_URL
 */
function parsePath(pathname: string, search: string, hash: string): Route {
  // Strip base URL if running under a subpath (e.g. /mankutimmana-kagga/)
  const basePath = import.meta.env.BASE_URL || '/';
  let cleanPath = pathname;
  if (basePath !== '/' && cleanPath.startsWith(basePath)) {
    cleanPath = cleanPath.slice(basePath.length - 1);
  }

  // Handle hash-based fallbacks (e.g. #/kagga/42 or #kagga-42)
  if (hash.startsWith('#/')) {
    cleanPath = hash.slice(1);
  } else if (hash.startsWith('#kagga-')) {
    const id = parseInt(hash.replace('#kagga-', ''), 10);
    if (!isNaN(id) && id >= 1 && id <= 945) {
      return { name: 'reader', id };
    }
  }

  const searchParams = new URLSearchParams(search);

  // Match /kagga/42 or /kaggas/42
  const kaggaMatch = cleanPath.match(/^\/(?:kagga|kaggas)\/(\d+)$/i);
  if (kaggaMatch) {
    const id = parseInt(kaggaMatch[1], 10);
    if (id >= 1 && id <= 945) {
      return { name: 'reader', id };
    }
    return { name: 'not-found' };
  }

  if (cleanPath === '' || cleanPath === '/' || cleanPath === '/index.html') {
    return { name: 'home' };
  }

  if (cleanPath.startsWith('/explore')) {
    const theme = searchParams.get('theme') || undefined;
    const query = searchParams.get('q') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    return { name: 'explore', theme, query, page: isNaN(page) ? 1 : page };
  }

  if (cleanPath.startsWith('/bookmarks')) {
    return { name: 'bookmarks' };
  }

  if (cleanPath.startsWith('/about')) {
    return { name: 'about' };
  }

  if (cleanPath.startsWith('/api') || cleanPath.startsWith('/api-docs')) {
    return { name: 'api-docs' };
  }

  return { name: 'not-found' };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<Route>(() =>
    parsePath(window.location.pathname, window.location.search, window.location.hash)
  );

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath(window.location.pathname, window.location.search, window.location.hash));
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string | Route) => {
    const basePath = import.meta.env.BASE_URL || '/';
    let targetPath = '';

    if (typeof to === 'string') {
      targetPath = to.startsWith('/') ? to : `/${to}`;
    } else {
      switch (to.name) {
        case 'home':
          targetPath = '/';
          break;
        case 'explore': {
          const params = new URLSearchParams();
          if (to.theme) params.set('theme', to.theme);
          if (to.query) params.set('q', to.query);
          if (to.page && to.page > 1) params.set('page', to.page.toString());
          const qs = params.toString();
          targetPath = `/explore${qs ? `?${qs}` : ''}`;
          break;
        }
        case 'reader':
          targetPath = `/kagga/${to.id}`;
          break;
        case 'bookmarks':
          targetPath = '/bookmarks';
          break;
        case 'about':
          targetPath = '/about';
          break;
        case 'api-docs':
          targetPath = '/api-docs';
          break;
        case 'not-found':
          targetPath = '/404';
          break;
      }
    }

    // Prepend base path safely
    const fullPath =
      basePath === '/'
        ? targetPath
        : `${basePath.replace(/\/$/, '')}${targetPath}`;

    window.history.pushState({}, '', fullPath);
    setRoute(parsePath(fullPath, window.location.search, window.location.hash));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getBaseUrl = (): string => {
    return import.meta.env.BASE_URL || '/';
  };

  return (
    <RouterContext.Provider value={{ route, navigate, getBaseUrl }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter(): RouterContextValue {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
