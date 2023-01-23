import { WalletSelector } from '@near-wallet-selector/core';
import { CONTRACT_NAME } from '../constants';
import { callMethod, viewMethod } from './contract';
import { File } from './types';

export const addFile = async (walletSelector: WalletSelector, accountId: string, { cid, name }: File) => {
  return await callMethod(walletSelector, accountId, {
    contractId: CONTRACT_NAME!,
    method: 'add_file',
    args: {
      cid,
      name,
    },
  });
};

export const getFiles = async (walletSelector: WalletSelector, accountId: string) => {
  const response = await viewMethod(walletSelector, {
    contractId: CONTRACT_NAME!,
    method: 'get_files',
    args: {
      account_id: accountId,
    },
  });
  console.log('GET_FILES', response);
  return response;
};
