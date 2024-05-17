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
  const { formations } = useChoreoStore();
  const [start, setStart] = React.useState(false);
  const [pause, setPause] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const intervalRef = React.useRef<NodeJS.Timeout | number | undefined>(
    undefined
  );

  if (!formations || formations.length === 0) return <></>;

  const [index, setIndex] = React.useState(0);
  const [springs, setSprings] = useSprings(
    formations[0].positions.length,
    (i) => ({
      from: {
        transform: `translate(${formations[0].positions[i].positionX}px, ${formations[0].positions[i].positionY}px)`,
      },
      to: {
        transform: `translate(${formations[0].positions[i].positionX}px, ${formations[0].positions[i].positionY}px)`,
      },
    })
  );

  const updateSprings = (prevIndex: number, nextIndex: number) => {
    const nextFormation = formations[nextIndex];
    const previousFormation = formations[prevIndex];

    setSprings((i) => ({
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
    if (start && !pause) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 1000;
          const currentFormation = formations[index];
          if (nextTime >= parseTime(currentFormation.timeEnd)) {
            setIndex((prevIndex) => {
              const nextIndex =
                prevIndex === formations.length - 1 ? prevIndex : prevIndex + 1;
              console.log('nextIndex', nextIndex);
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
  }, [start, pause, index, setSprings, formations]);

  const handlePause = () => {
    setPause(true);
    clearInterval(intervalRef.current);
  };

  const handleRestart = () => {
    setPause(false);
    setIndex(0);
    setStart(false);
    setCurrentTime(0);
  };

  return (
    <>
      <div className={s.simulation}>
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
              style={{ backgroundColor: formations[index].positions[i].color }}
            />
            {formations[index].positions[i].name}
          </animated.div>
        ))}
      </div>
      <Button onClick={() => setStart(true)} icon={<PlayCircleOutlined />} />
      <Button onClick={handlePause} icon={<PauseCircleOutlined />} />
      <Button onClick={handleRestart} icon={<RedoOutlined />} />
      <Typography.Title level={3}>{formatTime(currentTime)}</Typography.Title>
    </>
  );
};

export default observer(DanceSimulation);
