// TODO should import using import { create } from 'ipfs-client';
// but it isn't working with Parcel atm.
import { create } from './node_modules/ipfs-client/dist/index.min';

export function useIpfs() {
  const ipfs = create({
    grpc: '/ip4/127.0.0.1/tcp/5003/ws',
    http: '/ip4/127.0.0.1/tcp/5002/http',
  });
  return ipfs;
}
