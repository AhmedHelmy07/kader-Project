import React from 'react';
import { PlayIcon, PauseIcon, PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from './icons/ControlIcons';

interface DashboardControlsProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onAddWheelchair: () => void;
  onAddObstacle: () => void;
  onReset: () => void;
  onManualMove: (dx: number, dy: number) => void;
  selectedWheelchairId: string | null;
}

// FIX: Add `disabled` prop to ControlButton props and pass it to the underlying button element.
const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string; title: string; disabled?: boolean }> = ({ onClick, children, className = '', title, disabled }) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
  >
    {children}
  </button>
);


export const DashboardControls: React.FC<DashboardControlsProps> = ({
  isSimulating,
  onToggleSimulation,
  onAddWheelchair,
  onAddObstacle,
  onReset,
  onManualMove,
  selectedWheelchairId
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Simulation Controls</h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <ControlButton
          onClick={onToggleSimulation}
          className={isSimulating ? 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400' : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400'}
          title={isSimulating ? "Pause Simulation" : "Start Simulation"}
        >
          {isSimulating ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          <span>{isSimulating ? 'Pause' : 'Start'}</span>
        </ControlButton>
        <ControlButton
            onClick={onReset}
            className="bg-red-500 hover:bg-red-600 text-white focus:ring-red-400"
            title="Reset Simulation"
        >
            <RefreshIcon className="w-5 h-5"/>
            <span>Reset</span>
        </ControlButton>
        <ControlButton
          onClick={onAddWheelchair}
          className="bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400"
          title="Add a new wheelchair"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Wheelchair</span>
        </ControlButton>
        <ControlButton
          onClick={onAddObstacle}
          className="bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500"
          title="Add a random obstacle"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Obstacle</span>
        </ControlButton>
      </div>

      <h3 className="text-lg font-semibold my-4 text-gray-700">Manual Control</h3>
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-500 mb-2">{selectedWheelchairId ? 'Use arrows to move selected wheelchair' : 'Select a wheelchair to enable manual control'}</p>
        <ControlButton
          onClick={() => onManualMove(0, -1)}
          disabled={!selectedWheelchairId}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
          title="Move Up"
        >
          <ArrowUpIcon className="w-5 h-5"/>
        </ControlButton>
        <div className="flex gap-2 w-full justify-center">
          <ControlButton
            onClick={() => onManualMove(-1, 0)}
            disabled={!selectedWheelchairId}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
            title="Move Left"
          >
            <ArrowLeftIcon className="w-5 h-5"/>
          </ControlButton>
          <ControlButton
            onClick={() => onManualMove(1, 0)}
            disabled={!selectedWheelchairId}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
            title="Move Right"
          >
            <ArrowRightIcon className="w-5 h-5"/>
          </ControlButton>
        </div>
        <ControlButton
          onClick={() => onManualMove(0, 1)}
          disabled={!selectedWheelchairId}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
          title="Move Down"
        >
          <ArrowDownIcon className="w-5 h-5"/>
        </ControlButton>
      </div>
    </div>
  );
};