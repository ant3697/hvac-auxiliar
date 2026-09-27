import React, { useState, useEffect } from 'react';
import {
  Play,
  AlertTriangle,
  RefreshCw,
  Zap,
  Radio,
  Gauge,
  Layers,
  Info,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Eye,
  Sliders,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import {
  OfficialPotentialRelaySvg,
  PotentialRelaySvgMode,
  PotentialRelayVisualStyle,
} from './OfficialPotentialRelaySvg';
import { playFaultAcousticSound, startCompressorHum, stopCompressorHum } from '../utils/audio';

export type PotentialRelayCircuitType = 'both' | 'csir' | 'csr';

interface PotentialRelaySchematicSheetProps {
  onOpenModal?: (variant: 'CSIR_POTENTIAL' | 'CSR_POTENTIAL') => void;
}

export const PotentialRelaySchematicSheet: React.FC<PotentialRelaySchematicSheetProps> = () => {
  const [circuitMode, setCircuitMode] = useState<PotentialRelaySvgMode>('both');
  const [visualStyle, setVisualStyle] = useState<PotentialRelayVisualStyle>('dynamic');
  const [simState, setSimState] = useState<'idle' | 'starting' | 'running' | 'overload'>('idle');
  const [selectedPinInfo, setSelectedPinInfo] = useState<string | null>(null);
  const [fcemVoltage, setFcemVoltage] = useState<number>(0);
  const [lineAmps, setLineAmps] = useState<number>(0);

  // Sound and simulation step timing
  useEffect(() => {
    let timer1: NodeJS.Timeout | null = null;

    if (simState === 'starting') {
      setFcemVoltage(110);
      setLineAmps(16.8);
      startCompressorHum(0.35);

      timer1 = setTimeout(() => {
        // After 1.4 seconds, motor reaches 75% speed -> f.c.e.m. jumps over pick-up voltage (~340V)
        setFcemVoltage(385);
        setLineAmps(3.2);
        setSimState('running');
      }, 1400);
    } else if (simState === 'running') {
      setFcemVoltage(395);
      setLineAmps(3.2);
    } else if (simState === 'overload') {
      stopCompressorHum();
      playFaultAcousticSound('open_klixon');
      setFcemVoltage(0);
      setLineAmps(0);
    } else {
      stopCompressorHum();
      setFcemVoltage(0);
      setLineAmps(0);
    }

    return () => {
      if (timer1) clearTimeout(timer1);
    };
  }, [simState]);

  const handleStart = () => {
    setSimState('starting');
  };

  const handleOverload = () => {
    setSimState('overload');
  };

  const handleReset = () => {
    setSimState('idle');
  };

  // Pin reference documentation for Mars/GE/Supco standard potential relays
  const PIN_DETAILS: Record<string, { name: string; standard: string; connection: string; role: string; test: string }> = {
    '5': {
      name: 'Borne 5 (Bobina voltimétrica - Lado Común)',
      standard: 'Conexión a Línea C1 y Borne Común (C)',
      connection: 'Conectado a la fase de entrada C1 y al borne C del compresor (a través del Klixon).',
      role: 'Punto de referencia común de la bobina del relé. La bobina voltimétrica queda en serie entre 5 y 2, midiendo la tensión que se genera en el bobinado auxiliar S.',
      test: 'Con borne 2: Resistencia alta de bobina (3.000 Ω a 10.000 Ω). Con 1, 4 o 6: Aislamiento (circuito abierto ∞).',
    },
    '2': {
      name: 'Borne 2 (Bobina voltimétrica - Lado Devanado Auxiliar)',
      standard: 'Conexión a Borne S (Arranque) y Contacto NC',
      connection: 'Conectado directamente al borne S del compresor y al contacto interno del relé.',
      role: 'Recibe la fuerza contraelectromotriz (f.c.e.m.) generada por la bobina de arranque cuando el rotor gira. En CSR, también recibe la salida del condensador de marcha permanente.',
      test: 'Con borne 1: Continuidad 0 Ω (NC en reposo). Con borne 5: Resistencia de bobina (3.000 Ω a 10.000 Ω).',
    },
    '1': {
      name: 'Borne 1 (Contacto Normalmente Cerrado - Salida a Condensador de Arranque)',
      standard: 'Conexión exclusiva al Condensador de Arranque',
      connection: 'Conectado a un extremo del condensador electrolítico de arranque.',
      role: 'El contacto normalmente cerrado (NC) se encuentra entre los bornes 1 y 2. En reposo y arranque conduce. Al activarse la bobina 5-2 por f.c.e.m. (> 340V), el contacto se abre y aísla el condensador de arranque.',
      test: 'Con borne 2 en reposo: 0 Ω. Si da abierto (∞) en reposo, el relé está roto (contacto fogueado o quemado).',
    },
    '4': {
      name: 'Borne 4 (Borne Ciego / Neutro de Conexión y Condensadores)',
      standard: 'Entrada C2, Marcha (R) y Condensadores',
      connection: 'Conectado a la línea de alimentación C2, al borne R de marcha y al otro extremo de los condensadores.',
      role: 'Actúa como punto de empalme o puente sin conexión eléctrica interna a la bobina del relé. Es el punto común de alimentación de los condensadores.',
      test: 'Con cualquier otro borne (1, 2, 5, 6): Aislamiento total (circuito abierto ∞).',
    },
    '6': {
      name: 'Borne 6 (Borne Auxiliar / Ciego)',
      standard: 'Sin conexión eléctrica interna (Libre)',
      connection: 'Libre o utilizado por técnicos como regleta de unión auxiliar para resistencias de descarga.',
      role: 'Terminal ficticio de soporte mecánico en el chasis del relé. No interviene eléctricamente en el funcionamiento interno.',
      test: 'Con cualquier otro borne: Aislamiento total (circuito abierto ∞).',
    },
  };

  return (
    <div className="space-y-4 font-sans text-slate-800 dark:text-slate-100">
      {/* 1. TOP SIMULATION & CONTROLS TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-100 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-tiny font-mono font-bold text-purple-600 dark:text-purple-400 uppercase flex items-center gap-1">
            <Radio className="w-3.5 h-3.5" />
            Simulador de Relé de Potencial:
          </span>

          <button
            type="button"
            onClick={handleStart}
            disabled={simState === 'starting'}
            className="px-3 py-1 rounded text-tiny font-bold bg-amber-400 text-black hover:bg-amber-300 transition-colors flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{simState === 'starting' ? 'Arrancando...' : 'Arrancar'}</span>
          </button>

          <button
            type="button"
            onClick={handleOverload}
            className="px-2.5 py-1 rounded text-tiny font-bold bg-rose-600/15 border border-rose-500 text-rose-600 dark:text-rose-400 hover:bg-rose-600/25 transition-colors flex items-center gap-1 cursor-pointer"
            title="Disparo térmico del Klixon en serie con el borne Común (C)"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Corte Klixon</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-300 dark:border-slate-700 cursor-pointer"
            title="Restablecer circuito a reposo"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Live Gauges: FCEM & Line Status */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-tiny font-mono">
          {/* FCEM Gauge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300">
            <Gauge className="w-3.5 h-3.5 text-purple-500" />
            <span>
              f.c.e.m. (Bornes 5-2):{' '}
              <strong className="text-purple-600 dark:text-purple-300 font-bold">
                {fcemVoltage} V
              </strong>
            </span>
          </div>

          {/* Contact 1-2 state */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
            <span>Contacto 1-2:</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                simState === 'running'
                  ? 'bg-rose-500 text-white'
                  : simState === 'starting'
                  ? 'bg-amber-400 text-black animate-pulse'
                  : simState === 'overload'
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {simState === 'running' ? 'ABIERTO (Despegue f.c.e.m.)' : 'CERRADO (NC)'}
            </span>
          </div>

          {/* Motor Line Status */}
          <div
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
              simState === 'idle'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                : simState === 'starting'
                ? 'bg-amber-400 text-black animate-pulse'
                : simState === 'running'
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {simState === 'idle' && '⚪ REPOSO'}
            {simState === 'starting' && '⚡ ARRANQUE (PICO)'}
            {simState === 'running' && '🟢 MARCHA NOMINAL'}
            {simState === 'overload' && '🔴 KLIXON ABIERTO'}
          </div>
        </div>
      </div>

      {/* 2. CIRCUIT SELECTOR & VISUAL STYLE SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {/* Layout Tabs */}
        <div className="flex items-center gap-1 text-tiny font-mono flex-wrap">
          <button
            type="button"
            onClick={() => setCircuitMode('both')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
              circuitMode === 'both'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60'
            }`}
          >
            Ver Lámina Completa (800×1000)
          </button>
          <button
            type="button"
            onClick={() => setCircuitMode('csir')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
              circuitMode === 'csir'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60'
            }`}
          >
            1. CSIR (Superior)
          </button>
          <button
            type="button"
            onClick={() => setCircuitMode('csr')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
              circuitMode === 'csr'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60'
            }`}
          >
            2. CSR (Inferior)
          </button>
        </div>

        {/* Visual Style Selector & Pin Hint */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setVisualStyle('dynamic')}
              className={`px-2.5 py-1 rounded-md transition-all font-bold flex items-center gap-1 cursor-pointer ${
                visualStyle === 'dynamic'
                  ? 'bg-white dark:bg-purple-600 text-purple-700 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-500 dark:text-white" />
              <span>Modo Dinámico</span>
            </button>
            <button
              type="button"
              onClick={() => setVisualStyle('technical')}
              className={`px-2.5 py-1 rounded-md transition-all font-bold flex items-center gap-1 cursor-pointer ${
                visualStyle === 'technical'
                  ? 'bg-white dark:bg-purple-600 text-purple-700 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3 text-slate-500 dark:text-white" />
              <span>Plano Vectorial Puro</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:flex items-center gap-1 font-mono">
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>Clic en bornes 5, 2, 1, 4, 6</span>
          </div>
        </div>
      </div>

      {/* 3. PIN INFO BANNER IF CLICKED */}
      {selectedPinInfo && PIN_DETAILS[selectedPinInfo] && (
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/50 flex items-start justify-between gap-3 text-xs text-purple-100 animate-in fade-in duration-200 shadow-md">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center font-mono text-sm shadow-sm">
                {selectedPinInfo}
              </span>
              <strong className="text-sm font-bold text-white">
                {PIN_DETAILS[selectedPinInfo].name}
              </strong>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 border border-purple-500/40">
                {PIN_DETAILS[selectedPinInfo].standard}
              </span>
            </div>
            <p className="text-[11px] text-purple-200">
              <strong>Conexión:</strong> {PIN_DETAILS[selectedPinInfo].connection}
            </p>
            <p className="text-[11px] text-purple-300/90">
              <strong>Función técnica:</strong> {PIN_DETAILS[selectedPinInfo].role}
            </p>
            <p className="text-[11px] text-amber-200 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/30 font-mono">
              <strong>Comprobación con Polímetro:</strong> {PIN_DETAILS[selectedPinInfo].test}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPinInfo(null)}
            className="text-purple-300 hover:text-white font-bold text-xs px-2.5 py-1 rounded bg-purple-900/50 hover:bg-purple-800 cursor-pointer"
          >
            Cerrar ✕
          </button>
        </div>
      )}

      {/* 4. OFFICIAL SVG DIAGRAM DISPLAY */}
      <div className="p-3 sm:p-5 rounded-2xl bg-white dark:bg-[#070b13] border-2 border-purple-500/40 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Esquemas Oficiales del Relé de Potencial (CSIR / CSR)
              </h3>
              <span className="text-tiny font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30">
                ViewBox 800×1000 Oficial
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Representación vectorial exacta según la normativa de refrigeración. Haz clic en los bornes (1, 2, 4, 5, 6) para inspeccionar la conexión interna y el diagnóstico con multímetro.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>Bornes normalizados Mars / Supco / GE</span>
          </div>
        </div>

        {/* SVG Container */}
        <div className="bg-slate-50 dark:bg-[#03060c] rounded-xl p-2 sm:p-4 border border-slate-200 dark:border-slate-800/80 overflow-x-auto flex justify-center">
          <OfficialPotentialRelaySvg
            mode={circuitMode}
            visualStyle={visualStyle}
            simState={simState}
            fcemVoltage={fcemVoltage}
            selectedPin={selectedPinInfo}
            onSelectPin={(pin) => setSelectedPinInfo(pin)}
          />
        </div>
      </div>

      {/* 5. DEDICATED YOUTUBE VIDEO & PEDAGOGICAL BREAKDOWN SECTION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        {/* Banner with YouTube reference link */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-500/30">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Vídeo Técnico de Referencia: Funcionamiento del Relé de Potencial
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Aprende el comportamiento del relé voltimétrico, la f.c.e.m., el contacto NC y los bornes 5-2-1-4-6.
              </p>
            </div>
          </div>

          <a
            href="https://www.youtube.com/watch?v=EwoHs4G8PgA&t=2s"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <span>Ver Vídeo en YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Cards explaining the video teachings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Card 1: Por qué es un relé de potencial */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400">
              <Radio className="w-4 h-4" />
              <span>1. Relé Voltimétrico (Tensión)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              A diferencia del relé amperimétrico (que actúa por la alta intensidad de la bobina de marcha), el relé de potencial tiene una <strong>bobina de alta impedancia</strong> (miles de espiras de hilo muy fino) conectada en paralelo con la bobina de arranque (entre bornes <strong>5 y 2</strong>).
            </p>
            <div className="p-1.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 font-mono text-[10px]">
              Bobina: ~3.000 Ω a 10.000 Ω
            </div>
          </div>

          {/* Card 2: f.c.e.m. */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
              <Gauge className="w-4 h-4" />
              <span>2. Fuerza Contraelectromotriz</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              Al alcanzar el 75-80% de velocidad nominal, el devanado auxiliar corta el campo magnético del rotor y <strong>funciona como generador</strong>, induciendo un voltaje que supera la tensión de red: ¡puede llegar a <strong>350V – 420V AC</strong> entre bornes 5 y 2!
            </p>
            <div className="p-1.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-mono text-[10px]">
              Tensión de Despegue: &gt; 340V AC
            </div>
          </div>

          {/* Card 3: Contacto 1-2 NC */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
              <Zap className="w-4 h-4" />
              <span>3. Contacto 1-2 (NC)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              El contacto entre los bornes <strong>1 y 2</strong> es <strong>Normalmente Cerrado (NC)</strong>. En el arranque deja pasar la corriente hacia el condensador de arranque. Cuando la f.c.e.m. excita la bobina 5-2, el contacto <strong>se abre</strong> y desconecta el condensador.
            </p>
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono text-[10px]">
              En reposo: 0 Ω (Contacto Cerrado)
            </div>
          </div>

          {/* Card 4: CSIR vs CSR */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
              <Layers className="w-4 h-4" />
              <span>4. CSIR vs CSR</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              En <strong>CSIR</strong>, al abrirse 1-2 la bobina de arranque solo genera f.c.e.m. En <strong>CSR</strong>, el <strong>condensador de marcha permanente</strong> va conectado directo entre el borne 4 (C2) y el borne 2 (S), manteniendo corriente activa a 90° con cos φ ≈ 0.98.
            </p>
            <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
              CSR: C. Marcha directo a borne 2
            </div>
          </div>
        </div>

        {/* Diagnostic Guide for Multimeter Testing */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span>Guía Rápida de Comprobación con Polímetro en Taller (según el Vídeo)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-amber-600 dark:text-amber-400">Paso 1 (Bornes 1 y 2):</span>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Debe dar <strong>continuidad (0 Ω)</strong>. Si marca infinito (∞), los contactos internos están quemados o abiertos mecánicamente.
              </p>
            </div>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-purple-600 dark:text-purple-400">Paso 2 (Bornes 5 y 2):</span>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Debe medir la <strong>bobina voltimétrica (3.000 Ω a 10.000 Ω)</strong>. Si da 0 Ω está en corto; si da ∞ está cortada.
              </p>
            </div>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Paso 3 (Bornes 4 y 6):</span>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Son bornes de amarre sin conexión a la bobina. La medida hacia cualquier otro borne debe ser <strong>circuito abierto (∞)</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
