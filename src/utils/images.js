const modules = import.meta.glob('../assets/images/projects/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
});

const imageMap = {};
for (const path in modules) {
  const filename = path.split('/').pop();
  imageMap[filename] = modules[path];
}

export function getProjectImage(filename) {
  return imageMap[filename] || '';
}
