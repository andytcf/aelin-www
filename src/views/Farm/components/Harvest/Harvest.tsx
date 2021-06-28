import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Box, Button, Card, CardActions, CardContent, CardIcon } from "react-neu";
import { useWallet } from "use-wallet";
import Logo from "assets/logo.svg";

import Label from "components/Label";
import Value from "components/Value";

import useFarming from "hooks/useFarming";

import { bnToDec } from "utils";

const Harvest: React.FC = () => {
  const [earnedBalance, setEarnedBalance] = useState<number>(0);
  const { status } = useWallet();
  const { earnedBalanceFWBETH, isHarvesting, onHarvest } = useFarming();

  const formattedEarnedBalance = useCallback(async () => {
    if (earnedBalanceFWBETH && bnToDec(earnedBalanceFWBETH) > 0) {
      setEarnedBalance(bnToDec(earnedBalanceFWBETH));
    } else {
      setEarnedBalance(0);
    }
  }, [earnedBalanceFWBETH]);

  useEffect(() => {
    formattedEarnedBalance();
    let refreshInterval = setInterval(formattedEarnedBalance, 10000);
    return () => clearInterval(refreshInterval);
  }, [formattedEarnedBalance]);

  const HarvestAction = useMemo(() => {
    if (status !== "connected") {
      return <Button disabled full text="Harvest" variant="secondary" />;
    }
    if (!isHarvesting) {
      return <Button disabled={earnedBalance <= 0} full onClick={onHarvest} text="Harvest" variant="secondary" />;
    }
    if (isHarvesting) {
      return <Button disabled full text="Harvesting..." variant="secondary" />;
    }
  }, [isHarvesting, earnedBalance, onHarvest, status]);

  return (
    <>
      <Card>
        <CardIcon>
          <img
            src={Logo}
            style={{
              width: 65,
              height: "auto",
            }}
          />
        </CardIcon>
        <CardContent>
          <Box alignItems="center" column>
            <Value value={earnedBalance > 0 ? earnedBalance.toString() : "--"} />
            <Label text="Unharvested Aelin" />
          </Box>
        </CardContent>
        <CardActions>{HarvestAction}</CardActions>
      </Card>
    </>
  );
};

export default Harvest;
