import * as React from 'react';
import styles from './Dancer.module.scss';
import Draggable from 'react-draggable';
import { useChoreoStore } from 'store/locals/ChoreoStore';
import { observer } from 'mobx-react';

type Props = {
  id: number;
  name: string;
  color: string;
};

const Dancer: React.FC<Props> = ({
  id,
  name,
  color,
}) => {
  const { selectedFormation, setPosition} = useChoreoStore();
  const position = selectedFormation?.positions.find(
    (position) => position.dancerId === id
  );
  const nodeRef = React.useRef(null);

  const onControlledDrag = (
    e: unknown,
    positionDrag: { x: number; y: number }
  ) => {
    const { x, y } = positionDrag;
    setPosition(id, x, y);
  };

  return (
    <Draggable
      bounds="parent"
      onStop={onControlledDrag}
      nodeRef={nodeRef}
      position={{
        x: position ? position.positionX : 0,
        y: position ? position.positionY : 0,
      }}
    >
      <div className={styles.point} ref={nodeRef}>
        <div className={styles.dancer} style={{ backgroundColor: color }} />
        <span>{name}</span>
      </div>
    </Draggable>
  );
};

export default observer(Dancer);
