"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Box, Button, Collapse, ListItem, ListSubheader } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { styled } from "@mui/material/styles"; 
import { useRouter } from "next/navigation";

const StyledListItem = styled(ListItem)(({ theme }) => ({

  paddingTop: 0,
  paddingBottom: 0,
  [theme.breakpoints.up("md")]: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  "& .MuiSvgIcon-root": {
    // color: "#000",
    transition: "color 0.3s",
  },
  "&:hover .MuiSvgIcon-root": {
    // color: "#000",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  // color: "#0D0D0D",
  justifyContent: "flex-start",
  textTransform: "none",
  marginBottom: "8px",
  letterSpacing: 0,
  width: "100%",
  fontWeight: 400,
  "&:hover": {
    // color: "#000",
    // background: "rgba(255, 255, 255, 0.40)",
    border: "1px solid rgba(0, 0, 0, 0.25)",
    "& $icon": {
      // color: "#000",
    },
  },
}));

const StyledButtonLeaf = styled(Button)(({ theme }) => ({

  justifyContent: "flex-start",
  textTransform: "none",
  letterSpacing: 0,
  width: "100%",
  marginBottom: "5px",
  opacity: 1,
  border: "0.5px solid transparent !important",
  borderRadius: "10px",
  fontWeight: 500,
  fontSize: "13px",

  "& $icon": {
    color: "#0D0D0D",
  },
  "& li": {
    "& $title": {
      marginLeft: "30px",
    },
  },
  "&:hover, &.active": {
    borderRadius: "10px",
    border: "0.5px solid #EEEDED",
    background: "#EEEDED",
    color:"#404040",
    "& $icon": {
      color: "#404040",
    },
    "& span": {
      color: "#404040",
    },
  },
  "&.depth-0": {
    "& $title": {
      fontWeight: 400,
      fontSize: "12px",
      whiteSpace: "pre",
    },
  },
}));

const StyledIcon = styled("span")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(1),
  color: "#000",
}));
const SideIconBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "30px",
  height: "35px",
  borderRadius: "50%",
  "& span": {
    marginLeft: "0px",
    marginRight:"0px",
  },
}));
const StyledTitle = styled("span")({
  marginLeft: "5px",
  color: "#404040",
  fontWeight: 500,
  whiteSpace: "pre",
  fontSize: "14px",
});

const StyledCollapse = styled(Collapse)({
  marginLeft: "0px",
});

const NavItem = ({
  children,
  className,
  depth,
  href,
  icon: Icon,
  info: Info,
  open: openProp,
  title,
  tabview,
  setSelectedTab,
  ...rest
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(openProp);
  useEffect(() => {
    if (tabview === "Sniper") {
      setSelectedTab(tabview);
    }
  }, [tabview]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  let paddingLeft = 8;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  const style = { paddingLeft };
  const isActive = router.asPath === href;

  if (children) {
    
    return (
      <StyledListItem
        className={clsx(className)}
        disableGutters
        key={title}
        {...rest}
      >
        <StyledButton onClick={handleToggle}>
          {Icon && (
            <StyledIcon>{<img src={Icon} alt={`${Icon}Img`} />}</StyledIcon>
          )}

          <StyledTitle>{title}</StyledTitle>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </StyledButton>
        <StyledCollapse in={open}>{children}</StyledCollapse>
      </StyledListItem>
    );
  }

  return (
    <StyledListItem
      className={clsx(className)}
      disableGutters
      key={title}
      {...rest}
    >
      <StyledButtonLeaf
        className={clsx(`depth-${depth}`, isActive && "active")}
        onClick={() => router.push(href)}
      >
        <SideIconBox>
          {Icon && (
            <StyledIcon>
              {<img src={Icon} alt={`${Icon}Img`} width={"19px"} />}
            </StyledIcon>
          )}
        </SideIconBox>
        <StyledTitle>{title}</StyledTitle>
        {Info && <Info />}
      </StyledButtonLeaf>
    </StyledListItem>
  );
};

NavItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  depth: PropTypes.number.isRequired,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  info: PropTypes.elementType,
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

NavItem.defaultProps = {
  open: false,
};

export default NavItem;
