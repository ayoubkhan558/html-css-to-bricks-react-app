import { create } from 'zustand';

const initialDark = (() => {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
  if (stored) return stored === 'dark';
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
})();

const useGeneratorStore = create((set) => ({
  html: '',
  css: '',
  js: '',
  output: '',
  activeTab: 'html',
  isMinified: false,
  includeJs: false,
  showJsonPreview: true,
  isCopied: false,
  inlineStyleHandling: 'inline', // 'skip', 'inline', 'class'
  isDarkMode: initialDark,

  // setters
  setHtml: (html) => set({ html }),
  setCss: (css) => set({ css }),
  setJs: (js) => set({ js }),
  setOutput: (output) => set({ output }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleMinified: () => set((s) => ({ isMinified: !s.isMinified })),
  setIncludeJs: (inc) => set({ includeJs: inc }),
  setShowJsonPreview: (show) => set({ showJsonPreview: show }),
  setIsCopied: (val) => set({ isCopied: val }),
  setInlineStyleHandling: (mode) => set({ inlineStyleHandling: mode }),
  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.isDarkMode;
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
      }
      return { isDarkMode: newMode };
    }),
}));

export default useGeneratorStore;
