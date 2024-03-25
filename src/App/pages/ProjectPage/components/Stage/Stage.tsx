import * as React from 'react';
import Dancer from './Dancer';
import ChoreoStore, { ChoreoStoreProvider } from 'store/ChoreoModel';
import { useLocalStore } from 'shared/hooks';
import { observer } from 'mobx-react';

import styles from './Stage.module.scss';
import Formations from '../Formations';
import DanceSimulation from '../DanceSimulation';

const Stage: React.FC = () => {
  const [newDancerName, setNewDancerName] = React.useState('');
  const [newDancerColor, setNewDancerColor] = React.useState('');

  const choreoStore = useLocalStore(() => new ChoreoStore());

  React.useEffect(() => {
    choreoStore.getFormationsList();
  }, [choreoStore]);

  const handleAddDancer = () => {
    choreoStore.addDancer(newDancerName, newDancerColor);
    setNewDancerName('');
    setNewDancerColor('');
  };

  return (
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
      <ChoreoStoreProvider value={choreoStore}>
        {choreoStore.dancers && (
          <div className={styles.stage}>
            {choreoStore.dancers.map((dancer) => (
              <Dancer key={dancer.dancerID} {...dancer} />
            ))}
          </div>
        )}
        <Formations />
        {choreoStore.formations && <DanceSimulation />}
      </ChoreoStoreProvider>
    </div>
  );
};

export default observer(Stage);
