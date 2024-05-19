import * as React from 'react';
import Stage from './components/Stage';
import { useLocation } from 'react-router-dom';
import { useLocalStore } from 'store/hooks';
import { ChoreoStore, ChoreoStoreProvider } from 'store/locals/ChoreoStore';
import { useRootStore } from 'store/globals/root';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { DanceSimulation } from './components/DanceSimulation';
import s from './ProjectPage.module.scss';


const ProjectPage: React.FC = () => {
  // const location = useLocation();
  const rootStore = useRootStore();
  const choreoStore = useLocalStore(() => new ChoreoStore(rootStore));
  const [show, isShow] = React.useState(false);

  const handleSave =() => {
    choreoStore.editProject();
  }

  return (
    <div className={s.page}>
    <ChoreoStoreProvider value={{ store: choreoStore }}>
      {/* <span>{location.state.projectId}</span> */}
      <Button icon={<SaveOutlined />} onClick={handleSave}>Сохранить</Button>
      <Button onClick={() => isShow(!show)}>
        {show ? 'Скрыть симуляцию' : 'Показать симуляцию'}
      </Button>
      <Stage />
      {show && <DanceSimulation />}
    </ChoreoStoreProvider>
    </div>
  );
};

export default observer(ProjectPage);
