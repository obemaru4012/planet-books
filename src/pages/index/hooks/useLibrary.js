import { useCallback, useEffect, useState } from "react";
// Libs
import { addBook, deleteBook, listBooks } from "@app/libs/db";
import { readBookMeta } from "@app/libs/bookMeta";

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * 本棚（取り込み・一覧・削除）
 */
const useLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    try {
      setBooks(await listBooks());
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

  const importFiles = async (files) => {
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
          size: file.size,
          addedAt: Date.now(),
          lastOpenedAt: null,
          cfi: null,
          fraction: 0,
          ...meta
        };
        await addBook(book, await file.arrayBuffer());
      } catch (e) {
        console.error(e);
        failed.push(file.name);
      }
    }

    if (failed.length) {
      setError(`取り込めませんでした: ${failed.join("、")}`);
    }
    await reload();
    setImporting(false);
  };

  const removeBook = async (id) => {
    try {
      await deleteBook(id);
    } catch (e) {
      console.error(e);
      setError("削除に失敗しました。");
    }
    await reload();
  };

  const clearError = () => setError(null);

  return {
    books,
    loading,
    importing,
    error,
    reload,
    importFiles,
    removeBook,
    clearError
  };
};

export default useLibrary;
