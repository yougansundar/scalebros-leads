/**
 * Phone Number Normalization and Formatting Utilities
 * Specially optimized for Indian phone numbers (+91) and international mobile formats.
 */

export interface PhoneNormalizationResult {
  raw: string;
  normalized: string; // purely digits with country code (e.g., 919876543210)
  formatted: string; // human readable (e.g., +91 98765 43210)
  isValid: boolean;
  countryCode: string;
  nationalNumber: string;
}

/**
 * Normalizes any raw phone input:
 * - Strips whitespace, dashes, brackets, plus signs
 * - Auto-prefixes '91' for 10-digit Indian numbers
 * - Converts leading '0' (trunk prefix) to '91'
 * - Retains existing country codes
 */
export function normalizePhoneNumber(rawPhone: string): PhoneNormalizationResult {
  if (!rawPhone) {
    return {
      raw: '',
      normalized: '',
      formatted: 'Not Available',
      isValid: false,
      countryCode: '',
      nationalNumber: '',
    };
  }

  // Remove all non-numeric characters except leading '+' if present
  let cleanDigits = rawPhone.replace(/\D/g, '');

  let normalized = cleanDigits;
  let countryCode = '91';
  let nationalNumber = cleanDigits;

  // Case 1: 10-digit Indian number (starting with 6, 7, 8, 9)
  if (/^[6-9]\d{9}$/.test(cleanDigits)) {
    normalized = `91${cleanDigits}`;
    countryCode = '91';
    nationalNumber = cleanDigits;
  }
  // Case 2: 11-digit number with leading 0 (e.g., 09876543210)
  else if (/^0[6-9]\d{9}$/.test(cleanDigits)) {
    const stripped = cleanDigits.slice(1);
    normalized = `91${stripped}`;
    countryCode = '91';
    nationalNumber = stripped;
  }
  // Case 3: 12-digit number already prefixed with 91 (e.g., 919876543210)
  else if (/^91[6-9]\d{9}$/.test(cleanDigits)) {
    normalized = cleanDigits;
    countryCode = '91';
    nationalNumber = cleanDigits.slice(2);
  }
  // Case 4: Other international numbers (at least 10 digits)
  else if (cleanDigits.length >= 10 && cleanDigits.length <= 15) {
    normalized = cleanDigits;
    countryCode = cleanDigits.length > 10 ? cleanDigits.slice(0, cleanDigits.length - 10) : '91';
    nationalNumber = cleanDigits.slice(-10);
  }

  const isValid = /^\d{10,15}$/.test(normalized) && normalized.length >= 10;

  // Format display string (+91 98765 43210)
  let formatted = normalized;
  if (normalized.startsWith('91') && normalized.length === 12) {
    const p1 = normalized.slice(2, 7);
    const p2 = normalized.slice(7);
    formatted = `+91 ${p1} ${p2}`;
  } else if (isValid) {
    formatted = `+${normalized}`;
  } else {
    formatted = rawPhone || 'Invalid Number';
  }

  return {
    raw: rawPhone,
    normalized,
    formatted,
    isValid,
    countryCode,
    nationalNumber,
  };
}

export interface VerificationCheckResult {
  input: string;
  expectedNormalized: string;
  actualNormalized: string;
  expectedFormatted: string;
  actualFormatted: string;
  passed: boolean;
  notes: string;
}

/**
 * Self-verification test runner for phone number formatting
 * Specifically verifies auto-prefixing +91 for 10-digit Indian numbers and symbol stripping.
 */
export function runPhoneVerificationSuite(): VerificationCheckResult[] {
  const testCases = [
    {
      input: '9842155678',
      expectedNormalized: '919842155678',
      expectedFormatted: '+91 98421 55678',
      notes: '10-digit standard Indian mobile number',
    },
    {
      input: '09842155678',
      expectedNormalized: '919842155678',
      expectedFormatted: '+91 98421 55678',
      notes: 'Leading zero 11-digit dial format',
    },
    {
      input: '+91 98421 55678',
      expectedNormalized: '919842155678',
      expectedFormatted: '+91 98421 55678',
      notes: 'Already formatted with +91 and spaces',
    },
    {
      input: '98421-55678',
      expectedNormalized: '919842155678',
      expectedFormatted: '+91 98421 55678',
      notes: 'Dashed 10-digit number',
    },
    {
      input: '(04546) 9842155678',
      expectedNormalized: '919842155678',
      expectedFormatted: '+91 98421 55678',
      notes: 'Area code brackets stripped',
    },
    {
      input: '919842155678',
      expectedNormalized: '919842155678',
      expectedFormatted: '+91 98421 55678',
      notes: 'Already 12-digit without plus',
    },
  ];

  return testCases.map((tc) => {
    const res = normalizePhoneNumber(tc.input);
    const passed =
      res.normalized === tc.expectedNormalized && res.formatted === tc.expectedFormatted;
    return {
      input: tc.input,
      expectedNormalized: tc.expectedNormalized,
      actualNormalized: res.normalized,
      expectedFormatted: tc.expectedFormatted,
      actualFormatted: res.formatted,
      passed,
      notes: tc.notes,
    };
  });
}
