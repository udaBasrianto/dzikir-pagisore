import React from 'react';
import { Card } from '@/components/ui/card';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  animation?: 'fade-in' | 'slide-up' | 'scale-in';
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  animation = 'fade-in',
  ...props 
}) => {
  const animationClasses = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'scale-in': 'animate-scale-in'
  };

  const style = delay > 0 ? { animationDelay: `${delay}ms` } : {};

  return (
    <Card 
      className={`${animationClasses[animation]} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Card>
  );
};