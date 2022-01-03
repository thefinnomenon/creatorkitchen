import Amplify, { Auth, Storage } from 'aws-amplify';
import config from '../aws-exports';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, DeleteObjectTaggingCommand } from '@aws-sdk/client-s3';

export const configureAmplify = async () => {
  // Configure Amplify with the Amplify CLI generated config file
  await Amplify.configure({
    ...config,
    mandatorySignIn: false,
  });

  // We want our users' files to be protected by default (i.e. readable by everyone, but only writable by the creating owner)
  // https://docs.amplify.aws/lib/storage/configureaccess/q/platform/js/
  await Storage.configure({ level: 'protected' });

  // Check if there is a currently authed user
  // Auth.currentCredentials()
  //   .then((user) => console.log(user))
  //   .catch((err) => console.log(err));
};

export type StorageProgress = {
  loaded: number;
  total: number;
};

// Upload @file to S3 bucket with unique Id and update @setUploadProgress with current progress
export const uploadFile = async (file, setUploadProgress) => {
  console.log(file, setUploadProgress);
  try {
    const user = await Auth.currentAuthenticatedUser();
    const ext = file.name.match(/\.[0-9a-z]+$/i)[0];
    if (!ext) throw Error('Invalid filename');
    const fileName = `${uuidv4()}${ext}`;

    const res = await Storage.put(fileName, file, {
      tagging: 'unsaved=1',
      progressCallback(progress: StorageProgress) {
        setUploadProgress(progress);
      },
    });

    const getRes = await Storage.get(res.key);
    return getRes.split('?')[0];
  } catch (error) {
    console.log('Error uploading file: ', error);
    throw error;
  }
};

export const removeFile = async (file) => {
  const name = file.key.substring(file.key.lastIndexOf('/') + 1);
  console.log(name);
  try {
    await Storage.remove(name, { level: 'protected' });
  } catch (error) {
    console.log(error);
  }
};

export const removeTags = async (file) => {
  const credentials = await Auth.currentCredentials();
  const client = new S3Client({
    region: config.aws_user_files_s3_bucket_region,
    credentials,
  });

  try {
    const params = {
      Bucket: config.aws_user_files_s3_bucket,
      // Note: Convert it back to the colon so it doesn't get double encoded
      Key: file.key.replace('%3A', ':'),
    };

    const command = new DeleteObjectTaggingCommand(params);
    await client.send(command);
  } catch (error) {
    console.log(error);
  }
};

export const signOut = async () => {
  await Auth.signOut();
};
