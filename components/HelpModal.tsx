import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionStep: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="font-semibold text-gray-800 text-md mb-1">{title}</h4>
        <div className="text-gray-600 text-sm space-y-1">{children}</div>
    </div>
);

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-50 rounded-lg shadow-xl p-6 w-full max-w-lg text-gray-800 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-xl font-bold text-gray-800">How to Use the Dashboard</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        
        <div className="space-y-4">
            <InstructionStep title="1. Simulation Controls">
                <p><strong className="font-medium">Start/Pause:</strong> Toggles the automatic movement and battery depletion of the wheelchairs.</p>
                <p><strong className="font-medium">Reset:</strong> Clears the map of all wheelchairs and obstacles and stops the simulation.</p>
            </InstructionStep>
            
            <InstructionStep title="2. Adding Elements">
                <p><strong className="font-medium">Add Wheelchair:</strong> Places a new, fully charged wheelchair at a random available spot on the map.</p>
                <p><strong className="font-medium">Add Obstacle:</strong> Places a new obstacle on a random empty square.</p>
            </InstructionStep>

            <InstructionStep title="3. Selecting a Wheelchair">
                <p>Simply <strong className="font-medium">click on any wheelchair</strong> on the map to select it. The selected wheelchair will have a blue border.</p>
                <p>Once selected, its details will appear in the <strong className="font-medium">Wheelchair Details</strong> panel, and you can give it commands.</p>
            </InstructionStep>

            <InstructionStep title="4. Autonomous Movement">
                <p>After selecting a wheelchair, <strong className="font-medium">click any empty cell</strong> on the map to set it as the destination.</p>
                <p>If the simulation is running, the wheelchair will automatically start moving along the calculated path (shown as a dashed line) towards the red 'X' marker.</p>
            </InstructionStep>

            <InstructionStep title="5. Manual Controls">
                <p>When a wheelchair is selected, you can use the <strong className="font-medium">arrow buttons</strong> in the control panel or the <strong className="font-medium">arrow keys on your keyboard</strong> to move it one cell at a time.</p>
                <p>Manual movement will cancel any existing destination and path.</p>
            </InstructionStep>

            <InstructionStep title="6. Understanding the Display">
                <p><strong className="font-medium">Wheelchair Colors:</strong> Green (Available), Blue (In Transit), and Red (Needs Assistance, e.g., low battery or blocked).</p>
                <p><strong className="font-medium">Details Panel:</strong> Shows the selected wheelchair's ID, status, battery level, current coordinates, and destination.</p>
            </InstructionStep>
        </div>

        <div className="mt-6 pt-4 border-t text-right">
             <button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Got it!
            </button>
        </div>
      </div>
    </div>
  );
};
