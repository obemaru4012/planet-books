// MUI7 の palette に設定できる全項目
// primary.main と background 以外は、MUI 7.3 のデフォルト値をそのまま書いている
//
// 注意: light / dark / contrastText は、省略すると main から自動で計算される。
// main を変えたときは、light / dark / contrastText も合わせて変えるか、行ごと消して自動計算に任せる

// 灰色の段階（ライト・ダーク共通）
const GREY = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#bdbdbd",
  500: "#9e9e9e",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
  A100: "#f5f5f5",
  A200: "#eeeeee",
  A400: "#bdbdbd",
  A700: "#616161"
};

const LIGHT_PALETTE = {
  // 文字色を白にするか黒にするかを決める、背景とのコントラスト比の基準
  contrastThreshold: 3,
  // main から light / dark を自動で作るときの明るさの変化量
  tonalOffset: 0.2,

  // 意味ごとの色
  primary: {
    main: "#1E3A5F",
    light: "rgb(75, 97, 127)",
    dark: "rgb(21, 40, 66)",
    contrastText: "#fff"
  },
  secondary: {
    main: "#9c27b0",
    light: "#ba68c8",
    dark: "#7b1fa2",
    contrastText: "#fff"
  },
  error: {
    main: "#d32f2f",
    light: "#ef5350",
    dark: "#c62828",
    contrastText: "#fff"
  },
  warning: {
    main: "#ed6c02",
    light: "#ff9800",
    dark: "#e65100",
    contrastText: "#fff"
  },
  info: {
    main: "#0288d1",
    light: "#03a9f4",
    dark: "#01579b",
    contrastText: "#fff"
  },
  success: {
    main: "#2e7d32",
    light: "#4caf50",
    dark: "#1b5e20",
    contrastText: "#fff"
  },

  // 文字色
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.6)",
    disabled: "rgba(0, 0, 0, 0.38)"
  },
  // 背景（default: ページ全体 / paper: カードやダイアログ）
  background: {
    default: "#FCFBE8",
    paper: "#FFFFFF"
  },
  // 区切り線
  divider: "rgba(0, 0, 0, 0.05)",
  // ボタンやリストを触ったときの色
  action: {
    active: "rgba(0, 0, 0, 0.54)",
    hover: "rgba(0, 0, 0, 0.04)",
    hoverOpacity: 0.04,
    selected: "rgba(0, 0, 0, 0.08)",
    selectedOpacity: 0.08,
    disabled: "rgba(0, 0, 0, 0.26)",
    disabledBackground: "rgba(0, 0, 0, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(0, 0, 0, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.12
  },

  // 基本色・灰色
  common: { black: "#000", white: "#fff" },
  grey: GREY
};

const DARK_PALETTE = {
  contrastThreshold: 3,
  tonalOffset: 0.2,

  primary: {
    main: "#fca311",
    light: "rgb(252, 181, 64)",
    dark: "rgb(176, 114, 11)",
    contrastText: "rgba(0, 0, 0, 0.87)"
  },
  secondary: {
    main: "#ce93d8",
    light: "#f3e5f5",
    dark: "#ab47bc",
    contrastText: "rgba(0, 0, 0, 0.87)"
  },
  error: {
    main: "#f44336",
    light: "#e57373",
    dark: "#d32f2f",
    contrastText: "#fff"
  },
  warning: {
    main: "#ffa726",
    light: "#ffb74d",
    dark: "#f57c00",
    contrastText: "rgba(0, 0, 0, 0.87)"
  },
  info: {
    main: "#29b6f6",
    light: "#4fc3f7",
    dark: "#0288d1",
    contrastText: "rgba(0, 0, 0, 0.87)"
  },
  success: {
    main: "#66bb6a",
    light: "#81c784",
    dark: "#388e3c",
    contrastText: "rgba(0, 0, 0, 0.87)"
  },

  text: {
    primary: "#fff",
    secondary: "rgba(255, 255, 255, 0.7)",
    disabled: "rgba(255, 255, 255, 0.5)",
    // ダークにだけある項目（型定義には無いが、MUI のデフォルトに含まれる）
    icon: "rgba(255, 255, 255, 0.5)"
  },
  background: {
    default: "#121212",
    paper: "#1e1e1e"
  },
  divider: "rgba(255, 255, 255, 0.12)",
  action: {
    active: "#fff",
    hover: "rgba(255, 255, 255, 0.08)",
    hoverOpacity: 0.08,
    selected: "rgba(255, 255, 255, 0.16)",
    selectedOpacity: 0.16,
    disabled: "rgba(255, 255, 255, 0.3)",
    disabledBackground: "rgba(255, 255, 255, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(255, 255, 255, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.24
  },

  common: { black: "#000", white: "#fff" },
  grey: GREY
};

/**
 * 画面モードに合わせた palette を返す（mode 自体は CustomTheme 側で指定する）
 *
 * @param {{ mode: "light" | "dark" }} params
 */
export const getPalette = ({ mode }) => {
  if (mode === "dark") return DARK_PALETTE;
  // "light" とそれ以外はライト
  return LIGHT_PALETTE;
};
