import { IconType } from 'react-icons';
import VisuallyHidden from '@reach/visually-hidden';
import { ReactElement } from 'react';

type Props = {
  icon: ReactElement<IconType>;
  onClick(): void;
  altText: string;
  disabled?: boolean;
  isActive: boolean;
  isGroupStart?: boolean;
} & typeof defaultProps;

const defaultProps = Object.freeze({
  disabled: false,
  isGroupStart: false,
});
const initialState = Object.freeze({});

export default function ToolbarButton(props: Props): JSX.Element {
  const { icon, onClick, altText, disabled, isActive, isGroupStart } = props;

  return (
    <button
      disabled={disabled}
      onClick={() => onClick()}
      className={`p-2 ${disabled ? 'text-gray-300' : 'hover:bg-gray-300'} ${
        isActive ? 'text-blue-500' : ''
      }
        ${isGroupStart ? 'border-l-2 border-gray-200' : ''}
      }`}
    >
      <VisuallyHidden>{altText}</VisuallyHidden>
      {icon}
    </button>
  );
}

ToolbarButton.defaultProps = defaultProps;
