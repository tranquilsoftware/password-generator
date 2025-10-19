import type { ReactNode } from 'react';

export interface ServiceCardProps {
  /**
   * The icon to display at the top of the card
   * Can be an SVG icon or any React element
   */
  icon: ReactNode;
  
  /**
   * The title of the service card
   */
  title: string;
  
  /**
   * The description text for the service
   */
  description: string;
  
  /**
   * Text for the call-to-action button
   * @default 'Learn More'
   */
  buttonText?: string;
  
  /**
   * Callback when the button is clicked
   */
  onButtonClick?: () => void;
  
  /**
   * Additional CSS classes for the card container
   */
  className?: string;
  
  /**
   * Whether to show a hover effect
   * @default true
   */
  hoverEffect?: boolean;
  
  /**
   * Custom styles for the card
   */
  style?: React.CSSProperties;
}

export interface ServiceCardContainerProps {
  /**
   * Array of service card data
   */
  services: Omit<ServiceCardProps, 'onButtonClick'>[];
  
  /**
   * Callback when a service card button is clicked
   */
  onServiceClick?: (index: number, service: ServiceCardProps) => void;
  
  /**
   * Number of columns to display on different screen sizes
   * @default { sm: 1, md: 2, lg: 3 }
   */
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  
  /**
   * Gap between grid items
   * @default '1.5rem'
   */
  gap?: string | number;
  
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  
  /**
   * Whether to enable search functionality
   * @default false
   */
  searchable?: boolean;
  
  /**
   * Custom search placeholder text
   * @default 'Search services...'
   */
  searchPlaceholder?: string;
  
  /**
   * Custom search input component
   */
  searchComponent?: ReactNode;
  
  /**
   * Whether to show a "View All" button when search is active
   * @default true
   */
  showViewAllButton?: boolean;
}

export interface ServiceCardGridProps {
  /**
   * Array of service card data
   */
  services: ServiceCardProps[];
  
  /**
   * Callback when a service card button is clicked
   */
  onServiceClick?: (index: number, service: ServiceCardProps) => void;
  
  /**
   * Number of columns to display on different screen sizes
   * @default { sm: 1, md: 2, lg: 3 }
   */
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  
  /**
   * Whether to enable search functionality
   * @default false
   */
  searchable?: boolean;
}
