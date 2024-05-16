import * as React from 'react';
import styles from './Dancer.module.scss';
import Draggable from 'react-draggable';
import { observer } from 'mobx-react';
import { PositionModel } from 'store/models/PositionModel';

type Props = {
  position: PositionModel;
};

const Dancer: React.FC<Props> = ({ position }) => {
  const nodeRef = React.useRef(null);

  const onControlledDrag = (
    e: unknown,
    positionDrag: { x: number; y: number }
  ) => {
    const { x, y } = positionDrag;
    position.updatePosition(x, y);
  };


  return (
    <Draggable
      bounds="parent"
      onStop={onControlledDrag}
      nodeRef={nodeRef}
      position={{
        x: position.positionX ?? 0,
        y: position.positionY ?? 0,
      }}
    >
      <div className={styles.point} ref={nodeRef}>
        <div className={styles.dancer} style={{ backgroundColor: position.color }} />
        <span>{position.name}</span>
      </div>
    </Draggable>
  );
};

export default observer(Dancer);
