import React, { useState } from 'react';
import {
  Camera,
  Wrench,
  ZoomIn,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Flame,
  Radio,
  Sparkles,
  Cpu,
  Clock,
  Gauge,
  Sliders,
  Maximize2,
  Info,
} from 'lucide-react';
import {
  ComponentPhotoType,
  COMPONENT_PHOTOS_DATA,
} from './ComponentPhotoViewerModal';
import { ZoomPanViewer } from './ZoomPanViewer';
import { KlixonTestSvg } from './KlixonTestSvg';
import { AmperometricRelayTestSvg } from './AmperometricRelayTestSvg';
import { OfficialPotentialRelaySvg } from './OfficialPotentialRelaySvg';

interface ComponentsTabBenchViewerProps {
  selectedComponent: ComponentPhotoType;
  onSelectComponent: (comp: ComponentPhotoType) => void;
  viewMode: 'photo' | 'bench';
  onChangeViewMode: (mode: 'photo' | 'bench') => void;
  onOpenPhotoModal: (comp: ComponentPhotoType) => void;
}

export const ComponentsTabBenchViewer: React.FC<ComponentsTabBenchViewerProps> = ({
  selectedComponent,
  onSelectComponent,
  viewMode,
  onChangeViewMode,
  onOpenPhotoModal,
}) => {
  const currentData = COMPONENT_PHOTOS_DATA[selectedComponent] || COMPONENT_PHOTOS_DATA.ptc;

  // State for PTC interactive test bench
  const [ptcState, setPtcState] = useState<'cold' | 'hot' | 'cooldown'>('cold');
  const [ptcCooldownSeconds, setPtcCooldownSeconds] = useState<number>(0);

  // State for Capacitor test bench
  const [capTestMode, setCapTestMode] = useState<'capacitance' | 'discharge_resistor' | 'ground_leak'>('capacitance');

  // Trigger PTC cooldown
  const handleTriggerPtcCooldown = () => {
    setPtcState('cooldown');
    setPtcCooldownSeconds(180);
    const interval = setInterval(() => {
      setPtcCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPtcState('cold');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            {selectedComponent === 'ptc' && <Flame className="w-4 h-4" />}
            {selectedComponent === 'klixon' && <Cpu className="w-4 h-4" />}
            {selectedComponent === 'rele_arranque' && <Zap className="w-4 h-4" />}
            {selectedComponent === 'rele_potencia' && <Radio className="w-4 h-4" />}
            {(selectedComponent === 'condensador_marcha' || selectedComponent === 'condensador_arranque') && (
              <Sparkles className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-small font-bold text-white tracking-tight truncate">
                {currentData.title}
              </h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase shrink-0 border ${currentData.badgeColor}`}
              >
                {currentData.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {currentData.subtitle}
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Foto Real HD vs Banco de Ensayo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-tiny font-mono">
            <button
              type="button"
              onClick={() => onChangeViewMode('photo')}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                viewMode === 'photo'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Foto Real HD</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('bench')}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                viewMode === 'bench'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Banco de Ensayo</span>
            </button>
          </div>

          {/* Fullscreen Photo Modal Button */}
          <button
            type="button"
            onClick={() => onOpenPhotoModal(selectedComponent)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="Abrir Fotografía en Pantalla Completa"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative overflow-hidden bg-slate-950/60 flex flex-col">
        {/* MODE 1: FOTO REAL HD CON ZOOM Y ANOTACIONES */}
        {viewMode === 'photo' && (
          <div className="w-full h-full flex flex-col relative">
            <ZoomPanViewer
              className="w-full h-full"
              containerClassName="w-full h-full bg-[#070a11] flex items-center justify-center relative select-none"
              initialZoom={1}
              minZoom={0.8}
              maxZoom={3.0}
              showToolbar={true}
              toolbarPosition="top-right"
            >
              <div className="relative flex flex-col items-center justify-center p-4">
                <div className="relative group inline-block max-w-[420px] max-h-[380px] rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 bg-black/40">
                  <img
                    src={currentData.imgSrc}
                    alt={currentData.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = currentData.fallbackSrc;
                    }}
                    className="max-h-[360px] w-auto object-contain mx-auto transition-transform duration-300"
                  />

                  {/* Terminal annotations badge overlay */}
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2 text-tiny font-sans text-slate-200 shadow-lg pointer-events-none">
                    <div className="flex items-center justify-between text-amber-400 font-mono font-bold mb-0.5">
                      <span className="flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Bornes / Terminales:
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">Identificación de Taller</span>
                    </div>
                    <div className="text-[11px] leading-tight text-slate-300 font-mono">
                      {currentData.bornes}
                    </div>
                  </div>
                </div>
              </div>
            </ZoomPanViewer>

            {/* Bottom info strip in photo mode */}
            <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 text-tiny text-slate-400 flex items-center justify-between shrink-0 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Fotografía Real de Banco • Haz doble clic o usa la rueda para Zoom
              </span>
              <button
                type="button"
                onClick={() => onOpenPhotoModal(selectedComponent)}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ZoomIn className="w-3 h-3" />
                <span>Zoom Detallado</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: BANCO DE ENSAYO INTERACTIVO DE TALLER */}
        {viewMode === 'bench' && (
          <div className="w-full h-full flex flex-col overflow-hidden">
            {/* 1. KLIXON: Interactive bench test with multimeter */}
            {selectedComponent === 'klixon' && (
              <div className="w-full h-full overflow-hidden flex flex-col">
                <KlixonTestSvg className="w-full h-full flex-1" />
              </div>
            )}

            {/* 2. RELÉ DE INTENSIDAD: Interactive bench test (Right-side up vs Inverted) */}
            {selectedComponent === 'rele_arranque' && (
              <div className="w-full h-full overflow-hidden flex flex-col">
                <AmperometricRelayTestSvg className="w-full h-full flex-1" />
              </div>
            )}

            {/* 3. RELÉ DE POTENCIAL 5-2-1: Interactive schematic test */}
            {selectedComponent === 'rele_potencia' && (
              <div className="w-full h-full overflow-hidden flex flex-col p-2 bg-[#080d1a]">
                <div className="flex items-center justify-between px-2 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-tiny font-mono mb-2 shrink-0">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    Ensayo del Relé de Potencial 5-2-1 (Bobina f.c.e.m. & Contacto 1-2 NC)
                  </span>
                  <span className="text-slate-400">
                    Bobina 5-2: &gt;340V AC • Contacto 1-2: NC
                  </span>
                </div>
                <div className="flex-1 min-h-0 flex items-center justify-center">
                  <OfficialPotentialRelaySvg
                    mode="both"
                    visualStyle="dynamic"
                    simState="running"
                    fcemVoltage={365}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* 4. TERMISTOR PTC: Interactive thermal test bench */}
            {selectedComponent === 'ptc' && (
              <div className="w-full h-full p-4 overflow-y-auto flex flex-col justify-between bg-slate-950 font-sans">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h4 className="text-small font-bold text-white flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-500" />
                        Comprobación del Termistor Cerámico PTC
                      </h4>
                      <p className="text-tiny text-slate-400">
                        Ensayo de resistencia en frío vs estado bloqueado por calentamiento Joule (&gt;120 °C)
                      </p>
                    </div>

                    <span
                      className={`text-tiny font-mono px-2.5 py-1 rounded-md font-bold uppercase border ${
                        ptcState === 'cold'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : ptcState === 'hot'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}
                    >
                      {ptcState === 'cold' && 'En Frío (Reposo)'}
                      {ptcState === 'hot' && 'Disparado (Caliente)'}
                      {ptcState === 'cooldown' && `Enfriando (${ptcCooldownSeconds}s)`}
                    </span>
                  </div>

                  {/* Visual Bench with Multimeter Simulation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                    {/* Visual Disk Graphic */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div
                        className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-700 shadow-2xl relative ${
                          ptcState === 'cold'
                            ? 'bg-slate-800 border-sky-400 text-sky-300 shadow-sky-500/20'
                            : ptcState === 'hot'
                            ? 'bg-amber-950/80 border-rose-500 text-rose-400 shadow-red-500/40 animate-pulse'
                            : 'bg-amber-900/40 border-amber-400 text-amber-300'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <Flame className="w-6 h-6 mb-1" />
                          <span className="text-xs font-mono font-bold">
                            {ptcState === 'cold' ? '25 °C' : ptcState === 'hot' ? '135 °C' : '65 °C'}
                          </span>
                        </div>
                      </div>
                      <span className="text-tiny font-mono text-slate-300 mt-2 font-bold">
                        Pastilla Cerámica BaTiO₃
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {ptcState === 'cold'
                          ? 'Conducción plena a devanado de arranque'
                          : 'Alta resistencia: corriente residual <15mA'}
                      </span>
                    </div>

                    {/* Multimeter Reading Card */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                      <span className="text-tiny font-mono text-slate-400 font-bold uppercase">
                        Lectura de Polímetro (Ohmios Ω):
                      </span>
                      <div className="py-2">
                        <div className="font-mono text-2xl sm:text-3xl font-bold tracking-wider text-amber-400 bg-black/60 px-3 py-2 rounded-lg border border-slate-700 text-right">
                          {ptcState === 'cold' ? '18.4 Ω' : ptcState === 'hot' ? '14.8 kΩ' : '1.2 kΩ'}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                          <span>Rango: 200 Ω / 20 kΩ</span>
                          <span className={ptcState === 'cold' ? 'text-emerald-400' : 'text-amber-400'}>
                            {ptcState === 'cold' ? '● Continuidad OK' : '▲ Resistencia Bloqueo'}
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>PTC Correcta en frío: <strong>12 Ω a 35 Ω</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>PTC Averiada: Abierta (OL) o quemada en pedazos</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPtcState('cold')}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-mono text-tiny font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        ptcState === 'cold'
                          ? 'bg-emerald-500 text-black shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Simular En Frío (25°C - 18Ω)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPtcState('hot')}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-mono text-tiny font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        ptcState === 'hot'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Simular Calentado (Disparo &gt;10kΩ)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTriggerPtcCooldown}
                      className="py-1.5 px-3 rounded-lg font-mono text-tiny font-bold flex items-center justify-center gap-1.5 cursor-pointer bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Simular Enfriamiento (3 a 5 min)</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Nota de Taller:</strong> Si el compresor intenta arrancar inmediatamente tras un corte de luz antes de 3 minutos, la PTC seguirá caliente y el compresor no arrancará, disparando el Klixon por sobrecorriente.
                  </p>
                </div>
              </div>
            )}

            {/* 5 & 6. CONDENSADORES (MARCHA Y ARRANQUE): Interactive bench */}
            {(selectedComponent === 'condensador_marcha' || selectedComponent === 'condensador_arranque') && (
              <div className="w-full h-full p-4 overflow-y-auto flex flex-col justify-between bg-slate-950 font-sans">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h4 className="text-small font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Comprobación del {selectedComponent === 'condensador_marcha' ? 'Condensador de Marcha' : 'Condensador de Arranque'}
                      </h4>
                      <p className="text-tiny text-slate-400">
                        {selectedComponent === 'condensador_marcha'
                          ? 'Polipropileno metalizado autorregenerable • Servicio Continuo (450 V AC)'
                          : 'Electrolítico no polarizado con resistencia de descarga • Servicio Intermitente (330 V AC)'}
                      </p>
                    </div>
                  </div>

                  {/* Mode Selector for Capacitor Test */}
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 text-tiny font-mono">
                    <button
                      type="button"
                      onClick={() => setCapTestMode('capacitance')}
                      className={`flex-1 py-1 px-2 rounded font-bold cursor-pointer transition-all ${
                        capTestMode === 'capacitance'
                          ? 'bg-amber-400 text-black shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      1. Capacidad (µF)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCapTestMode('discharge_resistor')}
                      className={`flex-1 py-1 px-2 rounded font-bold cursor-pointer transition-all ${
                        capTestMode === 'discharge_resistor'
                          ? 'bg-amber-400 text-black shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      2. Resistencia Descarga
                    </button>
                    <button
                      type="button"
                      onClick={() => setCapTestMode('ground_leak')}
                      className={`flex-1 py-1 px-2 rounded font-bold cursor-pointer transition-all ${
                        capTestMode === 'ground_leak'
                          ? 'bg-amber-400 text-black shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      3. Fuga a Carcasa
                    </button>
                  </div>

                  {/* Test Box Simulation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                      <span className="text-tiny font-mono text-slate-400 font-bold uppercase">
                        Valor Medido en Pantalla:
                      </span>
                      <div className="py-2">
                        <div className="font-mono text-2xl sm:text-3xl font-bold tracking-wider text-amber-400 bg-black/60 px-3 py-2 rounded-lg border border-slate-700 text-right">
                          {capTestMode === 'capacitance'
                            ? selectedComponent === 'condensador_marcha'
                              ? '19.8 µF'
                              : '78.5 µF'
                            : capTestMode === 'discharge_resistor'
                            ? selectedComponent === 'condensador_marcha'
                              ? 'OL (Sin resist.)'
                              : '15.2 kΩ (Purga OK)'
                            : 'OL (&gt;500 MΩ OK)'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1.5 font-mono flex items-center justify-between">
                          <span>
                            {capTestMode === 'capacitance'
                              ? 'Nominal: ' + (selectedComponent === 'condensador_marcha' ? '20 µF ±5%' : '80 µF ±10%')
                              : capTestMode === 'discharge_resistor'
                              ? 'Resistencia de purga de seguridad'
                              : 'Aislamiento Dieléctrico'}
                          </span>
                          <span className="text-emerald-400 font-bold">● Apto para servicio</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Tolerancia admisible: ±5% en Marcha, ±10% en Arranque</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-tiny text-slate-300">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-400" />
                        Instrucciones de Taller:
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-400">
                        {capTestMode === 'capacitance' &&
                          'Desconectar siempre los terminales del condensador antes de medir. Conectar las puntas del capacímetro. Si la capacitancia cae más de un 10%, el par se reducirá drásticamente y el compresor no podrá arrancar.'}
                        {capTestMode === 'discharge_resistor' &&
                          'Los condensadores de arranque electrolíticos incorporan una resistencia de 15 a 20 kΩ entre sus terminales para descargar la energía acumulada y evitar chispazos que fundan los contactos del relé.'}
                        {capTestMode === 'ground_leak' &&
                          'Comprobar con óhmetro en escala de megaohmios entre cada borne y la carcasa metálica del condensador. La lectura debe ser infinito (OL). Cualquier valor medible indica derivación interna peligrosa.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Seguridad Eléctrica:</strong> Descargar siempre el condensador con una resistencia de 1 kΩ 5W o bombilla incandescente antes de manipular los terminales para evitar descargas de hasta 400V.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
