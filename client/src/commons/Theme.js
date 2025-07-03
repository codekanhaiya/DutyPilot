// theme.js

export const darkThemeOptions = {
  palette: {
    mode: "dark",
    background: {
      default: "#0f1117",
      paper: "#1a1c23",
    },
    text: {
      primary: "#e5e7eb",
      secondary: "#9ca3af",
    },
    menu: {
      hover: "#2d3748", // gray-700
      selected: "#3b4252", // Slightly brighter for selected
    },
    primary: {
      main: "#38bdf8", // sky-400
    },
    secondary: {
      main: "#c084fc", // violet-400
    },
    info: {
      main: "#60a5fa", // blue-400
    },
    border: {
      color: "#334155", // slate-700
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
};

export const lightThemeOptions = {
  palette: {
    mode: "light",
    background: {
      default: "#f1f5f9", // slate-100
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b", // slate-500
    },
    menu: {
      hover: "#e2e8f0", // slate-200
      selected: "#cbd5e1", // slate-300 (soft highlight)
    },
    primary: {
      main: "#2563eb", // blue-600
    },
    secondary: {
      main: "#7c3aed", // violet-600
    },
    info: {
      main: "#38bdf8", // sky-400
    },
    border: {
      color: "#cbd5e1", // slate-300
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
};
