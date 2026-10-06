import React from 'react';
import type { CardProps } from './Card';
import Card from './Card';
import type { ColorScheme } from '../types';
import { calculateColumns, type CardColumns } from '../utils/tableUtil';

export interface ServiceCardContainerProps {
  /**
   * Array of service card data
   */
  services: Omit<CardProps, 'onButtonClick'>[];
  
  /**
   * Callback when a service card button is clicked
   */
  onServiceClick?: (index: number, service: CardProps) => void;
  
  /**
   * Number of columns to display on different screen sizes
   * @default { sm: 1, md: 2, lg: 3 }
   */
  columns?: CardColumns;
  /**
   * Gap between grid items
   * @default '1.5rem'
   */
  gap?: string | number;

  /**
   * Color for hover and accent elements
   */
  colour?: ColorScheme;
  
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}


/**
 * A responsive container for displaying ServiceCard components in a grid layout.
nality, similar to CardTemplate.
 */
const ServiceCardContainer: React.FC<ServiceCardContainerProps> = ({
  services,
  onServiceClick,
  columns,
  gap = '1.5rem',
  colour,
  className,
}) => {
  // Use provided columns or calculate based on services count if not provided
  const gridColumns = columns || calculateColumns(services.length);
  
  // Get the first service's color if it exists, otherwise use the container's color or default
  const getServiceColor = (service: any) => 
    service.color || colour || 'cyan' as ColorScheme;
        
  return (
    <div className={`w-full ${className || ''}`}>
      <div 
        className={`grid gap-6 
          ${gridColumns.sm ? `grid-cols-${gridColumns.sm}` : ''} 
          ${gridColumns.md ? `md:grid-cols-${gridColumns.md}` : ''} 
          ${gridColumns.lg ? `lg:grid-cols-${gridColumns.lg}` : ''} 
          ${gridColumns.xl ? `xl:grid-cols-${gridColumns.xl}` : ''}`.replace(/\s+/g, ' ').trim()}
        style={{ gap: typeof gap === 'string' ? gap : `${gap}px` }}
      >
        {services.map((service: CardProps, index) => {
          return (  
            <Card
              key={`${service.title}-${index}`}
              {...service}
              onButtonClick={() => onServiceClick?.(index, service)}
              color={getServiceColor(service)}
              />
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCardContainer;
