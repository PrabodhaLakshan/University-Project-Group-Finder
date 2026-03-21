export function normalizeString(value: unknown) {
  return (value ?? "").toString().trim();
}

export function normalizeEmail(value: unknown) {
  return normalizeString(value).toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidId(value: string) {
  return /^[A-Za-z0-9_-]{3,40}$/.test(value);
}

export function hasLengthBetween(value: string, min: number, max: number) {
  return value.length >= min && value.length <= max;
}

export function isAllowedNotificationType(type: string) {
  return ["application", "invite", "system", "alert"].includes(type);
}
