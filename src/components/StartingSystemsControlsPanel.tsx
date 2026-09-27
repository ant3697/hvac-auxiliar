import React, { useState, useEffect } from 'react';
import { SchematicVariant } from './IntuitiveSchematicDiagram';
import { Zap, Sparkles, Layers, Cpu, Maximize2, Play, AlertTriangle, RefreshCw, Square, CheckCircle2, BookOpen, Sliders, Wrench, Camera, Flame } from 'lucide-react';
import { StartingSystemModal } from './StartingSystemModal';

import ptcImg from '../assets/ptc.png';
import klixonImg from '../assets/klixon.png';
import releArranqueImg from '../assets/rele_arranque.png';
import relePotenciaImg from '../assets/rele_potencia.png';
import condensadorMarchaImg from '../assets/condensador_marcha.jpg';
import condensadorArranqueImg from '../assets/condensador_arranque.png';

interface StartingSystemsControlsPanelProps {
  selectedCircuit: SchematicVariant;
  onSelectCircuit: (variant: SchematicVariant) => void;
  simState: 'idle' | 'starting' | 'running' | 'overload';
  onStartSimulation: () => void;
  onOverload: () => void;
  onReset: () => void;
  onOpenModal: (variant: SchematicVariant) => void;
  onOpenComponentsModal?: (tab?: 'all' | 'selector' | 'ptc' | 'klixon' | 'rele' | 'capacitors' | 'potencial') => void;
  onNavigateToDirectStart?: () => void;
  onNavigateToComponentsTab?: () => void;
}

interface CircuitCardData {
  id: SchematicVariant;
  name: string;
  category: 'HST' | 'LST' | 'POTENCIAL';
  condensador: string;
  desconexion: string;
  par: string;
  detalles: string;
  aplicaciones: string;
  capacidadRecomendada: string;
}

const ALL_CIRCUITS: CircuitCardData[] = [
  // POTENCIAL (5-2-1)
  {
    id: 'CSIR_POTENCIAL',
    name: 'CSIR con Relé de Potencial',
    category: 'POTENCIAL',
    condensador: 'Solo Condensador de Arranque (Electrolítico)',
    desconexion: 'Relé de Potencial (Bobina 5-2 por f.c.e.m. / Contacto 1-2 NC)',
    par: 'Alto Par (HST)',
    detalles: 'El contacto normalmente cerrado 1-2 conecta el condensador de arranque. Al acelerar el motor, la f.c.e.m. generada en el devanado auxiliar S excita la bobina 5-2 (>340 V), abriendo el contacto 1-2 y desconectando el condensador.',
    aplicaciones: 'Compresores comerciales de 1/3 a 5 CV con capilar o válvula de expansión (TXV).',
    capacidadRecomendada: 'Arranque: 60 - 160 µF (330V AC intermitente)',
  },
  {
    id: 'CSR_POTENCIAL',
    name: 'CSR con Relé de Potencial',
    category: 'POTENCIAL',
    condensador: 'Doble Condensador: Arranque (4-1) + Marcha Permanente (4-2)',
    desconexion: 'Relé de Potencial (Bobina 5-2 por f.c.e.m. / Contacto 1-2 NC)',
    par: 'Muy Alto Par (HST) + Alto Rendimiento',
    detalles: 'Combina el gran par de arranque del condensador electrolítico con un condensador de marcha de polipropileno conectado permanentemente entre el borne 4 (Línea C2) y el borne 2 (S) para máximo rendimiento continuo.',
    aplicaciones: 'Cámaras frigoríficas de congelación, bombas de calor y compresores de 1/2 a 5+ CV.',
    capacidadRecomendada: 'Arranque: 80 - 200 µF (330V) • Marcha: 15 - 45 µF (450V)',
  },
  // HST
  {
    id: 'HST_CSR_RELE',
    name: 'CSR con Relé de Arranque',
    category: 'HST',
    condensador: 'Cond. Electrolítico de Arranque',
    desconexion: 'Relé de Intensidad (caída por gravedad)',
    par: 'Alto Par (HST)',
    detalles: 'El condensador de arranque genera un desfase de 90° para alto par. Al acelerar, la corriente de la bobina de marcha desciende y el contacto del relé abre desconectando el condensador.',
    aplicaciones: 'Compresores comerciales con capilar sin despresurizar o válvulas de expansión.',
    capacidadRecomendada: '40 - 100 µF (330V AC intermitente)',
  },
  {
    id: 'HST_CSR_PTC',
    name: 'CSR con Termistor PTC',
    category: 'HST',
    condensador: 'Cond. Electrolítico de Arranque',
    desconexion: 'Pastilla Cerámica PTC (Estado Sólido)',
    par: 'Alto Par (HST)',
    detalles: 'La pastilla PTC fría alimenta el condensador de arranque. El paso de corriente la calienta rápidamente (>120 °C) aumentando su resistencia a >10 kΩ y bloqueando el paso de corriente.',
    aplicaciones: 'Enfriadores de botellas y vitrinas comerciales con ecualización de presiones.',
    capacidadRecomendada: '50 - 80 µF (250V AC)',
  },
  {
    id: 'HST_CSIR_RELE',
    name: 'CSIR con Relé (Doble Condensador)',
    category: 'HST',
    condensador: 'Cond. Arranque + Cond. Marcha Permanente',
    desconexion: 'Relé de Arranque',
    par: 'Muy Alto Par (HST) + Alto Rendimiento',
    detalles: 'Combina el gran par de arranque del condensador electrolítico con la eficiencia energética del condensador permanente de marcha de polipropileno.',
    aplicaciones: 'Cámaras frigoríficas de congelación, bombas de calor y equipos comerciales exigentes.',
    capacidadRecomendada: 'Arranque: 60-120 µF • Marcha: 10-25 µF',
  },
  {
    id: 'HST_CSIR_PTC',
    name: 'CSIR con PTC (Doble Condensador)',
    category: 'HST',
    condensador: 'Cond. Arranque + Cond. Marcha',
    desconexion: 'PTC de Estado Sólido',
    par: 'Alto Par + Rendimiento Permanente',
    detalles: 'Al calentar el PTC, el condensador de arranque queda aislado pero el condensador permanente sigue conectado alimentando la fase auxiliar con desfase continuo.',
    aplicaciones: 'Equipos comerciales silenciosos sin piezas mecánicas móviles.',
    capacidadRecomendada: 'Arranque: 40-80 µF • Marcha: 8-16 µF',
  },
  // LST
  {
    id: 'RSIR_RELE',
    name: 'RSIR con Relé de Intensidad',
    category: 'LST',
    condensador: 'Sin Condensador',
    desconexion: 'Relé de Intensidad electromecánico',
    par: 'Bajo Par (LST)',
    detalles: 'El desfase se logra por la diferencia de inductancia y resistencia entre hilos (marcha hilo grueso, arranque hilo fino). Tras el arranque el relé abre.',
    aplicaciones: 'Neveras domésticas y arcones pequeños con tubo capilar que ecualiza presiones.',
    capacidadRecomendada: 'No utiliza condensador',
  },
  {
    id: 'RSIR_PTC',
    name: 'RSIR con Termistor PTC',
    category: 'LST',
    condensador: 'Sin Condensador',
    desconexion: 'PTC Cerámica',
    par: 'Bajo Par (LST)',
    detalles: 'Sistema universal en refrigeración doméstica moderna. Económico, sin contactos que puedan foguearse.',
    aplicaciones: 'Frigoríficos y congeladores domésticos estándar.',
    capacidadRecomendada: 'No utiliza condensador',
  },
  {
    id: 'RSCR_RELE',
    name: 'PSC (Condensador Permanente)',
    category: 'LST',
    condensador: 'Cond. Permanente de Marcha (Polipropileno)',
    desconexion: 'Sin desconexión (permanente)',
    par: 'Bajo Par (LST) + Máxima Eficiencia (cos φ ≈ 1)',
    detalles: 'El condensador permanece siempre en circuito entre R y S, reduciendo el consumo eléctrico y las pérdidas térmicas.',
    aplicaciones: 'Aires acondicionados, climatizadores y compresores rotativos.',
    capacidadRecomendada: '15 - 45 µF (400/450V AC continuo)',
  },
  {
    id: 'RSCR_PTC',
    name: 'RSCR con PTC y Condensador',
    category: 'LST',
    condensador: 'Cond. Marcha Permanente',
    desconexion: 'PTC en paralelo',
    par: 'Bajo Par Asistido',
    detalles: 'PTC para el impulso inicial y condensador permanente continuo.',
    aplicaciones: 'Frigoríficos domésticos de alta eficiencia energética (Clase A++/A+++).',
    capacidadRecomendada: '3 - 6 µF (450V)',
  },
];

export const StartingSystemsControlsPanel: React.FC<StartingSystemsControlsPanelProps> = ({
  selectedCircuit,
  onSelectCircuit,
  simState,
  onStartSimulation,
  onOverload,
  onReset,
  onOpenModal,
  onOpenComponentsModal,
  onNavigateToDirectStart,
  onNavigateToComponentsTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<'HST' | 'LST' | 'POTENCIAL' | 'COMPONENTS'>(() => {
    const match = ALL_CIRCUITS.find((c) => c.id === selectedCircuit);
    return (match ? match.category : 'HST');
  });

  // Keep active category in sync with the selected circuit if it changes externally
  useEffect(() => {
    const match = ALL_CIRCUITS.find((c) => c.id === selectedCircuit);
    if (match && match.category !== activeCategory) {
      setActiveCategory(match.category);
    }
  }, [selectedCircuit]);

  // When switching tabs between LST, HST, or POTENCIAL, activate the first schematic associated with that tab (top-left)
  const handleCategoryChange = (category: 'HST' | 'LST' | 'POTENCIAL') => {
    setActiveCategory(category);
    const firstCircuit = ALL_CIRCUITS.find((c) => c.category === category);
    if (firstCircuit) {
      onSelectCircuit(firstCircuit.id);
    }
  };

  const filteredCircuits = ALL_CIRCUITS.filter(
    (c) => c.category === activeCategory
  );

  const currentCircuitData = ALL_CIRCUITS.find((c) => c.id === selectedCircuit) || ALL_CIRCUITS[0];

  return (
    <div className="space-y-3 flex-1 flex flex-col justify-between font-sans">
      {/* 1. Header & Category Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-small font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Selección de Esquema de Arranque</span>
          </h4>
          <p className="text-tiny text-slate-500 dark:text-slate-400">
            Haz clic en cualquier sistema para mostrar su esquema técnico en la ventana izquierda.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-[#0a0d16] border border-slate-200 dark:border-slate-800 text-tiny font-mono shrink-0">
          <button
            type="button"
            onClick={() => handleCategoryChange('LST')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
              activeCategory === 'LST'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            LST (Bajo Par)
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('HST')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
              activeCategory === 'HST'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            HST (Alto Par)
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('POTENCIAL')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
              activeCategory === 'POTENCIAL'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Relé Potencial (5-2-1)
          </button>
          <button
            type="button"
            onClick={() => {
              if (onNavigateToComponentsTab) {
                onNavigateToComponentsTab();
              } else {
                onOpenComponentsModal?.('all');
              }
            }}
            className="px-2.5 py-1 rounded transition-all cursor-pointer font-bold text-amber-500 hover:text-amber-400 hover:bg-amber-950/30 flex items-center gap-1 border border-amber-500/30"
            title="Ver Solapa 4: Componentes"
          >
            <Cpu className="w-3 h-3" />
            <span>4. Componentes ➔</span>
          </button>
        </div>
      </div>

      {/* Quick Simulation Controller Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 dark:bg-[#0a0d16] border border-slate-200 dark:border-slate-800 rounded-xl text-tiny font-mono shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-bold hidden sm:inline text-[11px]">Prueba:</span>
          <button
            type="button"
            onClick={onStartSimulation}
            className="px-2.5 py-1 rounded bg-amber-400 text-black hover:bg-amber-300 font-bold flex items-center gap-1 cursor-pointer shadow-sm text-[11px]"
            title="Arrancar simulación del esquema"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Arrancar</span>
          </button>
          <button
            type="button"
            onClick={onOverload}
            className="px-2 py-1 rounded bg-rose-500/15 border border-rose-500 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 font-bold flex items-center gap-1 cursor-pointer text-[11px]"
            title="Simular sobrecarga térmica (Klixon)"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Klixon</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-2 py-1 rounded text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold flex items-center gap-1 cursor-pointer text-[11px]"
            title="Parar y restablecer simulación a reposo"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Parar</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase flex items-center gap-1.5 ${
              simState === 'idle'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                : simState === 'starting'
                ? 'bg-amber-400 text-black animate-pulse shadow-sm'
                : simState === 'running'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-rose-500 text-white'
            }`}
          >
            {simState === 'idle' && '⚪ REPOSO'}
            {simState === 'starting' && '⚡ ARRANQUE'}
            {simState === 'running' && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>🟢 EN MARCHA • 🔊 50 Hz</span>
              </>
            )}
            {simState === 'overload' && '🔴 KLIXON ABIERTO'}
          </span>
        </div>
      </div>

      {/* 2. Circuit Selector Grid / List */}
      {activeCategory !== 'COMPONENTS' ? (
        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-tiny">
            {filteredCircuits.map((circuit) => {
              const isSelected = selectedCircuit === circuit.id;
              return (
                <div
                  key={circuit.id}
                  onClick={() => onSelectCircuit(circuit.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/25 ring-1 ring-amber-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0d16] hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isSelected ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                        }`}
                      />
                      <span className="truncate">{circuit.name}</span>
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0 ${
                        circuit.category === 'HST'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : circuit.category === 'POTENCIAL'
                          ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                          : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {circuit.category}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 mt-1">
                    <div>
                      <strong className="text-slate-700 dark:text-slate-300">Desconexión:</strong> {circuit.desconexion}
                    </div>
                    <div>
                      <strong className="text-slate-700 dark:text-slate-300">Condensador:</strong> {circuit.condensador}
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">
                      {isSelected ? '✓ Activo en ventana técnica' : 'Clic para ver esquema'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCircuit(circuit.id);
                        onOpenModal(circuit.id);
                      }}
                      className="text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
                    >
                      <Maximize2 className="w-2.5 h-2.5" />
                      <span>Conectar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* COMPONENTS TECHNICAL SHEET */
        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
          {/* Banner to open component selector */}
          <button
            type="button"
            onClick={() => onOpenComponentsModal?.('selector')}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-sky-500/20 border border-amber-400/60 hover:border-amber-400 text-left transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs group"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500 dark:text-amber-400">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                  Selector de Componentes Oficiales
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-800 dark:text-amber-200 font-bold">
                    6 Tablas
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Danfoss 117U, relés con soporte, bobina desnuda, cuadrados QP2 y protectores JRT4
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-amber-400 text-black shrink-0 group-hover:scale-105 transition-transform">
              Abrir Selector →
            </span>
          </button>

          {/* Banner to open full information window */}
          <button
            type="button"
            onClick={() => onOpenComponentsModal?.('all')}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-sky-500/20 via-amber-500/15 to-sky-500/20 border border-sky-400/50 hover:border-amber-400 text-left transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs group"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                <BookOpen className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Abrir Ventana de Información Completa
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Incluye tiempos de rearme PTC (3-5 min), Klixon, Relé y Condensadores
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-amber-400 text-black shrink-0 group-hover:scale-105 transition-transform">
              Ver Guía →
            </span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-tiny">
            {/* PTC con tiempo de rearme (3-5 min) y Foto Real */}
            <div
              onClick={() => onOpenComponentsModal?.('ptc')}
              className="p-3 rounded-xl bg-sky-50/50 dark:bg-[#0a0d16] border border-sky-300 dark:border-sky-800/80 space-y-1.5 cursor-pointer hover:border-sky-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Flame className="w-3.5 h-3.5 text-sky-500" />
                  <span>Termistor PTC (Estado Sólido)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/30">
                    Foto Real
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                    3 a 5 min
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-13 h-13 rounded-lg bg-black/70 border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <img src={ptcImg} alt="Termistor PTC" className="max-h-full max-w-full object-contain" />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  Pastilla cerámica BaTiO3. Conduce en frío (<strong>15-25 Ω</strong>) y sube a &gt;10 kΩ en marcha. <strong>Requiere 3-5 min de enfriamiento</strong> antes de un nuevo arranque.
                </p>
              </div>
              <div className="text-[10px] text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1 pt-0.5">
                <span>Ver foto real y tiempo de rearme →</span>
              </div>
            </div>

            {/* Klixon */}
            <div
              onClick={() => onOpenComponentsModal?.('klixon')}
              className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0d16] border border-slate-200 dark:border-slate-800 space-y-1.5 cursor-pointer hover:border-rose-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Cpu className="w-3.5 h-3.5 text-rose-500" />
                  <span>Protector Térmico (Klixon)</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30">
                  Foto Real
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-13 h-13 rounded-lg bg-black/70 border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <img src={klixonImg} alt="Klixon" className="max-h-full max-w-full object-contain" />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  En serie con borne <strong>C (Común)</strong>. Resistencia calefactora y disco bimetálico. Corta por exceso de amperios (LRA) o alta temperatura.
                </p>
              </div>
              <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 pt-0.5">
                <span>Ver foto real y detalles →</span>
              </div>
            </div>

            {/* Relé de Arranque */}
            <div
              onClick={() => onOpenComponentsModal?.('rele')}
              className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0d16] border border-slate-200 dark:border-slate-800 space-y-1.5 cursor-pointer hover:border-amber-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Relé de Intensidad</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                  Foto Real
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-13 h-13 rounded-lg bg-black/70 border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <img src={releArranqueImg} alt="Relé de Arranque" className="max-h-full max-w-full object-contain" />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  Bobina en serie con borne <strong>R (Marcha)</strong>. El pico inrush levanta el émbolo; cae por gravedad al régimen nominal. Posición vertical UP.
                </p>
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 pt-0.5">
                <span>Ver foto real y regla UP →</span>
              </div>
            </div>

            {/* Condensadores */}
            <div
              onClick={() => onOpenComponentsModal?.('capacitors')}
              className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0d16] border border-slate-200 dark:border-slate-800 space-y-1.5 cursor-pointer hover:border-indigo-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Condensadores</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/30">
                  Fotos Reales
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 shrink-0">
                  <div className="w-11 h-13 rounded-lg bg-black/70 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-0.5" title="Condensador de Arranque">
                    <img src={condensadorArranqueImg} alt="Cond. Arranque" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="w-11 h-13 rounded-lg bg-black/70 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-0.5" title="Condensador de Marcha">
                    <img src={condensadorMarchaImg} alt="Cond. Marcha" className="max-h-full max-w-full object-contain" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  <strong>Arranque (negro):</strong> 40-160 µF, &lt;3 s.<br />
                  <strong>Marcha (aluminio):</strong> 2-35 µF, continuo.
                </p>
              </div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 pt-0.5">
                <span>Ver fotos reales y comparativa →</span>
              </div>
            </div>

            {/* Relé de Potencial (5-2-1) */}
            <div
              onClick={() => onOpenComponentsModal?.('potencial')}
              className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a0d16] border border-slate-200 dark:border-slate-800 space-y-1.5 cursor-pointer hover:border-purple-400 transition-colors col-span-1 sm:col-span-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Sliders className="w-3.5 h-3.5 text-purple-500" />
                  <span>Relé de Potencial / Potencia (5-2-1)</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/30">
                  Foto Real
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-13 h-13 rounded-lg bg-black/70 border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <img src={relePotenciaImg} alt="Relé de Potencia" className="max-h-full max-w-full object-contain" />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bobina voltimétrica entre <strong>5 (Común)</strong> y <strong>2 (Arranque S)</strong>. Contacto NC <strong>1-2</strong> conmuta el condensador de arranque por fuerza contraelectromotriz (f.c.e.m. &gt;340V).
                </p>
              </div>
              <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1 pt-0.5">
                <span>Ver foto real y terminales 5-2-1-4-6 →</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Selected Circuit Technical Breakdown Card */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111624] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 mt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-tiny font-mono font-bold text-slate-500 uppercase tracking-wider">
              Detalles Técnicos: {currentCircuitData.name}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30">
            {currentCircuitData.par}
          </span>
        </div>

        <p className="text-tiny leading-relaxed text-slate-700 dark:text-slate-300">
          {currentCircuitData.detalles}
        </p>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
          <div>
            <span className="text-slate-500 block">Capacidad Típica:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {currentCircuitData.capacidadRecomendada}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Aplicación Habitual:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {currentCircuitData.aplicaciones}
            </span>
          </div>
        </div>
      </div>

      {/* Shortcut to Workshop Bench (Direct Start) */}
      {onNavigateToDirectStart && (
        <button
          type="button"
          onClick={onNavigateToDirectStart}
          className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 bg-slate-50 dark:bg-slate-900/80 text-tiny font-bold flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Wrench className="w-3.5 h-3.5 text-amber-500" />
          <span>Probar en Banco de Taller (Arranque Directo con Pulsador)</span>
        </button>
      )}
    </div>
  );
};
