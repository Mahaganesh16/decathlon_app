export const API_BASE = '';

/**
 * Hero banner images uploaded through the admin page are stored in MySQL as a
 * relative path (e.g. "/uploads/hero-banners/169...-photo.jpg"). This turns
 * that into a full URL the <img> tag can load. Absolute URLs (https://...)
 * are returned unchanged, so existing seeded banners with external image
 * links keep working too.
 */
export function resolveImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `${API_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}