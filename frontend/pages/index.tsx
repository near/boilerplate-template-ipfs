import { useEffect, useState } from 'react';
import EducationalText from '../components/EducationalText';
import ExplainText from '../components/ExplainText';
import { useWalletSelector } from '../components/WalletSelectorContext';
import * as ipfsContract from '../contracts/ipfs-contract';
import { File } from '../contracts/types';
import { useIpfs } from '../ipfs';

export default function Home() {
  const { selector, accountId } = useWalletSelector();
  const [files, setFiles] = useState<File[]>([]);
  const ipfs = useIpfs();

  useEffect(() => {
    if (!accountId) {
      return;
    }
    (async () => {
      const files = await ipfsContract.getFiles(selector, accountId);
      setFiles(files || []);
    })();
  }, [selector, accountId]);

  async function onFileSave(file: File) {
    if (!accountId) {
      return;
    }
    // optimistic update
    setFiles([...files, file]);
    // async update
    (async () => {
      const files = await ipfsContract.getFiles(selector, accountId);
      setFiles(files || []);
    })();
  }

  return (
    <div>
      <h1 className="mx-4 mt-8 mb-16 text-center font-extrabold text-8xl bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
        {files.length > 0 ? 'Your Files' : 'Upload a File'}
      </h1>
      <div className="mb-8 mx-2 columns-1 md:columns-2 lg:columns-3">
        {files.length > 0 && <ViewFiles files={files} />}
        {!ipfs && <SetupGateway />}
        {ipfs && <UploadFile onUpload={onFileSave} ipfs={ipfs} />}
        <EducationalText />
        <ExplainText />
      </div>
    </div>
  );
}

function ViewFiles({ files }: { files: File[] }) {
  return (
    <div className="mx-auto mb-8 p-4 max-w-sm rounded overflow-hidden bg-slate-700">
      <ul role="list" className="divide-y divide-gray-400">
        {files.map((file, i) => {
          return (
            <li key={file.cid + i} className="py-2">
              <a
                className="text-lg text-gray-200 hover:text-gray-400"
                id="gateway-link"
                target="_blank"
                href={`https://ipfs.io/ipfs/${file.cid}`}
                rel="noreferrer"
              >
                {`${file.name} (${file.cid.substring(file.cid.length - 5)})`}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SetupGateway() {
  return (
    <div className="mx-auto mb-8 p-4 max-w-sm rounded overflow-hidden bg-slate-700">
      <p className="block text-lg font-bold text-gray-200">Upload File</p>
      <div>
        <p className="text-gray-200">
          Please setup an IPFS gateway to upload files. Instructions on setting up locally are in the readme.
        </p>
      </div>
    </div>
  );
}

function UploadFile({ onUpload, ipfs }: { onUpload: (file: File) => {}; ipfs: any }) {
  const { selector, accountId } = useWalletSelector();
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState<any>(null);

  async function uploadFile(event: any) {
    if (!accountId) {
      return;
    }
    setUploadingFile(true);

    const file = event.target.files[0];
    try {
      const added = await ipfs.add(file);
      const uploadedFile = { name: file.name, cid: added.cid.toString() };
      await ipfsContract.addFile(selector, accountId, uploadedFile);
      onUpload(uploadedFile);
    } catch (err: any) {
      setError(err);
    }

    setUploadingFile(false);
  }

  async function fileDrop(e: any) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    await uploadFile({ target: { files } });
  }

  return (
    <div className="mx-auto mb-8 p-4 max-w-sm rounded overflow-hidden bg-slate-700">
      <p className="block text-lg font-bold text-gray-200">Upload file</p>
      <div
        className={uploadingFile ? 'animate-pulse' : ''}
        onDrop={fileDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
      >
        <label className="flex justify-center w-full h-32 p-2 border-4 border-gray-200 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
          <span className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {!uploadingFile && (
              <span className="font-bold text-gray-200">
                Drop or <span className="text-gray-200 underline hover:text-gray-400">browse</span> for a file to upload
                to IPFS
              </span>
            )}
            {uploadingFile && <span className="font-bold text-gray-200">Uploading...</span>}
          </span>
          <input type="file" name="media-upload" className="hidden" onChange={uploadFile}></input>
        </label>
      </div>

      {error && <div className="bg-red pa3 center mv3 white">Error: {error.message || error}</div>}
    </div>
  );
}
