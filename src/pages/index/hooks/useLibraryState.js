import { useCallback, useEffect, useState } from "react";
// Libs
import {
  addBook,
  addFolder,
  deleteBook,
  deleteFolder,
  listBooks,
  listFolders,
  updateBook,
  updateFolder
} from "@app/libs/db";
import { readBookMeta } from "@app/libs/bookMeta";

const createId = () =>
  `${Date.now()}-${Math.random().toString(24).slice(2, 10)}`;

// 取り込み失敗の理由を短く表す（原因の切り分け用）
const describeError = (e) => {
  if (e?.name === "QuotaExceededError") return "保存容量が足りません";
  return [e?.name, e?.message].filter(Boolean).join(": ") || "不明なエラー";
};

/**
 * 本棚（取り込み・一覧・削除・フォルダ分け）
 */
const useLibraryState = () => {
  const [books, setBooks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    try {
      const [nextBooks, nextFolders] = await Promise.all([
        listBooks(),
        listFolders()
      ]);
      setBooks(nextBooks);
      setFolders(nextFolders);
    } catch (e) {
      console.error(e);
      setError("本棚の読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  /**
   * EPUBを取り込む
   *
   * @param {FileList} files
   * @param {string | null} folderId 入れるフォルダ（null ならフォルダなし）
   */
  const importFiles = async (files, folderId = null) => {
    setImporting(true);
    setError(null);
    const failed = [];

    // ブラウザの判断で消されないよう永続化を依頼（拒否されても続行）
    navigator.storage?.persist?.().catch(() => {});

    for (const file of Array.from(files)) {
      try {
        const meta = await readBookMeta(file);
        const book = {
          id: createId(),
          fileName: file.name,
          fileSize: file.size,
          addedAt: Date.now(),
          lastOpenedAt: null,
          cfi: null, // EPUBの進捗位置
          fraction: 0, // おおまかな位置（%）
          fontSize: 18, // 本ごとのフォントサイズ
          folderId,
          ...meta
        };
        // メモリに読み込まず、ファイルのまま保存する（大きな本でも落ちないように）
        await addBook(book, file);
      } catch (e) {
        failed.push(`${file.name}（${describeError(e)}）`);
      }
    }

    if (failed.length) {
      setError(`取り込めませんでした: ${failed.join("、")}`);
    }
    await reload();
    setImporting(false);
  };

  // 失敗したらエラーを表示し、成否にかかわらず一覧を読み直す
  const run = async (action, message) => {
    try {
      await action();
    } catch (e) {
      console.error(e);
      setError(message);
    }
    await reload();
  };

  const removeBook = (id) => run(() => deleteBook(id), "削除に失敗しました。");

  const moveBook = (id, folderId) =>
    run(() => updateBook(id, { folderId }), "移動に失敗しました。");

  /**
   * フォルダを作成して、作ったフォルダを返す
   */
  const createFolder = async (name) => {
    const folder = { id: createId(), name, createdAt: Date.now() };
    await run(() => addFolder(folder), "フォルダを作成できませんでした。");
    return folder;
  };

  const renameFolder = (id, name) =>
    run(() => updateFolder(id, { name }), "名前を変更できませんでした。");

  const removeFolder = (id) =>
    run(() => deleteFolder(id), "フォルダを削除できませんでした。");

  const clearError = () => setError(null);

  return {
    books,
    folders,
    loading,
    importing,
    error,
    reload,
    importFiles,
    removeBook,
    moveBook,
    createFolder,
    renameFolder,
    removeFolder,
    clearError
  };
};

export default useLibraryState;
