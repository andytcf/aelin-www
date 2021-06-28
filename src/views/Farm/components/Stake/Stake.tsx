import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Box, Button, Card, CardActions, CardContent, CardIcon } from "react-neu";
import { useWallet } from "use-wallet";
import Logo from "assets/logo.svg";

import Label from "components/Label";
import Value from "components/Value";

import useFarming from "hooks/useFarming";

import { bnToDec, getFullDisplayBalance } from "utils";

import StakeModal from "./components/StakeModal";
import UnstakeModal from "./components/UnstakeModal";

const Stake: React.FC = () => {
  const [stakeModalIsOpen, setStakeModalIsOpen] = useState(false);
  const [unstakeModalIsOpen, setUnstakeModalIsOpen] = useState(false);
  const [stakeBalance, setStakeBalance] = useState<number>(0);

  const { status } = useWallet();
  const { isApproved, isApproving, isStaking, isUnstaking, onApprove, onStake, onUnstake, stakedBalance, isWhitelisted } = useFarming();

  const handleDismissStakeModal = useCallback(() => {
    setStakeModalIsOpen(false);
  }, [setStakeModalIsOpen]);

  const handleDismissUnstakeModal = useCallback(() => {
    setUnstakeModalIsOpen(false);
  }, [setUnstakeModalIsOpen]);

  const handleOnStake = useCallback(
    (amount: string) => {
      onStake(amount);
      handleDismissStakeModal();
    },
    [handleDismissStakeModal, onStake]
  );

  const handleOnUnstake = useCallback(
    (amount: string) => {
      onUnstake(amount);
      handleDismissUnstakeModal();
    },
    [handleDismissUnstakeModal, onUnstake]
  );

  const handleStakeClick = useCallback(() => {
    setStakeModalIsOpen(true);
  }, [setStakeModalIsOpen]);

  const handleUnstakeClick = useCallback(() => {
    setUnstakeModalIsOpen(true);
  }, [setUnstakeModalIsOpen]);

  const StakeButton = useMemo(() => {
    if (status !== "connected") {
      return <Button disabled full text="Stake" variant="secondary" />;
    }
    if (isStaking) {
      return <Button disabled full text="Staking..." variant="secondary" />;
    }
    if (!isApproved) {
      return (
        <Button
          disabled={isApproving}
          full
          onClick={onApprove}
          text={!isApproving ? "Approve staking" : "Approving staking..."}
          variant={isApproving || status !== "connected" ? "secondary" : "default"}
        />
      );
    }
    if (isApproved) {
      return <Button full onClick={handleStakeClick} text="Stake" variant="secondary" />;
    }
  }, [handleStakeClick, isApproving, onApprove, status, isApproved, isStaking]);

  const UnstakeButton = useMemo(() => {
    const hasStaked = stakedBalance && stakedBalance.toNumber() > 0;
    if (status !== "connected" || !hasStaked) {
      return <Button disabled full text="Unstake" variant="secondary" />;
    }
    if (isUnstaking) {
      return <Button disabled full text="Unstaking..." variant="secondary" />;
    }
    return <Button full onClick={handleUnstakeClick} text="Unstake" variant="secondary" />;
  }, [handleUnstakeClick, status, isUnstaking, stakedBalance]);

  const formattedStakedBalance = useCallback(async () => {
    if (stakedBalance && bnToDec(stakedBalance) > 0) {
      setStakeBalance(Number(getFullDisplayBalance(stakedBalance)));
    } else {
      setStakeBalance(0);
    }
  }, [stakedBalance]);

  useEffect(() => {
    formattedStakedBalance();
    let refreshInterval = setInterval(formattedStakedBalance, 10000);
    return () => clearInterval(refreshInterval);
  }, [formattedStakedBalance]);

  return (
    <>
      <Card>
        <CardIcon>
          <img
            src={Logo}
            style={{
              opacity: 0.5,
              width: 65,
              height: "auto",
            }}
          />
        </CardIcon>

        <CardContent>
          <Box alignItems="center" column>
            <Value value={stakeBalance > 0 ? stakeBalance.toString() : "--"} />
            <Label text="Staked Defi BLPV2 Tokens" />
          </Box>
        </CardContent>
        <CardActions>
          {UnstakeButton}
          {StakeButton}
        </CardActions>
      </Card>
      <StakeModal isOpen={stakeModalIsOpen} onDismiss={handleDismissStakeModal} onStake={handleOnStake} />
      <UnstakeModal isOpen={unstakeModalIsOpen} onDismiss={handleDismissUnstakeModal} onUnstake={handleOnUnstake} />
    </>
  );
};

export default Stake;
