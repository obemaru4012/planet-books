import React, { useEffect, useState } from "react";
// MUI
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import TocIcon from "@mui/icons-material/Toc";
// Hooks
import useReader from "@app/pages/index/hooks/useReader";
import {
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FONT_SIZE_STEP
} from "@app/pages/index/hooks/usePageState";

const Reader = ({ state }) => {
  const book = state.openedBook;
  const reader = useReader({
    book,
    mode: state.mode,
    fontSize: state.fontSize
  });

  const [tocOpen, setTocOpen] = useState(false);
  // スライダー操作中の値（null なら現在の読書位置を表示）
  const [dragging, setDragging] = useState(null);

  const isRtl = reader.dir === "rtl";
  const fraction = dragging ?? reader.fraction;

  // 読書中はページ全体のスクロールを止める
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // 縦書き（右開き）の本は右端を先頭にする
  const toSliderValue = (value) => (isRtl ? 1 - value : value);

  const handleSliderCommit = (e, value) => {
    setDragging(null);
    reader.goToFraction(toSliderValue(value));
  };

  const handleSelectToc = (href) => {
    setTocOpen(false);
    reader.setMenuVisible(false);
    reader.goTo(href);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "background.default",
          pt: "env(safe-area-inset-top)",
          pb: "env(safe-area-inset-bottom)"
        }}
      >
        <Box ref={reader.containerRef} sx={{ width: "100%", height: "100%" }} />

        {reader.loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {reader.error && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              px: 2
            }}
          >
            <Alert severity='error'>{reader.error}</Alert>
            <Button variant='outlined' onClick={state.closeBook}>
              {"本棚に戻る"}
            </Button>
          </Box>
        )}
      </Box>

      <Fade in={reader.menuVisible}>
        <AppBar
          position='fixed'
          color='default'
          elevation={1}
          sx={{ pt: "env(safe-area-inset-top)" }}
        >
          <Toolbar>
            <IconButton
              edge='start'
              onClick={state.closeBook}
              aria-label='back to library'
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant='subtitle1'
              component='h1'
              noWrap
              sx={{ flexGrow: 1, mx: 1 }}
            >
              {book.title}
            </Typography>
            <IconButton
              onClick={() => setTocOpen(true)}
              disabled={reader.toc.length === 0}
              aria-label='table of contents'
            >
              <TocIcon />
            </IconButton>
            <IconButton
              onClick={state.toggleMode}
              aria-label='toggle dark mode'
            >
              {state.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
      </Fade>

      <Fade in={reader.menuVisible}>
        <Paper
          square
          elevation={4}
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: "appBar",
            px: 3,
            pt: 1,
            pb: "calc(8px + env(safe-area-inset-bottom))"
          }}
        >
          <Stack direction='row' spacing={2} alignItems='center'>
            <Slider
              size='medium'
              min={0}
              max={1}
              step={0.001}
              track={isRtl ? "inverted" : "normal"}
              value={toSliderValue(fraction)}
              onChange={(e, value) => setDragging(toSliderValue(value))}
              onChangeCommitted={handleSliderCommit}
              aria-label='reading progress'
            />
            <Typography
              variant='body2'
              sx={{ minWidth: 44, textAlign: "right", color: "text.secondary" }}
            >
              {`${Math.round(fraction * 100)}%`}
            </Typography>
            <Stack direction='row' alignItems='center'>
              <IconButton
                onClick={() => state.changeFontSize(-FONT_SIZE_STEP)}
                disabled={state.fontSize <= FONT_SIZE_MIN}
                aria-label='decrease font size'
              >
                <TextDecreaseIcon />
              </IconButton>
              <Typography
                variant='body2'
                sx={{
                  minWidth: 44,
                  textAlign: "center",
                  color: "text.secondary"
                }}
              >
                {`${state.fontSize}%`}
              </Typography>
              <IconButton
                onClick={() => state.changeFontSize(FONT_SIZE_STEP)}
                disabled={state.fontSize >= FONT_SIZE_MAX}
                aria-label='increase font size'
              >
                <TextIncreaseIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>
      </Fade>

      <Drawer anchor='left' open={tocOpen} onClose={() => setTocOpen(false)}>
        <Box
          sx={{
            width: 320,
            maxWidth: "80vw",
            pt: "env(safe-area-inset-top)",
            pb: "env(safe-area-inset-bottom)"
          }}
        >
          <Typography
            variant='subtitle1'
            sx={{ px: 2, py: 1.5, fontWeight: 700 }}
          >
            {"目次"}
          </Typography>
          <List dense disablePadding>
            {reader.toc.map((item, index) => (
              <ListItemButton
                key={`${item.href}-${index}`}
                selected={item.href === reader.currentHref}
                onClick={() => handleSelectToc(item.href)}
                sx={{ pl: 2 + item.depth * 2 }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default Reader;
