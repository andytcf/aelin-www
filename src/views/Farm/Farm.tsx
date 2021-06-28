import React, { useMemo } from "react";

import { Box, Button, Card, CardContent, Container, Separator, Spacer, useTheme } from "react-neu";

import numeral from "numeral";
import Page from "components/Page";
import PageHeader from "components/PageHeader";
import Split from "components/Split";
import useFarming from "hooks/useFarming";
import HarvestCard from "./components/Harvest";
import StakeCard from "./components/Stake";
import { useWallet } from "use-wallet";
import FancyValue from "components/FancyValue";

const Farm: React.FC = () => {
  const { colors } = useTheme();
  const { status } = useWallet();

  const { tvl, isRedeeming, onRedeem, isWhitelisted } = useFarming();

  const RedeemButton = useMemo(() => {
    if (status !== "connected") {
      return <Button disabled text="Harvest &amp; Unstake Defi BLPV2" variant="secondary" />;
    }
    if (!isRedeeming) {
      return <Button onClick={onRedeem} text="Harvest &amp; Unstake Defi BLPV2" variant="secondary" />;
    }
    return <Button disabled text="Redeeming..." variant="secondary" />;
  }, [isRedeeming, onRedeem, status]);

  return (
    <Page>
      <PageHeader icon="👩🏻‍🌾" subtitle="Stake Defi Balancer V2 LP tokens and receive Aelin" title="Token Farming" />
      <Container>
        <Card>
          {/* <CardContent>
            <FancyValue
              wrap
              value={isWhitelisted ? "Whitelisted" : "Not whitelisted"}
              valueSize="54px"
              valueColor={colors.primary.main}
              valueBold="800"
            />
          </CardContent> */}
        </Card>
        <Spacer />
        <Split>
          <StakeCard />
          <HarvestCard />
        </Split>
        <Spacer />
        <Box row justifyContent="center">
          {RedeemButton}
        </Box>
        <Spacer size="lg" />
        <Separator />
        <Spacer size="lg" />
        <Split>
          <Button full text="Addresses" to="/addresses" variant="secondary" />
          <Button
            full
            text="Get Defi BLPV2 LP tokens"
            href="https://app.uniswap.org/#/add/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f/ETH"
            variant="tertiary"
          />
        </Split>
      </Container>
    </Page>
  );
};

export default Farm;
