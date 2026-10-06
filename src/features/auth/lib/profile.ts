import type { AuthUser, UserRole } from "../types";

export function displayName(user: AuthUser) {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function initials(user: AuthUser) {
  const first = user.firstName.trim().charAt(0);
  const last = user.lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase() || "N";
}

export function roleLabel(role: UserRole) {
  if (role === "admin") return "Admin";
  if (role === "vendor") return "Vendor";
  return "Customer";
}
