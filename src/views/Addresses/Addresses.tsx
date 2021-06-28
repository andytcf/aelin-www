import React from "react";
import { Container } from "react-neu";

import Page from "components/Page";
import PageHeader from "components/PageHeader";
import { AELIN, DEFIBLPV2, DAO, STAKINGREWARDS } from "constants/tokenAddresses";
import AddressButton from "components/AddressButton";

const Addresses: React.FC = () => {
  return (
    <Page>
      <PageHeader icon={"🎖️"} title={"Addresses"} subtitle={"Official Addresses"} />
      <Container size="sm">
        <h2>AELIN Addresses &amp; Assets</h2>
        {/* @TODO change this address */}
        <AddressButton
          name="Aelin"
          address={AELIN.toLowerCase()}
          uniswap={true}
          unitext="Buy on Uniswap"
          unilink="https://app.uniswap.org/#/swap?inputCurrency=0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f"
        />
        {/* @TODO change this address */}
        <AddressButton
          name="Defi BLPV2"
          address={DEFIBLPV2.toLowerCase()}
          uniswap={true}
          unitext="Add Defi BLPV2 at Balancer"
          unilink={"https://app.uniswap.org/#/add/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f/ETH"}
        />

        <h3>AELIN Contracts Addresses</h3>
        <AddressButton name="AELIN DAO" address={DAO.toLowerCase()} uniswap={false} />
        <AddressButton name="Staking Rewards" address={STAKINGREWARDS.toLowerCase()} uniswap={false} />
        <AddressButton name="Genesis aePool" address={STAKINGREWARDS.toLowerCase()} uniswap={false} />
      </Container>
    </Page>
  );
};

export default Addresses;
