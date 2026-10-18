// MUI7
import { createTheme } from "@mui/material/styles";

/**
 * CustomTheme
 *
 * @param {"light" | "dark"} mode
 * @returns {import("@mui/material/styles").Theme} theme
 */
const CustomTheme = (mode = "light") => {
  // 画面幅が "lg"（1280px以上）なら true、それ未満なら false
  // const isLargeUp = useMediaQuery(customTheme.breakpoints.up("lg"));

  const themeCustom = createTheme({
    palette: {
      mode
    },
    breakpoints: {
      values: {
        xs: 0, // これ以上はxtra Small
        sm: 376, // これ以上はSmall
        md: 768, // これ以上はMedium
        lg: 1280, // これ以上はLarge
        xl: 1280
      }
    },
    typography: {
      fontFamily: [
        '"Noto Sans JP"',
        "Zen Maru Gothic",
        "Roboto",
        '"Source Code Pro"',
        '"Helvetica"',
        "Arial",
        "sans-serif"
      ].join(",")
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // iPadで画面端を引っ張ったときのバウンドを止める
          // （ブラウザはhtml側の指定を見るので、htmlにも付ける）
          "html, body": { overscrollBehavior: "none" }
        }
      }
    }
  });

  return themeCustom;
};

export default CustomTheme;
