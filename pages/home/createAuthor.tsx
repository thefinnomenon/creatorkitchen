import { useState } from 'react';
import { API, Auth } from 'aws-amplify';
import { Author, CreateAuthorMutation } from '../../graphql/API';
import { uploadFile, StorageProgress } from '../../lib/amplify';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { createAuthor } from '../../graphql/mutations';

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

type Inputs = {
  name: string;
  bio: string;
  email?: string;
  twitter?: string;
};

export default function CreateAuthor(props: Props): JSX.Element {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploadingAvatar, setisUploadingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({});

  const onSave = async (author: Inputs) => {
    try {
      const { username } = await Auth.currentAuthenticatedUser();
      const { data } = (await API.graphql({
        query: createAuthor,
        variables: {
          input: {
            id: username,
            ...author,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      })) as { data: CreateAuthorMutation; errors: any[] };
      router.push('/dashboard');
    } catch (e) {
      console.log(e);
    }
  };

  const inputStyle = (error) =>
    `w-full px-5 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-transparent focus:ring-blue-500 focus:ring-2 placeholder-gray-400 ${
      error && 'border border-red-500 focus:ring-red-500'
    }`;

  const onChangeAvatar = async (e) => {
    const avatarFile = e.target.files[0];
    if (!avatarFile) return;
    setisUploadingAvatar(true);
    setAvatarUrl(await uploadFile(avatarFile, () => {}, true));
    setisUploadingAvatar(false);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSaving(true);
    const author = {
      name: data.name,
      bio: data.bio,
      avatarUrl,
      links: JSON.stringify({
        email: data.email,
        twitter: data.twitter,
      }),
    };
    await onSave(author);
    setIsSaving(false);
  };

  return (
    <div className="h-full flex flex-col justify-between items-center bg-gradient-to-r from-rose-100 to-teal-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="m-40 mt-40 inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
      >
        <h2 className="font-cal text-2xl mb-6">Setup Your Profile</h2>
        <div className="grid gap-y-5 w-5/6 mx-auto">
          <label htmlFor="avatar" className="flex justify-center items-center mb-2">
            <input type="file" id="avatar" className="hidden" accept="image/*" onChange={(e) => onChangeAvatar(e)} />
            <img
              src={avatarUrl || 'default-avatar.png'}
              className={`w-32 h-32 rounded-full hover:opacity-80 ${isUploadingAvatar && 'animate-pulse'}`}
              alt="avatar"
            />
          </label>
          <div className="text-left mb-2">
            <label htmlFor="name" className="text-gray-700">
              Name
            </label>
            <input
              id="name"
              className={inputStyle(errors.name)}
              placeholder="Michael Scott"
              aria-invalid={errors.name ? 'true' : 'false'}
              {...register('name', { required: true })}
            />
            {errors.name && (
              <p role="alert" className="text-red-500 mt-1">
                Name is required
              </p>
            )}
          </div>
          <div className="text-left mb-2">
            <label htmlFor="bio" className="text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              className={inputStyle(errors.bio)}
              placeholder="World's Best Boss. Author of How I Manage. Director and producer of Threat Level Midnight. Manager of a paper company by day and Lipophedrine salesman by night."
              aria-invalid={errors.name ? 'true' : 'false'}
              {...register('bio')}
              rows={4}
            />
          </div>
          <div className="text-left mb-2">
            <label htmlFor="email" className="text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={inputStyle(errors.email)}
              placeholder="mscott@dundermifflin.com"
              aria-invalid={errors.email ? 'true' : 'false'}
              {...register('email', {
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p role="alert" className="text-red-500 mt-1">
                Invalid email address
              </p>
            )}
          </div>
          <div className="text-left mb-2">
            <label htmlFor="twitter" className="text-gray-700">
              Twitter
            </label>
            <input
              id="twitter"
              type="twitter"
              className={inputStyle(errors.twitter)}
              placeholder="worldsbestboss"
              aria-invalid={errors.twitter ? 'true' : 'false'}
              {...register('twitter')}
            />
          </div>
        </div>

        <div className="flex items-center mt-10 w-full">
          <button
            type="submit"
            disabled={isSaving || isUploadingAvatar}
            className={`${
              isSaving || isUploadingAvatar
                ? 'cursor-not-allowed text-gray-400 bg-gray-50'
                : 'bg-white text-gray-700 hover:text-blue-500 cursor-pointer'
            } w-full px-5 py-5 text-sm font-semibold border-t border-gray-300 rounded-br focus:outline-none transition-all ease-in-out duration-300 focus:border-transparent focus:text-blue-500`}
          >
            {isSaving ? <ClipLoader /> : 'CREATE PROFILE'}
          </button>
        </div>
      </form>
    </div>
  );
}

CreateAuthor.defaultProps = defaultProps;
