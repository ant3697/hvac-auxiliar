import React, { useEffect, useState } from 'react';
import {
  X,
  ShieldAlert,
  Zap,
  Radio,
  Sparkles,
  Cpu,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Info,
  Layers,
  Clock,
  Gauge,
  Flame,
} from 'lucide-react';
import { ZoomPanViewer } from './ZoomPanViewer';

import ptcImg from '../assets/ptc.png';
import klixonImg from '../assets/klixon.png';
import releArranqueImg from '../assets/rele_arranque.png';
import relePotenciaImg from '../assets/rele_potencia.png';
import condensadorMarchaImg from '../assets/condensador_marcha.jpg';
import condensadorArranqueImg from '../assets/condensador_arranque.png';

export type ComponentPhotoType =
  | 'ptc'
  | 'klixon'
  | 'rele_arranque'
  | 'rele_potencia'
  | 'condensador_marcha'
  | 'condensador_arranque';

export interface ComponentPhotoInfo {
  id: ComponentPhotoType;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  imgSrc: string;
  fallbackSrc: string;
  connectionRole: string;
  bornes: string;
  operationPrinciple: string;
  keySpecs: string[];
  multimeterTest: {
    good: string;
    faulty: string;
    technicianTip: string;
  };
}

export const COMPONENT_PHOTOS_DATA: Record<ComponentPhotoType, ComponentPhotoInfo> = {
  ptc: {
    id: 'ptc',
    title: 'Relé de Arranque por Termistor PTC (Estado Sólido)',
    subtitle: 'Arranque estático semiconductor sin piezas mecánicas para compresores frigoríficos',
    badge: 'Estado Sólido • Cerámica BaTiO3',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    imgSrc: ptcImg,
    fallbackSrc: '/ptc.png',
    connectionRole: 'Conectado entre la línea de alimentación (C2) y el borne S (Arranque) del compresor hermético.',
    bornes: 'Línea C2 ➔ Pastilla PTC ➔ Borne S (Arranque) [Encajado directo sobre bornas C-S-R]',
    operationPrinciple:
      'En frío (~25°C), la pastilla cerámica semiconductora de titanato de bario presenta baja resistencia (15 Ω a 25 Ω), permitiendo el paso de corriente al bobinado de arranque S. En cuestión de 0.5 a 1 segundo, la intensidad que la atraviesa autocalienta la pastilla por encima de su temperatura de Curie (~70°C hasta alcanzar 110°C-130°C). En ese instante, su resistencia se multiplica por miles (>10.000 Ω a >50.000 Ω), actuando como un circuito abierto virtual que desconecta el devanado auxiliar sin chispas ni desgaste mecánico.',
    keySpecs: [
      'Resistencia en frío (25°C): 15 Ω a 25 Ω nominal (tolerancia estándar ±20%).',
      'Temperatura de régimen en marcha: 110 °C a 130 °C continuos (autocalentada mientras el motor gira).',
      'Resistencia en caliente: > 10.000 Ω a > 50.000 Ω (aislamiento térmico casi total del devanado S).',
      'Tiempo de rearme obligatorio: 3 a 5 minutos (debe disipar el calor y descender bajo 70°C antes de volver a conducir).',
      'Ventaja tecnológica: Sin contactos móviles, silencioso e intrínsecamente seguro para refrigerantes inflamables (R600a/R290).',
    ],
    multimeterTest: {
      good: 'En frío a 25°C: Entre sus terminales debe medir de 15.0 Ω a 25.0 Ω continuos. Al agitar el cuerpo de plástico no debe oírse ningún sonido de piezas sueltas.',
      faulty: 'Si marca OL / circuito abierto (∞), la pastilla interna está quemada o abierta. Si al sacudirlo suena como "cascabel" o arena, la pastilla cerámica está rota/fracturada por choque térmico.',
      technicianTip:
        '¡Avería crítica en campo! Si ocurre un microcorte de luz (<30 s) y regresa la corriente de golpe, la PTC aún caliente bloqueará el paso a S. El motor no arrancará, consumirá LRA y disparará el Klixon.',
    },
  },
  klixon: {
    id: 'klixon',
    title: 'Protector Térmico Bimetálico (Klixon)',
    subtitle: 'Seguridad combinada de sobretemperatura y sobreintensidad para el motor',
    badge: 'Seguridad Térmica Motor',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    imgSrc: klixonImg,
    fallbackSrc: '/klixon.png',
    connectionRole: 'Montado en serie directa con el borne Común (C) del compresor hermético.',
    bornes: 'Línea Fase (L) ➔ Klixon ➔ Borne Común (C)',
    operationPrinciple:
      'Consta de una resistencia calefactora de bajo valor en serie con un disco bimetálico cóncavo apoyado contra la carcasa. Si la intensidad supera la nominal (ej. rotor bloqueado LRA ≈ 16A) o la temperatura de la carcasa supera 105°C-120°C, el bimetal salta de golpe (acción snap) cortando la alimentación a ambos devanados.',
    keySpecs: [
      'Calibración en corriente: Ajustado al LRA del compresor (disparo en 4-10 s).',
      'Sensibilidad térmica de carcasa: Corte entre 105 °C y 130 °C.',
      'Rearme automático: Se restablece al enfriarse la carcasa (aprox. 65 °C - 75 °C, toma 3 a 8 min).',
      'Protección total: Desenergiza Marcha (R) y Arranque (S) simultáneamente.',
    ],
    multimeterTest: {
      good: 'En frío a 25°C: Continuidad absoluta (0.0 Ω a 0.4 Ω). Contacto cerrado.',
      faulty: 'Si en frío marca circuito abierto (OL / infinito), el bimetal o calefactor está quemado o deformado.',
      technicianTip:
        'Si acaba de saltar en marcha por alta compresión o falta de gas, esperar a que la carcasa baje de 70°C antes de sustituirlo.',
    },
  },
  rele_arranque: {
    id: 'rele_arranque',
    title: 'Relé de Intensidad / Arranque Electromecánico',
    subtitle: 'Desconexión automática del bobinado auxiliar por caída de intensidad y gravedad',
    badge: 'Sistemas RSIR y CSIR',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    imgSrc: releArranqueImg,
    fallbackSrc: '/rele_arranque.png',
    connectionRole: 'Bobina en serie con borne Marcha (R) y contacto normalmente abierto hacia Arranque (S).',
    bornes: 'Línea C2 ➔ Bobina Relé ➔ Borne R; Contacto NA ➔ Borne S',
    operationPrinciple:
      'En el instante de arranque, la corriente de rotor bloqueado (4 a 6 veces la nominal) atraviesa la bobina de hilo grueso, generando un fuerte campo electromagnético que levanta el émbolo interno hacia arriba y cierra el contacto hacia el devanado auxiliar S. Al alcanzar el motor ~80% de velocidad, la intensidad desciende a valor nominal; el campo magnético decae y el émbolo cae por gravedad, abriendo el circuito de arranque.',
    keySpecs: [
      'Posición vertical obligatoria ("UP / TOP"): Debe montarse estrictamente en vertical.',
      'Tiempo de actuación: Contacto cerrado durante 0.5 a 1.5 segundos.',
      'Bobina de pocas espiras y sección gruesa (baja impedancia: 0.1 a 0.5 Ω).',
      'Contacto normalmente abierto (N.A.) en reposo.',
    ],
    multimeterTest: {
      good: 'En posición vertical: Contactos abiertos (OL). Al invertir el relé boca abajo: Émbolo cae y da 0.0 Ω (CERRADO).',
      faulty: 'Si boca abajo marca circuito abierto (OL), el émbolo está atascado o los contactos fogueados. Si en vertical marca 0 Ω, contactos pegados.',
      technicianTip:
        '¡Regla de oro de taller! Nunca montar este relé inclinado u horizontal, pues el émbolo no caerá por gravedad y quemará el bobinado auxiliar.',
    },
  },
  rele_potencia: {
    id: 'rele_potencia',
    title: 'Relé de Potencial / Potencia (Voltimétrico 5-2-1)',
    subtitle: 'Desconexión de alta precisión por fuerza contraelectromotriz (f.c.e.m.) para compresores CSR / HST',
    badge: 'Sistemas CSR de Alto Par (HST)',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    imgSrc: relePotenciaImg,
    fallbackSrc: '/rele_potencia.png',
    connectionRole: 'Bobina voltimétrica en bornes 5-2 en paralelo con bobina S; contacto normalmente cerrado 1-2 en serie con condensador de arranque.',
    bornes: 'Borne 5: Común (C1/Klixon) • Borne 2: Arranque (S) • Borne 1: Cond. Arranque • Borne 4: Neutro/Marcha (C2/R)',
    operationPrinciple:
      'A diferencia del relé de intensidad, su bobina es de alta impedancia (miles de espiras de hilo fino) y su contacto es Normalmente Cerrado (NC). Al arrancar, el condensador de arranque actúa a través del contacto cerrado 1-2. Al girar el motor, el devanado S genera una tensión contraelectromotriz que supera los 300V-400V. Esta alta tensión energiza la bobina y abre el contacto 1-2, desconectando el condensador de arranque limpiamente.',
    keySpecs: [
      'Terminales oficiales estándar: 5 (Bobina/Común), 2 (Bobina/Contacto S), 1 (Salida NC a Condensador), 4 (Línea R/Neutro).',
      'Contacto normalmente cerrado (NC): Conduce desde reposo hasta el régimen nominal.',
      'Tensión de actuación por f.c.e.m.: Bobina calibrada para abrir a ~300V - 380V AC.',
      'Excelente inmunidad a fluctuaciones de carga y presiones en válvula de expansión.',
    ],
    multimeterTest: {
      good: 'Entre bornes 1 y 2 (Contacto NC): 0.0 Ω (Continuidad). Entre bornes 2 y 5 (Bobina): Alta resistencia (3.000 Ω a 10.000 Ω).',
      faulty: 'Entre 1 y 2 en reposo marca OL (contacto abierto o fogueado). Entre 2 y 5 marca OL (bobina cortada) o 0 Ω (bobina en cortocircuito).',
      technicianTip:
        'Borne 4 es una regleta pasante sin conexión interna a la bobina, utilizada como puente de conexión neutro/línea C2.',
    },
  },
  condensador_marcha: {
    id: 'condensador_marcha',
    title: 'Condensador de Marcha Permanente (Run Capacitor)',
    subtitle: 'Servicio continuo ininterrumpido (100% ED) para elevado rendimiento y cos φ',
    badge: 'Polipropileno • Servicio Continuo',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    imgSrc: condensadorMarchaImg,
    fallbackSrc: '/condensador_marcha.jpg',
    connectionRole: 'Conectado de forma permanente entre los bornes de Marcha (R) y Arranque (S).',
    bornes: 'Un terminal al borne R (Marcha) • Otro terminal al borne S (Arranque)',
    operationPrinciple:
      'Permanece conectado durante todo el funcionamiento del motor. Proporciona una corriente senoidal desfasada permanentemente ~90° en el devanado auxiliar S, transformando el motor monofásico en un motor bifásico rotativo con campo magnético giratorio casi perfecto. Eleva el factor de potencia (cos φ ~0.95), disminuye el amperaje nominal en 15-25% y suaviza el funcionamiento acústico.',
    keySpecs: [
      'Capacidad moderada: 2 µF a 35 µF (tolerancia ±5%).',
      'Tensión nominal de aislamiento: 400V a 450V AC (dieléctrico de alta rigidez).',
      'Carcasa metálica de aluminio o polipropileno ignífugo en baño de aceite.',
      'Servicio continuo 100%: Puede funcionar las 24 horas sin sobrecalentarse.',
    ],
    multimeterTest: {
      good: 'Con capacímetro: Capacidad medida dentro del ±5% del valor serigrafiado (ej. 4 µF ± 0.2 µF). Aislamiento a carcasa > 50 MΩ.',
      faulty: 'Capacidad desvalorizada (>10% por debajo de su valor nominal) o circuito abierto/cortocircuito.',
      technicianTip:
        'Descargar siempre con una resistencia de 20kΩ antes de medir con el capacímetro para proteger el multímetro.',
    },
  },
  condensador_arranque: {
    id: 'condensador_arranque',
    title: 'Condensador de Arranque Electrolítico (Start Capacitor)',
    subtitle: 'Servicio intermitente de altísimo par de arranque (máx. 3 segundos) para sistemas HST',
    badge: 'Electrolítico • Alta Capacidad',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    imgSrc: condensadorArranqueImg,
    fallbackSrc: '/condensador_arranque.png',
    connectionRole: 'Conectado en serie con el contacto del relé (contacto NA en relé de intensidad o contacto NC en relé de potencial).',
    bornes: 'Contacto de relé ➔ Condensador de Arranque ➔ Borne S (Arranque)',
    operationPrinciple:
      'Diseñado para inyectar un par motriz colosal durante el breve instante de arranque (menos de 3 segundos), necesario para vencer la contrapresión en sistemas con válvula de expansión termostática (HST). Una vez que el motor adquiere velocidad, el relé desconecta este condensador inmediatamente.',
    keySpecs: [
      'Capacidad muy elevada: 40 µF a 160 µF.',
      'Carcasa de baquelita o plástico negro resistente a la presión con membrana de alivio.',
      'Tiempo máximo bajo tensión: 3 segundos por intento (ED intermitente).',
      'Resistencia de descarga: Suele llevar una resistencia de 15kΩ a 47kΩ / 2W en paralelo para evacuar la carga acumulada y evitar arcos.',
    ],
    multimeterTest: {
      good: 'Con capacímetro: Capacidad entre -0% y +20% del valor nominal. Con óhmetro sin resistencia: sube rápidamente hacia infinito.',
      faulty: 'Carcasa abombada, membrana rota o electrolito expulsado; capacímetro marca 0 µF o corto total.',
      technicianTip:
        '¡Peligro! Si el relé de arranque se queda pegado, este condensador sobrecalienta su electrolito y estalla por la válvula de seguridad.',
    },
  },
};

const ORDERED_COMPONENTS: ComponentPhotoType[] = [
  'ptc',
  'klixon',
  'rele_arranque',
  'rele_potencia',
  'condensador_marcha',
  'condensador_arranque',
];

interface ComponentPhotoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialComponent?: ComponentPhotoType;
}

export const ComponentPhotoViewerModal: React.FC<ComponentPhotoViewerModalProps> = ({
  isOpen,
  onClose,
  initialComponent = 'klixon',
}) => {
  const [selectedType, setSelectedType] = useState<ComponentPhotoType>(initialComponent);

  useEffect(() => {
    if (isOpen && initialComponent) {
      setSelectedType(initialComponent);
    }
  }, [isOpen, initialComponent]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedType, onClose]);

  if (!isOpen) return null;

  const currentIdx = ORDERED_COMPONENTS.indexOf(selectedType);
  const currentData = COMPONENT_PHOTOS_DATA[selectedType];

  const handleNext = () => {
    const nextIdx = (currentIdx + 1) % ORDERED_COMPONENTS.length;
    setSelectedType(ORDERED_COMPONENTS[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIdx - 1 + ORDERED_COMPONENTS.length) % ORDERED_COMPONENTS.length;
    setSelectedType(ORDERED_COMPONENTS[prevIdx]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="component-modal-title"
    >
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-inner shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="component-modal-title" className="text-base sm:text-lg font-black text-white tracking-wide">
                  {currentData.title}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${currentData.badgeColor}`}>
                  {currentData.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">{currentData.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Prev / Next */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                title="Componente anterior (Flecha Izq)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 px-1.5">
                {currentIdx + 1}/{ORDERED_COMPONENTS.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                title="Componente siguiente (Flecha Der)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
              title="Cerrar ventana (Esc)"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* COMPONENT NAVIGATION PILLS */}
        <div className="px-4 sm:px-6 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
          {ORDERED_COMPONENTS.map((id) => {
            const comp = COMPONENT_PHOTOS_DATA[id];
            const isSelected = selectedType === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedType(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {id === 'ptc' && <Flame className="w-3.5 h-3.5 text-sky-400" />}
                {id === 'klixon' && <ShieldAlert className="w-3.5 h-3.5" />}
                {id === 'rele_arranque' && <Zap className="w-3.5 h-3.5" />}
                {id === 'rele_potencia' && <Radio className="w-3.5 h-3.5" />}
                {id === 'condensador_marcha' && <Sparkles className="w-3.5 h-3.5" />}
                {id === 'condensador_arranque' && <Sparkles className="w-3.5 h-3.5" />}
                <span>{comp.title.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1">
          {/* Main Visual Display with ZoomPanViewer */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
            {/* Top Toolbar / Image Badge */}
            <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Fotografía Real de Taller: <strong className="text-white">{currentData.title}</strong>
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                Rueda del ratón para zoom • Arrastrar para desplazar
              </span>
            </div>

            {/* Image Container with Zoom and Panning */}
            <div className="relative w-full h-[320px] sm:h-[380px] overflow-hidden bg-slate-950 flex items-center justify-center p-2">
              <ZoomPanViewer
                className="w-full h-full flex items-center justify-center"
                containerClassName="w-full h-full flex items-center justify-center"
                initialZoom={1}
                minZoom={0.6}
                maxZoom={4}
                toolbarPosition="top-right"
                title={`Inspección Detallada: ${currentData.title}`}
              >
                <img
                  src={currentData.imgSrc}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== currentData.fallbackSrc) {
                      target.src = currentData.fallbackSrc;
                    }
                  }}
                  alt={currentData.title}
                  className="max-h-[300px] sm:max-h-[350px] w-auto max-w-full object-contain rounded-xl shadow-lg select-none pointer-events-none"
                  draggable={false}
                />
              </ZoomPanViewer>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Card 1: Función y Cableado */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Conexión y Bornes</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {currentData.connectionRole}
              </p>
              <div className="p-2 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
                {currentData.bornes}
              </div>
            </div>

            {/* Card 2: Principio Físico y Características */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sky-400 text-sm">
                <Info className="w-4 h-4 text-sky-400" />
                <span>Principio de Trabajo</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {currentData.operationPrinciple}
              </p>
              <ul className="text-[10px] text-slate-300 space-y-1 list-disc pl-4 pt-1">
                {currentData.keySpecs.slice(0, 2).map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>

            {/* Card 3: Prueba con Polímetro en Taller */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Comprobación con Polímetro</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold font-mono">✓</span>
                  <span><strong>Estado OK:</strong> {currentData.multimeterTest.good}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold font-mono">✗</span>
                  <span><strong>Averiado:</strong> {currentData.multimeterTest.faulty}</span>
                </li>
                <li className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-200 text-[10px] leading-tight">
                  💡 <strong>Tip Técnico:</strong> {currentData.multimeterTest.technicianTip}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <div className="text-[11px] font-mono text-slate-400 hidden sm:flex items-center gap-2">
            <span className="text-amber-400">⚡</span>
            <span>Galería Oficial de Componentes de Arranque Frigorífico</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
