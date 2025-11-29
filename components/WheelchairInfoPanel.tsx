
import React from 'react';
import type { Wheelchair } from '../types';
import { WheelchairStatus } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { BatteryIcon, StatusIcon, PositionIcon } from './icons/InfoIcons';

interface WheelchairInfoPanelProps {
  wheelchair: Wheelchair | null;
}

const statusStyles: Record<WheelchairStatus, { bg: string; text: string; dot: string }> = {
    [WheelchairStatus.Available]: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    [WheelchairStatus.InTransit]: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    [WheelchairStatus.Charging]: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    [WheelchairStatus.NeedsAssistance]: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
};


const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center gap-3">
            <div className="text-gray-500">{icon}</div>
            <span className="font-medium text-gray-600">{label}</span>
        </div>
        <div className="font-semibold text-gray-800">{value}</div>
    </div>
);


export const WheelchairInfoPanel: React.FC<WheelchairInfoPanelProps> = ({ wheelchair }) => {
  const { t } = useLanguage();
  
  if (!wheelchair) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 h-full flex items-center justify-center">
        <p className="text-gray-500">{t('common.noResults')}</p>
      </div>
    );
  }

  const { id, status, battery, position, destination } = wheelchair;
  const style = statusStyles[status];
  
  const batteryColor = battery > 50 ? 'bg-green-500' : battery > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Wheelchair Details</h3>
      <p className="text-xs text-gray-400 mb-4 truncate">ID: {id}</p>
      
      <div className="space-y-2">
        <InfoRow
            icon={<StatusIcon className="w-5 h-5"/>}
            label="Status"
            value={
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${style.bg} ${style.text}`}>
                    {status}
                </span>
            }
        />
         <InfoRow
            icon={<BatteryIcon className="w-5 h-5"/>}
            label="Battery"
            value={
                <div className="flex items-center gap-2">
                    <span>{battery.toFixed(0)}%</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                       <div className={`${batteryColor} h-2 rounded-full`} style={{ width: `${battery}%` }}></div>
                    </div>
                </div>
            }
        />
        <InfoRow
            icon={<PositionIcon className="w-5 h-5"/>}
            label="Position"
            value={`(${position.x}, ${position.y})`}
        />
        <InfoRow
            icon={<PositionIcon className="w-5 h-5 text-blue-500"/>}
            label="Destination"
            value={destination ? `(${destination.x}, ${destination.y})` : 'N/A'}
        />
      </div>
    </div>
  );
};
