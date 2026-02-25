import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'NurOS Package List',
  description: 'Documentation for the NurOS Package Search System',
  lang: 'en-US',

  // GitHub Pages base path - serves from /listpkgs.nuros.org/docs/
  base: '/docs/',

  // Social links
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
  ],

  // Search configuration
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'NurOS Package List',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Docs', items: [
        { text: 'Architecture', link: '/architecture' },
        { text: 'Frontend Guide', link: '/frontend-guide' },
        { text: 'API Reference', link: '/api-reference' },
        { text: 'Deployment', link: '/deployment' },
      ]},
      { text: 'Contributing', link: '/contributing' },
      { text: 'FAQ', link: '/faq' },
      { text: 'Back to App', link: '../' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Quick Start', link: '/getting-started' },
        ]
      },
      {
        text: 'Documentation',
        items: [
          { text: 'Architecture', link: '/architecture' },
          { text: 'Frontend Guide', link: '/frontend-guide' },
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Deployment Guide', link: '/deployment' },
        ]
      },
      {
        text: 'Community',
        items: [
          { text: 'Contributing', link: '/contributing' },
          { text: 'FAQ', link: '/faq' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/NurOS-Linux/listpkgs.nuros.org' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present NurOS Project'
    },

    editLink: {
      pattern: 'https://github.com/NurOS-Linux/listpkgs.nuros.org/edit/main/blog/:path',
      text: 'Edit this page on GitHub'
    },

    // Search configuration (uses local search)
    search: {
      provider: 'local'
    },

    // Appearance toggle
    appearance: 'auto',

    // Dark model CSS class
    darkModeCssClass: 'dark',
  },

  // Markdown configuration
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  // Build performance
  build: {
    minify: 'esbuild',
  },

  // Vite config overrides
  vite: {
    server: {
      port: 5173,
      strictPort: false,
    }
  }
});
