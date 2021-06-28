import React, { useMemo, useCallback, useState} from 'react';

import Logo from "assets/logo.svg";

import Label from 'components/Label';
import Value from 'components/Value';
import { Card, CardIcon, CardContent, Box, CardActions, Button } from 'react-neu';
import { useWallet } from 'use-wallet';
import PurchaseModal from './components/PurchaseModal';
import useFarming from 'hooks/useFarming';

type PurchaseCardProps = {

}

const PurchaseCard: React.FC<PurchaseCardProps> = ({}) => {
  const [purchaseModalIsOpen, setPurchaseModalIsOpen] = useState(false);

  const { status } = useWallet();
  const { isApproved, isApproving, isStaking, isUnstaking, onApprove, onStake, onUnstake, stakedBalance, isWhitelisted } = useFarming();

  const handlePurchaseClick = useCallback(() => {
    setPurchaseModalIsOpen(true);
  }, [setPurchaseModalIsOpen]);

  const handleDismissPurchaseModal = useCallback(() => {
    setPurchaseModalIsOpen(false);
  }, [setPurchaseModalIsOpen]);

  const handlePurchase = useCallback(
    (amount: string) => {
      // onStake(amount);
      handleDismissPurchaseModal();
    },
    [handleDismissPurchaseModal]
  );

  const PurchaseButton = useMemo(() => {
    if (status !== "connected") {
      return <Button disabled full text="Purchase" variant="secondary" />;
    }
    if (isStaking) {
      return <Button disabled full text="Purchasing..." variant="secondary" />;
    }
    if (!isApproved) {
      return (
        <Button
          disabled={isApproving}
          full
          onClick={onApprove}
          text={!isApproving ? "Approve aePool" : "Approving aePool..."}
          variant={isApproving || status !== "connected" ? "secondary" : "default"}
        />
      );
    }
    if (isApproved) {
      return <Button full onClick={handlePurchaseClick} text="Purchase" variant="secondary" />;
    }
  }, [handlePurchaseClick, isApproving, onApprove, status, isApproved, isStaking]);


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
            <Value value={"--"} />
            <Label text="Purchase Aelin" />
          </Box>
        </CardContent>
        <CardActions>{PurchaseButton}</CardActions>
      </Card>
      <PurchaseModal isOpen={purchaseModalIsOpen} onDismiss={handleDismissPurchaseModal} onStake={handlePurchase} />
    </>
    )
}
export default PurchaseCard
