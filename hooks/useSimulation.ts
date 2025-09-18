import { useState, useEffect, useRef, useCallback } from 'react';
import type { Wheelchair, Obstacle, Point } from '../types';
import { WheelchairStatus } from '../types';
import { MAP_WIDTH, MAP_HEIGHT, SIMULATION_TICK_RATE, BATTERY_DEPLETION_RATE } from '../constants';

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const isOccupied = (pos: Point, wheelchairs: Wheelchair[], obstacles: Obstacle[]) => {
  return obstacles.some(o => o.position.x === pos.x && o.position.y === pos.y) ||
         wheelchairs.some(w => w.position.x === pos.x && w.position.y === pos.y);
};

const findEmptySpot = (wheelchairs: Wheelchair[], obstacles: Obstacle[]): Point => {
    let pos: Point;
    do {
        pos = {
            x: Math.floor(Math.random() * MAP_WIDTH),
            y: Math.floor(Math.random() * MAP_HEIGHT),
        };
    } while (isOccupied(pos, wheelchairs, obstacles));
    return pos;
};

export const useSimulation = () => {
  const [wheelchairs, setWheelchairs] = useState<Wheelchair[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const simulationIntervalRef = useRef<number | null>(null);

  const calculatePath = (start: Point, end: Point): Point[] => {
    const path: Point[] = [];
    let current = { ...start };

    while (current.x !== end.x || current.y !== end.y) {
        if (current.x < end.x) current.x++;
        else if (current.x > end.x) current.x--;
        
        if (current.y < end.y) current.y++;
        else if (current.y > end.y) current.y--;

        path.push({ ...current });
    }
    return path;
  };

  const runSimulationTick = useCallback(() => {
    setWheelchairs(prevWheelchairs => {
      const allWheelchairs = [...prevWheelchairs];
      const currentObstacles = [...obstacles];

      return allWheelchairs.map(wc => {
        // Idle wandering for available wheelchairs
        if (wc.status === WheelchairStatus.Available && wc.battery > 20 && Math.random() < 0.05) {
            const directions = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            const newPos = { x: wc.position.x + randomDirection.x, y: wc.position.y + randomDirection.y };

            if (
                newPos.x >= 0 && newPos.x < MAP_WIDTH &&
                newPos.y >= 0 && newPos.y < MAP_HEIGHT &&
                !isOccupied(newPos, allWheelchairs.filter(w => w.id !== wc.id), currentObstacles)
            ) {
                return {
                    ...wc,
                    position: newPos,
                    battery: Math.max(0, wc.battery - BATTERY_DEPLETION_RATE),
                };
            }
        }

        if (wc.status !== WheelchairStatus.InTransit || wc.path.length === 0 || wc.battery <= 0) {
          if (wc.battery <= 0 && wc.status !== WheelchairStatus.NeedsAssistance) {
            return { ...wc, status: WheelchairStatus.NeedsAssistance, battery: 0 };
          }
          return wc;
        }

        const nextPosition = wc.path[0];
        const isNextCellBlocked = isOccupied(nextPosition, allWheelchairs.filter(w => w.id !== wc.id), currentObstacles);

        if (isNextCellBlocked) {
          return { ...wc, status: WheelchairStatus.NeedsAssistance };
        }

        const newPath = wc.path.slice(1);
        const newStatus = newPath.length === 0 ? WheelchairStatus.Available : WheelchairStatus.InTransit;
        
        return {
          ...wc,
          position: nextPosition,
          path: newPath,
          status: newStatus,
          battery: Math.max(0, wc.battery - BATTERY_DEPLETION_RATE),
        };
      });
    });
  }, [obstacles]);

  const toggleSimulation = () => {
    setIsSimulating(prev => !prev);
  };

  useEffect(() => {
    if (isSimulating) {
      simulationIntervalRef.current = window.setInterval(runSimulationTick, SIMULATION_TICK_RATE);
    } else {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    }
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimulating]);
  
  const addWheelchair = useCallback(() => {
    setWheelchairs(prev => {
        const newWheelchair: Wheelchair = {
            id: `wc_${generateId()}`,
            position: findEmptySpot(prev, obstacles),
            destination: null,
            path: [],
            status: WheelchairStatus.Available,
            battery: 100,
            speed: 1,
        };
        return [...prev, newWheelchair];
    });
  }, [obstacles]);
  
  const addObstacle = useCallback(() => {
    setObstacles(prev => {
        const newObstacle: Obstacle = {
            id: `obs_${generateId()}`,
            position: findEmptySpot(wheelchairs, prev),
        };
        return [...prev, newObstacle];
    });
  }, [wheelchairs]);

  const setWheelchairDestination = (id: string, destination: Point) => {
    setWheelchairs(prev =>
      prev.map(wc => {
        if (wc.id === id && wc.status === WheelchairStatus.Available) {
          const path = calculatePath(wc.position, destination);
          return { ...wc, destination, path, status: WheelchairStatus.InTransit };
        }
        return wc;
      })
    );
  };

  const moveSelectedWheelchair = useCallback((id: string, dx: number, dy: number) => {
    setWheelchairs(prev => {
      const allWheelchairs = [...prev];
      const currentObstacles = [...obstacles];
      
      return allWheelchairs.map(wc => {
        if (wc.id === id) {
          const newPos = { x: wc.position.x + dx, y: wc.position.y + dy };

          if (newPos.x >= 0 && newPos.x < MAP_WIDTH && newPos.y >= 0 && newPos.y < MAP_HEIGHT &&
              !isOccupied(newPos, allWheelchairs.filter(w => w.id !== wc.id), currentObstacles)) {
            return { ...wc, position: newPos, status: WheelchairStatus.Available, path: [], destination: null };
          }
        }
        return wc;
      });
    });
  }, [obstacles]);

  const resetSimulation = () => {
    setIsSimulating(false);
    setWheelchairs([]);
    setObstacles([]);
  };

  return {
    wheelchairs,
    obstacles,
    isSimulating,
    addWheelchair,
    addObstacle,
    toggleSimulation,
    resetSimulation,
    setWheelchairDestination,
    moveSelectedWheelchair,
  };
};
