import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { CommandListItem } from '../../extensions/nodes/command/suggestion';

type Props = {
  items: [CommandListItem];
  command: any;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

// eslint-disable-next-line
export default forwardRef((props: Props, ref) => {
  const listRef = useRef();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const item = props.items[index];

    if (item) {
      console.log(item.key, item.title);
      props.command({ section: item.section, type: item.key });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
    if (listRef.current) {
      // @ts-ignore
      listRef.current.getElementsByClassName('bg-gray-300')[0].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
    if (listRef.current) {
      listRef.current
        // @ts-ignore
        .getElementsByClassName('bg-gray-300')[0]
        .scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div
      ref={listRef}
      className="flex flex-col overflow-y-auto max-h-60 w-40 bg-gray-100 text-lg rounded-sm shadow-lg"
    >
      {props.items.map((item, index) => (
        <button
          className={`p-4 ${index === selectedIndex ? 'bg-gray-300' : ''}`}
          key={index}
          onClick={() => selectItem(index)}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
});
