import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { UpdateAuthorMutation } from '../../graphql/API';
import { ClipLoader } from 'react-spinners';
import { inputStyle } from '../ContentSettingsPanel/ContentSettingsPanel';
import { API } from 'aws-amplify';
import { updateAuthor } from '../../graphql/mutations';
import { uploadFile } from '../../lib/amplify';
import { Author } from '../../pages/home/dashboard';

type Props = {
  author: Author;
  setAuthor(author: Author): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

type Inputs = {
  name: string;
  bio: string;
  email?: string;
  twitter?: string;
};

export default function AuthPanel(props: Props): JSX.Element {
  const { author, setAuthor } = props;
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(author.avatarUrl);
  const [isUploadingAvatar, setisUploadingAvatar] = useState(false);

  const getDefaults = (author: Author) => {
    return {
      name: author.name,
      bio: author.bio,
      email: author.links.email,
      twitter: author.links.twitter,
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: getDefaults(author),
  });

  const onSave = async (data: Inputs) => {
    const newAuthor = {
      id: author.id,
      name: data.name,
      bio: data.bio,
      avatarUrl,
      links: {
        email: data.email,
        twitter: data.twitter,
      },
    };

    try {
      (await API.graphql({
        query: updateAuthor,
        variables: {
          input: {
            ...newAuthor,
            links: JSON.stringify(newAuthor.links),
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      })) as { data: UpdateAuthorMutation; errors: any[] };
      setAuthor({ ...author, ...newAuthor });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    reset(getDefaults(author));
  }, [reset, author]);

  const onChangeAvatar = async (e) => {
    const avatarFile = e.target.files[0];
    if (!avatarFile) return;
    setisUploadingAvatar(true);
    setAvatarUrl(await uploadFile(avatarFile, () => {}, true));
    setisUploadingAvatar(false);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSaving(true);
    await onSave(data);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col max-w-xs bg-gray-100" autoComplete="off">
      <h1 className="text-3xl font-semibold tracking-wide p-4">Author Profile</h1>
      <div className="flex-auto overflow-y-scroll p-4">
        <div className="mb-4">
          <label htmlFor="avatar" className="flex justify-center items-center">
            <input type="file" id="avatar" className="hidden" accept="image/*" onChange={(e) => onChangeAvatar(e)} />
            <img
              src={avatarUrl || 'default-avatar.png'}
              className={`w-32 h-32 rounded-full hover:opacity-80 ${isUploadingAvatar && 'animate-pulse'}`}
              alt="avatar"
            />
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="text-gray-700">
            Name
          </label>
          <input
            id="title"
            className={inputStyle(errors.name)}
            placeholder="Michael Scott"
            aria-invalid={errors.name ? 'true' : 'false'}
            {...register('name', {
              required: true,
            })}
          />
          {errors.name && (
            <p role="alert" className="text-red-500 mt-1">
              Name is required
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            className={`${inputStyle(errors.bio)} align-top`}
            placeholder="Enter site description"
            {...register('bio')}
            rows={4}
          />
        </div>
        <div className="mb-4">
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
        <div className="mb-4">
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

      <div className="flex flex-shrink-0 flex-grow-0 flex-auto p-4">
        <button
          disabled={isSaving}
          type="submit"
          className="flex-1 flex justify-center items-center bg-blue-600 text-white font-semibold h-10 rounded-lg hover:bg-blue-500"
        >
          {isSaving ? <ClipLoader color="white" size={'1.5rem'} /> : 'SAVE'}
        </button>
      </div>
    </form>
  );
}

AuthPanel.defaultProps = defaultProps;
