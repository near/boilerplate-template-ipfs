import { create } from 'ipfs-client';

export function useIpfs(): any {
  if (!process.env.NEXT_PUBLIC_IPFS_GRPC_ADDRESS || !process.env.NEXT_PUBLIC_IPFS_HTTP_ADDRESS) {
    return null;
  }

  const ipfs = create({
    grpc: process.env.NEXT_PUBLIC_IPFS_GRPC_ADDRESS,
    http: process.env.NEXT_PUBLIC_IPFS_HTTP_ADDRESS,
  });
  return ipfs;
}
