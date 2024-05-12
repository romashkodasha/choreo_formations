import * as React from 'react';
import { useChoreoStore } from 'store/locals/ChoreoStore';
import styles from './Formations.module.scss';
import { observer } from 'mobx-react';

const Formations: React.FC = () => {
  const { formations, setSelectedFormation, selectedFormation, addFormation } =
    useChoreoStore();

  const handleRowClick = (sequenceNumber: number) => {
    setSelectedFormation(sequenceNumber);
  };
  const [newTimeStart, setNewTimeStart] = React.useState('');
  const [newTimeEnd, setNewTimeEnd] = React.useState('');

  const handleAddFormationClick = () => {
    addFormation(newTimeStart, newTimeEnd);
    setNewTimeStart('');
    setNewTimeEnd('');
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th className={styles.cell}>Sequence Number</th>
            <th className={styles.cell}>Time Start</th>
            <th className={styles.cell}>Time End</th>
          </tr>
        </thead>
        <tbody>
          {formations?.map((formation) => (
            <tr
              key={formation.sequenceNumber}
              onClick={() => handleRowClick(formation.sequenceNumber)}
              className={
                formation.sequenceNumber === selectedFormation?.sequenceNumber
                  ? styles.selectedRow
                  : styles.row
              }
            >
              <td className={styles.cell}>{formation.sequenceNumber}</td>
              <td className={styles.cell}>{formation.timeStart}</td>
              <td className={styles.cell}>{formation.timeEnd}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <label>
          Время начала:
          <input
            type="text"
            value={newTimeStart}
            onChange={(e) => setNewTimeStart(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Время окончания:
          <input
            type="text"
            value={newTimeEnd}
            onChange={(e) => setNewTimeEnd(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleAddFormationClick}>Добавить переход</button>
    </>
  );
};

export default observer(Formations);
