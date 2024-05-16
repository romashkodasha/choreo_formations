import * as React from 'react';
import styles from './Dancer.module.scss';
import Draggable from 'react-draggable';
import { observer } from 'mobx-react';
import { PositionModel } from 'store/models/PositionModel';
import { useLocalStore } from 'store/hooks';
import { DancerStore } from 'store/locals/DancerStore';
import { useChoreoStore } from 'store/locals/ChoreoStore';

type Props = {
  position: PositionModel;
};

const Dancer: React.FC<Props> = ({ position}) => {
  const {updatePositions} = useChoreoStore();
  const dancerStore = useLocalStore(() => new DancerStore(position,  updatePositions));
  const nodeRef = React.useRef(null);

  const onControlledDrag = (
    e: unknown,
    positionDrag: { x: number; y: number }
  ) => {
    const { x, y } = positionDrag;
    dancerStore.updatePosition(x, y);
  };


  return (
    <Draggable
      bounds="parent"
      onStop={onControlledDrag}
      nodeRef={nodeRef}
      position={{
        x: dancerStore.position.positionX ?? 0,
        y: dancerStore.position.positionY ?? 0,
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
