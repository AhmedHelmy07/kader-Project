import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { t } = useLanguage();
  
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
            <h2 className="text-xl font-bold text-gray-800">{t('help.title')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        
        <div className="space-y-4">
            <InstructionStep title={t('help.simulationControls')}>
                <p><strong className="font-medium">{t('help.startPause')}</strong></p>
                <p><strong className="font-medium">{t('help.reset')}</strong></p>
            </InstructionStep>
            
            <InstructionStep title={t('help.addingElements')}>
                <p><strong className="font-medium">{t('help.addWheelchair')}</strong></p>
                <p><strong className="font-medium">{t('help.addObstacle')}</strong></p>
            </InstructionStep>

            <InstructionStep title={t('help.selectWheelchair')}>
                <p>{t('help.clickWheelchair')}</p>
                <p>{t('help.detailsPanel')}</p>
            </InstructionStep>

            <InstructionStep title={t('help.autonomousMovement')}>
                <p>{t('help.clickEmpty')}</p>
                <p>{t('help.simulationMovement')}</p>
            </InstructionStep>

            <InstructionStep title={t('help.manualControls')}>
                <p>{t('help.arrowButtons')}</p>
                <p>{t('help.cancelDestination')}</p>
            </InstructionStep>

            <InstructionStep title={t('help.understanding')}>
                <p><strong className="font-medium">{t('help.wheelchairColors')}</strong></p>
                <p><strong className="font-medium">{t('help.detailsInfo')}</strong></p>
            </InstructionStep>
        </div>

        <div className="mt-6 pt-4 border-t text-right">
             <button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                {t('help.gotIt')}
            </button>
        </div>
      </div>
    </div>
  );
};
