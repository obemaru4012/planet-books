import { openDB } from "idb";

const DB_NAME = "planet-books-reader";
const DB_VERSION = 2;
// 本棚に並べる情報（タイトル・表紙・読書位置・所属フォルダなど）
const STORE_BOOKS = "books";
// EPUB本体（一覧取得時に読み込まないよう別ストアに分離）
const STORE_FILES = "files";
// フォルダ（v2で追加）
const STORE_FOLDERS = "folders";

let dbPromise = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      // 既に本が入っている端末では、足りないストアだけ追加する
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore(STORE_BOOKS, { keyPath: "id" });
          db.createObjectStore(STORE_FILES);
        }
        if (oldVersion < 2) {
          db.createObjectStore(STORE_FOLDERS, { keyPath: "id" });
        }
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
 * @param {Blob} file EPUB本体（Fileのまま渡すと、Safariはメモリに展開せずディスクに保存する）
 */
export const addBook = async (book, file) => {
  const db = await getDB();
  const tx = db.transaction([STORE_BOOKS, STORE_FILES], "readwrite");
  await Promise.all([
    tx.objectStore(STORE_BOOKS).put(book),
    tx.objectStore(STORE_FILES).put(file, book.id),
    tx.done
  ]);
};

/**
 * EPUB本体を取得（Blob。古い版で取り込んだ本は ArrayBuffer）
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

/**
 * フォルダの一覧を名前順で取得
 */
export const listFolders = async () => {
  const db = await getDB();
  const folders = await db.getAll(STORE_FOLDERS);
  return folders.sort((a, b) => a.name.localeCompare(b.name, "ja"));
};

/**
 * フォルダを追加
 */
export const addFolder = async (folder) => {
  const db = await getDB();
  await db.put(STORE_FOLDERS, folder);
};

/**
 * フォルダの情報を部分更新（名前の変更など）
 */
export const updateFolder = async (id, patch) => {
  const db = await getDB();
  const tx = db.transaction(STORE_FOLDERS, "readwrite");
  const folder = await tx.store.get(id);
  if (folder) await tx.store.put({ ...folder, ...patch });
  await tx.done;
};

/**
 * フォルダを削除（中の本は消さずに、フォルダなしに戻す）
 */
export const deleteFolder = async (id) => {
  const db = await getDB();
  const tx = db.transaction([STORE_FOLDERS, STORE_BOOKS], "readwrite");
  const books = tx.objectStore(STORE_BOOKS);
  for (const book of await books.getAll()) {
    if (book.folderId === id) await books.put({ ...book, folderId: null });
  }
  await tx.objectStore(STORE_FOLDERS).delete(id);
  await tx.done;
};
