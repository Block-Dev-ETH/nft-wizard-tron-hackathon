"use client";

import React, { useState } from "react";
import {
  Container,
  TextField,
  Grid,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import Appbar from "../components/Appbar";
import ERC721WizardData from "../components/ERC721WizardData.js";
import ERC721WizardDataWhitelist from "../components/ERC721WizardDataWhitelist.js";
import Properties from "../components/Properties.js";

const utf8 = require("utf8");
var base64 = require("base-64");
const hljs = require("highlight.js");
var hljsDefineSolidity = require("highlightjs-solidity");

hljsDefineSolidity(hljs);
hljs.initHighlightingOnLoad();

const contractTypes = [
  {
    value: "NFT extended",
    label: "NFT extended",
  },
  {
    value: "NFT with whitelist",
    label: "NFT with whitelist",
  },
];

export default function CreateContract() {
  // ERC721 extended
  const [typeSelected, setTypeSelected] = useState("NFT extended");
  const [name, setName] = useState("TokenName");
  const [symbol, setSymbol] = useState("TokenSymbol");
  const [baseTokenURI, setBaseTokenURI] = useState(
    "https://baseTokenURI.com/myTokens/"
  );
  const [unrevealedURI, setUnrevealedURI] = useState(
    "https://baseTokenURI.com/unrevealedURI.json"
  );
  const [maxSupply, setMaxSupply] = useState(10000);
  const [maxMintPerTrx, setMaxMintPerTrx] = useState(3);
  const [paused, setPaused] = useState(true);
  const [unrevealed, setUnrevealed] = useState(true);
  const [botPrevention, setBotPrevention] = useState(true);
  const [wizardCode, setWizardCode] = useState("");

  // ERC721 with whitelist
  const [publicCost, setPublicCost] = useState(20);
  const [whitelistCost, setWhitelistCost] = useState(10);
  const [amountPerWhitelist, setAmountPerWhitelist] = useState(2);

  const handleWizardCode = (text) => {
    setWizardCode(text);
  };

  const handleDeploy = (chain) => {
    let bytes = utf8.encode(wizardCode);
    let encoded = base64.encode(bytes);

    if (chain == "tronide")
      window.open("https://tronide.io/?#code=" + encoded, "_blank");
    else if (chain == "remix")
      window.open("https://remix.ethereum.org/?#code=" + encoded, "_blank");
  };

  return (
    <>
      <Appbar></Appbar>
      <Container>
        <Grid container fixed>
          <Grid item xs={4} p={2}>
            <Box
              backgroundColor={grey[300]}
              p={2}
              sx={{
                boxShadow: 5,
                borderRadius: 2,
                position: "-webkit-sticky",
                position: "sticky",
                top: "10px",
              }}
            >
              {/* <Box marginBottom={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => alert("implement")}
                >
                  How does it work?
                </Button>
              </Box> */}

              <TextField
                id="outlined-select-currency"
                select
                label="Select contract type"
                defaultValue={typeSelected}
                fullWidth
                onChange={(e) => setTypeSelected(e.target.value)}
              >
                {contractTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <Properties
                type={typeSelected}
                setName={setName}
                setSymbol={setSymbol}
                setBaseTokenURI={setBaseTokenURI}
                setUnrevealedURI={setUnrevealedURI}
                setPublicCost={setPublicCost}
                setWhitelistCost={setWhitelistCost}
                setAmountPerWhitelist={setAmountPerWhitelist}
                setMaxSupply={setMaxSupply}
                setMaxMintPerTrx={setMaxMintPerTrx}
                setPaused={setPaused}
                setUnrevealed={setUnrevealed}
                setBotPrevention={setBotPrevention}
                name={name}
                symbol={symbol}
                baseTokenURI={baseTokenURI}
                unrevealedURI={unrevealedURI}
                publicCost={publicCost}
                whitelistCost={whitelistCost}
                amountPerWhitelist={amountPerWhitelist}
                maxSupply={maxSupply}
                maxMintPerTrx={maxMintPerTrx}
                paused={paused}
                unrevealed={unrevealed}
                botPrevention={botPrevention}
              />

              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="success"
                fullWidth
                onClick={() => handleDeploy("tronide")}
              >
                Deploy to Tronide
              </Button>

              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="success"
                fullWidth
                onClick={() => handleDeploy("remix")}
              >
                Deploy to Remix
              </Button>
            </Box>
          </Grid>
          <Grid item xs={8}>
            {typeSelected === "NFT extended" ? (
              <ERC721WizardData
                paused={paused}
                maxMintPerTrx={maxMintPerTrx}
                name={name}
                baseTokenURI={baseTokenURI}
                unrevealed={unrevealed}
                botPrevention={botPrevention}
                unrevealedURI={unrevealedURI}
                cost={publicCost}
                maxSupply={maxSupply}
                symbol={symbol}
                handleWizardCode={handleWizardCode}
              />
            ) : (
              <ERC721WizardDataWhitelist
                name={name}
                symbol={symbol}
                baseTokenURI={baseTokenURI}
                unrevealedURI={unrevealedURI}
                publicCost={publicCost}
                whitelistCost={whitelistCost}
                amountPerWhitelist={amountPerWhitelist}
                maxSupply={maxSupply}
                maxMintPerTrx={maxMintPerTrx}
                handleWizardCode={handleWizardCode}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
