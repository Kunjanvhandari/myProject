import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { BiBell } from "react-icons/bi";
import { maxWidth, styled } from "@mui/system";
import {
  IconButton,
  Toolbar,
  AppBar,
  Grid,
  Box,
  Avatar,
  TextField,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import Logo from "../../../../src/components/Logo";

const AppBarContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.05)",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  padding: "7px 30px 7px 30px",
  [theme.breakpoints.down("sm")]: {
    padding: "0px 20px 0px 20px",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: "0px",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  cursor: "pointer",
}));

const MainHeader = styled(Box)(({ theme }) => ({
  "& .filtersButton": {
    marginLeft: "20px",
    "& .filterIcon": {
      "& button": {
        background: "rgba(0, 0, 0, 0.08) !important",
        width: "37px",
        height: "37px",
        borderRadius: "50%",
        padding: "0px",
        "& svg": {
          position: "absolute",
          zIndex: 3,
        },
      },
    },
  },
  "& .serchBox": {
    "& .MuiOutlinedInput-root": {
      border: "1px solid #E8E8E8",
      position: "relative",
      borderRadius: "10px",
      background: "#FFFFFF",
      height: "44px",
      color: "#000 !important",
      // minWidth: "350px",
    },
  },
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  return (
    <AppBarContainer
      elevation={3}
      style={{}}
      className={clsx(className)}
      color="inherit"
      sx={{
        boxShadow: "0px 4px 4px 0px #0000001A",
        color: "#FFFFFF",
        borderRadius: "0px",
        padding: "8px",
      }}
    >
      <StyledToolbar>
        <StyledIconButton
          onClick={onMobileNavOpen}
          sx={{ display: { sm: "block", md: "none" } }}
        >
          <MenuIcon style={{ fontSize: "30px", color: "#6FCFB9" }} />
        </StyledIconButton>
      </StyledToolbar>
      <MainHeader>
        <Box className="displaySpacebetween">
          <Box sx={{ display: { sm: "none", md: "block" } }}>
            <Box className="filtersButton displayEnd">
              <Box className="displayStart filterIcon">
                <IconButton style={{ cursor: "pointer", marginRight: "8px" }}>
                  <img
                    src="/images/topbar/calisLogo.png"
                    alt="search"
                    width="350px"
                  />
                </IconButton>
                <Box>
                  <Typography variant="h3" sx={{ color: "#6FCFB9",fontWeight:700 }}>
                    LibriVista Library
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="displayStart serchBox">
            <Box>
              <TextField
                style={{ width: "100%", maxWidth: "225px" }}
                variant="outlined"
                placeholder="Search books, authors, or categories..."
                fullWidth
                type="search"
              />
            </Box>
            <Box>
              <IconButton>
                <img
                  src="/images/topbar/filterIcon.png"
                  alt="search"
                  width="350px"
                />
              </IconButton>
            </Box>
          </Box>
          <Box style={{ display: "flex", justifyContent: "end" }}>
            <Box className="filtersButton serchBox displayEnd">
              <IconButton size="40px">
                <img
                  src="/images/topbar/addIcon.png"
                  alt="search"
                  width="400px"
                />
              </IconButton>
              <IconButton size="40px">
                <img
                  src="/images/topbar/messageIcon.png"
                  alt="search"
                  width="400px"
                />
              </IconButton>
              <IconButton size="40px">
                <img
                  src="/images/topbar/notificationIcon.png"
                  alt="search"
                  width="400px"
                />
              </IconButton>
              <IconButton size="40px">
                <img
                  src="/images/topbar/profileIcon.png"
                  alt="search"
                  width="400px"
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </MainHeader>
    </AppBarContainer>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
};
TopBar.defaultProps = {
  onMobileNavOpen: () => {},
};

export default TopBar;
