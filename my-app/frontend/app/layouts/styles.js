import React from "react";
import { Box, Card, Grid, Hidden, Typography } from "@mui/material";
import { styled } from "@mui/system";

const MainComponent = styled("Box")(({ theme }) => ({
  "& .cardBox": {
    position: "relative",
    top: "0px",
    padding: "200px 0px 650px",
    background: `url('images/wineImage.jpg')`,
    width: "100%",
    backgroundSize: "cover !important",
    backgroundRepeat: "no-repeat !important",
    backgroundPosition: "center !important",
    objectFit: "cover !important",
    [theme.breakpoints.down("md")]: {
      padding: "100px 0px 600px",
    },

    "& .gradiantBox": {
      "&:after": {
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        content: "''",
        zIndex: "1",
        position: "absolute",
        background:
          "radial-gradient(72.62% 72.62% at 49.58% 28.37%, rgba(22, 16, 50, 0.01) 0%, #161032 100%), radial-gradient(116.19% 42.00% at 59.35% 49.06%, rgba(22, 16, 50, 0.00) 0%, #161032 100%)",
      },
    },
  },
  "& h1": {
    fontSize: "150px",
  },
  "& h4": {
    margin: "8px 0px 150px",
    [theme.breakpoints.down("md")]: {
      margin: "8px 0px 50px",
    },
  },
  "& .grapesBox": {
    marginBottom: "150px",
    maxWidth: "270px",
  },
  "& .leafBox": {
    maxWidth: "270px",
  },
  "& .sprintText": {
    marginTop: "8px",
  },
  "& .responsiveBox": {
    marginTop: "16px",
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
    "& .textBox": {
      marginLeft: "8px",
      [theme.breakpoints.down("md")]: {
        marginTop: "8px",
        marginLeft: "0px",
      },
    },
  },
}));

const TheWine = () => {
  return (
    <MainComponent>
      <Card className="cardBox">
        <Box className="gradiantBox">
          <Box style={{ position: "absolute", zIndex: "10" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <Box p={2} className="displayColumn">
                  <Box className="displayColumn" style={{ maxWidth: "120px" }}>
                    <img
                      src="images/wineBarGrapes.png"
                      alt="Background"
                      width="100%"
                    />
                    <Typography variant="h4">Wine Bar</Typography>
                  </Box>
                  <Box className="displaySpacebetween">
                    <Box>
                      <Typography variant="h3">98k+</Typography>
                      <Typography variant="h6">Artwork</Typography>
                    </Box>
                    <Box ml={4}>
                      <Typography variant="h3">12k+</Typography>
                      <Typography variant="h6">Auction</Typography>
                    </Box>
                    <Box ml={4}>
                      <Typography variant="h3">15k+</Typography>
                      <Typography variant="h6">Artist</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <Box>
                  <Typography variant="h1">THE WINE</Typography>
                  <Typography variant="h3" className="sprintText">
                    & Spirits Web3 
                  </Typography>
                  <Box className="displaySpacebetween responsiveBox">
                    <Typography variant="body2">
                      Lorem ipsum dolor sit amet consetur. Turpis interdum vitae
                      cursus diam orci suspendisse ipsum phasellus. Scesque
                      pharetra.
                    </Typography>
                    <Typography variant="body2" className="textBox">
                      Lorem ipsum dolor sit amet consetur. Turpis interdum vitae
                      cursus diam orci suspendisse ipsum phasellus. Scesque
                      pharetra.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <Hidden mdDown>
                  <Box className="displayColumn">
                    <Box className="grapesBox">
                      <img
                        src="images/grapes.png"
                        alt="Background"
                        width="100%"
                      />
                    </Box>

                    <Box className="leafBox">
                      <img
                        src="images/leaf.png"
                        alt="Background"
                        width="100%"
                      />
                    </Box>
                  </Box>
                </Hidden>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Card>
    </MainComponent>
  );
};

export default TheWine;