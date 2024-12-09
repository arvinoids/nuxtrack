const pattern = /CAS-\d{7}-[A-Z]\d[A-Z]\d[A-Z]\d/;

export function validateCASNumber(casNumber: string): boolean {
  return pattern.test(casNumber.trim());
}