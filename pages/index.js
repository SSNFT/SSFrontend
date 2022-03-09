import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import Vote from "./vote";

export default function Home() {
  const getLibrary = (provider, connector) => {
    return new Web3Provider(provider);
  };

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      { <Vote/> }
    </Web3ReactProvider>
  );
}
