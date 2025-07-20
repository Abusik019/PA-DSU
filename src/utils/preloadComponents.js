import { useEffect } from 'react';

// Хук для предварительной загрузки компонентов
export const usePreloadComponents = (components) => {
  useEffect(() => {
    const preloadComponent = async (component) => {
      try {
        await component();
      } catch (error) {
        console.warn('Failed to preload component:', error);
      }
    };

    const timer = setTimeout(() => {
      components.forEach(preloadComponent);
    }, 1000);

    return () => clearTimeout(timer);
  }, [components]);
};
