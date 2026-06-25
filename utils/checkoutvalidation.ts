// checkoutValidation.ts
// Centralized validators + formatters for the checkout form.
// Each validator returns "" when the value is valid, or an error string when it isn't.

// removed react-phone-number-input

/* ───────────────────────── Card Number ───────────────────────── */

/** Strips everything except digits */
export const stripNonDigits = (val: string) => val.replace(/\D/g, "");

/** Formats raw digits into groups of 4: "4111 1111 1111 1111" */
export const formatCardNumber = (val: string) => {
  const digits = stripNonDigits(val).substring(0, 19); // covers up to 19-digit PANs
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

/**
 * Luhn checksum — catches fat-finger typos and most fake/filler numbers
 * (e.g. "1234 5678 9012 3456") without needing a real card network call.
 */
export const isValidLuhn = (digits: string) => {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

export const validateCardNumber = (formatted: string): string => {
  const digits = stripNonDigits(formatted);
  if (!digits) return "Card number is required.";
  if (digits.length < 13 || digits.length > 19) {
    return "Card number must be 13–19 digits.";
  }
  if (!isValidLuhn(digits)) {
    return "This card number isn't valid. Please check the digits.";
  }
  return "";
};

/* ───────────────────────── Expiry Date ───────────────────────── */

export const formatExpiry = (val: string) => {
  let digits = stripNonDigits(val).substring(0, 4);
  if (digits.length === 0) return "";
  
  if (digits.length === 1 && parseInt(digits[0], 10) > 1) {
    digits = `0${digits[0]}`;
  }
  
  if (digits.length >= 2) {
    let month = parseInt(digits.substring(0, 2), 10);
    if (month > 12) {
      digits = `12${digits.substring(2)}`;
    } else if (month === 0) {
      digits = `01${digits.substring(2)}`;
    }
  }
  
  if (digits.length <= 2) return digits;
  return `${digits.substring(0, 2)}/${digits.substring(2)}`;
};

/**
 * Validates MM/YY:
 * - month must be 01–12 (catches "13/29" style typos)
 * - must be a real, fully-typed MM/YY
 * - card must not already be expired (compares to end of that month)
 */
export const validateExpiry = (val: string): string => {
  const digits = stripNonDigits(val);
  if (!digits) return "Expiry date is required.";
  if (digits.length < 4) return "Enter expiry as MM/YY.";

  const month = parseInt(digits.substring(0, 2), 10);
  const year = parseInt(digits.substring(2, 4), 10);

  if (month < 1 || month > 12) {
    return "Month must be between 01 and 12.";
  }

  const fullYear = 2000 + year;
  const expiryEnd = new Date(fullYear, month, 0, 23, 59, 59); // last day of that month
  const now = new Date();

  if (expiryEnd < now) {
    return "This card has expired.";
  }

  // Reject dates unreasonably far out (10 yrs) — almost always a typo
  const maxFuture = new Date();
  maxFuture.setFullYear(maxFuture.getFullYear() + 10);
  if (expiryEnd > maxFuture) {
    return "Please check the expiry year.";
  }

  return "";
};

/** Builds a list of selectable years for the picker (current → +10) */
export const getExpiryYearOptions = (): number[] => {
  const startYear = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => startYear + i);
};

export const EXPIRY_MONTH_OPTIONS = [
  { value: 1, label: "01 — Jan" },
  { value: 2, label: "02 — Feb" },
  { value: 3, label: "03 — Mar" },
  { value: 4, label: "04 — Apr" },
  { value: 5, label: "05 — May" },
  { value: 6, label: "06 — Jun" },
  { value: 7, label: "07 — Jul" },
  { value: 8, label: "08 — Aug" },
  { value: 9, label: "09 — Sep" },
  { value: 10, label: "10 — Oct" },
  { value: 11, label: "11 — Nov" },
  { value: 12, label: "12 — Dec" },
];

/* ───────────────────────── CVV ───────────────────────── */

export const formatCVV = (val: string) => stripNonDigits(val).substring(0, 4);

export const validateCVV = (val: string, cardDigitsLength?: number): string => {
  const digits = stripNonDigits(val);
  if (!digits) return "CVV is required.";
  // Amex-style 4-digit CVVs start with 34/37; default to 3 digits otherwise.
  const expectedLen = cardDigitsLength && /^3[47]/.test(String(cardDigitsLength)) ? 4 : null;
  if (digits.length < 3 || digits.length > 4) {
    return "CVV must be 3 or 4 digits.";
  }
  if (expectedLen && digits.length !== expectedLen) {
    return `CVV must be ${expectedLen} digits for this card.`;
  }
  return "";
};

/* ───────────────────────── Zip / Postal Code ───────────────────────── */

export const formatZip = (val: string) =>
  val.replace(/\D/g, "").substring(0, 10);

/**
 * Accepts US 5-digit / ZIP+4 as well as generic alphanumeric postal codes
 * (since the shipping address itself doesn't lock to one country here).
 */
export const validateZip = (val: string): string => {
  const trimmed = val.trim();
  if (!trimmed) return "Zip / postal code is required.";

  const usZip = /^\d{5}(-\d{4})?$/;
  const genericPostal = /^[A-Za-z0-9][A-Za-z0-9\- ]{2,9}$/;

  if (usZip.test(trimmed) || genericPostal.test(trimmed)) return "";
  return "Enter a valid zip/postal code.";
};

/* ───────────────────────── Phone Number ───────────────────────── */

export const validatePhone = (val: string): string => {
  if (!val) return "Contact number is required.";
  if (val.replace(/\D/g, "").length < 7) {
    return "Enter a valid phone number.";
  }
  return "";
};

/* ───────────────────────── Card Holder Name ───────────────────────── */

export const validateCardHolderName = (val: string): string => {
  const trimmed = val.trim();
  if (!trimmed) return "Card holder name is required.";
  if (trimmed.length < 2) return "Name looks too short.";
  if (!/^[A-Za-z\s.'-]+$/.test(trimmed)) {
    return "Name can only contain letters, spaces, and ' . -";
  }
  return "";
};