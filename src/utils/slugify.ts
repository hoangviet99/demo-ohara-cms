import slugifyLib from "slugify";

const slugify = slugifyLib.default || slugifyLib;

// Extend Vietnamese-specific characters not covered by the 'vi' locale
slugify.extend({
  đ: "d",
  Đ: "d",
});

export function generateSlug(name: string): string {
  if (!name.trim()) return "";
  return slugify(name, {
    locale: "vi",
    lower: true,
    strict: true,
    trim: true,
  });
}

export function generateSKU(name: string): string {
  if (!name.trim()) return "";
  const slug = generateSlug(name);
  const prefix = slug.replace(/-/g, "").slice(0, 3).toUpperCase();
  const now = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 5);
  return `SKU-${prefix}-${now}-${rand}`.toUpperCase();
}
