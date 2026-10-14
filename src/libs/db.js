import { openDB } from "idb";

const DB_NAME = "planet-books-reader";
const DB_VERSION = 1;
// 本棚に並べる情報（タイトル・表紙・読書位置など）
const STORE_BOOKS = "books";
// EPUB本体（一覧取得時に読み込まないよう別ストアに分離）
const STORE_FILES = "files";

let dbPromise = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore(STORE_BOOKS, { keyPath: "id" });
        db.createObjectStore(STORE_FILES);
      }
    });
  }
  return dbPromise;
};

/**
 * 本の一覧を最近読んだ順で取得
 */
export const listBooks = async () => {
  const db = await getDB();
  const books = await db.getAll(STORE_BOOKS);
  return books.sort(
    (a, b) => (b.lastOpenedAt ?? b.addedAt) - (a.lastOpenedAt ?? a.addedAt)
  );
};

/**
 * 本を追加
 *
 * @param {object} book 本棚用の情報
 * @param {ArrayBuffer} buffer EPUB本体
 */
export const addBook = async (book, buffer) => {
  const db = await getDB();
  const tx = db.transaction([STORE_BOOKS, STORE_FILES], "readwrite");
  await Promise.all([
    tx.objectStore(STORE_BOOKS).put(book),
    tx.objectStore(STORE_FILES).put(buffer, book.id),
    tx.done
  ]);
};

/**
 * EPUB本体を取得
 */
export const getBookFile = async (id) => {
  const db = await getDB();
  return db.get(STORE_FILES, id);
};

/**
 * 本の情報を部分更新（読書位置の保存など）
 */
export const updateBook = async (id, patch) => {
  const db = await getDB();
  const tx = db.transaction(STORE_BOOKS, "readwrite");
  const book = await tx.store.get(id);
  if (book) await tx.store.put({ ...book, ...patch });
  await tx.done;
};

/**
 * 本を削除
 */
export const deleteBook = async (id) => {
  const db = await getDB();
  const tx = db.transaction([STORE_BOOKS, STORE_FILES], "readwrite");
  await Promise.all([
    tx.objectStore(STORE_BOOKS).delete(id),
    tx.objectStore(STORE_FILES).delete(id),
    tx.done
  ]);
};
