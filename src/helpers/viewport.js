export function width() {
  return __SERVER__ ? 0 : (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0)
}
