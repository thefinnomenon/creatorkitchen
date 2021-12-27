import { MediaObject } from '../Media';
import { MdUploadFile } from 'react-icons/md';
import { useDropzone } from 'react-dropzone';

type File = {
  path: string;
  size: number;
};

type Props = {
  setMedia(media: MediaObject): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function Upload(props: Props): JSX.Element {
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      console.log(file);
    });
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    multiple: false,
    noDragEventsBubbling: true,
    maxSize: 52428800,
    onDrop,
  });

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
