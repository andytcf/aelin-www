import React, { useCallback, useState, useEffect, useMemo } from "react";

import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";

import logo from "assets/logo.svg";
import numeral from "numeral";

import { Box, Button, Modal, ModalContent, ModalProps, ModalTitle, Separator, Spacer } from "react-neu";

import FancyValue from "components/FancyValue";
import Split from "components/Split";

import useBalances from "hooks/useBalances";

const WalletModal: React.FC<ModalProps> = ({ isOpen, onDismiss }) => {
  const [walletModalIsOpen, setWalletModalIsOpen] = useState(false);
  const { reset } = useWallet();
  const { fwbBalance, fwbLPBalance } = useBalances();

  const getDisplayBalance = useCallback((value?: BigNumber) => {
    if (value) {
      return numeral(value).format("0.00a");
    } else {
      return "--";
    }
  }, []);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem("account");
    localStorage.removeItem("walletProvider");
    setWalletModalIsOpen(false);
    reset();
    if (onDismiss) {
      onDismiss();
    }
  }, [reset]);

  useEffect(() => {
    isOpen = !isOpen;
  }, [setWalletModalIsOpen]);

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalTitle text="My Wallet" />
      <ModalContent>
        <Split>
          <Box row>
            <FancyValue
              icon={<img role="img" src={logo} style={{ width: 50, height: "auto", marginRight: 8 }} />}
              label="Aelin balance"
              value={getDisplayBalance(fwbBalance)}
            />
          </Box>
          <Box row>
            <FancyValue
              icon={
                <img
                  role="img"
                  src={logo}
                  style={{
                    opacity: 0.5,
                    width: 50,
                    height: "auto",
                    marginRight: 8,
                  }}
                />
              }
              label="Defi BLPV2 balance"
              value={getDisplayBalance(fwbLPBalance)}
            />
          </Box>
        </Split>
        <Spacer />
        <Separator />
        <Spacer />
        <Spacer />
      </ModalContent>
      <Separator />
      <Box justifyContent="space-between" alignItems="center" height={96} row paddingHorizontal={4}>
        <Box row justifyContent="flex-end" alignItems="center">
          <Button onClick={onDismiss} text="Cancel" variant="secondary" />
          <Spacer />
          <Button onClick={handleSignOut} text="Sign Out" />
        </Box>
      </Box>
    </Modal>
  );
};

export default WalletModal;
