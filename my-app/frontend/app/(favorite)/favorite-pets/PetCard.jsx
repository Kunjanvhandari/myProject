import { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { TiHeartFullOutline } from "react-icons/ti";
import { styled } from "@mui/system";
import { CiLocationOn } from "react-icons/ci";
import { useRouter } from "next/navigation";

import { FaRegUser } from "react-icons/fa";
const PetCardBox = styled(Box)(({ theme }) => ({
  "& .petCardMainBox": {
    border: "1px solid #DEDEDE",
    borderRadius: "10px",
  },

  "& .framecardBox": {
    // position:"relative",
    width: "100%",
    height: "200px",
    zIndex: "0",
    overflow: "hidden",
    borderRadius: "10px 10px 0px 0px",
    backgroundSize: "cover !important",
    backgroundRepeat: "no-repeat !important",
    backgroundPosition: "center !important",
  },
}));

const PetCard = ({ petData }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <PetCardBox>
      <Box className="petCardMainBox">
        <Box
          className="framecardBox"
          style={{ backgroundImage: `url(${petData.backgroundImage})` }}
        >
          <IconButton
            align="right"
            onClick={handleFavoriteClick}
            className="favouriteBox"
            style={{
              color: isFavorite ? "#ed0000 !important" : "inherit",
              position: "absolute",
             float:"right",
            }}
          >
            <TiHeartFullOutline style={{ color: "#fff", fontSize: "50px" }} />
          </IconButton>
        </Box>
        <Box p={1}>
          <Box className="displaySpacebetween">
            <Typography variant="body2" sx={{ marginLeft: "8px" }}>
              {petData.name}
            </Typography>
            <Typography variant="body2" sx={{ marginLeft: "8px" }}>
              ${petData.price}
            </Typography>
          </Box>
          <Box className="displayStart">
            <IconButton>
              <FaRegUser style={{ color: "#DEDEDE", fontSize: "16px" }} />
            </IconButton>
            <Typography variant="body2" sx={{ marginLeft: "8px" }}>
              {petData.petOwnerName}
            </Typography>
          </Box>
          <Box className="displaySpacebetween">
            <Box className="displayStart">
              <IconButton>
                <CiLocationOn style={{ color: "#DEDEDE", fontSize: "16px" }} />
              </IconButton>
              <Typography variant="body2">{petData.address}</Typography>
            </Box>
            <Button variant="contained" color="primary">
              Sell
            </Button>
          </Box>
        </Box>
      </Box>
    </PetCardBox>
  );
};

export default PetCard;
