import React, { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import { AELIN, DEFIBLPV2 } from "constants/tokenAddresses";
import { getBalance } from "utils";

import Context from "./Context";

const Provider: React.FC = ({ children }) => {
  const [fwbBalance, setFWBBalance] = useState<BigNumber>();
  const [fwbLPBalance, setFWBLPBalance] = useState<BigNumber>();

  const { account, ethereum }: { account: string | null; ethereum: provider } = useWallet();

  const fetchBalances = useCallback(
    async (userAddress: string, provider: provider) => {
      const balances = await Promise.all([await getBalance(provider, AELIN, userAddress), await getBalance(provider, DEFIBLPV2, userAddress)]);
      setFWBBalance(new BigNumber(balances[0]).dividedBy(new BigNumber(10).pow(18)));
      setFWBLPBalance(new BigNumber(balances[1]).dividedBy(new BigNumber(10).pow(18)));
    },
    [setFWBBalance, setFWBLPBalance]
  );

  useEffect(() => {
    if (account && ethereum) {
      fetchBalances(account, ethereum);
    }
  }, [account, ethereum, fetchBalances]);

  useEffect(() => {
    if (account && ethereum) {
      fetchBalances(account, ethereum);
      let refreshInterval = setInterval(() => fetchBalances(account, ethereum), 10000);
      return () => clearInterval(refreshInterval);
    }
  }, [account, ethereum, fetchBalances]);

  return (
    <Context.Provider
      value={{
        fwbBalance,
        fwbLPBalance,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
