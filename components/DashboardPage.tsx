import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Header } from './Header';
import { HospitalMap } from './HospitalMap';
import { DashboardControls } from './DashboardControls';
import { WheelchairInfoPanel } from './WheelchairInfoPanel';
import { useSimulation } from '../hooks/useSimulation';
import type { Wheelchair } from '../types';
import { WheelchairStatus } from '../types';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { Footer } from './Footer';

const StatCard: React.FC<{title: string, value: string | number, color: string}> = ({ title, value, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: color }}>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
);


const DashboardPage: React.FC = () => {
  const [selectedWheelchairId, setSelectedWheelchairId] = useState<string | null>(null);
  const {
    wheelchairs,
    obstacles,
    isSimulating,
    addWheelchair,
    addObstacle,
    toggleSimulation,
    resetSimulation,
    setWheelchairDestination,
    moveSelectedWheelchair,
  } = useSimulation();

  const selectedWheelchair = wheelchairs.find(w => w.id === selectedWheelchairId) || null;
  
  const stats = useMemo(() => ({
    total: wheelchairs.length,
    available: wheelchairs.filter(w => w.status === WheelchairStatus.Available).length,
    inTransit: wheelchairs.filter(w => w.status === WheelchairStatus.InTransit).length,
    needsAssistance: wheelchairs.filter(w => w.status === WheelchairStatus.NeedsAssistance).length,
  }), [wheelchairs]);


  const handleMapClick = (x: number, y: number) => {
    if (selectedWheelchairId) {
      setWheelchairDestination(selectedWheelchairId, { x, y });
    }
  };

  const handleSelectWheelchair = useCallback((wheelchair: Wheelchair) => {
    setSelectedWheelchairId(wheelchair.id);
  }, []);

  const handleManualMove = useCallback((dx: number, dy: number) => {
    if (selectedWheelchairId) {
      moveSelectedWheelchair(selectedWheelchairId, dx, dy);
    }
  }, [selectedWheelchairId, moveSelectedWheelchair]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedWheelchairId) return;
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
          handleManualMove(0, -1);
          break;
        case 'ArrowDown':
          handleManualMove(0, 1);
          break;
        case 'ArrowLeft':
          handleManualMove(-1, 0);
          break;
        case 'ArrowRight':
          handleManualMove(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedWheelchairId, handleManualMove]);


  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-grow flex flex-col p-4 gap-4 overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Wheelchairs" value={stats.total} color="#3b82f6" />
            <StatCard title="Available" value={stats.available} color="#22c55e" />
            <StatCard title="In Transit" value={stats.inTransit} color="#f97316" />
            <StatCard title="Needs Assistance" value={stats.needsAssistance} color="#ef4444" />
        </div>
        <div className="flex-grow flex flex-col lg:flex-row gap-4 overflow-hidden">
            <div className="flex-grow lg:w-3/4 flex flex-col bg-white rounded-lg shadow-md border border-gray-200 p-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Hospital Floor Plan Simulation</h2>
                <div className="flex-grow w-full h-full min-h-[400px] lg:min-h-0">
                    <HospitalMap
                        width={MAP_WIDTH}
                        height={MAP_HEIGHT}
                        wheelchairs={wheelchairs}
                        obstacles={obstacles}
                        selectedWheelchairId={selectedWheelchairId}
                        onMapClick={handleMapClick}
                        onSelectWheelchair={handleSelectWheelchair}
                    />
                </div>
            </div>

            <aside className="w-full lg:w-1/4 flex flex-col gap-4">
            <DashboardControls
                isSimulating={isSimulating}
                onToggleSimulation={toggleSimulation}
                onAddWheelchair={addWheelchair}
                onAddObstacle={addObstacle}
                onReset={resetSimulation}
                onManualMove={handleManualMove}
                selectedWheelchairId={selectedWheelchairId}
            />
            <WheelchairInfoPanel wheelchair={selectedWheelchair} />
            </aside>
        </div>
      </main>
      <Footer theme="light" />
    </div>
  );
};

export default DashboardPage;