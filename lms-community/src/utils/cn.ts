import clsx, { ClassValue } from 'clsx';

/**
 * Utility function to merge class names conditionally
 * @param classes - Array of class names or conditional class objects
 * @returns Merged class string
 */
export function cn(...classes: ClassValue[]) {
  return clsx(classes);
}
