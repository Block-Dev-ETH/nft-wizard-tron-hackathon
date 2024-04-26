import React from "react";
import {
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

function Properties({
  type,
  setName,
  setSymbol,
  setBaseTokenURI,
  setUnrevealedURI,
  setPublicCost,
  setWhitelistCost,
  setAmountPerWhitelist,
  setMaxSupply,
  setMaxMintPerTrx,
  setPaused,
  setUnrevealed,
  setBotPrevention,
  name,
  symbol,
  baseTokenURI,
  unrevealedURI,
  publicCost,
  whitelistCost,
  amountPerWhitelist,
  maxSupply,
  maxMintPerTrx,
  paused,
  unrevealed,
  botPrevention,
}) {
  return (
    <>
      <TextField
        label="name"
        variant="standard"
        fullWidth
        value={name}
        sx={{ mt: 1 }}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="symbol"
        variant="standard"
        fullWidth
        value={symbol}
        sx={{ mt: 1 }}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <TextField
        label="baseTokenURI"
        variant="standard"
        fullWidth
        value={baseTokenURI}
        sx={{ mt: 1 }}
        onChange={(e) => setBaseTokenURI(e.target.value)}
      />
      <TextField
        label={type == "NFT with whitelist" ? "public cost" : "cost"}
        variant="standard"
        fullWidth
        value={publicCost}
        sx={{ mt: 1 }}
        onChange={(e) => setPublicCost(e.target.value)}
      />
      {type == "NFT with whitelist" ? (
        <>
          <TextField
            label="whitelist cost"
            variant="standard"
            fullWidth
            value={whitelistCost}
            sx={{ mt: 1 }}
            onChange={(e) => setWhitelistCost(e.target.value)}
          />
          <TextField
            label="amount per whitelist"
            variant="standard"
            fullWidth
            value={amountPerWhitelist}
            sx={{ mt: 1 }}
            onChange={(e) => setAmountPerWhitelist(e.target.value)}
          />
        </>
      ) : null}
      <TextField
        label="max supply"
        variant="standard"
        fullWidth
        value={maxSupply}
        sx={{ mt: 1 }}
        onChange={(e) => setMaxSupply(e.target.value)}
      />
      <TextField
        label="max mints per transaction"
        variant="standard"
        fullWidth
        value={maxMintPerTrx}
        sx={{ mt: 1 }}
        onChange={(e) => setMaxMintPerTrx(e.target.value)}
      />
      {type == "NFT extended" ? (
        <FormGroup sx={{ mt: 1 }}>
          <FormControlLabel
            control={<Checkbox />}
            label="Pausable"
            checked={paused}
            onChange={(e) => setPaused(e.target.checked)}
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Bot prevention"
            checked={botPrevention}
            onChange={(e) => setBotPrevention(e.target.checked)}
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Revelable"
            checked={unrevealed}
            onChange={(e) => setUnrevealed(e.target.checked)}
          />
        </FormGroup>
      ) : null}

      {unrevealed ? (
        <TextField
          label="unrevealedTokenURI"
          variant="standard"
          fullWidth
          value={unrevealedURI}
          sx={{ mt: 1 }}
          onChange={(e) => setUnrevealedURI(e.target.value)}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Properties;
