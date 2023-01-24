import React from 'react';
import SignInPrompt from './SigninPrompt';
import { WalletButtons } from './WalletButtons';
import { useWalletSelector } from './WalletSelectorContext';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { accountId } = useWalletSelector();

  return (
    <main className="mx-auto max-w-7xl min-h-screen">
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <WalletButtons />
      </div>
      {!accountId && <SignInPrompt />}
      {accountId && children}
    </main>
  );
};

export default Layout;
