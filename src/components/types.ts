import type { BadgeColor } from "./ui/Badge";

// Color scheme types and helpers
export type ColorScheme = 'cyan' | 'red' | 'lime' | 'purple' | 'navy' | 'blue';

export interface ColorSchemeConfig {
  raw: string;  // for badgeTemplate, currently used in BaseCaseStudy
  // Core colors
  text: string;
  border: string;
  bg: string;
  trans: string;
  darkTrans: string;
  hover: {
    bg: string;
    text: string;
    border: string;
  };
  // Button styles
  button: {
    text: string;
    border: string;
    hover: {
      bg: string;
      text: string;
      border: string;
    };
  };
  gradient: {
    primary: string;
    secondary: string;
  };
}


export const colorSchemes: Record<ColorScheme, ColorSchemeConfig> = {
  cyan: {
    raw: 'cyan',
    text: 'text-cyan-400',
    border: 'border-cyan-300',
    bg: 'bg-cyan-400',
    trans: 'bg-cyan-400/25',
    darkTrans: 'bg-cyan-400/75',
    hover: {
      bg: 'hover:bg-cyan-400',
      text: 'hover:text-slate-900',
      border: 'hover:border-cyan-400'
    },
    button: {
      text: 'text-cyan-400',
      border: 'border-cyan-400',
      hover: {
        bg: 'hover:bg-cyan-400',
        text: 'hover:text-slate-900',
        border: 'hover:border-cyan-400'
      }
    },
    gradient: {
      primary: 'rgba(59, 130, 246, 0.9)',
      secondary: 'rgba(59, 130, 246, 0.5)'
    }
  },
  red: {
    raw: 'red',
    text: 'text-[#FF6B6B]',
    border: 'border-[#FF6B6B]',
    bg: 'bg-[#FF6B6B]',
    trans: 'bg-[#FF6B6B]/25',
    darkTrans: 'bg-[#FF6B6B]/75',
    hover: {
      bg: 'hover:bg-[#FF6B6B]',
      text: 'hover:text-slate-900',
      border: 'hover:border-[#FF6B6B]'
    },
    button: {
      text: 'text-[#FF6B6B]',
      border: 'border-[#FF6B6B]',
      hover: {
        bg: 'hover:bg-[#FF6B6B]',
        text: 'hover:text-slate-900',
        border: 'hover:border-[#FF6B6B]'
      }
    },
    gradient: {
      primary: 'rgba(255, 107, 107, 0.9)',
      secondary: 'rgba(100, 38, 38, 0.8)'
    }
  },

  lime: {
    raw: 'lime',
    text: 'text-[#C6FE3D]',
    border: 'border-[#C6FE3D]',
    bg: 'bg-[#C6FE3D]',
    trans: 'bg-[#C6FE3D]/25',
    darkTrans: 'bg-[#C6FE3D]/75',
    hover: {
      bg: 'hover:bg-[#C6FE3D]',
      text: 'hover:text-slate-900',
      border: 'hover:border-[#C6FE3D]'
    },
    button: {
      text: 'text-[#C6FE3D]',
      border: 'border-[#C6FE3D]',
      hover: {
        bg: 'hover:bg-[#C6FE3D]',
        text: 'hover:text-slate-900',
        border: 'hover:border-[#C6FE3D]'
      }
    },
    gradient: {
      primary: 'rgba(206, 254, 61, 0.9)',
      secondary: 'rgba(100, 38, 38, 0.8)'
    }
  },
  purple: {
    raw: 'purple',
    text: 'text-purple-400',
    border: 'border-purple-300',
    bg: 'bg-purple-400',
    trans: 'bg-purple-400/25',
    darkTrans: 'bg-purple-400/75',
    hover: {
      bg: 'hover:bg-purple-400',
      text: 'hover:text-slate-900',
      border: 'hover:border-purple-400'
    },
    button: {
      text: 'text-purple-400',
      border: 'border-purple-400',
      hover: {
        bg: 'hover:bg-purple-400',
        text: 'hover:text-slate-900',
        border: 'hover:border-purple-400'
      }
    },
    gradient: {
      primary: 'rgba(167, 139, 250, 0.9)',
      secondary: 'rgba(88, 28, 135, 0.8)'
    }
  },
  navy: {
    raw: 'navy',
    text: 'text-blue-600',
    border: 'border-blue-500',
    bg: 'bg-blue-600',
    trans: 'bg-blue-600/25',
    darkTrans: 'bg-blue-600/75',
    hover: {
      bg: 'hover:bg-blue-500',
      text: 'hover:text-white',
      border: 'hover:border-blue-400'
    },
    button: {
      text: 'text-blue-500',
      border: 'border-blue-500',
      hover: {
        bg: 'hover:bg-blue-600',
        text: 'hover:text-white',
        border: 'hover:border-blue-400'
      }
    },
    gradient: {
      primary: 'rgba(37, 99, 235, 0.9)',
      secondary: 'rgba(29, 78, 216, 0.8)'
    }
  },
  blue: {
    raw: 'blue',
    text: 'text-blue-400',
    border: 'border-blue-300',
    bg: 'bg-blue-400',
    trans: 'bg-blue-400/25',
    darkTrans: 'bg-blue-400/75',
    hover: {
      bg: 'hover:bg-blue-400',
      text: 'hover:text-slate-900',
      border: 'hover:border-blue-400'
    },
    button: {
      text: 'text-blue-400',
      border: 'border-blue-400',
      hover: {
        bg: 'hover:bg-blue-400',
        text: 'hover:text-slate-900',
        border: 'hover:border-blue-400'
      }
    },
    gradient: {
      primary: 'rgba(96, 165, 250, 0.9)',
      secondary: 'rgba(59, 130, 246, 0.8)'
    }
  }
};

// Convert colorScheme obj to BadgeColor
export const mapColorSchemeToBadgeColor = (colorScheme: ColorScheme): BadgeColor => {
  // cant map blueBlock, hallowRed, rainbow.
  switch (colorScheme) {
    case 'cyan':
      return 'cyan';
    case 'red':
      return 'red';
    case 'lime':
      return 'lime';
    case 'purple':
      return 'purple';
    case 'blue':
      return 'blue';
    default:
      return 'cyan';
  }
};


/**
 * 
 * @param color 'cyan'
 * @returns ColorSchemeConfig of color config
 */
export const getColorScheme = (color: ColorScheme = 'cyan'): ColorSchemeConfig => {
  return colorSchemes[color] || colorSchemes.cyan;
}; 
/// END ServiceShwocase (also in ServiceCard.tsx)
