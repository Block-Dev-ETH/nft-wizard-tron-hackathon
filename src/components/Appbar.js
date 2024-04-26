"use client";

import { React } from "react";
import { AppBar, Typography, Box, Toolbar } from "@mui/material";

export default function Appbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Nft creation wizard
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
