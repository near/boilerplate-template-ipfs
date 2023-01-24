import { create } from 'ipfs-client';

export function useIpfs() {
  const ipfs = create({
    grpc: '/ip4/127.0.0.1/tcp/5003/ws',
    http: '/ip4/127.0.0.1/tcp/5002/http',
  });
  return ipfs;
}
