import React, { useMemo } from "react";
import { createTheme, ThemeProvider } from "react-neu";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UseWalletProvider } from "use-wallet";

import TopBar from "components/TopBar";

import { BalancesProvider } from "contexts/Balances";
import { FarmingProvider } from "contexts/Farming";
import useLocalStorage from "hooks/useLocalStorage";

import Farm from "views/Farm";
import Addresses from "views/Addresses";
import Purchase from "views/Purchase";

const App: React.FC = () => {
  return (
    <Router>
      <Providers>
        <TopBar />
        <Switch>
          <Route exact path="/">
            <Farm />
          </Route>
          <Route exact path="/purchase">
            <Purchase />
          </Route>
          <Route exact path="/addresses">
            <Addresses />
          </Route>
        </Switch>
      </Providers>
    </Router>
  );
};

const Providers: React.FC = ({ children }) => {
  const [darkModeSetting] = useLocalStorage("darkMode", false);
  const { dark: darkTheme, light: lightTheme } = useMemo(() => {
    return createTheme({
      baseColor: { h: 338, s: 100, l: 41 },
      baseColorDark: { h: 339, s: 89, l: 49 },
      borderRadius: 28,
    });
  }, []);
  return (
    <ThemeProvider darkModeEnabled={darkModeSetting} darkTheme={darkTheme} lightTheme={lightTheme}>
      <UseWalletProvider
        chainId={1}
        connectors={{
          walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
        }}
      >
        <BalancesProvider>
          <FarmingProvider>{children}</FarmingProvider>
        </BalancesProvider>
      </UseWalletProvider>
    </ThemeProvider>
  );
};

export default App;
