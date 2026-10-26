import { useEffect, useState } from "react";
// Hooks
import useLibraryState from "@app/pages/index/hooks/useLibraryState";

const COLOR_MODE_KEY = "color-mode";
const FONT_SIZE_KEY = "font-size";

export const FONT_SIZE_MIN = 20;
export const FONT_SIZE_MAX = 200;
export const FONT_SIZE_STEP = 10;

/**
 * ライト・ダークモード
 */
const getInitialMode = () => {
  const saved = window.localStorage.getItem(COLOR_MODE_KEY);

  return "light";
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialFontSize = () => {
  const saved = Number(window.localStorage.getItem(FONT_SIZE_KEY));
  if (saved >= FONT_SIZE_MIN && saved <= FONT_SIZE_MAX) return saved;
  return 100;
};

/**
 * Hooks
 */
const useAppState = ({ props }) => {
  // 画面モード
  const [mode, setMode] = useState(getInitialMode);
  // 本文の文字サイズ（%）
  const [fontSize, setFontSize] = useState(getInitialFontSize);
  // 開いている本（null なら本棚を表示）
  const [openedBook, setOpenedBook] = useState(null);
  // 本棚で開いているフォルダ（null なら一番上）
  // 本を閉じたときに元のフォルダへ戻れるよう、本棚の外で持つ
  const [openedFolderId, setOpenedFolderId] = useState(null);

  const library = useLibraryState();

  // 開いているフォルダが削除されたら一番上に戻る
  const openedFolder =
    library.folders.find((folder) => folder.id === openedFolderId) ?? null;

  useEffect(() => {
    window.localStorage.setItem(COLOR_MODE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    window.localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
  }, [fontSize]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const changeFontSize = (delta) => {
    setFontSize((prev) =>
      Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, prev + delta))
    );
  };

  const openBook = (book) => setOpenedBook(book);

  const closeBook = () => {
    setOpenedBook(null);
    // 読書位置・最終閲覧日時を本棚に反映
    library.reload();
  };

  const openFolder = (folder) => setOpenedFolderId(folder.id);

  const closeFolder = () => setOpenedFolderId(null);

  return {
    mode,
    toggleMode,
    fontSize,
    changeFontSize,
    openedBook,
    openBook,
    closeBook,
    openedFolder,
    openFolder,
    closeFolder,
    library
  };
};

export default useAppState;
