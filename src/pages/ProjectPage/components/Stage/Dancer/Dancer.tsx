import * as React from 'react';
import styles from './Dancer.module.scss';
import Draggable from 'react-draggable';
import { useChoreoStore } from 'store';
import { observer } from 'mobx-react';

type Props = {
  dancerID: number;
  name: string;
  color: string;
};

const Dancer: React.FC<Props> = ({
  dancerID,
  name,
  color,
}) => {
  const { selectedFormation, setPosition } = useChoreoStore();
  const position = selectedFormation?.positions.find(
    (position) => position.dancerID === dancerID
  );
  const nodeRef = React.useRef(null);

  const onControlledDrag = (
    e: unknown,
    positionDrag: { x: number; y: number }
  ) => {
    const { x, y } = positionDrag;
    setPosition(dancerID, x, y);
  };

  return (
    <Draggable
      bounds="parent"
      onDrag={onControlledDrag}
      nodeRef={nodeRef}
      position={{
        x: position ? position.position_x : 0,
        y: position ? position.position_y : 0,
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
