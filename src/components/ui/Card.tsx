import React from 'react';
import type { ColorScheme } from '../types';
import { getColorScheme } from '../types';

export interface CardBaseProps {
  /**
   * The icon to display at the top of the card
   * Should be an SVG icon or a React element that accepts className
   */
  icon: React.ReactElement<{ className?: string; 'aria-hidden'?: boolean }>;
  
  /**
   * The title of the service card
   */
  title: string;
  
  /**
   * The description text for the service
   */
  description: string;
  
  /**
   * Callback when the button is clicked
   */
  onButtonClick?: () => void;
  
  /**
   * Whether to show hover effects
   * @default true
   */
  hoverEffect?: boolean;

  /**
   * Color for hover and accent elements
   * @default 'cyan'
   */
  color?: ColorScheme;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
}

/**
 * A modern, responsive service card component with hover effects and call-to-action button.
 * Designed to match the Modiphy design language with a dark theme and cyan accents.
 */
export interface CardProps extends Omit<CardBaseProps, 'onButtonClick'>, 
  Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'color'> {
  /**
   * Callback when the button is clicked
   */
  onButtonClick?: () => void;
}

export default function Card({
  icon,
  title,
  description,
  onButtonClick,
  hoverEffect = true,
  color =   'cyan',
  className,
  style,
  ...props
}: CardProps) {

  const colorScheme = getColorScheme(color);
  const cardContent = (
    <div 
      className={`relative flex flex-col p-6 rounded-lg transition-all duration-300
        bg-background-grey border border-border-grey text-white overflow-hidden
        h-full min-h-[256px] ${hoverEffect ? `hover:-translate-y-1 ${colorScheme.hover.border}` : ''} ${className || ''}`}
      style={style}
      aria-label={`${title} - ${description}`}
      role="article"
      {...props}
    >
      {/* Icon and Title Row */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-16 h-16 rounded-lg ${colorScheme.trans} shrink-0 flex items-center justify-center`}>
          {React.cloneElement(icon, { 
            className: `w-8 h-8 ${colorScheme.text} transition-transform duration-300 group-hover:scale-110`,
            'aria-hidden': true 
          })}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-left">
            {title}
          </h3>
          
          {/* Content */}
          <div className="flex-1 flex flex-col">
            <p className="text-gray-300 text-sm mt-2 text-left">
              {description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      {hoverEffect && (
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none ${colorScheme.bg} rounded-lg`} />
      )}
    </div>
  );

  return cardContent;
};
