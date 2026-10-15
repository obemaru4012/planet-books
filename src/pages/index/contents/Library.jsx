import React, { useEffect, useRef, useState } from "react";
// MUI
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const BookCard = ({ book, onOpen, onDelete }) => {
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

  return (
    <Card variant='outlined' sx={{ position: "relative" }}>
      <CardActionArea onClick={() => onOpen(book)}>
        <Box
          sx={{
            aspectRatio: "9 / 16",
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          {coverUrl ? (
            <Box
              component='img'
              src={coverUrl}
              alt=''
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography
              variant='subtitle2'
              sx={{ p: 2, textAlign: "center", color: "text.secondary" }}
            >
              {book.title}
            </Typography>
          )}
        </Box>
        <LinearProgress variant='determinate' value={percent} />
        <Box sx={{ p: 1, pr: 5 }}>
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
        </Box>
      </CardActionArea>
      <IconButton
        size='small'
        aria-label='delete book'
        onClick={() => onDelete(book)}
        sx={{ position: "absolute", right: 4, bottom: 4 }}
      >
        <DeleteOutlineIcon fontSize='small' />
      </IconButton>
    </Card>
  );
};

const Library = ({ state }) => {
  const { library } = state;
  const fileInputRef = useRef(null);
  // 削除確認中の本
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSelectFiles = (e) => {
    const files = e.target.files;
    if (files?.length) library.importFiles(files);
    // 同じファイルを続けて選べるようにリセット
    e.target.value = "";
  };

  const handleDelete = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    await library.removeBook(target.id);
  };

  const openFilePicker = () => fileInputRef.current?.click();

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
            <MenuBookIcon sx={{ mr: 1 }} />
            <Typography variant='h6' component='h1' sx={{ flexGrow: 1 }}>
              {"Planet Books"}
            </Typography>
            <IconButton
              onClick={state.toggleMode}
              aria-label='toggle dark mode'
            >
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
        ) : library.books.length === 0 ? (
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
              <MenuBookIcon sx={{ fontSize: 64, color: "text.disabled" }} />
              <Typography variant='h6'>{"本棚は空です"}</Typography>
              <Typography
                variant='body2'
                sx={{ marginTop: 1, marginBottom: 3 }}
              >
                {"「本を追加」からEPUBファイルを選んでください。"}
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
          <Grid container sx={{ padding: 2, spacing: 4 }}>
            {library.books.map((book) => (
              <Grid size={{ xs: 3 }}>
                <BookCard
                  key={book.id}
                  book={book}
                  onOpen={state.openBook}
                  onDelete={setDeleteTarget}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>{"本を削除しますか？"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`「${deleteTarget?.title ?? ""}」と読書位置を本棚から削除します。元のEPUBファイルは消えません。`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>{"キャンセル"}</Button>
          <Button color='error' onClick={handleDelete}>
            {"削除"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Library;
