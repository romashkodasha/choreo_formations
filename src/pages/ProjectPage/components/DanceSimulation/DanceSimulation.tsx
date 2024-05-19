import * as React from 'react';
import { animated, useSprings } from 'react-spring';
import { useChoreoStore } from 'store/locals/ChoreoStore';
import { parseTime } from 'utils/parseTime';

import s from './DanceSimulation.module.scss';
import { observer } from 'mobx-react';
import { Button, Typography } from 'antd';
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { formatTime } from 'utils/formatTime';

const DanceSimulation: React.FC = () => {
  const { formations, project } = useChoreoStore();
  const [running, setRunning] = React.useState(false);

  const [currentTime, setCurrentTime] = React.useState(0);
  const intervalRef = React.useRef<NodeJS.Timeout | number | undefined>(
    undefined
  );

  if (!formations || formations.length === 0) return <></>;

  const [index, setIndex] = React.useState(0);
  const [springs, api] = useSprings(formations[0].positions.length, (i) => ({
    from: {
      transform: `translate(${formations[0].positions[i].positionX}px, ${formations[0].positions[i].positionY}px)`,
    },
    to: {
      transform: `translate(${formations[0].positions[i].positionX}px, ${formations[0].positions[i].positionY}px)`,
    },
  }));

  const updateSprings = (prevIndex: number, nextIndex: number) => {
    const nextFormation = formations[nextIndex];
    const previousFormation = formations[prevIndex];

    api.start((i) => ({
      from: {
        transform: `translate(${previousFormation.positions[i].positionX}px, ${previousFormation.positions[i].positionY}px)`,
      },
      to: {
        transform: `translate(${nextFormation.positions[i].positionX}px, ${nextFormation.positions[i].positionY}px)`,
      },
      config: {
        duration:
          parseTime(nextFormation.timeStart) -
          parseTime(previousFormation.timeEnd),
      },
    }));
  };

  React.useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 1000;
          const currentFormation = formations[index];
          if (nextTime >= parseTime(currentFormation.timeEnd)) {
            setIndex((prevIndex) => {
              const nextIndex =
                prevIndex === formations.length - 1 ? prevIndex : prevIndex + 1;
              updateSprings(prevIndex, nextIndex);
              return nextIndex;
            });
            clearInterval(intervalRef.current);
          }
          return nextTime;
        });
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [running, index, api, formations]);

  const handlePause = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
    api.pause();
  };

  const handleRestart = () => {
    setIndex(0);
    setCurrentTime(0);
    api.set((i) => ({
      transform: `translate(${formations[0].positions[i].positionX}px, ${formations[0].positions[i].positionY}px)`,
    }));
  };

  const handleStart = () => {
    setRunning(true);
    api.resume();
  };

  return (
    <>
      <div className={s.simulation} style={{height: `${project?.height * 3}rem`, width: `${project?.width * 3}rem`}}>
        {springs.map((props, i) => (
          <animated.div
            key={formations[index].positions[i].id}
            style={{
              ...props,
              position: 'absolute',
            }}
          >
            <div
              className={s.dancer}
              style={{ backgroundColor: `#${formations[index].positions[i].member.color}` }}
            />
            {formations[index].positions[i].member.name}
          </animated.div>
        ))}
      </div>
      <Button onClick={handleStart} icon={<PlayCircleOutlined />} />
      <Button onClick={handlePause} icon={<PauseCircleOutlined />} />
      <Button onClick={handleRestart} icon={<RedoOutlined />} />
      <Typography.Title level={3}>{formatTime(currentTime)}</Typography.Title>
    </>
  );
};

export default observer(DanceSimulation);
