import { makeBook } from "foliate-js/view.js";

// メタデータは文字列の場合と { 言語: 文字列 } の場合がある
const formatLanguageMap = (x) => {
  if (!x) return "";
  if (typeof x === "string") return x;
  const keys = Object.keys(x);
  return x[keys[0]] ?? "";
};

const formatOneContributor = (contributor) =>
  typeof contributor === "string"
    ? contributor
    : formatLanguageMap(contributor?.name);

const formatContributor = (contributor) =>
  Array.isArray(contributor)
    ? contributor.map(formatOneContributor).filter(Boolean).join("、")
    : formatOneContributor(contributor);

/**
 * EPUBからタイトル・著者・表紙を取り出す
 *
 * @param {File} file
 */
export const readBookMeta = async (file) => {
  const book = await makeBook(file);

  const title =
    formatLanguageMap(book.metadata?.title) ||
    file.name.replace(/\.epub$/i, "");
  const author = formatContributor(book.metadata?.author);

  let cover = null;
  try {
    const blob = await book.getCover?.();
    if (blob) cover = { buffer: await blob.arrayBuffer(), type: blob.type };
  } catch (e) {
    console.warn(e);
  }

  book.destroy?.();

  return { title, author, cover };
};
