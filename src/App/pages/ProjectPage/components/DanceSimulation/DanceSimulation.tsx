import * as React from 'react';
// import { useSprings, animated } from 'react-spring';
// import {
//   FormationModel,
//   PositionModel,
//   useChoreoStore,
// } from 'store/ChoreoModel';
// import Dancer from '../Stage/Dancer';

// import style from './DanceSimulation.module.scss';
// import { parseTime } from 'utils/parseTime';

const DanceSimulation: React.FC = () => {
  return(<></>)
  // const { formations, dancers } = useChoreoStore();

  // const springs = useSprings(
  //   formations.length,
  //   formations.map((formation: FormationModel) => ({
  //     from: { time: 0 },
  //     to: { time: parseTime(formation.timeEnd) * 1000 },
  //     reset: simulationActive,
  //     reverse: simulationActive,
  //     onRest: stopSimulation,
  //   }))
  // );

  // // текущий переход
  // const getPositions = (time: number): PositionModel[] => {
  //   const currentFormation = formations.find(
  //     (formation: FormationModel) =>
  //       time >= parseTime(formation.timeStart) &&
  //       time <= parseTime(formation.timeEnd)
  //   );

  //   if (currentFormation) {
  //     return currentFormation.positions;
  //   }

  //   return [];
  // };


  // return (
  //   <div>
  //     <button onClick={startSimulation} disabled={simulationActive}>
  //       Start Simulation
  //     </button>

  //     <div className={style.simulation}>
  //       {springs.map((props, index) => (
  //         <React.Fragment key={formations[index].sequenceNumber}>
  //           {formations[index].positions.map((position: PositionModel) => {
  //             const dancer = dancers.find(
  //               (d) => d.dancerID === position.dancerID
  //             );
  //             return (
  //               <animated.div
  //                 key={position.dancerID}
  //                 style={{
  //                   position: 'absolute',
  //                   transform: props.time
  //                     .to((t) => getPositions(index)) // Multiply by 1000 to convert to milliseconds
  //                     .to(
  //                       (pos) =>
  //                         `translate(${pos?.position_x || 0}px, ${
  //                           pos?.position_y || 0
  //                         }px)`
  //                     ),
  //                 }}
  //               >
  //                 {dancer && (
  //                   <Dancer
  //                     dancerID={dancer.dancerID}
  //                     name={dancer.name}
  //                     color={dancer.color}
  //                   />
  //                 )}
  //               </animated.div>
  //             );
  //           })}
  //         </React.Fragment>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default DanceSimulation;
