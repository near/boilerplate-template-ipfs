import 'regenerator-runtime/runtime';
import { useState, useEffect } from 'react';
import { useIpfs } from './ipfs';

import './assets/global.css';

import { EducationalText, SignInPrompt, SignOutButton } from './ui-components';

export default function App({ isSignedIn, contract, wallet }) {
  const ipfs = useIpfs();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    (async () => {
      if (!wallet || !wallet.accountId) return;
      const files = await contract.getFiles({ accountId: wallet.accountId });
      setFiles(files || []);
    })();
  }, [contract, isSignedIn, wallet]);

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return <SignInPrompt onClick={() => wallet.signIn()} />;
  }

  async function onFileSave(payload) {
    await contract.addFile(payload);
    // optimistic update
    setFiles([...files, payload]);
    // async update
    (async () => {
      const files = await contract.getFiles({ accountId: wallet.accountId });
      setFiles(files || []);
    })();
  }

  return (
    <>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()} />
      <main>
        <SaveFile ipfs={ipfs} onSave={onFileSave} />
        <ViewFiles files={files} />
        <EducationalText />
      </main>
    </>
  );
}

const ViewFiles = ({ files }) => {
  return (
    <div>
      <h2>Your files</h2>
      <ul>
        {files.map((file) => {
          return (
            <li>
              <a id="gateway-link" target="_blank" href={`https://ipfs.io/ipfs/${file.cid}`} rel="noreferrer">
                {`${file.name} (${file.cid.substring(file.cid.length - 5)})`}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const SaveFile = ({ ipfs, onSave }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setFile(event.target.files[0]);
  };

  const saveToIpfs = async () => {
    try {
      const added = await ipfs.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      onSave({ name: file.name, cid: added.cid.toString() });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }
    setError(null);

    saveToIpfs();
  };

  return (
    <div>
      <h2>Upload file</h2>
      <form id="capture-media" onSubmit={handleSubmit}>
        <input
          className="input-reset bn black-80 bg-white pa3 w-100 mb3 ft"
          id="input-file"
          name="input-file"
          type="file"
          onChange={captureFile}
        />
        <label htmlFor="input-file" className="f5 ma0 pb2 aqua fw4 db">
          Input File
        </label>
        <button style={{ marginTop: '1rem' }} type="submit">
          Save
        </button>
      </form>

      {error && <div className="bg-red pa3 center mv3 white">Error: {error.message || error}</div>}
    </div>
  );
};
