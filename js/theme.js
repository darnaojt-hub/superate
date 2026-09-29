/**
 * theme.js
 * Dark / light theme handling. Respects the OS-level
 * prefers-color-scheme by default, but a manual toggle overrides it and
 * is remembered in localStorage. The <head> of index.html also applies
 * the saved theme inline before paint to avoid a flash of wrong theme.
 */
const Theme = (() => {
  const KEY = 'tindarhan_theme';

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function apply(mode) {
    if (mode === 'dark' || mode === 'light') {
      document.documentElement.setAttribute('data-theme', mode);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function init() {
    const saved = localStorage.getItem(KEY);
    apply(saved);
    updateIcon();

    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener && mq.addEventListener('change', () => {
        if (!localStorage.getItem(KEY)) updateIcon();
      });
    }

    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.addEventListener('click', toggle);
  }

  function isDark() {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved === 'dark';
    return systemPrefersDark();
  }

  function toggle() {
    const next = isDark() ? 'light' : 'dark';
    localStorage.setItem(KEY, next);
    apply(next);
    updateIcon();
  }

  function updateIcon() {
    const iconEl = document.getElementById('themeToggleIcon');
    const labelEl = document.getElementById('themeToggleLabel');
    const btn = document.getElementById('themeToggleBtn');
    const dark = isDark();
    if (iconEl) iconEl.innerHTML = dark ? Icons.sun : Icons.moon;
    if (labelEl) labelEl.textContent = dark ? 'Light Mode' : 'Dark Mode';
    if (btn) {
      const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    }
  }

  return { init, isDark, toggle, updateIcon };
})();
