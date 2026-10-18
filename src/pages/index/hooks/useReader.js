import { useEffect, useRef, useState } from "react";
// foliate-js（<foliate-view> を登録する）
import "foliate-js/view.js";
// Libs
import { getBookFile, updateBook } from "@app/libs/db";

// 画面の左右この割合をタップするとページ送り、中央はメニュー表示
const TAP_ZONE = 0.2;

// 本文の余白（foliate-jsの標準より詰めて、画面を広く使う）
const LAYOUT = {
  // 左右の余白（画面幅に対する割合）
  gap: "4%",
  // 上下の余白
  margin: "1.5%",
  // 1段の幅・高さの上限。画面がこれより大きいと本文は上下左右の中央に置かれる
  // （iPad miniの画面 744x1133 より大きくして、miniでは画面いっぱいに表示）
  "max-inline-size": "900px",
  "max-block-size": "1200px"
};

const getReaderCSS = ({ mode, fontSize }) => `
  html {
    color-scheme: ${mode};
    font-size: ${fontSize}% !important;
  }
  ${
    mode === "dark"
      ? `
  html, body {
    color: #e0e0e0 !important;
    background: #121212 !important;
  }
  body * {
    color: inherit !important;
    background-color: transparent !important;
  }
  a:link, a:link * {
    color: #90caf9 !important;
  }`
      : ""
  }
`;

const flattenToc = (items, depth = 0) =>
  (items ?? []).flatMap((item) => [
    { label: item.label, href: item.href, depth },
    ...flattenToc(item.subitems, depth + 1)
  ]);

/**
 * リーダー（EPUBの表示・ページ送り・読書位置の保存）
 */
const useReader = ({ book, mode, fontSize }) => {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const styleRef = useRef({ mode, fontSize });
  const menuVisibleRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState([]);
  // ページ送り方向（縦書きの本は "rtl"）
  const [dir, setDir] = useState("ltr");
  const [fraction, setFraction] = useState(book.fraction ?? 0);
  const [currentHref, setCurrentHref] = useState(null);
  const [menuVisible, setMenuVisibleState] = useState(true);

  const setMenuVisible = (visible) => {
    menuVisibleRef.current = visible;
    setMenuVisibleState(visible);
  };

  useEffect(() => {
    let cancelled = false;

    const view = document.createElement("foliate-view");
    view.style.display = "block";
    view.style.width = "100%";
    view.style.height = "100%";
    containerRef.current.append(view);
    viewRef.current = view;

    const handleKeydown = (e) => {
      if (e.key === "ArrowLeft") view.goLeft();
      else if (e.key === "ArrowRight") view.goRight();
    };

    // 画面上のX座標でページ送り・メニュー表示を振り分ける
    const tapAt = (clientX) => {
      if (menuVisibleRef.current) {
        setMenuVisible(false);
        return;
      }
      const ratio = clientX / window.innerWidth;
      if (ratio < TAP_ZONE) view.goLeft();
      else if (ratio > 1 - TAP_ZONE) view.goRight();
      else setMenuVisible(true);
    };

    // 本文（iframe内）のタップ
    const handleTap = (e, doc) => {
      if (e.target.closest?.("a[href]")) return;
      if (doc.defaultView.getSelection()?.toString()) return;
      // iframe内の座標なので、画面上の位置に換算する
      const frame = doc.defaultView.frameElement;
      const left = frame ? frame.getBoundingClientRect().left : 0;
      tapAt(e.clientX + left);
    };

    // 本文の外側（中央寄せしたときの周りの余白）のタップ
    // iframe内のクリックはここまで届かないので、二重には処理されない
    const handleOuterTap = (e) => tapAt(e.clientX);

    const handleLoad = ({ detail: { doc } }) => {
      doc.addEventListener("keydown", handleKeydown);
      doc.addEventListener("click", (e) => handleTap(e, doc));
    };

    const handleRelocate = ({ detail }) => {
      const nextFraction = detail.fraction ?? 0;
      setFraction(nextFraction);
      setCurrentHref(detail.tocItem?.href ?? null);
      updateBook(book.id, { cfi: detail.cfi, fraction: nextFraction }).catch(
        (e) => console.error(e)
      );
    };

    const open = async () => {
      const buffer = await getBookFile(book.id);
      if (!buffer) throw new Error("本のデータが見つかりません。");
      const file = new File([buffer], book.fileName, {
        type: "application/epub+zip"
      });

      await view.open(file);
      if (cancelled) return;

      view.addEventListener("load", handleLoad);
      view.addEventListener("click", handleOuterTap);
      view.addEventListener("relocate", handleRelocate);
      view.renderer.setStyles?.(getReaderCSS(styleRef.current));
      view.renderer.setAttribute("animated", "");
      for (const [name, value] of Object.entries(LAYOUT)) {
        view.renderer.setAttribute(name, value);
      }

      setToc(flattenToc(view.book.toc));
      setDir(view.book.dir === "rtl" ? "rtl" : "ltr");

      await view.init({ lastLocation: book.cfi ?? null });
      await updateBook(book.id, { lastOpenedAt: Date.now() });
    };

    open()
      .catch((e) => {
        console.error(e);
        if (!cancelled) setError("この本を開けませんでした。");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    window.addEventListener("keydown", handleKeydown);

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", handleKeydown);
      view.close();
      view.remove();
      viewRef.current = null;
    };
  }, [book.id]);

  // 文字サイズ・配色の変更を本文に反映
  useEffect(() => {
    styleRef.current = { mode, fontSize };
    viewRef.current?.renderer?.setStyles?.(getReaderCSS(styleRef.current));
  }, [mode, fontSize]);

  const goTo = (href) => viewRef.current?.goTo(href);
  const goToFraction = (value) => viewRef.current?.goToFraction(value);

  return {
    containerRef,
    loading,
    error,
    toc,
    dir,
    fraction,
    currentHref,
    menuVisible,
    setMenuVisible,
    goTo,
    goToFraction
  };
};

export default useReader;
