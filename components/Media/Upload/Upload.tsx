import { MediaObject } from '../Media';
import { MdUploadFile } from 'react-icons/md';
import { useDropzone } from 'react-dropzone';
import { uploadFile, StorageProgress } from '../../../lib/amplify';
import { useEffect, useState } from 'react';

type File = {
  path: string;
  size: number;
};

type Props = {
  setMedia(media: MediaObject): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function Upload({ setMedia }: Props): JSX.Element {
  const [uploadProgress, setUploadProgress] = useState<StorageProgress>();
  const [file, setFile] = useState();
  const [error, setError] = useState('');

  const determineTypeFromSrc = (source: string) => {
    const imgRegex = new RegExp('.?(jpe?g|png|gif|bmp)', 'ig');
    const videoRegex = new RegExp('.?(mov|avi|wmv|flv|3gp|mp4|mpg)', 'ig');

    if (imgRegex.test(source)) return 'image';
    if (videoRegex.test(source)) return 'video';
    // Todo: Handle audio files
    // Todo: Create a file download block with editable display text
    return null;
  };

  useEffect(() => {
    async function upload() {
      try {
        if (file) {
          // @ts-ignore
          const type = determineTypeFromSrc(file.name);
          if (!type) {
            setError(
              'Sorry, currently only image and video files can be uploaded.'
            );
            return;
          }
          const src = await uploadFile(file, setUploadProgress);
          setMedia({
            type,
            src,
            alt: '',
            caption: '',
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    upload();
  }, [file]);

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      setFile(file);
    });
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    multiple: false,
    noDragEventsBubbling: true,
    maxSize: 52428800,
    onDrop,
  });

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }

  if (uploadProgress) {
    return (
      <div className="mt-10">
        <div className="w-full bg-gray-200 h-2">
          <div
            className="bg-blue-500 h-2 w-10"
            style={{
              width: `${(uploadProgress.loaded / uploadProgress.total) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto border-4 border-dashed border-gray-300 w-11/12 bg-blue-50 flex justify-center items-center">
      <div
        {...getRootProps({ className: 'dropzone' })}
        className="flex justify-center items-center flex-col p-2"
      >
        <input {...getInputProps()} />
        <MdUploadFile className="flex-1 text-6xl" />
        <div className="flex-1">
          Drag & Drop your file here or click to select
        </div>
      </div>
    </div>
  );
}

Upload.defaultProps = defaultProps;
