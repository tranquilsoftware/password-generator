import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from './components/ui/Badge';
import { Copy, Eye, EyeOff, Download, Check, Lock, Shield, RotateCw, Key, Clock, ShieldCheck } from 'lucide-react';
import ServiceCardContainer from './components/ui/CardContainer';
import { PASSWORD_STRENGTH_DATA } from './components/utils/tableUtil';

// ===== TYPES =====
interface GeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  allowAmbiguous: boolean;
}

interface SecretResult {
  secret: string;
  strength: number;
  strengthLabel: string;
}

type GenerationMode = 'random' | 'deterministic';
const COLOR_SCHEME = 'cyan';

// ===== CRYPTO UTILITIES =====
class DeterministicGenerator {
  private static ITERATIONS = 10000;

  static async generate(
    masterInput: string,
    salt: string,
    options: GeneratorOptions
  ): Promise<string> {
    const canonical = JSON.stringify({
      seed: masterInput,
      salt: salt,
      length: options.length,
      sets: {
        U: options.uppercase,
        L: options.lowercase,
        N: options.numbers,
        S: options.symbols,
        A: options.allowAmbiguous
      },
      iterations: this.ITERATIONS
    });

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode('jwt-secret-generator-v1'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(canonical)
    );

    return this.expandToSecret(new Uint8Array(signature), options);
  }

  private static expandToSecret(bytes: Uint8Array, options: GeneratorOptions): string {
    const alphabet = this.buildAlphabet(options);
    if (alphabet.length === 0) return '';

    let result = '';
    let byteIndex = 0;

    while (result.length < options.length) {
      if (byteIndex >= bytes.length) {
        const newBytes = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
          newBytes[i] = (bytes[i] + result.length) % 256;
        }
        bytes = newBytes;
        byteIndex = 0;
      }

      const char = alphabet[bytes[byteIndex] % alphabet.length];
      result += char;
      byteIndex++;
    }

    return result;
  }

  private static buildAlphabet(options: GeneratorOptions): string {
    let alphabet = '';
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const upperAmbig = 'IO';
    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const lowerAmbig = 'ilo';
    const nums = '23456789';
    const numsAmbig = '01';
    const syms = '!@#$%^&*-_=+';

    if (options.uppercase) {
      alphabet += options.allowAmbiguous ? upper + upperAmbig : upper;
    }
    if (options.lowercase) {
      alphabet += options.allowAmbiguous ? lower + lowerAmbig : lower;
    }
    if (options.numbers) {
      alphabet += options.allowAmbiguous ? nums + numsAmbig : nums;
    }
    if (options.symbols) {
      alphabet += syms;
    }

    return alphabet;
  }
}

function generateRandomSecret(options: GeneratorOptions): string {
  const alphabet = buildAlphabet(options);
  if (alphabet.length === 0) return '';

  const array = new Uint8Array(options.length);
  crypto.getRandomValues(array);

  let result = '';
  for (let i = 0; i < options.length; i++) {
    result += alphabet[array[i] % alphabet.length];
  }

  return result;
}

function buildAlphabet(options: GeneratorOptions): string {
  let alphabet = '';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const upperAmbig = 'IO';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const lowerAmbig = 'ilo';
  const nums = '23456789';
  const numsAmbig = '01';
  const syms = '!@#$%^&*-_=+';

  if (options.uppercase) {
    alphabet += options.allowAmbiguous ? upper + upperAmbig : upper;
  }
  if (options.lowercase) {
    alphabet += options.allowAmbiguous ? lower + lowerAmbig : lower;
  }
  if (options.numbers) {
    alphabet += options.allowAmbiguous ? nums + numsAmbig : nums;
  }
  if (options.symbols) {
    alphabet += syms;
  }

  return alphabet;
}

function calculateStrength(secret: string, options: GeneratorOptions): SecretResult {
  let score = 0;
  const length = secret.length;

  score += Math.min(length * 2, 50);

  let charSets = 0;
  if (options.uppercase) charSets++;
  if (options.lowercase) charSets++;
  if (options.numbers) charSets++;
  if (options.symbols) charSets++;

  score += charSets * 10;

  if (length >= 64) score += 20;
  if (length >= 32 && charSets >= 3) score += 10;

  score = Math.min(score, 100);

  let label = 'Weak';
  if (score >= 80) label = 'Very Strong';
  else if (score >= 60) label = 'Strong';
  else if (score >= 40) label = 'Medium';

  return { secret, strength: score, strengthLabel: label };
}

// ===== COMPONENTS =====
const Header: React.FC = () => (
  <header className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-sm sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="https://i.imgur.com/CdnTZ20.png" alt="Tranquil Software Logo" className="w-6 h-6" />
          </div>
          <a 
            href="https://www.tranquilsoftware.com.au" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Tranquil Software
          </a>
          
        </div>
        {/*  optional todo: add navigation links
        <nav className="hidden md:flex gap-6">
          <a href="#" className="text-slate-300 hover:text-white transition">Home</a>
          <a href="#" className="text-slate-300 hover:text-white transition">About</a>
        </nav>
        */}
      </div>

    </div>
  </header>
);

const Hero: React.FC = () => (
  <section className="text-center py-16 px-6">
    <Badge
      variant="outline" 
      color="blue"
      children="Password Generator"
      className="inline-flex items-center gap-2 bg-blue-500/10 border-blue-500/20"
    />
    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
      Generate <span className="text-blue-400">Secure Passwords</span> Instantly
    </h1>
    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
      Create cryptographically secure passwords for your applications.
      Generate strong, unique passwords for all your authentication needs.
    </p>
  </section>
);

interface SecretPanelProps {
  secret: string;
  strength: number;
  strengthLabel: string;
  onRegenerate: () => void;
}

const SecretPanel: React.FC<SecretPanelProps> = ({ secret, strength, strengthLabel, onRegenerate }) => {
  const [revealed, setRevealed] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const REVEAL_AMT = 3;
  const displaySecret = !secret 
    ? <span className="text-slate-500 italic">Awaiting your input...</span>
    : revealed 
      ? secret 
      : secret.length <= REVEAL_AMT 
        ? '•'.repeat(secret.length) 
        : `${secret.substring(0, REVEAL_AMT)}${'•'.repeat(Math.max(0, secret.length - REVEAL_AMT))}${secret.substring(secret.length - REVEAL_AMT)}`;
  const strengthColor = strength >= 80 ? 'bg-green-500' : strength >= 60 ? 'bg-blue-500' : strength >= 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="max-w-4xl mx-auto px-6 mb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-lg text-slate-300 break-all flex-1 mr-4">
            {displaySecret}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRevealed(!revealed)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              aria-label={revealed ? 'Hide secret' : 'Show secret'}
            >
              {revealed ? <EyeOff className="w-5 h-5 text-slate-300" /> : <Eye className="w-5 h-5 text-slate-300" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              aria-label="Copy password"
            >
              {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
            </button>
            <button
              onClick={onRegenerate}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              aria-label="Generate new password"
              title="Generate new password"
            >
              <RotateCw className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Secret Strength</span>
            <span className={`font-semibold ${strength >= 80 ? 'text-green-400' : strength >= 60 ? 'text-blue-400' : strength >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {strengthLabel}
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${strengthColor} transition-all duration-500`} style={{ width: `${strength}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OptionsCardProps {
  options: GeneratorOptions;
  onChange: (options: GeneratorOptions) => void;
}

const OptionsCard: React.FC<OptionsCardProps> = ({ options, onChange }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Password Generation Options</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-slate-300 text-sm">Character Length: {options.length}</label>
          </div>
          <input
            type="range"
            min="16"
            max="512"
            value={options.length}
            onChange={(e) => onChange({ ...options, length: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="space-y-3">
          {[
            { key: 'uppercase', label: 'Uppercase Letters (A-Z)' },
            { key: 'lowercase', label: 'Lowercase Letters (a-z)' },
            { key: 'numbers', label: 'Numbers (0-9)' },
            { key: 'symbols', label: 'Symbols (!@#$%^&*)' },
            { key: 'allowAmbiguous', label: 'Allow Ambiguous (0,O,I,l)' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={options[key as keyof GeneratorOptions] as boolean}
                onChange={(e) => onChange({ ...options, [key]: e.target.checked })}
                className="w-5 h-5 bg-slate-800 border-2 border-slate-700 rounded checked:bg-blue-600 checked:border-blue-600 cursor-pointer"
              />
              <span className="text-slate-300 group-hover:text-white transition">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ModeToggleProps {
  mode: GenerationMode;
  onChange: (mode: GenerationMode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onChange }) => (
  <div className="flex gap-2 bg-slate-800 rounded-lg p-1 mb-6">
    <button
      onClick={() => onChange('random')}
      className={`flex-1 px-4 py-2 rounded-md transition font-medium ${
        mode === 'random' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
      }`}
    >
      Random
    </button>
    <button
      onClick={() => onChange('deterministic')}
      className={`flex-1 px-4 py-2 rounded-md transition font-medium ${
        mode === 'deterministic' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
      }`}
    >
      Deterministic
    </button>
  </div>
);

interface DeterministicInputsProps {
  masterInput: string;
  salt: string;
  onMasterChange: (value: string) => void;
  onSaltChange: (value: string) => void;
}

const DeterministicInputs: React.FC<DeterministicInputsProps> = ({
  masterInput,
  salt,
  onMasterChange,
  onSaltChange
}) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
    <h3 className="text-xl font-semibold text-white mb-4">Deterministic Inputs</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-slate-300 text-sm mb-2">Master Input / Seed</label>
        <input
          type="text"
          value={masterInput}
          onChange={(e) => onMasterChange(e.target.value)}
          placeholder="Enter master passphrase..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-slate-300 text-sm mb-2">Custom Salt</label>
        <input
          type="text"
          value={salt}
          onChange={(e) => onSaltChange(e.target.value)}
          placeholder="Enter custom salt..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
        <p className="text-yellow-400 text-sm">
          ⚠️ Same inputs will always generate the same secret. Keep your master input and salt secure.
        </p>
      </div>
    </div>
  </div>
);

interface BulkGeneratorProps {
  onGenerate: (count: number) => void;
}

const BulkGenerator: React.FC<BulkGeneratorProps> = ({ onGenerate }) => {
  const [count, setCount] = useState(10);

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
        <h3 className="text-lg font-semibold text-white">Bulk Generation</h3>
        <input
          type="number"
          min="1"
          max="1000"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 w-24 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => onGenerate(count)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Generate Multiple
        </button>
      </div>
    </div>
  );
};

const SecurityBestPractices: React.FC = () => {
  const practices = [
    { 
      title: 'Strong Passwords', 
      description: 'Use at least 12 characters with a mix of uppercase, lowercase, numbers, and symbols.',
      icon: <Key className="w-6 h-6" />,
    },
    { 
      title: 'Password Storage', 
      description: 'Store passwords securely using environment variables, never hardcode in source.',
      icon: <Lock className="w-6 h-6" />,
    },
    { 
      title: 'Regular Rotation', 
      description: 'Change passwords periodically and avoid reusing them across services.',
      icon: <RotateCw className="w-6 h-6" />,
    },
    { 
      title: 'Password Managers', 
      description: 'Use a trusted password manager to generate and store complex passwords.',
      icon: <ShieldCheck className="w-6 h-6" />,
    },
    { 
      title: 'Multi-Factor Auth', 
      description: 'Enable MFA for an additional layer of security beyond passwords.',
      icon: <Clock className="w-6 h-6" />,
    },
    { 
      title: 'Secure Transmission', 
      description: 'Always use HTTPS and implement proper security headers.',
      icon: <Shield className="w-6 h-6" />,
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 mb-16">
      <h2 className="text-3xl font-bold text-white text-center mb-4">Password Security Best Practices</h2>
      <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
        Learn how to create and manage secure passwords with industry best practices.
      </p>
      <ServiceCardContainer
        services={practices}
        columns={{ sm: 1, md: 2, lg: 3 }}
        className="max-w-7xl mx-auto"
        colour={COLOR_SCHEME}
      />
    </section>
  );
};

const StrengthGuide: React.FC = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Password Strength Guide</h2>
            <p className="text-slate-400 text-center mb-8 max-w-3xl mx-auto">
                Understand how password characteristics affect security and estimated time to crack.
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-800">
                        <tr>
                            <th className="text-left text-slate-300 px-6 py-4">Type</th>
                            <th className="text-left text-slate-300 px-6 py-4">Example</th>
                            <th className="text-left text-slate-300 px-6 py-4">Entropy</th>
                            <th className="text-left text-slate-300 px-6 py-4">Time to Crack*</th>
                            <th className="text-left text-slate-300 px-6 py-4">Security Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PASSWORD_STRENGTH_DATA.map((row, i) => (
                            <tr key={i} className="border-t border-slate-800">
                                <td className="px-6 py-4 text-slate-300">{row.type}</td>
                                <td className="px-6 py-4 font-mono text-blue-300">{row.example}</td>
                                <td className="px-6 py-4 text-slate-300">{row.entropy}</td>
                                <td className="px-6 py-4 font-medium text-green-300">{row.time}</td>
                                <td className="px-6 py-4">
                                    <Badge 
                                        color={row.badgeColor}
                                        variant="outline"
                                        size="sm"
                                    >
                                        {row.security}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Rest of the component remains the same */}
                <div className="p-4 bg-slate-800/50 text-slate-400 text-xs border-t border-slate-800">
                    * Estimated time to crack using modern hardware. Actual time may vary based on hashing algorithm and computing power.
                    <div className="mt-2">
                        <span className="font-medium text-slate-300">Tips for strong passwords:</span>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Use 16+ characters when possible</li>
                            <li>Include upper/lower case letters, numbers, and symbols</li>
                            <li>Avoid dictionary words and personal information</li>
                            <li>Consider using a passphrase (e.g., 'Coffee@8amTastesGreat!')</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer: React.FC = () => (
  <footer className="bg-slate-900 border-t border-slate-800 py-8">
    <div className="max-w-7xl mx-auto px-6">

      <p className="text-slate-400 text-sm">
        © {new Date().getFullYear()}{' '}
        <a 
          href="https://www.tranquilsoftware.com.au" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Tranquil Software
        </a>
        . All rights reserved.
      </p>
    </div>
  </footer>
);

// ===== MAIN APP =====
export default function App() {
  const [mode, setMode] = useState<GenerationMode>('random');
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 64,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    allowAmbiguous: false
  });
  const [masterInput, setMasterInput] = useState('');
  const [salt, setSalt] = useState('');
  const [result, setResult] = useState<SecretResult>({
    secret: '',
    strength: 0,
    strengthLabel: 'Weak'
  });

  const generateSecret = useCallback(async () => {
    let secret: string;

    if (mode === 'deterministic') {
      if (!masterInput || !salt) {
        secret = '';
      } else {
        secret = await DeterministicGenerator.generate(masterInput, salt, options);
      }
    } else {
      secret = generateRandomSecret(options);
    }

    const newResult = calculateStrength(secret, options);
    setResult(newResult);
  }, [mode, options, masterInput, salt]);

  useEffect(() => {
    generateSecret();
  }, [generateSecret]);

  const handleBulkGenerate = async (count: number) => {
    const secrets: string[] = [];
    
    for (let i = 0; i < count; i++) {
      let secret: string;
      if (mode === 'deterministic') {
        const indexedSalt = `${salt}-${i}`;
        secret = await DeterministicGenerator.generate(masterInput, indexedSalt, options);
      } else {
        secret = generateRandomSecret(options);
      }
      secrets.push(secret);
    }

    const csv = secrets.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passwords-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main>
        <Hero />
        
        {(
          <SecretPanel
            secret={result.secret}
            strength={result.strength}
            strengthLabel={result.strengthLabel}
            onRegenerate={generateSecret}
          />
        )}

        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="max-w-2xl mx-auto mb-8">
            <ModeToggle mode={mode} onChange={setMode} />
          </div>

          {mode === 'deterministic' && (
            <div className="max-w-2xl mx-auto">
              <DeterministicInputs
                masterInput={masterInput}
                salt={salt}
                onMasterChange={setMasterInput}
                onSaltChange={setSalt}
              />
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            <OptionsCard options={options} onChange={setOptions} />
        
            <div className="pt-6">
            <BulkGenerator onGenerate={handleBulkGenerate} />
            </div>
          </div>

          {/* <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <OptionsCard options={options} onChange={setOptions} />
            <BestPracticesCard />
          </div> */}
        </div>

        
        <SecurityBestPractices />
        <StrengthGuide />
      </main>
      <Footer />
    </div>
  );
}