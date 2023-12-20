import * as React from 'react';
import { FormationModel } from 'store/ChoreoModel';
import styles from './Formations.module.scss';

type Props = {
  formations: FormationModel[];
  setSelectedFormation: (sequenceNumber: number) => void;
  selectedFormation?: number;
};

const Formations: React.FC<Props> = ({
  formations,
  setSelectedFormation,
  selectedFormation,
}) => {
  const handleRowClick = (sequenceNumber: number) => {
    setSelectedFormation(sequenceNumber);
  };
  return (
    <table>
      <thead>
        <tr>
          <th className={styles.cell}>Sequence Number</th>
          <th className={styles.cell}>Time Start</th>
          <th className={styles.cell}>Time End</th>
        </tr>
      </thead>
      <tbody>
        {formations.map((formation) => (
          <tr
            key={formation.sequenceNumber}
            onClick={() => handleRowClick(formation.sequenceNumber)}
            className={
              formation.sequenceNumber === selectedFormation
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
  );
};

export default React.memo(Formations);
