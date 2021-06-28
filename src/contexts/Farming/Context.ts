import { createContext } from "react";
import BigNumber from "bignumber.js";

interface FarmingContext {
  tvl?: number;
  isApproved?: boolean;
  isWhitelisted?: boolean;
  isApproving?: boolean;
  isHarvesting?: boolean;
  isRedeeming?: boolean;
  isStaking?: boolean;
  isUnstaking?: boolean;
  onApprove: () => void;
  onHarvest: () => void;
  onRedeem: () => void;
  onStake: (amount: string) => void;
  onUnstake: (amount: string) => void;
  earnedBalanceFWBETH?: BigNumber;
  stakedBalance?: BigNumber;
}

const Context = createContext<FarmingContext>({
  onApprove: () => {},
  onHarvest: () => {},
  onRedeem: () => {},
  onStake: () => {},
  onUnstake: () => {},
});

export default Context;
