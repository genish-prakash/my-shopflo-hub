import { UserData } from '@/services/authApi';

/**
 * Get user initials from first and last name
 * Returns empty string if no names are available
 */
export const getUserInitials = (user: UserData | null): string => {
  if (!user) return '';

  const firstName = user.first_name?.trim();
  const lastName = user.last_name?.trim();

  if (!firstName && !lastName) return '';

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }

  if (lastName) {
    return lastName.substring(0, 2).toUpperCase();
  }

  return '';
};

/**
 * Get user's full name
 * Returns empty string if no names are available
 */
export const getUserFullName = (user: UserData | null): string => {
  if (!user) return '';

  const firstName = user.first_name?.trim();
  const lastName = user.last_name?.trim();

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName) return firstName;
  if (lastName) return lastName;

  return '';
};

/**
 * Get user display name (email or phone if no name)
 */
export const getUserDisplayName = (user: UserData | null): string => {
  const fullName = getUserFullName(user);
  if (fullName) return fullName;

  if (user?.email) return user.email;
  if (user?.phone_number) return user.phone_number;

  return 'User';
};
