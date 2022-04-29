import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons';

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function NavBar(props: Props): JSX.Element {
  return (
    <div className="py-4 max-w-3xl mx-auto">
      <Link href="/">
        <a className="text-2xl hover:text-blue-500 hover:underline">
          <FontAwesomeIcon icon={faHouseChimney} size={'lg'} />
        </a>
      </Link>
    </div>
  );
}

NavBar.defaultProps = defaultProps;
