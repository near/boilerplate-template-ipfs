import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout';
import Head from 'next/head';
import { WalletSelectorContextProvider } from '../components/WalletSelectorContext';
import { NETWORK, CONTRACT_NAME } from '../constants';

export default function App({ Component, pageProps }: AppProps) {
  if (!CONTRACT_NAME) {
    throw 'Please deploy your smart contract first';
  }

  return (
    <>
      <Head>
        <title>IPFS Boilerplate Template</title>
        <meta name="description" content="Store IPFS file references in a contract" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WalletSelectorContextProvider network={NETWORK} createAccessKeyFor={CONTRACT_NAME}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WalletSelectorContextProvider>
    </>
  );
}
