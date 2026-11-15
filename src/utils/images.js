const modules = import.meta.glob('../assets/images/projects/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
});

const imageMap = {};
for (const path in modules) {
  const filename = path.split('/').pop();
  imageMap[filename] = modules[path];
}

// A screenshot is either a file bundled with the site or a full URL to an
// image uploaded from the admin dashboard.
export function getProjectImage(filename) {
  if (!filename) return '';
  if (/^https?:\/\//.test(filename)) return filename;
  return imageMap[filename] || '';
}
