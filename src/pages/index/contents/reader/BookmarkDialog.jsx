// MUI
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

/**
 * ブックマーク用ダイアログ
 */
export const BookmarkDialog = ({ bookmarkDialog, bookmarkDialogToggle }) => {
  return (
    <Dialog
      open={bookmarkDialog}
      onClose={bookmarkDialogToggle}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>{"ブックマークの作成"}</DialogTitle>

      <Divider />

      <DialogContent>
        <TextField autoFocus fullWidth value={""} onChange={() => {}} />
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button
          size={"large"}
          variant={"outlined"}
          onClick={bookmarkDialogToggle}
        >
          {"キャンセル"}
        </Button>
        <Button size={"large"} variant={"contained"}>
          {"作成する"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
