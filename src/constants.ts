// ===== GENERATOR SSOT =====
// Single source of truth for generator types + default options.

export interface GeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  allowAmbiguous: boolean;
}

export interface SecretResult {
  secret: string;
  strength: number;
  strengthLabel: string;
}

export const DEFAULT_GENERATOR_OPTIONS: GeneratorOptions = {
  length: 64,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  allowAmbiguous: false,
};

export const DEFAULT_SECRET_RESULT: SecretResult = {
  secret: '',
  strength: 0,
  strengthLabel: 'Weak',
};
