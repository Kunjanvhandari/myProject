"use client";
import {
  Typography,
  Dialog,
  DialogContent,
  Button,
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { styled } from "@mui/material/styles";
import { PageLoader } from "./PageLoader";

// STYLED ROOT BOX
const ReadProfileBox = styled(Box, {
  name: "MuiCommonConfirmationDialog",
  slot: "root",
})(({ theme }) => ({
  "& .textField": {
    marginTop: theme.spacing(3),
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px !important",
      padding: "0px !important",
    },
  },
  "& .confirmationDialogBox": {
    "& .titleBox": {
      "& h4": {
        color: "#fff",
        textAlign: "center",
        margin: theme.spacing(2, 0),
      },
      "& h6": {
        color: "rgba(255, 255, 255, 0.60)",
      },
    },
    "& h5": {
      color: "#fff",
      textAlign: "center",
    },
    "& p": {
      color: "rgba(255, 255, 255, 0.4)",
      textAlign: "center",
      width: "100%",
      maxWidth: 320,
      margin: theme.spacing(2, 0),
    },
  },
  "& .disclaimerBox": {
    background: "rgba(0, 0, 0, 0.08)",
    borderRadius: 10,
    padding: theme.spacing(1),
    "& p": {
      color: "rgba(0, 0, 0, 0.60)",
    },
  },
}));

export default function CommonConfirmationDialog(props) {
  const {
    desc,
    isLoading,
    open,
    handleClose,
    heading,
    type,
    title,
    replyMessage,
    setMessage,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isLoading) handleClose();
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xs"
    >
      <ReadProfileBox>
        <DialogContent sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", top: 0, right: 0 }}>
            <IconButton onClick={handleClose}>
              <AiOutlineClose color="#fff" />
            </IconButton>
          </Box>

          <Box className="confirmationDialogBox displayColumn">
            <Box className="titleBox" textAlign="center">
              <Typography variant="h4">{title}</Typography>
              <Typography variant="h6">{heading}</Typography>
            </Box>

            {type === "logout" && <Typography variant="body2">{desc}</Typography>}
          </Box>

          {type === "reply" && (
            <TextField
              fullWidth
              variant="outlined"
              type="text"
              multiline
              className="textField"
              rows={5}
              placeholder="Type something..."
              value={replyMessage}
              onChange={(e) => setMessage && setMessage(e.target.value)}
            />
          )}

          <Box my={3} className="displayCenter">
            <Button
              disabled={isLoading}
              variant="outlined"
              color="primary"
              sx={{ mr: 1 }}
              onClick={handleClose}
            >
              NO
            </Button>
            <Button
              disabled={isLoading}
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={handleClose}
            >
              YES
            </Button>
          </Box>
        </DialogContent>
      </ReadProfileBox>

      {isLoading && <PageLoader />}
    </Dialog>
  );
}
