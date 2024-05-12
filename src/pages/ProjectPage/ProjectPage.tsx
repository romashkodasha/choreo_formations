import * as React from 'react';
import Stage from './components/Stage';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';

const ProjectPage: React.FC = () => {
  const location = useLocation();
  
  return (
    <>
    <span>{location.state.projectId}</span>
    <Stage />
    </>
  );
};

export default observer(ProjectPage);
