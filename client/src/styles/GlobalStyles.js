import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #fafafa;
    color: #1a1a1a;
    line-height: 1.6;
  }

  code {
    font-family: 'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
  }

  /* CSS Variables for consistent theming */
  :root {
    /* Primary Colors */
    --color-primary: #2563eb;
    --color-primary-dark: #1d4ed8;
    --color-primary-light: #3b82f6;
    
    /* Secondary Colors */
    --color-secondary: #10b981;
    --color-secondary-dark: #059669;
    --color-secondary-light: #34d399;
    
    /* Accent Colors */
    --color-accent: #8b5cf6;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-success: #10b981;
    
    /* Neutral Colors */
    --color-gray-50: #f9fafb;
    --color-gray-100: #f3f4f6;
    --color-gray-200: #e5e7eb;
    --color-gray-300: #d1d5db;
    --color-gray-400: #9ca3af;
    --color-gray-500: #6b7280;
    --color-gray-600: #4b5563;
    --color-gray-700: #374151;
    --color-gray-800: #1f2937;
    --color-gray-900: #111827;
    
    /* Background Colors */
    --color-background: #fafafa;
    --color-surface: #ffffff;
    --color-surface-hover: #f8fafc;
    
    /* Text Colors */
    --color-text-primary: #1a1a1a;
    --color-text-secondary: #6b7280;
    --color-text-muted: #9ca3af;
    
    /* Border Colors */
    --color-border: #e5e7eb;
    --color-border-light: #f3f4f6;
    --color-border-dark: #d1d5db;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    
    /* Border Radius */
    --radius-sm: 0.25rem;
    --radius: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-full: 9999px;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 2.5rem;
    --spacing-3xl: 3rem;
    
    /* Font Sizes */
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: 1.875rem;
    --text-4xl: 2.25rem;
    --text-5xl: 3rem;
    
    /* Font Weights */
    --font-light: 300;
    --font-normal: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;
    
    /* Line Heights */
    --leading-tight: 1.25;
    --leading-normal: 1.5;
    --leading-relaxed: 1.625;
    
    /* Transitions */
    --transition-fast: 150ms ease-in-out;
    --transition-normal: 200ms ease-in-out;
    --transition-slow: 300ms ease-in-out;
    
    /* Z-Index Scale */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
    --z-toast: 1080;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-gray-100);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-gray-300);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-gray-400);
  }

  /* Focus Styles */
  *:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Link Styles */
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--color-primary-dark);
  }

  /* Button Reset */
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Input Reset */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Utility Classes */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-1 {
    gap: var(--spacing-xs);
  }

  .gap-2 {
    gap: var(--spacing-sm);
  }

  .gap-4 {
    gap: var(--spacing-md);
  }

  .gap-6 {
    gap: var(--spacing-lg);
  }

  .mb-2 {
    margin-bottom: var(--spacing-sm);
  }

  .mb-4 {
    margin-bottom: var(--spacing-md);
  }

  .mb-6 {
    margin-bottom: var(--spacing-lg);
  }

  .mt-2 {
    margin-top: var(--spacing-sm);
  }

  .mt-4 {
    margin-top: var(--spacing-md);
  }

  .mt-6 {
    margin-top: var(--spacing-lg);
  }

  .p-2 {
    padding: var(--spacing-sm);
  }

  .p-4 {
    padding: var(--spacing-md);
  }

  .p-6 {
    padding: var(--spacing-lg);
  }

  .rounded {
    border-radius: var(--radius);
  }

  .rounded-lg {
    border-radius: var(--radius-lg);
  }

  .shadow {
    box-shadow: var(--shadow);
  }

  .shadow-lg {
    box-shadow: var(--shadow-lg);
  }

  /* Animation Classes */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }

    .container {
      padding: 0 var(--spacing-md);
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 0 var(--spacing-sm);
    }
  }

  /* Dark mode support (future enhancement) */
  @media (prefers-color-scheme: dark) {
    :root {
      --color-background: #0f172a;
      --color-surface: #1e293b;
      --color-text-primary: #f8fafc;
      --color-text-secondary: #cbd5e1;
      --color-border: #334155;
    }
  }
`;

export default GlobalStyles;