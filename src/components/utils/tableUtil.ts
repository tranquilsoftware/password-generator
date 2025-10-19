import type { BadgeColor } from "../ui/Badge";

export interface CardColumns {
    sm: number;
    md: number;
    lg: number;
    xl?: number;
}
// Calculate columns based on number of services
export const calculateColumns = (count: number): CardColumns => {
  if (count <= 1)       return { sm: 1, md: 1, lg: 3, xl: 3 };
  if (count === 2)      return { sm: 1, md: 1, lg: 3, xl: 3 };
  // return { sm: 1, md: 1, lg: (count) }; // default to 3 columns for 3+ items

  if (count % 3 === 0)  return { sm: 1, md: 1, lg: 3, xl: 3 }; // divisible by 3, use 3 columns
  if (count % 2 === 0)  return { sm: 1, md: 1, lg: 2, xl: 2 }; // divisible by 2, use 2 columns
 
  return { sm: 1, md: 1, lg: 3, xl: 3 }; // default to 3 columns for odd numbers
};

export interface PasswordStrength {
    type: string;
    example: string;
    entropy: string;
    time: string;
    security: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong';
    badgeColor: BadgeColor;
}

// Password strength data
export const PASSWORD_STRENGTH_DATA: PasswordStrength[] = [
    { 
        type: 'Basic (8 chars, letters only)', 
        example: 'password', 
        entropy: '18 bits', 
        time: '< 1 second',
        security: 'Very Weak',
        badgeColor: 'red'  // Add this line
    },
    { 
        type: 'Simple (8 chars, mixed case, numbers)', 
        example: 'P@ssw0rd', 
        entropy: '30 bits', 
        time: '~2 days',
        security: 'Weak',
        badgeColor: 'yellow'  // Add this line
    },
    { 
        type: 'Moderate (12 chars, mixed case, numbers, symbols)', 
        example: 'P@ssw0rd!123', 
        entropy: '65 bits', 
        time: '3 months',
        security: 'Moderate',
        badgeColor: 'blue'  // Add this line
    },
    { 
        type: 'Strong (16+ chars, mixed case, numbers, symbols)', 
        example: 'P@ssw0rd!123#Secure', 
        entropy: '100+ bits', 
        time: 'Centuries',
        security: 'Strong',
        badgeColor: 'green'  // Add this line
    }
];