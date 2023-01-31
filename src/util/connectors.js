

import { createClient, defaultChains, configureChains } from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { SequenceConnector } from '@0xsequence/wagmi-connector'

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: "yourAlchemyApiKey" }),
  publicProvider(),
]);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new SequenceConnector({
      chains,
      options: {
        connect: {
          app: 'Fraty',
          networkId: 137
        }
      }
    }),
  ],
  provider,
  webSocketProvider,
});

export default client;