export function route() {
  const raw = location.hash.replace(/^#\/?/, '') || '';
  const [path, query] = raw.split('?');
  return { path: '/' + path.replace(/^\//, ''), params: new URLSearchParams(query || '') };
}
export function navigate(path) {
  location.hash = '#' + path;
  window.scrollTo({ top: 0, behavior: 'instant' });
}
export function back() {
  if (history.length > 1) history.back();
  else navigate('/');
}
