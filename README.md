# planet-books-reader

iPad向けのEPUBリーダー（PWA）。[react19_boilerplates](https://github.com/obemaru4012/react19_boilerplates) をベースにしています。

- React 19 / MUI v7 / Vite 8
- EPUB表示: [foliate-js](https://github.com/johnfactotum/foliate-js)（縦書き・横書き対応）
- 本と読書位置は端末内（IndexedDB）に保存。サーバーには送信しません
- DRM付きのEPUBは読めません

## 開発

WSL（Node 22）で実行します。

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # distributions/ に出力
npm run preview    # ビルド結果を確認（オフライン動作はこちらで確認）
```

## iPadに入れる

1. `distributions/` の中身をHTTPSで配信できる場所（GitHub Pagesなど）に置く
2. iPadのSafariでそのURLを開く
3. 共有ボタン →「ホーム画面に追加」

ホーム画面のアイコンを削除すると、取り込んだ本と読書位置も消えます。

## 操作

- 画面の左右をタップ、またはスワイプ: ページ送り
- 画面の中央をタップ: メニュー（目次・進捗バー・文字サイズ・配色）の表示切り替え

## 構成

```
src/
  libs/db.js                       本棚・EPUB本体の保存（IndexedDB）
  libs/bookMeta.js                 EPUBからタイトル・著者・表紙を取得
  pages/index/hooks/useAppState.js  画面全体の状態
  pages/index/hooks/useLibraryState.js    本棚（取り込み・削除）
  pages/index/hooks/useReaderState.js     リーダー（表示・ページ送り・位置保存）
  pages/index/contents/Library.jsx   本棚画面
  pages/index/contents/Reader.jsx    リーダー画面
  public/icons/                    アプリアイコン
```
