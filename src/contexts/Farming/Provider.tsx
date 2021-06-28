import React, { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";

import ConfirmTransactionModal from "components/ConfirmTransactionModal";
import { DEFIBLPV2, STAKINGREWARDS } from "constants/tokenAddresses";
import useApproval from "hooks/useApproval";

import Context from "./Context";
import { getPoolContract, waitTransaction } from "utils";

const GAS_LIMIT = {
  GENERAL: 510000,
  STAKING: {
    DEFAULT: 510000,
    SNX: 850000,
  },
};

const Provider: React.FC = ({ children }) => {
  const [confirmTxModalIsOpen, setConfirmTxModalIsOpen] = useState(false);
  const [tvl, setTVL] = useState<number>();
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [earnedBalanceFWBETH, setEarnedBalanceFWBETH] = useState<BigNumber>();
  const [stakedBalance, setStakedBalance] = useState<BigNumber>();
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const { account, ethereum }: { account: string | null; ethereum: any } = useWallet();

  const { isApproved, isApproving, onApprove } = useApproval(DEFIBLPV2, STAKINGREWARDS, () => setConfirmTxModalIsOpen(false));

  const getWhitelisted = useCallback(async () => {
    const poolContract = getPoolContract(ethereum, STAKINGREWARDS);
    try {
      const isOnTheWhitelist = await poolContract.methods.whitelist(account).call();
      return isOnTheWhitelist;
    } catch (e) {
      console.log(e.message);
      return false;
    }
  }, [ethereum, account]);

  const getTVL = useCallback(async () => {
    const poolContract = getPoolContract(ethereum, STAKINGREWARDS);
    try {
      const totalSupply = new BigNumber(await poolContract.methods.totalSupply().call());
      return totalSupply;
    } catch (e) {
      return new BigNumber("0");
    }
  }, [ethereum]);

  const getEarned = useCallback(async () => {
    const poolContract = getPoolContract(ethereum, STAKINGREWARDS);
    try {
      const earned = new BigNumber(await poolContract.methods.earned(account).call());
      return earned;
    } catch (e) {
      return new BigNumber("0");
    }
  }, [ethereum, account]);

  const getStaked = useCallback(async () => {
    const poolContract = getPoolContract(ethereum, STAKINGREWARDS);
    try {
      const staked = new BigNumber(await poolContract.methods.balanceOf(account).call());
      return staked;
    } catch (e) {
      return new BigNumber("0");
    }
  }, [ethereum, account]);

  const harvest = useCallback(
    async (onTxHash: Function) => {
      const poolContract = getPoolContract(ethereum, STAKINGREWARDS);
      return poolContract.methods.getReward().send(
        {
          from: account,
          gas: GAS_LIMIT.GENERAL,
        },
        async (error: Error, txHash: string) => {
          if (error) {
            onTxHash && onTxHash("");
            console.log("Harvest error", error);
            return false;
          }
          onTxHash && onTxHash(txHash);
          const status = await waitTransaction(ethereum, txHash);
          if (!status) {
            console.log("Harvest transaction failed.");
            return false;
          }
          return true;
        }
      );
    },
    [ethereum, account]
  );

  const redeem = useCallback(
    async (onTxHash: Function) => {
      const poolContract = getPoolContract(ethereum, STAKINGREWARDS);

      return poolContract.methods.exit().send(
        {
          from: account,
          gas: GAS_LIMIT.GENERAL,
        },
        async (error: Error, txHash: string) => {
          if (error) {
            onTxHash && onTxHash("");
            console.log("Redeem error", error);
            return false;
          }
          onTxHash && onTxHash(txHash);
          const status = await waitTransaction(ethereum, txHash);
          if (!status) {
            console.log("Redeem transaction failed.");
            return false;
          }
          return true;
        }
      );
    },
    [ethereum, account]
  );

  const stake = useCallback(
    async (amount: string, onTxHash: Function) => {
      const gas = GAS_LIMIT.STAKING.DEFAULT;
      const poolContract = getPoolContract(ethereum, STAKINGREWARDS);
      return poolContract.methods.stake(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()).send(
        {
          from: account,
          gas,
        },
        async (error: Error, txHash: string) => {
          if (error) {
            onTxHash && onTxHash("");
            console.log("Staking error", error);
            return false;
          }
          onTxHash && onTxHash(txHash);
          const status = await waitTransaction(ethereum, txHash);
          if (!status) {
            console.log("Staking transaction failed.");
            return false;
          }
          return true;
        }
      );
    },
    [ethereum, account]
  );

  const unstake = useCallback(
    async (amount: string, onTxHash: Function) => {
      const poolContract = getPoolContract(ethereum, STAKINGREWARDS);
      return poolContract.methods.withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()).send(
        {
          from: account,
          gas: GAS_LIMIT.GENERAL,
        },
        async (error: Error, txHash: string) => {
          if (error) {
            onTxHash && onTxHash("");
            console.log("Unstaking error", error);
            return false;
          }
          onTxHash && onTxHash(txHash);
          const status = await waitTransaction(ethereum, txHash);
          if (!status) {
            console.log("Unstaking transaction failed.");
            return false;
          }
          return true;
        }
      );
    },
    [ethereum, account]
  );

  const fetchWhitelisted = useCallback(async () => {
    if (!account) return;
    const whitelisted = await getWhitelisted();
    setIsWhitelisted(whitelisted);
  }, [account, setIsWhitelisted, getWhitelisted]);

  const fetchEarnedBalance = useCallback(async () => {
    if (!account) return;
    const balance = await getEarned();
    setEarnedBalanceFWBETH(balance);
  }, [account, setEarnedBalanceFWBETH, getEarned]);

  const fetchStakedBalance = useCallback(async () => {
    if (!account) return;
    const balance = await getStaked();
    setStakedBalance(balance);
  }, [account, setStakedBalance, getStaked]);

  const fetchBalances = useCallback(async () => {
    fetchEarnedBalance();
    fetchStakedBalance();
  }, [fetchEarnedBalance, fetchStakedBalance]);

  const handleApprove = useCallback(() => {
    setConfirmTxModalIsOpen(true);
    onApprove();
  }, [onApprove, setConfirmTxModalIsOpen]);

  const handleHarvest = useCallback(async () => {
    if (!account || !ethereum) return;
    setConfirmTxModalIsOpen(true);
    await harvest(() => {
      setConfirmTxModalIsOpen(false);
      setIsHarvesting(true);
    });
    setIsHarvesting(false);
  }, [account, setConfirmTxModalIsOpen, setIsHarvesting, ethereum, harvest]);

  const handleRedeem = useCallback(async () => {
    if (!account || !ethereum) return;
    setConfirmTxModalIsOpen(true);
    await redeem(() => {
      setConfirmTxModalIsOpen(false);
      setIsRedeeming(true);
    });
    setIsRedeeming(false);
  }, [account, setConfirmTxModalIsOpen, setIsRedeeming, ethereum, redeem]);

  const handleStake = useCallback(
    async (amount: string) => {
      if (!account || !ethereum) return;
      setConfirmTxModalIsOpen(true);
      await stake(amount, () => {
        setConfirmTxModalIsOpen(false);
        setIsStaking(true);
      });
      setIsStaking(false);
    },
    [account, setConfirmTxModalIsOpen, setIsStaking, ethereum, stake]
  );

  const handleUnstake = useCallback(
    async (amount: string) => {
      if (!account || !ethereum) return;
      setConfirmTxModalIsOpen(true);
      await unstake(amount, () => {
        setConfirmTxModalIsOpen(false);
        setIsUnstaking(true);
      });
      setIsUnstaking(false);
    },
    [account, setConfirmTxModalIsOpen, setIsUnstaking, ethereum, unstake]
  );

  const fetchTVL = useCallback(async () => {
    if (!account || !ethereum) return;
    const tvl = Number(await getTVL());
    setTVL(tvl);
  }, [setTVL, ethereum, account, getTVL]);

  useEffect(() => {
    fetchTVL();
    let refreshInterval = setInterval(fetchTVL, 100000);
    return () => clearInterval(refreshInterval);
  }, [fetchTVL]);

  useEffect(() => {
    fetchWhitelisted();
    let refreshInterval = setInterval(fetchWhitelisted, 100000);
    return () => clearInterval(refreshInterval);
  }, [account]);

  useEffect(() => {
    fetchBalances();
    let refreshInterval = setInterval(() => fetchBalances(), 10000);
    return () => clearInterval(refreshInterval);
  }, [fetchBalances]);

  return (
    <Context.Provider
      value={{
        tvl,
        isWhitelisted,
        isApproved,
        isApproving,
        isHarvesting,
        isRedeeming,
        isStaking,
        isUnstaking,
        onApprove: handleApprove,
        onHarvest: handleHarvest,
        onRedeem: handleRedeem,
        onStake: handleStake,
        onUnstake: handleUnstake,
        earnedBalanceFWBETH,
        stakedBalance,
      }}
    >
      {children}
      <ConfirmTransactionModal isOpen={confirmTxModalIsOpen} />
    </Context.Provider>
  );
};

export default Provider;
