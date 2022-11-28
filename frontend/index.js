// React
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// NEAR
import { FilesNEAR } from './near-interface';
import { Wallet } from './near-wallet';

// TODO why isn't the env in start.sh working correctly?
const CONTRACT_NAME = process.env.CONTRACT_NAME || 'dev-1669650655396-78369756421589';

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_NAME });

// Abstract the logic of interacting with the contract to simplify your flow
const contract = new FilesNEAR({ contractId: CONTRACT_NAME, walletToUse: wallet });

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp();

  ReactDOM.render(<App isSignedIn={isSignedIn} contract={contract} wallet={wallet} />, document.getElementById('root'));
};
