const DEFAULT_BASE_URL =
  process.env.STATIC_IMAGE_BASE_URL || 'https://static.example.com/images';

const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'default';

const buildImageUrl = (segment, name) =>
  `${DEFAULT_BASE_URL}/${segment}/${slugify(name)}.png`;

module.exports = {
  DEFAULT_BASE_URL,
  buildImageUrl,
  slugify,
};
