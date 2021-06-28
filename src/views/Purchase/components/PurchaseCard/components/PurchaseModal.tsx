import React, { useCallback, useMemo, useState } from "react";

import BigNumber from "bignumber.js";
import { Button, Modal, ModalActions, ModalContent, ModalProps, ModalTitle } from "react-neu";

import TokenInput from "components/TokenInput";
import useBalances from "hooks/useBalances";
import { getFullDisplayBalance } from "utils";

interface PurchaseModalProps extends ModalProps {
  onStake: (amount: string) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onDismiss, onStake }) => {
  const [val, setVal] = useState("");
  const { fwbLPBalance } = useBalances();

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(fwbLPBalance || new BigNumber(0), 0);
  }, [fwbLPBalance]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal]
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  const handleStakeClick = useCallback(() => {
    onStake(val);
  }, [onStake, val]);

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalTitle text="Stake" />
      <ModalContent>
        <TokenInput value={val} onSelectMax={handleSelectMax} onChange={handleChange} max={fullBalance} symbol="AELIN ETH UNI V2" />
      </ModalContent>
      <ModalActions>
        <Button onClick={onDismiss} text="Cancel" variant="secondary" />
        <Button disabled={!val || !Number(val)} onClick={handleStakeClick} text="Stake" variant={!val || !Number(val) ? "secondary" : "default"} />
      </ModalActions>
    </Modal>
  );
};

export default PurchaseModal;
