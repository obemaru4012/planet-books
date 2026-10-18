import React, { useEffect, useRef, useState } from "react";
// MUI
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import EditIcon from "@mui/icons-material/Edit";
import FolderIcon from "@mui/icons-material/Folder";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMediaQuery } from "@mui/material";
// Theme
import CustomTheme from "@app/themes/CustomTheme";
// Contents
import {
  ConfirmDialog,
  FolderNameDialog,
  MoveBookDialog
} from "@app/pages/index/contents/LibraryDialogs";

/**
 * 「︙」ボタンとメニュー
 *
 * @param {{ label: string, icon: React.ReactNode, onClick: () => void, color?: string }[]} items
 */
const MoreMenu = ({ items, ariaLabel, size = "small", sx }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSelect = (item) => {
    setAnchorEl(null);
    item.onClick();
  };

  return (
    <React.Fragment>
      <IconButton
        size={size}
        aria-label={ariaLabel}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={sx}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {items.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => handleSelect(item)}
            sx={item.color ? { color: item.color } : undefined}
          >
            <ListItemIcon sx={item.color ? { color: item.color } : undefined}>
              {item.icon}
            </ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

const FolderCard = ({ folder, count, onOpen }) => (
  <Card variant='outlined'>
    <CardActionArea onClick={() => onOpen(folder)}>
      <Grid container spacing={1} alignItems='center'>
        <Grid size={{ xs: 3 }}>
          <Box
            sx={{
              aspectRatio: "2 / 3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FolderIcon sx={{ fontSize: 56, color: "primary.main" }} />
          </Box>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            {folder.name}
          </Typography>
          <Typography variant='body1'>{`${count}冊`}</Typography>
        </Grid>
      </Grid>
    </CardActionArea>
  </Card>
);

const BookCard = ({ book, state, onOpen, onDelete, onMove }) => {
  const [coverUrl, setCoverUrl] = useState(null);

  useEffect(() => {
    if (!book.cover) return;
    const url = URL.createObjectURL(
      new Blob([book.cover.buffer], { type: book.cover.type })
    );
    setCoverUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [book.cover]);

  const percent = Math.round((book.fraction ?? 0) * 100);
  // [TODO] 表示typeを切り替えできるようにする
  const displayType = "list";

  // テーマ読み込み
  const customTheme = CustomTheme(state.mode);
  const isLargeUp = useMediaQuery(customTheme.breakpoints.up("lg"));
  const isMediumUp = useMediaQuery(customTheme.breakpoints.up("md"));
  const isLarge = isLargeUp;
  const isMedium = !isLargeUp && isMediumUp;
  const isSmall = !isLargeUp && !isMediumUp;

  const menuItems = [
    {
      label: "フォルダへ移動",
      icon: <DriveFileMoveIcon fontSize='small' />,
      onClick: () => onMove(book)
    },
    {
      label: "削除",
      icon: <DeleteOutlineIcon fontSize='small' />,
      onClick: () => onDelete(book),
      color: "error.main"
    }
  ];

  return displayType == "list" ? (
    <Card variant='outlined' sx={{ position: "relative" }}>
      <CardActionArea onClick={() => onOpen(book)}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 3 }}>
            <Box
              sx={{
                aspectRatio: "2 / 3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}
            >
              <Box
                component='img'
                src={coverUrl ?? ""}
                alt=''
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>
            <LinearProgress variant='determinate' value={percent} />
          </Grid>
          <Grid size={{ xs: 9 }}>
            <Typography variant='body1' sx={{ fontWeight: 700 }}>
              {book.title}
            </Typography>
            <Typography variant='body1' noWrap component='div'>
              {book.author || ""}
            </Typography>
            <Typography variant='body1'>
              {book.lastOpenedAt ? `${percent}%` : "0%"}
            </Typography>
          </Grid>
        </Grid>
      </CardActionArea>
      <MoreMenu
        items={menuItems}
        ariaLabel='book menu'
        size='medium'
        sx={{ position: "absolute", right: 4, bottom: 4 }}
      />
    </Card>
  ) : (
    <Card variant='outlined' sx={{ position: "relative" }}>
      <CardActionArea onClick={() => onOpen(book)}>
        <Box
          sx={{
            aspectRatio: "2 / 3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          <Box
            component='img'
            src={coverUrl ?? ""}
            alt=''
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
        <LinearProgress variant='determinate' value={percent} />

        <Typography variant='body2' noWrap sx={{ fontWeight: 700 }}>
          {book.title}
        </Typography>
        <Typography
          variant='caption'
          noWrap
          component='div'
          sx={{ color: "text.secondary" }}
        >
          {book.author || " "}
        </Typography>
        <Typography variant='caption' sx={{ color: "text.secondary" }}>
          {book.lastOpenedAt ? `${percent}%` : "未読"}
        </Typography>
      </CardActionArea>
      <MoreMenu
        items={menuItems}
        ariaLabel='book menu'
        sx={{ position: "absolute", right: 4, bottom: 4 }}
      />
    </Card>
  );
};

const Library = ({ state }) => {
  const { library } = state;
  // 開いているフォルダ（null なら一番上）
  const folder = state.openedFolder;
  const fileInputRef = useRef(null);
  // 削除確認中の本
  const [deleteTarget, setDeleteTarget] = useState(null);
  // 移動先を選んでいる本
  const [moveTarget, setMoveTarget] = useState(null);
  // フォルダ名の入力中（"create" | "rename" | null）
  const [folderDialog, setFolderDialog] = useState(null);
  // フォルダの削除確認中
  const [deletingFolder, setDeletingFolder] = useState(false);

  // 今の階層に並べる本（古いデータには folderId が無いので null 扱い）
  const visibleBooks = library.books.filter(
    (book) => (book.folderId ?? null) === (folder?.id ?? null)
  );
  const visibleFolders = folder ? [] : library.folders;
  const countOf = (folderId) =>
    library.books.filter((book) => book.folderId === folderId).length;
  const isEmpty = visibleBooks.length === 0 && visibleFolders.length === 0;

  const handleSelectFiles = (e) => {
    const files = e.target.files;
    // フォルダを開いているときは、そのフォルダに入れる
    if (files?.length) library.importFiles(files, folder?.id ?? null);
    // 同じファイルを続けて選べるようにリセット
    e.target.value = "";
  };

  const handleDelete = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    await library.removeBook(target.id);
  };

  const handleMove = async (folderId) => {
    const target = moveTarget;
    setMoveTarget(null);
    await library.moveBook(target.id, folderId);
  };

  const handleCreateAndMove = async (name) => {
    const target = moveTarget;
    setMoveTarget(null);
    const created = await library.createFolder(name);
    await library.moveBook(target.id, created.id);
  };

  const handleFolderNameSubmit = async (name) => {
    const mode = folderDialog;
    setFolderDialog(null);
    if (mode === "rename") await library.renameFolder(folder.id, name);
    else await library.createFolder(name);
  };

  const handleDeleteFolder = async () => {
    const target = folder;
    setDeletingFolder(false);
    state.closeFolder();
    await library.removeFolder(target.id);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const folderMenuItems = [
    {
      label: "名前を変更",
      icon: <EditIcon fontSize='small' />,
      onClick: () => setFolderDialog("rename")
    },
    {
      label: "フォルダを削除",
      icon: <DeleteOutlineIcon fontSize='small' />,
      onClick: () => setDeletingFolder(true),
      color: "error.main"
    }
  ];

  return (
    <React.Fragment>
      <Box
        sx={{
          minHeight: "100dvh",
          bgcolor: "background.default",
          pb: "env(safe-area-inset-bottom)"
        }}
      >
        <AppBar
          position='sticky'
          color='default'
          elevation={2}
          sx={{ pt: "env(safe-area-inset-top)" }}
        >
          <Toolbar>
            {folder ? (
              <IconButton
                edge='start'
                onClick={state.closeFolder}
                aria-label='back to top'
                sx={{ mr: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <MenuBookIcon sx={{ mr: 1 }} />
            )}
            <Typography variant='h6' component='h1' noWrap sx={{ flexGrow: 1 }}>
              {folder ? folder.name : "Planet Books"}
            </Typography>
            {folder ? (
              <MoreMenu
                items={folderMenuItems}
                ariaLabel='folder menu'
                size='medium'
              />
            ) : (
              <IconButton
                onClick={() => setFolderDialog("create")}
                aria-label='create folder'
              >
                <CreateNewFolderIcon />
              </IconButton>
            )}
            <IconButton onClick={state.toggleMode}>
              {state.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Button
              variant='outlined'
              startIcon={
                library.importing ? (
                  <CircularProgress size={16} color='inherit' />
                ) : (
                  <AddIcon />
                )
              }
              disabled={library.importing}
              onClick={openFilePicker}
              sx={{ ml: 1 }}
            >
              {"本を追加"}
            </Button>
          </Toolbar>
        </AppBar>

        <input
          ref={fileInputRef}
          type='file'
          accept='.epub,application/epub+zip'
          multiple
          hidden
          onChange={handleSelectFiles}
        />

        {library.error && (
          <Alert severity='error' onClose={library.clearError} sx={{ m: 2 }}>
            {library.error}
          </Alert>
        )}

        {library.loading ? (
          <Grid
            container
            spacing={0}
            direction='column'
            alignItems='center'
            justifyContent='center'
            sx={{
              minHeight: "90vh",
              bgcolor: "background.default",
              px: 2,
              position: "relative"
            }}
          >
            <CircularProgress />
          </Grid>
        ) : isEmpty ? (
          <Grid
            container
            spacing={0}
            direction='column'
            alignItems='center'
            justifyContent='center'
            sx={{
              minHeight: "90vh",
              bgcolor: "background.default",
              px: 2,
              position: "relative"
            }}
          >
            <Box
              sx={{
                textAlign: "center"
              }}
            >
              {folder ? (
                <FolderIcon sx={{ fontSize: 64, color: "text.disabled" }} />
              ) : (
                <MenuBookIcon sx={{ fontSize: 64, color: "text.disabled" }} />
              )}
              <Typography variant='h6'>
                {folder ? "このフォルダは空です" : "本棚は空です"}
              </Typography>
              <Typography
                variant='body2'
                sx={{ marginTop: 1, marginBottom: 3 }}
              >
                {folder
                  ? "「本を追加」でこのフォルダに直接取り込めます。本棚の本は「︙」→「フォルダへ移動」で入れられます。"
                  : "「本を追加」からEPUBファイルを選んでください。"}
              </Typography>
              <Button
                size={"large"}
                variant='outlined'
                startIcon={<AddIcon />}
                disabled={library.importing}
                onClick={openFilePicker}
              >
                {"本を追加"}
              </Button>
            </Box>
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ paddingX: 4, paddingY: 2 }}>
            {visibleFolders.map((item) => (
              <Grid key={item.id} size={{ xs: 12, md: 6, lg: 3 }}>
                <FolderCard
                  folder={item}
                  count={countOf(item.id)}
                  onOpen={state.openFolder}
                />
              </Grid>
            ))}
            {visibleBooks.map((book) => (
              <Grid key={book.id} size={{ xs: 12, md: 6, lg: 3 }}>
                <BookCard
                  state={state}
                  book={book}
                  onOpen={state.openBook}
                  onDelete={setDeleteTarget}
                  onMove={setMoveTarget}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title='本を削除しますか？'
        message={`「${deleteTarget?.title ?? ""}」と読書位置を本棚から削除します。元のEPUBファイルは消えません。`}
        confirmLabel='削除'
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={deletingFolder}
        title='フォルダを削除しますか？'
        message={`「${folder?.name ?? ""}」を削除します。中の本は削除されず、本棚の一番上に戻ります。`}
        confirmLabel='削除'
        onClose={() => setDeletingFolder(false)}
        onConfirm={handleDeleteFolder}
      />

      <FolderNameDialog
        open={Boolean(folderDialog)}
        title={folderDialog === "rename" ? "名前を変更" : "新しいフォルダ"}
        initialName={folderDialog === "rename" ? (folder?.name ?? "") : ""}
        submitLabel={folderDialog === "rename" ? "変更" : "作成"}
        onClose={() => setFolderDialog(null)}
        onSubmit={handleFolderNameSubmit}
      />

      <MoveBookDialog
        book={moveTarget}
        folders={library.folders}
        onClose={() => setMoveTarget(null)}
        onMove={handleMove}
        onCreateAndMove={handleCreateAndMove}
      />
    </React.Fragment>
  );
};

export default Library;
