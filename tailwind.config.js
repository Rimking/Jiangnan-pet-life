/** @type {import('tailwindcss').Config} */
export default {
  // 这里给出了一份 uni-app /taro 通用示例，具体要根据你自己项目的目录结构进行配置
  // 不在 content 包括的文件内，你编写的 class，是不会生成对应的css工具类的
  content: ['./src/index.html', './src/**/*.{html,js,ts,jsx,tsx,vue}'],
  // 其他配置项
  // ...
  corePlugins: {
    // 小程序不需要 preflight，因为这主要是给 h5 的，如果你要同时开发小程序和 h5 端，你应该使用环境变量来控制它
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // 主题色（包含各类透明度）
        primary: 'var(--primary-color)',
        primary_hover: 'var(--primary-color-hover)',
        primary_active: 'var(--primary-color-active)',
        primary_5: 'var(--primary-color-5)',
        primary_10: 'var(--primary-color-10)',
        primary_15: 'var(--primary-color-15)',
        primary_20: 'var(--primary-color-20)',
        primary_50: 'var(--primary-color-50)',
        // 文字色（各级文字）
        first: 'var(--text-color)',
        second: 'var(--text-color-secondary)',
        third: 'var(--text-color-third)',
        fourth: 'var(--text-color-fourth)',
        // 成功色
        success: 'var(--success-color)',
        success_5: 'var(--success-color-5)',
        success_10: 'var(--success-color-10)',
        // 警告色
        warning: 'var(--warning-color)',
        warning_5: 'var(--warning-color-5)',
        warning_10: 'var(--warning-color-10)',
        // 错误色
        error: 'var(--error-color)',
        error_5: 'var(--error-color-5)',
        error_10: 'var(--error-color-10)',
        // 重要色
        important: 'var(--important-color)',
        important_5: 'var(--important-color-5)',
        important_10: 'var(--important-color-10)',
        // 禁止色
        disabled: 'var(--disabled-color)',
        // 背景色
        default_bg: 'var(--body-background)',
        // 边框色
        border: 'var(--border-color-base)',
      },
    },
  },
};
