import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  Zap,
  Layers,
  Sparkles,
  BookOpen,
  Search,
  Radio,
  Gauge,
  HelpCircle,
  ChevronRight,
  Info,
  Sliders,
  ZoomIn,
  Camera,
} from 'lucide-react';
import { StartingComponentSelector } from './StartingComponentSelector';
import { ComponentPhotoViewerModal, ComponentPhotoType } from './ComponentPhotoViewerModal';

import ptcImg from '../assets/ptc.png';
import klixonImg from '../assets/klixon.png';
import releArranqueImg from '../assets/rele_arranque.png';
import relePotenciaImg from '../assets/rele_potencia.png';
import condensadorMarchaImg from '../assets/condensador_marcha.jpg';
import condensadorArranqueImg from '../assets/condensador_arranque.png';

export type ComponentCategoryTab = 'all' | 'selector' | 'ptc' | 'klixon' | 'rele' | 'capacitors' | 'potencial';

interface ComponentsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ComponentCategoryTab;
}

export const ComponentsInfoModal: React.FC<ComponentsInfoModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<ComponentCategoryTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [photoModalComponent, setPhotoModalComponent] = useState<ComponentPhotoType>('klixon');

  const handleOpenPhoto = (comp: ComponentPhotoType) => {
    setPhotoModalComponent(comp);
    setIsPhotoModalOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Guía Técnica de Componentes de Arranque
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono font-medium hidden sm:inline-block">
                  Compresores Herméticos
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Parámetros de trabajo, tiempos de rearme, principios físicos y métodos de diagnóstico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector & Filter Bar */}
        <div className="px-4 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar py-0.5 max-w-full">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Todos los componentes
            </button>
            <button
              onClick={() => setActiveTab('selector')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'selector'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Selector de Componentes (Tablas Oficiales)</span>
            </button>
            <button
              onClick={() => setActiveTab('ptc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ptc'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-sky-400 hover:text-sky-300 hover:bg-sky-950/40'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>PTC y Rearme (3-5 min)</span>
            </button>
            <button
              onClick={() => setActiveTab('klixon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'klixon'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Klixon (Protector Térmico)</span>
            </button>
            <button
              onClick={() => setActiveTab('rele')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'rele'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Relé de Intensidad</span>
            </button>
            <button
              onClick={() => setActiveTab('capacitors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'capacitors'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Condensadores</span>
            </button>
            <button
              onClick={() => setActiveTab('potencial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'potencial'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-purple-400 hover:text-purple-300 hover:bg-purple-950/40'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Relé de Potencial</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed custom-scrollbar">

          {/* ========================================================================= */}
          {/* SECCIÓN 0: SELECTOR DE COMPONENTES SEGÚN TABLAS OFICIALES                 */}
          {/* ========================================================================= */}
          {activeTab === 'selector' && (
            <div className="space-y-4">
              <StartingComponentSelector />
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECCIÓN 1: TERMISTOR PTC Y TIEMPO DE REARME (INFORMACIÓN DEL BOTÓN "i")  */}
          {/* ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'ptc') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-sky-500/40 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      Termistor PTC de Estado Sólido
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
                        LST • Estado Sólido
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Pastilla cerámica semiconductora de Coeficiente de Temperatura Positivo (PTC)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPhoto('ptc')}
                    className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver Fotografía Real</span>
                  </button>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Tiempo de rearme: 3 a 5 min</span>
                  </span>
                </div>
              </div>

              {/* FOTOGRAFÍA REAL DE TALLER DEL RELÉ PTC */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-xl bg-slate-900/80 border border-sky-500/30">
                <div
                  onClick={() => handleOpenPhoto('ptc')}
                  className="relative group w-full sm:w-48 h-36 rounded-lg bg-black/60 border border-slate-700/80 overflow-hidden flex items-center justify-center cursor-pointer shrink-0"
                  title="Pulsar para ampliar fotografía en alta resolución"
                >
                  <img
                    src={ptcImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/ptc.png';
                    }}
                    alt="Fotografía del Relé de Arranque PTC"
                    className="max-h-full max-w-full object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                    <ZoomIn className="w-4 h-4 text-amber-400" />
                    <span>Ampliar</span>
                  </div>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-sky-300 border border-sky-500/40">
                    Fotografía Real
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 flex-1">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-sky-400" />
                    <strong className="text-white">Fotografía Real de Taller: Relé de Arranque PTC (Estado Sólido)</strong>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Montado directamente sobre la placa de bornas conectando la fase al borne <strong>S (Arranque)</strong>. Aloja una pastilla cerámica semiconductora de titanato de bario que en frío conduce (<strong>15 a 25 Ω</strong>) y en marcha se autocalienta (&gt;110°C–130°C) bloqueando el paso de corriente al bobinado auxiliar sin contactos mecánicos ni chispas.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenPhoto('ptc')}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-400 hover:text-sky-300 cursor-pointer pt-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Inspeccionar fotografía en alta definición con zoom y polímetro →</span>
                  </button>
                </div>
              </div>

              {/* BANNER DESTACADO DE REARME (Contenido que mostraba el botón "i") */}
              <div className="p-4 rounded-xl bg-sky-950/50 border border-sky-500/50 space-y-2">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sky-200 text-xs sm:text-sm">
                      ¿Por qué un compresor con PTC requiere de 3 a 5 minutos entre paradas?
                    </h4>
                    <p className="text-xs text-sky-300/90 mt-1">
                      En reposo a temperatura ambiente (20°C–25°C), la pastilla cerámica PTC necesita obligatoriamente entre 3 y 5 minutos para disipar el calor acumulado y descender de su <strong>temperatura de Curie (~70°C)</strong>, recuperando su baja resistencia inicial para permitir el próximo arranque.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 PUNTOS TÉCNICOS EXHAUSTIVOS DE LA INFORMACIÓN PTC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 1. Disipación Térmica Natural */}
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-1.5">
                  <h5 className="font-bold text-white flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                    1. Disipación térmica natural (convección pasiva)
                  </h5>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Durante el funcionamiento normal del compresor, la pastilla de titanato de bario permanece auto-calentada a más de <strong>110°C – 130°C</strong> para mantenerse en alta resistencia (&gt;10.000 Ω) y aislar el devanado auxiliar (S). Al apagarse el motor, está confinada en su encapsulado plástico sin ventilación forzada y se enfría lentamente por convección pasiva.
                  </p>
                </div>

                {/* 2. Temperatura de Curie */}
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-1.5">
                  <h5 className="font-bold text-white flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    2. Descenso por debajo de la temperatura de Curie (~70°C)
                  </h5>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Para que la PTC vuelva a conducir la elevada corriente de arranque (10 a 15 A), su temperatura interna debe descender por debajo de su punto de Curie. Al bajar de aprox. <strong>70°C</strong>, su resistencia se desploma de forma abrupta a su valor en frío (<strong>15 a 25 Ω</strong>), permitiendo de nuevo el paso de corriente al devanado de arranque.
                  </p>
                </div>

                {/* 3. Microcortes de Luz */}
                <div className="p-3.5 rounded-xl bg-rose-950/25 border border-rose-800/50 space-y-1.5">
                  <h5 className="font-bold text-rose-200 flex items-center gap-2 text-xs">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    3. ¿Qué ocurre ante un microcorte de luz (5 a 15 segundos)?
                  </h5>
                  <p className="text-[11px] text-rose-200/90 leading-relaxed">
                    Si la tensión se corta unos segundos e inmediatamente regresa:
                  </p>
                  <ul className="text-[11px] text-rose-200/80 pl-4 list-disc space-y-0.5">
                    <li>La pastilla PTC aún sigue caliente (&gt;100°C) y en alta resistencia.</li>
                    <li>Al no circular corriente por S, el motor carece de par motriz y queda con el rotor bloqueado.</li>
                    <li>El devanado principal absorbe corriente de rotor bloqueado (<em>LRA ≈ 16.5 A</em>).</li>
                    <li>A los 3 a 8 segundos, el <strong>protector Klixon</strong> corta por sobrecorriente para evitar quemar el motor.</li>
                  </ul>
                </div>

                {/* 4. Retardo Anti-Reciclo */}
                <div className="p-3.5 rounded-xl bg-amber-950/25 border border-amber-800/50 space-y-1.5">
                  <h5 className="font-bold text-amber-200 flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    4. Aplicación práctica: Parámetro anti-reciclo en termostatos
                  </h5>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    Por este motivo, los controladores digitales (Carel, Dixell, Eliwell, AKO, etc.) se programan con un <strong>retardo mínimo de parada de 3 a 5 minutos</strong>:
                  </p>
                  <ul className="text-[11px] text-amber-200/80 pl-4 list-disc space-y-0.5">
                    <li>Garantiza el enfriamiento y rearme total de la pastilla PTC a baja resistencia.</li>
                    <li>Permite la igualación completa de presiones alta/baja a través del capilar (esencial en sistemas LST).</li>
                  </ul>
                </div>
              </div>

              {/* Valores de Comprobación y Medidas con Multímetro */}
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-sky-400" />
                  <strong className="text-white">Valores de prueba con polímetro:</strong>
                </div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400">
                    En frío (25°C): 15 – 25 Ω (OK)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-rose-400">
                    En caliente (120°C): &gt;10.000 Ω (Aislado)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">
                    Avería típica: Pastilla cuarteada (OL / Circuito abierto)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECCIÓN 2: PROTECTOR TÉRMICO DE MOTOR (KLIXON)                           */}
          {/* ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'klixon') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-rose-500/40 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      Protector Térmico de Motor (Klixon)
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                        Seguridad Bimetálica
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Conectado estrictamente en serie con el borne <strong>C (Común)</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPhoto('klixon')}
                    className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver Fotografía Real</span>
                  </button>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 hidden sm:inline-block">
                    Doble protección: A + Tª
                  </span>
                </div>
              </div>

              {/* FOTOGRAFÍA REAL DE TALLER DEL KLIXON */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/30">
                <div
                  onClick={() => handleOpenPhoto('klixon')}
                  className="relative group w-full sm:w-48 h-36 rounded-lg bg-black/60 border border-slate-700/80 overflow-hidden flex items-center justify-center cursor-pointer shrink-0"
                  title="Pulsar para ampliar fotografía en alta resolución"
                >
                  <img
                    src={klixonImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/klixon.png';
                    }}
                    alt="Fotografía del Protector Térmico Klixon"
                    className="max-h-full max-w-full object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                    <ZoomIn className="w-4 h-4 text-amber-400" />
                    <span>Ampliar</span>
                  </div>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-rose-300 border border-rose-500/40">
                    Fotografía Real
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 flex-1">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-rose-400" />
                    <strong className="text-white">Fotografía Real de Taller: Protector Bimetálico Klixon</strong>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Montado sobre la regleta de bornes del compresor. En serie directa con el borne <strong>C (Común)</strong>. Contiene un disco bimetálico calibrado en contacto con la carcasa (&gt;105°C) y una resistencia calefactora de disparo ultra-rápido ante corriente de rotor bloqueado (LRA).
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenPhoto('klixon')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>🔍 Inspeccionar Fotografía y Diagnóstico de Taller →</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-2">
                  <h5 className="font-bold text-white flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    1. ¿Cómo funciona internamente?
                  </h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Consta de una pequeña <strong>resistencia calefactora (Im)</strong> en serie con un <strong>disco bimetálico convexo</strong>. 
                    Por él circula la corriente total absorbida por ambos devanados (marcha y arranque).
                  </p>
                  <ul className="text-slate-300 text-[11px] pl-4 list-disc space-y-1">
                    <li>
                      <strong>Corte por sobreintensidad (LRA):</strong> En rotor bloqueado (~16.5 A), el calefactor se pone al rojo en segundos, dilatando el bimetal que salta (*snap*) abriendo los contactos a 0.00 A.
                    </li>
                    <li>
                      <strong>Corte por sobretemperatura:</strong> Si la carcasa del compresor supera los <strong>105°C – 130°C</strong> (por falta de gas, condensador sucio o alta compresión), el calor externo abre el bimetal aunque el consumo sea nominal.
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-2">
                  <h5 className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    2. Rearme automático y diagnóstico en taller
                  </h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Una vez abierto el contacto, la corriente es <strong>0.00 A</strong>. El bimetal no puede cerrarse de inmediato: necesita que la temperatura descienda hasta aproximadamente <strong>65°C – 80°C</strong> (suele tardar entre 2 y 8 minutos).
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] space-y-1">
                    <div className="font-bold text-amber-300">Comprobación con Polímetro:</div>
                    <div className="text-slate-300">
                      • <strong>En frío:</strong> Continuidad absoluta (<strong>0.0 Ω</strong>). Contacto cerrado OK.<br />
                      • <strong>Avería:</strong> Si en frío marca circuito abierto (OL / infinito), el bimetal está quemado o vencido. Sustituir siempre por uno de idéntica calibración en amperios y temperatura.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECCIÓN 3: RELÉ DE INTENSIDAD ELECTROMECÁNICO                             */}
          {/* ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'rele') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-amber-500/40 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      Relé de Intensidad (Electromecánico)
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                        Bobina Serie en R
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Sistema electromecánico tradicional para arranque RSIR y CSIR
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPhoto('rele_arranque')}
                    className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver Fotografía Real</span>
                  </button>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 hidden sm:inline-block">
                    Desconexión por gravedad
                  </span>
                </div>
              </div>

              {/* FOTOGRAFÍA REAL DE TALLER DEL RELÉ DE INTENSIDAD / ARRANQUE */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30">
                <div
                  onClick={() => handleOpenPhoto('rele_arranque')}
                  className="relative group w-full sm:w-48 h-36 rounded-lg bg-black/60 border border-slate-700/80 overflow-hidden flex items-center justify-center cursor-pointer shrink-0"
                  title="Pulsar para ampliar fotografía en alta resolución"
                >
                  <img
                    src={releArranqueImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/rele_arranque.png';
                    }}
                    alt="Fotografía del Relé de Intensidad / Arranque"
                    className="max-h-full max-w-full object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                    <ZoomIn className="w-4 h-4 text-amber-400" />
                    <span>Ampliar</span>
                  </div>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-amber-300 border border-amber-500/40">
                    Fotografía Real
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 flex-1">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <strong className="text-white">Fotografía Real de Taller: Relé de Arranque (Intensidad)</strong>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Relé electromecánico con bobina de hilo grueso en serie con el borne <strong>R (Marcha)</strong> y contactos Normalmente Abiertos hacia <strong>S (Arranque)</strong>. <em>¡Regla crítica!</em> Requiere montaje en posición vertical estricta <strong>("UP")</strong> para que el émbolo desconecte por gravedad.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenPhoto('rele_arranque')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>🔍 Inspeccionar Fotografía y Regla Vertical UP →</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-2">
                  <h5 className="font-bold text-white flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                    Principio de funcionamiento magnético
                  </h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Su bobina consta de pocas espiras de hilo grueso conectada <strong>en serie con el devanado de Marcha (R)</strong>. Sus contactos normalmente abiertos (NA) van al borne de <strong>Arranque (S)</strong>.
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Al dar corriente, el pico inrush de arranque (4 a 6 × In) genera un campo magnético que levanta con fuerza el émbolo interno hacia arriba, cerrando el contacto hacia S durante <strong>0.5 a 1.5 segundos</strong>.
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Al acelerar el motor a ~2.850 RPM, la corriente cae a su valor nominal; el campo magnético decae y <strong>la gravedad hace caer el émbolo</strong>, desconectando el arranque.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-2">
                  <h5 className="font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    Regla crítica de instalación y fallos comunes
                  </h5>
                  <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/50 text-[11px] text-rose-200 space-y-1">
                    <strong>¡Posición vertical obligatoria ("UP"):</strong> Si el relé se monta inclinado o invertido, el émbolo cae por gravedad cerrando el contacto permanentemente, quemando el bobinado S en segundos.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] space-y-1 text-slate-300">
                    <strong>Diagnóstico con Polímetro:</strong><br />
                    • En posición normal (vertical): Contactos <strong>ABIERTOS (infinito)</strong>.<br />
                    • Al ponerlo boca abajo: El émbolo cae y los contactos deben dar <strong>0 Ω (CERRADO)</strong>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECCIÓN 4: CONDENSADORES (ARRANQUE VS MARCHA)                             */}
          {/* ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'capacitors') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-indigo-500/40 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      Condensador de Arranque vs Condensador de Marcha
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                        Dieléctrico y Régimen
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Diferencias técnicas cruciales entre servicio intermitente y servicio continuo
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Condensador de Arranque */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between font-bold text-amber-300">
                    <span>1. Condensador de Arranque (Start)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">
                      Electrolítico • No Permanente
                    </span>
                  </div>

                  {/* Fotografía de Taller Condensador Arranque */}
                  <div
                    onClick={() => handleOpenPhoto('condensador_arranque')}
                    className="relative group w-full h-44 rounded-lg bg-black/60 border border-amber-500/30 overflow-hidden flex items-center justify-center cursor-pointer"
                    title="Pulsar para ampliar fotografía en alta resolución"
                  >
                    <img
                      src={condensadorArranqueImg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/condensador_arranque.png';
                      }}
                      alt="Condensador de Arranque Electrolítico"
                      className="max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                      <ZoomIn className="w-4 h-4 text-amber-400" />
                      <span>Ampliar Fotografía</span>
                    </div>
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-amber-300 border border-amber-500/40">
                      Fotografía Real
                    </span>
                  </div>

                  <ul className="text-slate-300 text-[11px] space-y-1 list-disc pl-4">
                    <li><strong>Carcasa:</strong> Plástico negro o baquelita con válvula de alivio.</li>
                    <li><strong>Capacidad elevada:</strong> <strong>40 a 160 µF</strong> (proporciona un enorme par de arranque, ideal para sistemas HST con válvula de expansión).</li>
                    <li><strong>Tiempo de trabajo:</strong> Máximo <strong>3 segundos</strong> por arranque. Si el relé no abre, el electrolito hierve y estalla la válvula de seguridad.</li>
                    <li><strong>Resistencia de descarga:</strong> Suele llevar una resistencia de <strong>15 a 47 kΩ / 2W</strong> en paralelo para evacuar la carga y evitar arcos que fundan los contactos del relé.</li>
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleOpenPhoto('condensador_arranque')}
                    className="w-full py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver Detalles de Condensador de Arranque</span>
                  </button>
                </div>

                {/* Condensador de Marcha */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/40 space-y-3">
                  <div className="flex items-center justify-between font-bold text-sky-300">
                    <span>2. Condensador de Marcha (Run)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 border border-sky-500/40">
                      Polipropileno • 100% Permanente
                    </span>
                  </div>

                  {/* Fotografía de Taller Condensador Marcha */}
                  <div
                    onClick={() => handleOpenPhoto('condensador_marcha')}
                    className="relative group w-full h-44 rounded-lg bg-black/60 border border-sky-500/30 overflow-hidden flex items-center justify-center cursor-pointer"
                    title="Pulsar para ampliar fotografía en alta resolución"
                  >
                    <img
                      src={condensadorMarchaImg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/condensador_marcha.jpg';
                      }}
                      alt="Condensador de Marcha Permanente"
                      className="max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                      <ZoomIn className="w-4 h-4 text-sky-400" />
                      <span>Ampliar Fotografía</span>
                    </div>
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-sky-300 border border-sky-500/40">
                      Fotografía Real
                    </span>
                  </div>

                  <ul className="text-slate-300 text-[11px] space-y-1 list-disc pl-4">
                    <li><strong>Carcasa:</strong> Metálica de aluminio o plástico ignífugo gris/blanco en baño de aceite.</li>
                    <li><strong>Capacidad moderada:</strong> <strong>2 a 35 µF</strong> a alta tensión dieléctrica (<strong>400V – 450V AC</strong>).</li>
                    <li><strong>Trabajo 100% continuo:</strong> Permanece conectado siempre, manteniendo un desfase de 90° continuo en el devanado auxiliar.</li>
                    <li><strong>Beneficios:</strong> Eleva el factor de potencia (cos φ ~ 0.95 - 0.98), reduce el consumo de amperios nominales un 15-25% y disminuye las vibraciones y el ruido mecánico.</li>
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleOpenPhoto('condensador_marcha')}
                    className="w-full py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-[11px] font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                    <span>Ver Detalles de Condensador de Marcha</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECCIÓN 5: RELÉ DE POTENCIAL / TENSIÓN (HST)                              */}
          {/* ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'potencial') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-purple-500/40 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      Relé de Potencial / Tensión
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                        Sistemas CSR de Alto Par
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Control por fuerza contraelectromotriz (f.c.e.m.) para compresores de media y baja temperatura
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPhoto('rele_potencia')}
                    className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ver Fotografía Real</span>
                  </button>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/40 text-purple-300 hidden sm:inline-block">
                    Contacto Normalmente Cerrado (NC)
                  </span>
                </div>
              </div>

              {/* FOTOGRAFÍA REAL DE TALLER DEL RELÉ DE POTENCIA / POTENCIAL */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/30">
                <div
                  onClick={() => handleOpenPhoto('rele_potencia')}
                  className="relative group w-full sm:w-48 h-36 rounded-lg bg-black/60 border border-slate-700/80 overflow-hidden flex items-center justify-center cursor-pointer shrink-0"
                  title="Pulsar para ampliar fotografía en alta resolución"
                >
                  <img
                    src={relePotenciaImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/rele_potencia.png';
                    }}
                    alt="Fotografía del Relé de Potencial / Potencia"
                    className="max-h-full max-w-full object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                    <ZoomIn className="w-4 h-4 text-purple-400" />
                    <span>Ampliar</span>
                  </div>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-purple-300 border border-purple-500/40">
                    Fotografía Real
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 flex-1">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-purple-400" />
                    <strong className="text-white">Fotografía Real de Taller: Relé de Potencia / Potencial (5-2-1)</strong>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Relé voltimétrico de alta precisión para arranque CSR / HST. Bobina voltimétrica conectada a la tensión inducida (f.c.e.m.) entre bornes <strong>5 y 2</strong>; contacto normalmente cerrado entre <strong>1 y 2 (NC)</strong> que conmuta el condensador de arranque.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenPhoto('rele_potencia')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-purple-400" />
                    <span>🔍 Inspeccionar Fotografía y Guía de Terminales 5-2-1-4-6 →</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-2 text-xs">
                <h5 className="font-bold text-white flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  ¿Cómo funciona la desconexión por f.c.e.m.?
                </h5>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  A diferencia del relé de intensidad, la bobina del relé de potencial es de <strong>alta impedancia</strong> (miles de espiras finas) y está conectada <strong>en paralelo con el devanado auxiliar (S)</strong> entre los bornes <strong>5 y 2</strong>. Su contacto interno hacia el condensador de arranque es <strong>Normalmente Cerrado (NC)</strong> entre los bornes <strong>1 y 2</strong>.
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Cuando el motor arranca y el rotor alcanza el <strong>75% - 80% de su velocidad nominal</strong>, el devanado S genera por inducción magnética una tensión contraelectromotriz (f.c.e.m.) que supera los <strong>300V - 400V</strong>. Esta alta tensión energiza la bobina voltimétrica y abre el contacto NC (1-2), desconectando el condensador de arranque de forma limpia, precisa e inmune a fluctuaciones de presión.
                </p>
              </div>

              {/* Guía Oficial de Bornes Estándar (5, 2, 1, 4, 6) */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-3">
                <h5 className="font-bold text-white flex items-center gap-2 text-xs sm:text-sm">
                  <Radio className="w-4 h-4 text-purple-400" />
                  Identificación y Conexión de Bornes Estándar (Mars / GE 3ARR3 / Supco)
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-tiny">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-purple-500/30 space-y-1">
                    <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                      <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center font-mono text-[10px]">5</span>
                      <span>Borne 5: Bobina (Lado Común)</span>
                    </div>
                    <p className="text-slate-400 text-[10px] leading-tight">
                      Conecta a la línea <strong>C1</strong> y al borne <strong>C (Común)</strong> del motor a través del Klixon.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-purple-500/30 space-y-1">
                    <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                      <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center font-mono text-[10px]">2</span>
                      <span>Borne 2: Bobina / Contacto NC</span>
                    </div>
                    <p className="text-slate-400 text-[10px] leading-tight">
                      Conecta al borne <strong>S (Arranque)</strong> del compresor. Recibe la f.c.e.m. y el condensador de marcha en CSR.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-purple-500/30 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-mono text-[10px]">1</span>
                      <span>Borne 1: Cond. Arranque</span>
                    </div>
                    <p className="text-slate-400 text-[10px] leading-tight">
                      Salida del contacto NC (1-2). Va conectado exclusivamente a un extremo del <strong>Condensador de arranque</strong>.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-purple-500/30 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-mono text-[10px]">4</span>
                      <span>Borne 4: Puente Neutro</span>
                    </div>
                    <p className="text-slate-400 text-[10px] leading-tight">
                      Punto común para línea <strong>C2</strong>, borne <strong>R (Marcha)</strong> y el otro extremo de ambos condensadores.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700 space-y-1 sm:col-span-2">
                    <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-mono text-[10px]">6</span>
                      <span>Borne 6: Borne Auxiliar / Libre</span>
                    </div>
                    <p className="text-slate-400 text-[10px] leading-tight">
                      Sin conexión eléctrica interna. Se utiliza como punto de soporte mecánico para soldar resistencias de descarga (15-20 kΩ) si es necesario.
                    </p>
                  </div>
                </div>

                {/* Comprobación de taller con tester */}
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-purple-500/40 text-[11px] text-slate-300 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Protocolo de Comprobación con Polímetro (Relé en reposo desenergizado):
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-300">
                    <li><strong>Entre bornes 1 y 2:</strong> Debe dar <strong>0 Ω (Continuidad / Contacto NC cerrado)</strong>. Si da infinito, el contacto está quemado o fogueado.</li>
                    <li><strong>Entre bornes 2 y 5:</strong> Debe dar <strong>resistencia alta (entre 3.000 Ω y 10.000 Ω)</strong> correspondiente a la bobina voltimétrica de hilo fino. Si da 0 Ω está en corto; si da infinito está abierta.</li>
                    <li><strong>Entre borne 4 y el resto (1, 2, 5, 6):</strong> Debe dar <strong>aislamiento total (Infinito / OL)</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Información técnica integrada para taller y diagnóstico de campo</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-black text-xs sm:text-sm shadow-md transition-colors cursor-pointer ml-auto"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>

      {/* Visor Fotográfico Interactivo en Alta Resolución para Componentes Reales */}
      <ComponentPhotoViewerModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        initialComponent={photoModalComponent}
      />
    </div>
  );
};
