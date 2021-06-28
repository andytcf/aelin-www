import React from "react";

import Page from "components/Page";
import PageHeader from "components/PageHeader";
import Split from "components/Split";
import { Box, Button, Card, CardContent, Container, Separator, Spacer, useTheme } from "react-neu";

import FancyValue from "components/FancyValue";
import PurchaseCard from "./components/PurchaseCard";

type PurchaseProps = {};

const Purchase: React.FC<PurchaseProps> = ({}) => {
  const { colors } = useTheme();

    return (
      <Page>
        <PageHeader icon="🤑" subtitle="Participate in the Gensis aePool and purchase Aelin" title="Purchase Tokens" />
        <Container>
          <Card>
            <CardContent>
              <FancyValue
                wrap
                value={"$X Raised"}
                valueSize="54px"
                valueColor={colors.primary.main}
                valueBold="800"
              />
            </CardContent>
          </Card>
          <Spacer />
          {/* <Split> */}
              <PurchaseCard/>
          {/* </Split> */}
          <Spacer />
          <Box row justifyContent="center">

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
  )
};
export default Purchase;
