// utils/validators.js

/**
 * PAN format: 5 letters + 4 digits + 1 letter
 * 4th character indicates entity type:
 *   C – Company, P – Person, H – HUF, F – Firm, A – AOP, T – Trust, B – BOI, L – Local authority, J – Judiciary, G – Govt
 */
export const validatePAN = (pan) => {
  if (!pan || typeof pan !== 'string') return false;
  const upperPan = pan.toUpperCase().trim();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(upperPan)) return false;

  const fourthChar = upperPan[3];
  const validEntityTypes = ['C', 'P', 'H', 'F', 'A', 'T', 'B', 'L', 'J', 'G'];
  return validEntityTypes.includes(fourthChar);
};

// ---------- Verhoeff checksum for Aadhaar (12 digits) ----------
// Verhoeff algorithm tables
const verhoeff_d = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,2,3,4,0,6,7,8,9,5],
  [2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],
  [4,0,1,2,3,9,5,6,7,8],
  [5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],
  [7,6,5,9,8,2,1,0,4,3],
  [8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0]
];

const verhoeff_p = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,5,7,6,2,8,3,0,9,4],
  [5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],
  [4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],
  [7,0,4,6,9,1,3,2,5,8]
];

const verhoeff_inv = [0,4,3,2,1,5,6,7,8,9];

function verhoeffCheck(number) {
  let c = 0;
  const digits = number.toString().split('').map(Number).reverse();
  for (let i = 0; i < digits.length; i++) {
    c = verhoeff_d[c][verhoeff_p[i % 8][digits[i]]];
  }
  return c === 0;
}

export const validateAadhaar = (aadhaar) => {
  if (!aadhaar) return false;
  const digits = aadhaar.replace(/\s/g, ''); // remove spaces
  if (!/^\d{12}$/.test(digits)) return false;
  return verhoeffCheck(digits);
};