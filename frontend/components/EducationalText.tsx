import * as React from 'react';

const EducationalText = () => {
  return (
    <div className="mx-auto mb-8 p-8 max-w-sm rounded overflow-hidden bg-gray-200 text-gray-600">
      <p>
        Look at that! A simple app that stores files! These files are stored on IPFS and a reference to them is stored
        on the NEAR blockchain. Check it out:
      </p>
      <ol className="pt-4 space-y-4">
        <li>
          Look in <code className="text-sm font-bold text-gray-900">frontend/contracts/ipfs-contract.ts</code> -
          you&apos;ll see <code className="text-sm font-bold text-gray-900">addFile</code> and{' '}
          <code className="text-sm font-bold text-gray-900">getFiles</code> being called on{' '}
          <code className="text-sm font-bold text-gray-900">contract</code>. What&apos;s this?
        </li>
        <li>
          Ultimately, this <code className="text-sm font-bold text-gray-900">contract</code> code is defined in{' '}
          <code className="text-sm font-bold text-gray-900">./contract</code> – this is the source code for your smart
          contract.
        </li>
        <li>
          When you run <code className="text-sm font-bold text-gray-900">npm run deploy</code>, the code in{' '}
          <code className="text-sm font-bold text-gray-900">./contract</code> gets deployed to the NEAR testnet. You can
          see how this happens by looking in <code className="text-sm font-bold text-gray-900">package.json</code>.
        </li>
      </ol>
      <hr />
      <p>
        To keep learning, check out{' '}
        <a className="text-sky-500 hover:text-sky-600" target="_blank" rel="noreferrer" href="https://docs.near.org">
          the NEAR docs
        </a>
        {', '}
        <a
          className="text-sky-500 hover:text-sky-600"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/ipfs/js-ipfs"
        >
          IPFS client
        </a>{' '}
        or look through some{' '}
        <a
          className="text-sky-500 hover:text-sky-600"
          target="_blank"
          rel="noreferrer"
          href="https://examples.near.org"
        >
          example apps
        </a>
        .
      </p>
    </div>
  );
};

export default EducationalText;
