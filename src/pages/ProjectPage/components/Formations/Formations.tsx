import * as React from 'react';
import { useChoreoStore } from 'store/locals/ChoreoStore';
import styles from './Formations.module.scss';
import { observer } from 'mobx-react';
import { Button, Form, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons';

const Formations: React.FC = () => {
  const {
    formations,
    setFormations,
    selectedFormationIndex,
    setSelectedFormationIndex,
    addFormation,
  } = useChoreoStore();

  if (!formations) return null;

  const handleTimeRangeChange = (
    index: number,
    value: [Dayjs | null, Dayjs | null]
  ) => {
    const newFormations = [...formations];
    if (value[0]) newFormations[index].timeStart = value[0].format('mm:ss');
    if (value[1]) newFormations[index].timeEnd = value[1].format('mm:ss');
    setFormations(newFormations);
  };

  const handleRowClick = (index: number) => {
    setSelectedFormationIndex(index);
  };

  const handleAddFormationClick = () => {
    addFormation();
  };

  const handleDeleteFormationClick = (index: number) => {
    const newFormations = formations.filter((_, i) => i !== index);
    setFormations(newFormations);
    if (selectedFormationIndex === index) {
      setSelectedFormationIndex(0);
    } else if (selectedFormationIndex > index) {
      setSelectedFormationIndex(selectedFormationIndex - 1);
    }
  };

  return (
    <>
      <Form>
        {formations.map((formation, index) => (
          <Form.Item
            key={index}
            label={`Промежуток времени ${index + 1}`}
            required={true}
          >
            <TimePicker.RangePicker
              value={[
                dayjs(formation.timeStart, 'mm:ss'),
                dayjs(formation.timeEnd, 'mm:ss'),
              ]}
              format={'mm:ss'}
              placeholder={['Начало', 'Конец']}
              onChange={(value) =>
                handleTimeRangeChange(
                  index,
                  value as [Dayjs | null, Dayjs | null]
                )
              }
              allowEmpty={[false, false]}
              allowClear={false}
              className={
                index === selectedFormationIndex ? styles.selectedRow : ''
              }
            />
            <Button onClick={() => handleRowClick(index)}>Выбрать</Button>
            {formations.length > 1 && <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteFormationClick(index)}/>}
          </Form.Item>
        ))}
        <Button type="primary" onClick={handleAddFormationClick}>
          Добавить переход
        </Button>
      </Form>
    </>
  );
};

export default observer(Formations);

