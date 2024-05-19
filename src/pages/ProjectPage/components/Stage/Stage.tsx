import * as React from 'react';
import Dancer from './Dancer';
import { observer } from 'mobx-react';

import styles from './Stage.module.scss';
import Formations from '../Formations';
import { useChoreoStore } from 'store/locals/ChoreoStore';
import { useLocation } from 'react-router-dom';
import { ScreenSpinner } from 'components/common';

const Stage: React.FC = () => {
  const location = useLocation();

  const choreoStore = useChoreoStore();

  React.useEffect(() => {
    const init = async () => {
      await choreoStore.loadProjectDetail({ id: location.state.projectId });
    };
    void init();
  }, [choreoStore]);

  if (choreoStore.meta.isLoading || !choreoStore.project) {
    return <ScreenSpinner />;
  }

  return (
    <div className={styles.page}>
      {choreoStore.positions && (
        <div
          className={styles.stage}
          style={{
            height: `${choreoStore.project?.height * 3}rem`,
            width: `${choreoStore.project?.width * 3}rem`,
          }}
        >
          {choreoStore.positions.map((position) => (
            <Dancer key={position.id} position={position} />
          ))}
        </div>
      )}
      <Formations />
    </div>
  );
};

export default observer(Stage);
