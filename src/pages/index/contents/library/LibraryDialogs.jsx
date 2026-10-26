import React, { useEffect, useState } from "react";
// MUI
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOffIcon from "@mui/icons-material/FolderOff";

/**
 * 確認ダイアログ（本・フォルダの削除）
 */
export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel,
  onClose,
  onConfirm
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>{"キャンセル"}</Button>
      <Button color='error' onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

/**
 * フォルダ名の入力（作成・名前の変更）
 */
export const FolderNameDialog = ({
  open,
  title,
  initialName = "",
  submitLabel,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState(initialName);

  // 開くたびに初期値へ戻す
  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  const trimmed = name.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin='dense'
            label='フォルダ名'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{"キャンセル"}</Button>
          <Button type='submit' disabled={!trimmed}>
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

/**
 * 本の移動先フォルダを選ぶ
 */
export const MoveBookDialog = ({
  book,
  folders,
  onClose,
  onMove,
  onCreateAndMove
}) => {
  // 新しいフォルダ名の入力欄を出しているか
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (book) {
      setCreating(false);
      setName("");
    }
  }, [book]);

  const currentFolderId = book?.folderId ?? null;
  const trimmed = name.trim();

  const handleCreate = (e) => {
    e.preventDefault();
    if (trimmed) onCreateAndMove(trimmed);
  };

  const options = [
    { id: null, name: "フォルダなし", icon: <FolderOffIcon /> },
    ...folders.map((folder) => ({ ...folder, icon: <FolderIcon /> }))
  ];

  return (
    <Dialog open={Boolean(book)} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle>{"フォルダへ移動"}</DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <List>
          {options.map((option) => (
            <ListItemButton
              key={option.id ?? "none"}
              selected={option.id === currentFolderId}
              onClick={() => onMove(option.id)}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.name} />
              {option.id === currentFolderId && <CheckIcon color='primary' />}
            </ListItemButton>
          ))}
          {!creating && (
            <ListItemButton onClick={() => setCreating(true)}>
              <ListItemIcon>
                <CreateNewFolderIcon />
              </ListItemIcon>
              <ListItemText primary='新しいフォルダを作成…' />
            </ListItemButton>
          )}
        </List>
        {creating && (
          <Stack
            component='form'
            direction='row'
            spacing={1}
            alignItems='center'
            onSubmit={handleCreate}
            sx={{ px: 2, pb: 2 }}
          >
            <TextField
              autoFocus
              fullWidth
              size='small'
              label='フォルダ名'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type='submit' variant='contained' disabled={!trimmed}>
              {"作成"}
            </Button>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{"キャンセル"}</Button>
      </DialogActions>
    </Dialog>
  );
};
