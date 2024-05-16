import * as React from 'react';
import Dancer from './Dancer';
import { observer } from 'mobx-react';

import styles from './Stage.module.scss';
import Formations from '../Formations';
import DanceSimulation from '../DanceSimulation';
import { useLocalStore } from 'store/hooks';
import { ChoreoStore, ChoreoStoreProvider } from 'store/locals/ChoreoStore';
import { useRootStore } from 'store/globals/root';
import { useLocation } from 'react-router-dom';
import { ScreenSpinner } from 'components/common';
import { toJS } from 'mobx';

const Stage: React.FC = () => {
  const location = useLocation();
  const rootStore = useRootStore();
  const [newDancerName, setNewDancerName] = React.useState('');
  const [newDancerColor, setNewDancerColor] = React.useState('');

  const choreoStore = useLocalStore(() => new ChoreoStore(rootStore));

  React.useEffect(() => {
    const init = async () => {
      await choreoStore.loadProjectDetail({ id: location.state.projectId });
    };
    void init();
  }, [choreoStore]);

  const handleAddDancer = () => {
    choreoStore.addDancer(newDancerName, newDancerColor);
    setNewDancerName('');
    setNewDancerColor('');
  };

  if (choreoStore.meta.isLoading || !choreoStore.positions) {
    return <ScreenSpinner />;
  }

  console.log(toJS(choreoStore.meta.isLoading))

  return (
    <ChoreoStoreProvider value={{ store: choreoStore }}>
      <div className={styles.page}>
        <div>
          <label>
            Имя танцора:
            <input
              type="text"
              value={newDancerName}
              onChange={(e) => setNewDancerName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Цвет танцора:
            <input
              type="text"
              value={newDancerColor}
              onChange={(e) => setNewDancerColor(e.target.value)}
            />
          </label>
        </div>
        <button onClick={handleAddDancer}>Добавить танцора</button>

        {choreoStore.positions && (
          <div className={styles.stage}>
            {choreoStore.positions.map((position) => (
              <Dancer key={position.id} position={position} />
            ))}
          </div>
        )}
        <Formations />
        {choreoStore.formations && <DanceSimulation />}
      </div>
    </ChoreoStoreProvider>
  );
};

export default observer(Stage);
