import React from 'react';
import '../styles/tailwind.css';
import { withThemeByClassName } from "@storybook/addon-themes";

// Storybook global decorators (if using dark mode switching)
export const decorators = [
  withThemeByClassName({
    themes: {
      light: "",
      dark: "dark",
    },
    defaultTheme: "light",
  }),
];

// Global parameters apply to all stories
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#333333' },
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// Global types to add toolbar controls
export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: ['en', 'es', 'fr', 'de'],
    },
  },
};
