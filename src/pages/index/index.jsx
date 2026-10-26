import React from "react";
import { createRoot } from "react-dom/client";
// MUI5
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
// Hooks
import useAppState from "@app/pages/index/hooks/useAppState";
// Theme
import CustomTheme from "@app/themes/CustomTheme";
// Contents
import Contents from "@app/pages/index/contents/Contents";

const Index = () => {
  const propsContainer = document.getElementById("root");
  const props = Object.assign({}, propsContainer.dataset);

  // Hooks
  const state = useAppState({ props: props });

  // テーマ読み込み
  const customTheme = CustomTheme(state.mode);

  return (
    <React.Fragment>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Container maxWidth={false} disableGutters={true}>
          <Contents state={state} />
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
};

if (document.getElementById("root")) {
  const root = createRoot(document.getElementById("root"));
  root.render(<Index />);
}
