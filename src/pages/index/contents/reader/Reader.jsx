import React, { useEffect, useState } from "react";
// MUI
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";
// MUI Icons
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import TocIcon from "@mui/icons-material/Toc";
// Theme
import CustomTheme from "@app/themes/CustomTheme";
// Hooks
import useReaderState from "@app/pages/index/hooks/useReaderState";
import {
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FONT_SIZE_STEP
} from "@app/pages/index/hooks/useAppState";
import { BookmarkDialog } from "@app/pages/index/contents/reader/BookmarkDialog";

const Reader = ({ state }) => {
  // テーマ読み込み
  const customTheme = CustomTheme(state.mode);
  const isLargeUp = useMediaQuery(customTheme.breakpoints.up("lg"));
  const isMediumUp = useMediaQuery(customTheme.breakpoints.up("md"));

  // 本のタイトル
  const displayBookTitle = ({ title: title }) => {
    if (isLargeUp) {
      return title.length > 200 ? title.slice(0, 200) + "..." : book.title;
    }

    if (isMediumUp) {
      return title.length > 40 ? title.slice(0, 40) + "..." : book.title;
    }

    return title.length > 15 ? title.slice(0, 15) + "..." : book.title;
  };

  // DrawerMenuの横幅
  const getDrawerMenuWidth = () => {
    if (isLargeUp || isMediumUp) {
      return 320;
    }

    return 240;
  };

  // 選択した本
  const book = state.openedBook;
  // 読み込み処理
  const reader = useReaderState({
    book,
    mode: state.mode,
    fontSize: state.fontSize
  });

  // 目次Drawer
  const [tocOpen, setTocOpen] = useState(false);
  const handleSelectToc = (href) => {
    setTocOpen(false);
    reader.setMenuVisible(false);
    reader.goTo(href);
  };

  // スライダー操作中の値（null なら現在の読書位置を表示）
  // const [dragging, setDragging] = useState(null);

  const isRtl = reader.dir === "rtl";
  // const fraction = dragging ?? reader.fraction;

  // 縦書き（右開き）の本は右端を先頭にする
  const toSliderValue = (value) => (isRtl ? 1 - value : value);

  // 設定メニュー
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // ブックマークDialog
  const [bookmarkDialog, setbookmarkDialog] = useState(false);
  const bookmarkDialogToggle = (event) => {
    setbookmarkDialog(!bookmarkDialog);
  };

  // 読書中はページ全体のスクロールを止める
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <React.Fragment>
      {/** AppBar */}
      <Fade in={reader.menuVisible}>
        <AppBar position='fixed' color='default' elevation={2}>
          <Toolbar>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={isMediumUp ? 4 : 0}
              sx={{ flexGrow: 1 }}
            >
              <Stack direction={"row"} gap={0}>
                <IconButton edge='start' onClick={state.closeBook}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <IconButton
                  onClick={() => setTocOpen(true)}
                  disabled={reader.toc.length === 0}
                >
                  <TocIcon />
                </IconButton>
              </Stack>

              <Typography variant='body1'>
                {displayBookTitle({ title: book.title })}
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"flex-end"}
              gap={1}
              sx={{ flexGrow: 0 }}
            >
              <IconButton
                edge='start'
                onClick={handleClick}
                disabled={reader.toc.length === 0}
              >
                <FormatSizeIcon />
              </IconButton>
              <IconButton
                edge='start'
                onClick={bookmarkDialogToggle}
                disabled={reader.toc.length === 0}
              >
                <BookmarkBorderIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
      </Fade>

      {/** 目次Drawer */}
      <Drawer anchor='left' open={tocOpen} onClose={() => setTocOpen(false)}>
        <Box
          sx={{
            width: getDrawerMenuWidth()
          }}
        >
          <Typography variant='subtitle1' sx={{ paddingX: 2, paddingY: 2 }}>
            {"目次"}
          </Typography>

          <Divider />

          <List dense disablePadding>
            {reader.toc.map((item, index) => (
              <ListItemButton
                key={`${item.href}-${index}`}
                selected={item.href === reader.currentHref}
                onClick={() => handleSelectToc(item.href)}
                sx={{
                  paddingX: 2 + item.depth * 2,
                  marginTop: index == 0 ? 2 : 0,
                  marginBottom: reader.toc.length - 1 == index ? 2 : 0
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      {/** [TODO] 設定Menu */}
      <Menu
        id='setting-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}

        slotProps={{
          paper: { sx: { width: 280, borderRadius: 4 } }
        }}
      >
        <Stack alignItems={"center"} sx={{ paddingTop: 1, paddingBottom: 1.5 }}>
          <Typography variant={"subtitle2"}>{"Preferance"}</Typography>
        </Stack>
        <Divider />
        <Stack gap={1} sx={{ marginY: 1.5 }}>
          <MenuItem onClick={handleClose}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              gap={2}
              sx={{ width: "100%" }}
            >
              <Typography sx={{ width: 96, flexShrink: 0 }}>
                {"Theme"}
              </Typography>
              <Button variant={"contained"} fullWidth>
                {"Dark"}
              </Button>
            </Stack>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              gap={2}
              sx={{ width: "100%" }}
            >
              <Typography sx={{ width: 96, flexShrink: 0 }}>
                {"Font Size"}
              </Typography>
              <Button variant={"contained"} fullWidth>
                {"24px"}
              </Button>
            </Stack>
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              gap={2}
              sx={{ width: "100%" }}
            >
              <Typography sx={{ width: 96, flexShrink: 0 }}>
                {"Direction"}
              </Typography>
              <Button variant={"contained"} fullWidth>
                {"Right to Left"}
              </Button>
            </Stack>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              gap={2}
              sx={{ width: "100%" }}
            >
              <Typography sx={{ width: 96, flexShrink: 0 }}>
                {"Bookmarks"}
              </Typography>
              <Button variant={"contained"} fullWidth>
                {"0"}
              </Button>
            </Stack>
          </MenuItem>
        </Stack>
      </Menu>

      {/** [TODO] ブックマークDialog */}
      <BookmarkDialog
        bookmarkDialog={bookmarkDialog}
        bookmarkDialogToggle={bookmarkDialogToggle}
      />

      <Box
        sx={{
          position: "fixed",
          inset: 0
        }}
      >
        {/** 本の本体 */}
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
    </React.Fragment>
  );
};

export default Reader;
