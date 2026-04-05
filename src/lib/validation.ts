export function normalizeString(value: unknown) {
  return (value ?? "").toString().trim();
}

export function normalizeEmail(value: unknown) {
  return normalizeString(value).toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidSliitEmail(email: string) {
  return /^[^\s@]+@my\.sliit\.lk$/i.test(email);
}

export function sanitizeStudentId(value: unknown) {
  const normalized = normalizeString(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const letters = normalized.replace(/[^A-Z]/g, "").slice(0, 2);
  const digits = normalized.replace(/\D/g, "").slice(0, 8);
  return `${letters}${digits}`;
}

export function isValidStudentId(studentId: string) {
  return /^[A-Z]{2}\d{8}$/.test(studentId);
}

export function isValidPassword(password: string) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

export function isValidId(value: string) {
  return /^[A-Za-z0-9_-]{3,40}$/.test(value);
}

export function hasLengthBetween(value: string, min: number, max: number) {
  return value.length >= min && value.length <= max;
}

export function isAllowedNotificationType(type: string) {
  return [
    "application",
    "application_accepted",
    "application_rejected",
    "invite",
    "system",
    "alert",
  ].includes(type);
}
