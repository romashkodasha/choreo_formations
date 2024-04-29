import { ScreenSpinner, TeamCard } from 'components/common';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useProjectsStore } from 'store/locals/ProjectsStore';

import s from './TeamsList.module.scss';

const TeamsList: React.FC = () => {
  const projectsStore = useProjectsStore();

  React.useEffect(() => {
    const init = async () => {
      await projectsStore.loadTeamsList({ initial: true });
    };

    void init();
  }, [projectsStore]);

  if (projectsStore.metaTeams.isLoading) {
    return <ScreenSpinner />;
  }
  
  return (
    <div className={s.list}>
      {projectsStore.teams.map((team) => (
        <TeamCard team={team} className={s.card}/>
      ))}
    </div>
  );
};
export default observer(TeamsList);
