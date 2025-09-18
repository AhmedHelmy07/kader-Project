import React, { useMemo } from 'react';
import type { Wheelchair, Obstacle, Point } from '../types';
import { WheelchairStatus } from '../types';
import { CELL_SIZE } from '../constants';
import { WheelchairIcon } from './icons/WheelchairIcon';
import { ObstacleIcon } from './icons/ObstacleIcon';


interface HospitalMapProps {
  width: number;
  height: number;
  wheelchairs: Wheelchair[];
  obstacles: Obstacle[];
  selectedWheelchairId: string | null;
  onMapClick: (x: number, y: number) => void;
  onSelectWheelchair: (wheelchair: Wheelchair) => void;
}

const statusColors: Record<WheelchairStatus, string> = {
  [WheelchairStatus.Available]: 'text-green-500',
  [WheelchairStatus.InTransit]: 'text-blue-500',
  [WheelchairStatus.Charging]: 'text-yellow-500',
  [WheelchairStatus.NeedsAssistance]: 'text-red-500',
};

export const HospitalMap: React.FC<HospitalMapProps> = ({
  width,
  height,
  wheelchairs,
  obstacles,
  selectedWheelchairId,
  onMapClick,
  onSelectWheelchair,
}) => {
  const svgWidth = width * CELL_SIZE;
  const svgHeight = height * CELL_SIZE;

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - svgRect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - svgRect.top) / CELL_SIZE);
    onMapClick(x, y);
  };

  const selectedWheelchairPath = useMemo(() => {
    const selected = wheelchairs.find(w => w.id === selectedWheelchairId);
    if (!selected || selected.path.length === 0) return null;

    let pathString = `M ${selected.position.x * CELL_SIZE + CELL_SIZE / 2} ${selected.position.y * CELL_SIZE + CELL_SIZE / 2}`;
    selected.path.forEach(p => {
      pathString += ` L ${p.x * CELL_SIZE + CELL_SIZE / 2} ${p.y * CELL_SIZE + CELL_SIZE / 2}`;
    });
    return pathString;
  }, [wheelchairs, selectedWheelchairId]);

  return (
    <div className="w-full h-full bg-gray-100 rounded-md overflow-auto border-2 border-gray-200">
      <svg width={svgWidth} height={svgHeight} onClick={handleSvgClick} className="bg-white">
        <defs>
          <pattern id="grid" width={CELL_SIZE} height={CELL_SIZE} patternUnits="userSpaceOnUse">
            <path d={`M ${CELL_SIZE} 0 L 0 0 0 ${CELL_SIZE}`} fill="none" stroke="rgba(229, 231, 235, 1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Path for selected wheelchair */}
        {selectedWheelchairPath && (
            <path d={selectedWheelchairPath} strokeWidth="2" stroke="rgba(59, 130, 246, 0.5)" fill="none" strokeDasharray="4 4" />
        )}

        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <foreignObject
            key={obstacle.id}
            x={obstacle.position.x * CELL_SIZE}
            y={obstacle.position.y * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            className="cursor-not-allowed"
          >
              <ObstacleIcon className="w-full h-full text-gray-500"/>
          </foreignObject>
        ))}

        {/* Wheelchairs */}
        {wheelchairs.map(wheelchair => (
          <g
            key={wheelchair.id}
            transform={`translate(${wheelchair.position.x * CELL_SIZE}, ${wheelchair.position.y * CELL_SIZE})`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectWheelchair(wheelchair);
            }}
            className="cursor-pointer"
          >
            <WheelchairIcon
              x={CELL_SIZE * 0.125}
              y={CELL_SIZE * 0.125}
              width={CELL_SIZE * 0.75}
              height={CELL_SIZE * 0.75}
              className={`transition-colors duration-300 ${statusColors[wheelchair.status]} ${selectedWheelchairId === wheelchair.id ? 'opacity-100' : 'opacity-80'}`}
            />
            {selectedWheelchairId === wheelchair.id && (
              <rect
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill="none"
                stroke="rgb(59 130 246)"
                strokeWidth="2"
                rx="2"
              />
            )}
          </g>
        ))}

        {/* Destination marker for selected wheelchair */}
        {wheelchairs.find(w => w.id === selectedWheelchairId)?.destination && (
            <path d={`M ${wheelchairs.find(w => w.id === selectedWheelchairId)!.destination!.x * CELL_SIZE + CELL_SIZE/4} ${wheelchairs.find(w => w.id === selectedWheelchairId)!.destination!.y * CELL_SIZE + CELL_SIZE/4} L ${wheelchairs.find(w => w.id === selectedWheelchairId)!.destination!.x * CELL_SIZE + (CELL_SIZE*3)/4} ${wheelchairs.find(w => w.id === selectedWheelchairId)!.destination!.y * CELL_SIZE + (CELL_SIZE*3)/4} M ${wheelchairs.find(w => w.id === selectedWheelchairId)!.destination!.x * CELL_SIZE + (CELL_SIZE*3)/4} ${wheelchairs.find(w => w.id === selectedWheelchairId)!.destination!.y * CELL_SIZE + CELL_SIZE/4} L ${wheelchairs.find(w => w.id === selectedWheelchairId)!.destination!.x * CELL_SIZE + CELL_SIZE/4} ${wheelchairs.find(w => w.id === selectedWheelchairId)!.destination!.y * CELL_SIZE + (CELL_SIZE*3)/4}`} stroke="rgb(239 68 68)" strokeWidth="2" />
        )}
      </svg>
    </div>
  );
};
