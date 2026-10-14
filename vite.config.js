import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import app from "./build_target/app.js";

var entries = { ...app };

// https://vitejs.dev/config/
export default defineConfig({
  // サブディレクトリ配下（GitHub Pagesなど）でも動くよう相対パスにする
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Planet Books Reader",
        short_name: "Planet Books",
        description: "EPUBを読むための電子書籍リーダー",
        lang: "ja",
        display: "standalone",
        start_url: ".",
        scope: ".",
        background_color: "#14213d",
        theme_color: "#14213d",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        // オフラインでも起動できるようアプリ本体を丸ごとキャッシュ
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
        // ファイル名にハッシュを付けていないので、assets配下も内容のハッシュで更新を検知させる
        dontCacheBustURLsMatching: /^$/,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts",
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src"),
      "@img": path.resolve(__dirname, "./img")
    }
  },
  root: "src",
  build: {
    minify: true, // minify設定
    cssCodeSplit: false,
    assetsInlineLimit: 2097152, // 画像のインライン化の閾値（2MB）
    outDir: "../distributions", // ビルドされたjsファイルが格納される場所
    rollupOptions: {
      input: entries, // for build
      output: {
        // ファイル名ハッシュを辞めるオプション
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  server: {
    watch: {
      usePolling: true
    }
  }
});
