// MUI7
import { createTheme } from "@mui/material/styles";
import { getPalette } from "@app/themes/Palette";

/**
 * CustomTheme
 *
 * @param {"light" | "dark"} mode
 * @returns {import("@mui/material/styles").Theme} theme
 */
const CustomTheme = (mode = "light") => {
  // 画面幅が "lg"（1280px以上）なら true、それ未満なら false
  // const isLargeUp = useMediaQuery(customTheme.breakpoints.up("lg"));
  const inputBackgroundColor =
    mode === "dark" ? "rgba(255, 255, 255, 0.04)" : "#FCFCFC";

  const themeCustom = createTheme({
    palette: {
      mode,
      ...getPalette({ mode: mode })
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
      },
      MuiInputLabel: {
        defaultProps: {
          shrink: true
        },
        styleOverrides: {
          formControl: {
            // 移動をクリック時に動かないように固定
            position: "static",
            transform: "none",
            transition: "none",
            // クリックを可能に
            pointerEvents: "auto",
            cursor: "pointer",
            // 幅いっぱいを解除
            display: "inline",
            alignSelf: "start",
            // タイポグラフィを指定
            fontSize: "14px",
            fontWeight: "bold"
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            marginTop: 0,
            backgroundColor: inputBackgroundColor
          },
          input: {
            paddingTop: "14px",
            paddingBottom: "12px",
            height: "auto",
            // Chromeのオートフィル特有の色を完全に消す定番の書き方
            // (box-shadowで塗り替え、transitionを極端に伸ばして色が一瞬でも見えないようにする)
            "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active":
              {
                WebkitBoxShadow: `0 0 0 1000px ${inputBackgroundColor} inset`,
                WebkitTextFillColor: mode === "dark" ? "#fff" : "inherit",
                caretColor: mode === "dark" ? "#fff" : "inherit",
                transition: "background-color 9999s ease-in-out 0s"
              }
          },
          notchedOutline: {
            top: 0,
            // ラベルが枠線を突き破らなくなったので、notch(切り欠き)は不要
            "& legend": {
              display: "none"
            }
          }
        }
      },
      MuiTextField: {
        variants: [
          {
            props: { variant: "outlined" },
            style: {
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px"
              }
            }
          }
        ]
      }
    }
  });

  return themeCustom;
};

export default CustomTheme;
