import type { GeneratorOptions } from './constants';

// FROZEN: every value and step below feeds the deterministic derivation.
// Changing any of them silently changes every password users have derived.
// `npm test` pins the output with known-answer vectors.
const HMAC_KEY = 'jwt-secret-generator-v1';
// Only a label inside the hashed JSON. No key stretching happens.
const ITERATIONS = 10000;

const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghjkmnpqrstuvwxyz';
const NUMS = '23456789';
const SYMS = '!@#$%^&*-_=+';

// Make input bytes identical on every device. HMAC is byte-exact, so the
// same glyph encoded differently (NFC vs NFD from another keyboard/IME/OS),
// a stray CR, or edge whitespace would otherwise yield a totally different
// secret. NFC-normalize, strip CR, trim edges -> one canonical byte stream.
function normalizeInput(input: string): string {
  return input.normalize('NFC').replace(/\r\n?/g, '\n').trim();
}

function buildAlphabet(options: GeneratorOptions): string {
  let alphabet = '';
  if (options.uppercase) alphabet += options.allowAmbiguous ? UPPER + 'IO' : UPPER;
  if (options.lowercase) alphabet += options.allowAmbiguous ? LOWER + 'ilo' : LOWER;
  if (options.numbers) alphabet += options.allowAmbiguous ? NUMS + '01' : NUMS;
  if (options.symbols) alphabet += SYMS;
  return alphabet;
}

// `index` derives the Nth bulk secret. It is appended after normalization so
// edge whitespace in the salt can't change bulk output either.
export async function generateDeterministicSecret(
  masterInput: string,
  salt: string,
  options: GeneratorOptions,
  index?: number
): Promise<string> {
  const seed = normalizeInput(masterInput);
  const baseSalt = normalizeInput(salt);
  if (!seed || !baseSalt) return '';

  const canonical = JSON.stringify({
    seed,
    salt: index === undefined ? baseSalt : `${baseSalt}-${index}`,
    length: options.length,
    sets: {
      U: options.uppercase,
      L: options.lowercase,
      N: options.numbers,
      S: options.symbols,
      A: options.allowAmbiguous
    },
    iterations: ITERATIONS
  });

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(HMAC_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(canonical));
  return expandToSecret(new Uint8Array(signature), options);
}

function expandToSecret(bytes: Uint8Array, options: GeneratorOptions): string {
  const alphabet = buildAlphabet(options);
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

    result += alphabet[bytes[byteIndex] % alphabet.length];
    byteIndex++;
  }

  return result;
}

export function generateRandomSecret(options: GeneratorOptions): string {
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
