import React, { useState } from 'react';
import {
  ComponentPhotoType,
  COMPONENT_PHOTOS_DATA,
} from './ComponentPhotoViewerModal';
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  Cpu,
  Zap,
  Radio,
  Sparkles,
  BookOpen,
  Sliders,
  ZoomIn,
  Camera,
  Wrench,
  Layers,
  ArrowRight,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { StartingComponentSelector } from './StartingComponentSelector';

interface ComponentsTabControlsPanelProps {
  selectedComponent: ComponentPhotoType;
  onSelectComponent: (comp: ComponentPhotoType) => void;
  viewMode: 'photo' | 'bench';
  onChangeViewMode: (mode: 'photo' | 'bench') => void;
  onOpenPhotoModal: (comp: ComponentPhotoType) => void;
  onOpenFullGuideModal: () => void;
}

export const ComponentsTabControlsPanel: React.FC<ComponentsTabControlsPanelProps> = ({
  selectedComponent,
  onSelectComponent,
  viewMode,
  onChangeViewMode,
  onOpenPhotoModal,
  onOpenFullGuideModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ficha' | 'selector' | 'resumen'>('ficha');

  const currentData = COMPONENT_PHOTOS_DATA[selectedComponent] || COMPONENT_PHOTOS_DATA.ptc;

  const ALL_COMPONENTS: Array<{
    id: ComponentPhotoType;
    label: string;
    shortName: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'ptc',
      label: 'Termistor PTC',
      shortName: 'PTC (LST)',
      icon: <Flame className="w-3.5 h-3.5" />,
    },
    {
      id: 'klixon',
      label: 'Protector Klixon',
      shortName: 'Klixon (Térmico)',
      icon: <Cpu className="w-3.5 h-3.5" />,
    },
    {
      id: 'rele_arranque',
      label: 'Relé Intensidad',
      shortName: 'Relé Intensidad',
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    {
      id: 'rele_potencia',
      label: 'Relé Potencial (5-2-1)',
      shortName: 'Relé 5-2-1',
      icon: <Radio className="w-3.5 h-3.5" />,
    },
    {
      id: 'condensador_marcha',
      label: 'Cond. Marcha',
      shortName: 'Cond. Marcha',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'condensador_arranque',
      label: 'Cond. Arranque',
      shortName: 'Cond. Arranque',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="space-y-2.5 flex-1 flex flex-col justify-between font-sans">
      {/* 1. Sub-Tab Switcher at top */}
      <div className="flex items-center justify-between gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#0a0d16] border border-slate-200 dark:border-slate-800 shrink-0">
        <button
          type="button"
          onClick={() => setActiveSubTab('ficha')}
          className={`flex-1 py-1.5 px-2 rounded-md font-mono text-tiny font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'ficha'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>1. Ficha Técnica y Diagnóstico</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('selector')}
          className={`flex-1 py-1.5 px-2 rounded-md font-mono text-tiny font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'selector'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>2. Selector Oficial (Tablas HP)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('resumen')}
          className={`flex-1 py-1.5 px-2 rounded-md font-mono text-tiny font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'resumen'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3. Resumen y Simbología</span>
        </button>
      </div>

      {/* 2. Sub-Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar space-y-2.5">
        {/* SUBTAB 1: FICHA TÉCNICA Y DIAGNÓSTICO */}
        {activeSubTab === 'ficha' && (
          <div className="space-y-2.5">
            {/* Component Selector Chips Row */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-slate-100 dark:bg-[#0a0d16] p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              {ALL_COMPONENTS.map((item) => {
                const isSelected = selectedComponent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectComponent(item.id)}
                    className={`py-1 px-1.5 rounded text-[11px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer truncate ${
                      isSelected
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60'
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                    <span className="truncate">{item.shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Component Summary Card */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0d16] border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-small font-bold text-slate-900 dark:text-white font-mono">
                      {currentData.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${currentData.badgeColor}`}
                    >
                      {currentData.badge}
                    </span>
                  </div>
                  <p className="text-tiny text-slate-500 dark:text-slate-400">
                    {currentData.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenPhotoModal(selectedComponent)}
                  className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-amber-400 hover:text-black text-slate-700 dark:text-slate-300 transition-colors font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  title="Ver en pantalla completa con zoom"
                >
                  <ZoomIn className="w-3 h-3 text-amber-500" />
                  <span>Foto HD</span>
                </button>
              </div>

              {/* Bornes / Conexión de Taller */}
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-tiny text-slate-700 dark:text-amber-200 font-mono">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                  Conexión y Terminales de Taller:
                </span>
                <span className="text-[11px] leading-relaxed">
                  {currentData.bornes}
                </span>
              </div>
            </div>

            {/* Diagnostic Multimeter Readings Card */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0d16] border border-slate-200 dark:border-slate-800/80 space-y-2">
              <h5 className="text-tiny font-mono font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-500" />
                <span>Protocolo de Diagnóstico con Polímetro:</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-tiny">
                {/* Bueno */}
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold font-mono text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Lectura Estado Correcto (OK)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-400 font-mono">
                    {currentData.multimeterTest.good}
                  </p>
                </div>

                {/* Averiado */}
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-800 dark:text-red-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold font-mono text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Lectura Estado Averiado</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-red-700 dark:text-red-400 font-mono">
                    {currentData.multimeterTest.faulty}
                  </p>
                </div>
              </div>

              {/* Technician Tip */}
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-mono flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Tip de Frigorista:</strong> {currentData.multimeterTest.technicianTip}
                </span>
              </div>
            </div>

            {/* Key Specs and Operation */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0d16] border border-slate-200 dark:border-slate-800/80 space-y-2 text-tiny">
              <h5 className="font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                Especificaciones Clave:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px]">
                {currentData.keySpecs.map((spec, i) => (
                  <div
                    key={i}
                    className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                <strong className="text-slate-800 dark:text-slate-200">Principio de Operación: </strong>
                {currentData.operationPrinciple}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: SELECTOR OFICIAL (TABLAS HP) */}
        {activeSubTab === 'selector' && (
          <div className="space-y-2">
            <StartingComponentSelector />
          </div>
        )}

        {/* SUBTAB 3: RESUMEN Y SIMBOLOGÍA */}
        {activeSubTab === 'resumen' && (
          <div className="space-y-2">
            <div className="text-tiny text-slate-500 dark:text-slate-400 font-mono mb-2">
              Haz clic en cualquier componente para cargarlo inmediatamente en el banco de ensayo:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_COMPONENTS.map((item) => {
                const info = COMPONENT_PHOTOS_DATA[item.id];
                const isSelected = selectedComponent === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectComponent(item.id);
                      setActiveSubTab('ficha');
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-[#0a0d16] border-slate-200 dark:border-slate-800 hover:border-amber-400'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-black/40 border border-slate-700 overflow-hidden flex items-center justify-center p-1 shrink-0">
                      <img
                        src={info.imgSrc}
                        alt={info.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = info.fallbackSrc;
                        }}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-tiny font-bold text-slate-900 dark:text-white font-mono truncate">
                          {info.title}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${info.badgeColor}`}>
                          {info.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {info.connectionRole}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Action Bar */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onChangeViewMode(viewMode === 'photo' ? 'bench' : 'photo')}
          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-tiny font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          {viewMode === 'photo' ? (
            <>
              <Wrench className="w-3.5 h-3.5 text-amber-500" />
              <span>Cambiar a Banco de Ensayo</span>
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5 text-amber-500" />
              <span>Ver Fotografía Real HD</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenFullGuideModal}
          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-mono text-tiny font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Manual Técnico Completo</span>
        </button>
      </div>
    </div>
  );
};
