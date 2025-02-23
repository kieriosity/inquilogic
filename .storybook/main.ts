import type { StorybookConfig } from "@storybook/nextjs"
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-themes"
  ],
  staticDirs: ['../public'],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  webpackFinal: async (config) => {
    if (config.module?.rules) {
      // Filter out the default CSS rule
      config.module.rules = config.module.rules.filter(
        (rule) => rule?.test?.toString() !== '/\\.css$/'
      );

      // Add our own CSS rule
      config.module.rules.push({
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  tailwindcss,
                  autoprefixer,
                ],
              },
            },
          },
        ],
      });
    }
    return config;
  },
}
export default config
