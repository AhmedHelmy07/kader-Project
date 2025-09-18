import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon } from './icons/ControlIcons';

interface ManualMovementControlsProps {
    onManualMove: (dx: number, dy: number) => void;
    selectedWheelchairId: string | null;
}

const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string; title: string; disabled?: boolean }> = ({ onClick, children, className = '', title, disabled }) => (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`flex items-center justify-center p-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  );

export const ManualMovementControls: React.FC<ManualMovementControlsProps> = ({ onManualMove, selectedWheelchairId }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold my-4 text-gray-700 border-t pt-4">Manual Control</h3>
            <div className="flex flex-col items-center gap-1">
                <p className="text-sm text-gray-500 mb-2 text-center">{selectedWheelchairId ? 'Use arrows to move selected wheelchair' : 'Select a wheelchair to enable manual control'}</p>
                <ControlButton
                onClick={() => onManualMove(0, -1)}
                disabled={!selectedWheelchairId}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-24"
                title="Move Up"
                >
                <ArrowUpIcon className="w-6 h-6"/>
                </ControlButton>
                <div className="flex gap-2 w-full justify-center">
                <ControlButton
                    onClick={() => onManualMove(-1, 0)}
                    disabled={!selectedWheelchairId}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-24"
                    title="Move Left"
                >
                    <ArrowLeftIcon className="w-6 h-6"/>
                </ControlButton>
                <ControlButton
                    onClick={() => onManualMove(1, 0)}
                    disabled={!selectedWheelchairId}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-24"
                    title="Move Right"
                >
                    <ArrowRightIcon className="w-6 h-6"/>
                </ControlButton>
                </div>
                <ControlButton
                onClick={() => onManualMove(0, 1)}
                disabled={!selectedWheelchairId}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-24"
                title="Move Down"
                >
                <ArrowDownIcon className="w-6 h-6"/>
                </ControlButton>
            </div>
        </div>
    );
};