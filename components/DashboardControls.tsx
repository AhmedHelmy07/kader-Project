import React, { useState } from 'react';
import { PlayIcon, PauseIcon, PlusIcon, RefreshIcon, HelpIcon } from './icons/ControlIcons';
import { ManualMovementControls } from './ManualMovementControls';
import { HelpModal } from './HelpModal';

interface DashboardControlsProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onAddWheelchair: () => void;
  onAddObstacle: () => void;
  onReset: () => void;
  onManualMove: (dx: number, dy: number) => void;
  selectedWheelchairId: string | null;
}

const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string; title: string; disabled?: boolean }> = ({ onClick, children, className = '', title, disabled }) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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
  const [isHelpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Simulation Controls</h3>
          <button
            onClick={() => setHelpOpen(true)}
            title="How to Use"
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <HelpIcon className="w-6 h-6" />
          </button>
        </div>
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

        <ManualMovementControls
            onManualMove={onManualMove}
            selectedWheelchairId={selectedWheelchairId}
        />
      </div>
    </>
  );
};