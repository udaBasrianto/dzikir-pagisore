import React, { memo, useMemo } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  dependencies?: any[];
}

// Component wrapper for expensive calculations
export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = memo(({ 
  children, 
  dependencies = [] 
}) => {
  const memoizedChildren = useMemo(() => children, dependencies);
  return <>{memoizedChildren}</>;
});

// Debounce hook for search inputs and user interactions
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Lazy loading component for images and heavy content
export const LazyContent: React.FC<{
  children: React.ReactNode;
  threshold?: number;
}> = ({ children, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-20 bg-muted/20 animate-pulse rounded" />}
    </div>
  );
};

PerformanceOptimizer.displayName = 'PerformanceOptimizer';