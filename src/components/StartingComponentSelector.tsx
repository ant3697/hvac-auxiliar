import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
  Shield,
  Layers,
  Cpu,
  Thermometer,
  Gauge,
  Sparkles,
  Info,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import {
  ALL_HP_OPTIONS,
  DANFOSS_117U_LIST,
  BRACKET_RELAYS_LIST,
  BARE_BOBBIN_RELAYS_LIST,
  SQUARE_COMPACT_RELAYS_LIST,
  HEAVY_DUTY_PROTECTORS_LIST,
  JRT4_PROTECTORS_LIST,
} from '../data/startingComponentsData';
import {
  Danfoss117UIcon,
  BracketRelayIcon,
  BareBobbinRelayIcon,
  SquareRelayIcon,
  HeavyDutyProtectorIcon,
  Jrt4ProtectorIcon,
} from './ComponentVisualIcons';

export type SelectorTabMode = 'smart_selector' | 'official_tables' | 'technician_guide';
export type TableCategory = 'all' | 'danfoss' | 'bracket' | 'bare_bobbin' | 'square' | 'heavy_duty' | 'jrt4';

export const StartingComponentSelector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SelectorTabMode>('smart_selector');
  const [selectedHp, setSelectedHp] = useState<string>('1/4 HP');
  const [activeTableFilter, setActiveTableFilter] = useState<TableCategory>('all');

  // Reverse search sliders
  const [filterConnectA, setFilterConnectA] = useState<number>(0);
  const [filterOverloadA, setFilterOverloadA] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Extract clean fractional HP from string (e.g., '1/4 HP' -> '1/4')
  const cleanHp = (hpStr: string) => hpStr.replace(' HP', '').trim();

  // Find matching components across all 6 families for the selected HP
  const matchingComponents = useMemo(() => {
    const targetHp = cleanHp(selectedHp);

    const matches: Array<{
      category: string;
      categoryTitle: string;
      modelName: string;
      icon: React.ReactNode;
      power: string;
      connectA: number | null;
      releaseA: number | null;
      overloadA: number | null;
      temperatures?: string;
      details: string;
      badgeColor: string;
    }> = [];

    // 1. Relé Combinado Danfoss 117U
    DANFOSS_117U_LIST.forEach((item) => {
      const match =
        item.recommendedHp.includes(targetHp) ||
        (targetHp === '1/4' && item.model.includes('2040')) ||
        (targetHp === '1/3' && item.model.includes('2050')) ||
        ((targetHp === '1/6' || targetHp === '1/5') && item.model.includes('2030')) ||
        ((targetHp === '1/12' || targetHp === '1/8') && item.model.includes('2010'));

      if (match) {
        matches.push({
          category: 'danfoss',
          categoryTitle: 'Relé Combinado Danfoss 117U',
          modelName: item.model,
          icon: <Danfoss117UIcon size={70} />,
          power: `${item.approxPowerW} W (~${item.recommendedHp})`,
          connectA: item.connectCurrent,
          releaseA: item.releaseCurrent,
          overloadA: item.overloadCurrent,
          temperatures: `Corte: ${item.appliedTemp} | Rearme: ${item.connectTemp}`,
          details: item.description,
          badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
        });
      }
    });

    // 2. Relés con Soporte Metálico
    BRACKET_RELAYS_LIST.forEach((item) => {
      if (cleanHp(item.hp) === targetHp) {
        matches.push({
          category: 'bracket',
          categoryTitle: 'Relé Amperimétrico con Soporte Metálico',
          modelName: `Relé Soporte ${item.hp}`,
          icon: <BracketRelayIcon size={60} />,
          power: `${item.powerW} W (${item.hp})`,
          connectA: item.maxConnectCurrent,
          releaseA: item.minReleaseCurrent,
          overloadA: null,
          details: `Máx. Conexión: ${item.maxConnectCurrent} A, Mín. Desconexión: ${item.minReleaseCurrent} A. Montaje con pletina atornillada.`,
          badgeColor: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
        });
      }
    });

    // 3. Relé de Bobina Desnuda
    BARE_BOBBIN_RELAYS_LIST.forEach((item) => {
      if (cleanHp(item.hp) === targetHp) {
        matches.push({
          category: 'bare_bobbin',
          categoryTitle: 'Relé de Bobina Desnuda Vertical',
          modelName: `Modelo ${item.model}`,
          icon: <BareBobbinRelayIcon size={60} />,
          power: `${item.approxPowerW} W (${item.hp})`,
          connectA: item.maxConnectCurrent,
          releaseA: item.minReleaseCurrent,
          overloadA: null,
          details: `Bobina visible con émbolo central. Conexión: ${item.maxConnectCurrent} A, Desconexión: ${item.minReleaseCurrent} A.`,
          badgeColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        });
      }
    });

    // 4. Relé Cuadrado Compacto QP2
    SQUARE_COMPACT_RELAYS_LIST.forEach((item) => {
      if (cleanHp(item.hp) === targetHp) {
        matches.push({
          category: 'square',
          categoryTitle: 'Relé Cuadrado Compacto (Tipo QP2)',
          modelName: `Carcasa Cuadrada ${item.hp}`,
          icon: <SquareRelayIcon size={60} />,
          power: `${item.powerW} W (${item.hp})`,
          connectA: item.maxConnectCurrent,
          releaseA: item.releaseCurrent,
          overloadA: null,
          details: `Carcasa baquelita negra para bornes directos. Conexión: ${item.maxConnectCurrent} A, Desconexión: ${item.releaseCurrent} A.`,
          badgeColor: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
        });
      }
    });

    // 5. Protectores de Gran Potencia (3 y 5 HP)
    HEAVY_DUTY_PROTECTORS_LIST.forEach((item) => {
      if (cleanHp(item.hp) === targetHp) {
        matches.push({
          category: 'heavy_duty',
          categoryTitle: 'Protector Térmico de Gran Potencia',
          modelName: `Protector Industrial ${item.hp}`,
          icon: <HeavyDutyProtectorIcon size={70} />,
          power: `${item.powerW} W (${item.hp})`,
          connectA: null,
          releaseA: null,
          overloadA: item.overloadCurrent,
          temperatures: `Disparo: ${item.movementTemp} | Retorno: ${item.replyReturnTemp}`,
          details: `${item.variants}. Disparo a ${item.overloadCurrent} A. Uso: ${item.application}`,
          badgeColor: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
        });
      }
    });

    // 6. Protectores Serie JRT4
    JRT4_PROTECTORS_LIST.forEach((item) => {
      if (cleanHp(item.hp) === targetHp) {
        matches.push({
          category: 'jrt4',
          categoryTitle: 'Protector Klixon Serie JRT4 (3/4")',
          modelName: item.model,
          icon: <Jrt4ProtectorIcon size={60} />,
          power: item.powerDesc,
          connectA: null,
          releaseA: null,
          overloadA: item.overloadCurrent,
          temperatures: `Disparo: ${item.appliedTemp} | Rearme: ${item.restoredTemp}`,
          details: `Disparo térmico a ${item.overloadCurrent} A. ${item.variants}.`,
          badgeColor: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
        });
      }
    });

    return matches;
  }, [selectedHp]);

  return (
    <div className="space-y-4 font-sans text-slate-800 dark:text-slate-100">
      {/* 1. MAIN HEADER & NAV TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-sky-500/10 border border-amber-500/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500 text-black font-bold">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Selector de Componentes de Arranque y Protección
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Herramienta técnica interactiva basada en las <strong>Tablas de Características Oficiales</strong> (Danfoss 117U, Relés con soporte, Bobina desnuda, Cuadrados QP2, Protectores JRT4 y Alta Potencia 3-5 CV).
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('smart_selector')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'smart_selector'
                ? 'bg-amber-400 text-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selector por Compresor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('official_tables')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'official_tables'
                ? 'bg-amber-400 text-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tablas Oficiales (6)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('technician_guide')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'technician_guide'
                ? 'bg-amber-400 text-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Criterios Técnicos</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PESTAÑA 1: SELECTOR INTELIGENTE POR COMPRESOR (HP / W / AMPERAJE)         */}
      {/* ========================================================================= */}
      {activeTab === 'smart_selector' && (
        <div className="space-y-4">
          {/* Quick HP Selector Strip */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-amber-500" />
                Selecciona la Potencia del Compresor:
              </span>
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                Seleccionado: {selectedHp}
              </span>
            </div>

            {/* HP Pill Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-tiny font-mono">
              {ALL_HP_OPTIONS.map((hp) => (
                <button
                  key={hp}
                  type="button"
                  onClick={() => setSelectedHp(hp)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 border ${
                    selectedHp === hp
                      ? 'bg-purple-600 text-white border-purple-500 shadow-xs scale-105'
                      : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {hp}
                </button>
              ))}
            </div>
          </div>

          {/* Results: Matching components grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 px-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>
                  Componentes Homologados para <strong className="text-purple-500">{selectedHp}</strong>:
                </span>
                <span className="text-tiny font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {matchingComponents.length} opciones
                </span>
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                Valores de conexión, desconexión y sobrecarga según tablas oficiales
              </span>
            </div>

            {matchingComponents.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                Para {selectedHp} consulte las tablas de alta potencia o relés de potencial voltimétricos.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchingComponents.map((comp, idx) => (
                  <div
                    key={`${comp.category}-${idx}`}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#070b13] border-2 border-slate-200 dark:border-slate-800 hover:border-purple-400/80 transition-all shadow-sm space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Category Header */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 block">
                            {comp.categoryTitle}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {comp.modelName}
                          </h4>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${comp.badgeColor}`}>
                          {comp.power}
                        </span>
                      </div>

                      {/* Visual Graphic & Key Values */}
                      <div className="flex items-center gap-3 py-2">
                        <div className="p-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-center">
                          {comp.icon}
                        </div>

                        {/* Specs Table */}
                        <div className="space-y-1 text-tiny font-mono flex-1">
                          {comp.connectA !== null && (
                            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                              <span className="text-slate-500">Intensidad Conexión (Pick-up):</span>
                              <strong className="text-amber-600 dark:text-amber-400 font-bold">
                                {comp.connectA} A
                              </strong>
                            </div>
                          )}

                          {comp.releaseA !== null && (
                            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                              <span className="text-slate-500">Intensidad Desconexión (Drop-out):</span>
                              <strong className="text-blue-600 dark:text-blue-400 font-bold">
                                {comp.releaseA} A
                              </strong>
                            </div>
                          )}

                          {comp.overloadA !== null && (
                            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                              <span className="text-slate-500">Corriente de Sobrecarga (Klixon):</span>
                              <strong className="text-rose-600 dark:text-rose-400 font-bold">
                                {comp.overloadA} A
                              </strong>
                            </div>
                          )}

                          {comp.temperatures && (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-0.5 border-t border-slate-100 dark:border-slate-800/60">
                              🌡️ {comp.temperatures}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description Footer */}
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300">
                      {comp.details}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: TABLAS OFICIALES DIGITALIZADAS (LAS 6 DE LA IMAGEN)            */}
      {/* ========================================================================= */}
      {activeTab === 'official_tables' && (
        <div className="space-y-4">
          {/* Table Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-tiny font-mono">
            <button
              type="button"
              onClick={() => setActiveTableFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                activeTableFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Ver las 6 Tablas
            </button>
            <button
              type="button"
              onClick={() => setActiveTableFilter('danfoss')}
              className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                activeTableFilter === 'danfoss'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              1. Danfoss 117U
            </button>
            <button
              type="button"
              onClick={() => setActiveTableFilter('bracket')}
              className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                activeTableFilter === 'bracket'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              2. Con Soporte Metálico
            </button>
            <button
              type="button"
              onClick={() => setActiveTableFilter('bare_bobbin')}
              className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                activeTableFilter === 'bare_bobbin'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              3. Bobina Desnuda (B-Series)
            </button>
            <button
              type="button"
              onClick={() => setActiveTableFilter('square')}
              className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                activeTableFilter === 'square'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              4. Cuadrado Compacto QP2
            </button>
            <button
              type="button"
              onClick={() => setActiveTableFilter('heavy_duty')}
              className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                activeTableFilter === 'heavy_duty'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              5. Alta Potencia (3 y 5 HP)
            </button>
            <button
              type="button"
              onClick={() => setActiveTableFilter('jrt4')}
              className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                activeTableFilter === 'jrt4'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              6. Klixon JRT4 (3/4")
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* ================================================================= */}
            {/* TABLA 1: RELÉ COMBINADO DANFOSS 117U                              */}
            {/* ================================================================= */}
            {(activeTableFilter === 'all' || activeTableFilter === 'danfoss') && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      1. Relé Combinado Danfoss (Tipo 117U)
                    </h4>
                  </div>
                  <Danfoss117UIcon size={65} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-b border-amber-300 dark:border-amber-700/60">
                        <th className="p-2">Model</th>
                        <th className="p-2 text-center">Connect (A)</th>
                        <th className="p-2 text-center">Release (A)</th>
                        <th className="p-2 text-center">Overload (A)</th>
                        <th className="p-2 text-center">Applied ℃</th>
                        <th className="p-2 text-center">Connect ℃</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {DANFOSS_117U_LIST.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors"
                        >
                          <td className="p-2 font-bold text-slate-900 dark:text-white">{row.model}</td>
                          <td className="p-2 text-center font-bold text-amber-600 dark:text-amber-400">
                            {row.connectCurrent}
                          </td>
                          <td className="p-2 text-center text-blue-600 dark:text-blue-400">
                            {row.releaseCurrent}
                          </td>
                          <td className="p-2 text-center text-rose-600 dark:text-rose-400 font-bold">
                            {row.overloadCurrent}
                          </td>
                          <td className="p-2 text-center text-slate-600 dark:text-slate-400">
                            {row.appliedTemp}
                          </td>
                          <td className="p-2 text-center text-slate-600 dark:text-slate-400">
                            {row.connectTemp}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TABLA 2: RELÉS CON SOPORTE METÁLICO                               */}
            {/* ================================================================= */}
            {(activeTableFilter === 'all' || activeTableFilter === 'bracket') && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      2. Relé Amperimétrico con Soporte Metálico
                    </h4>
                  </div>
                  <BracketRelayIcon size={55} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-b border-amber-300 dark:border-amber-700/60">
                        <th className="p-2 text-left">Especificación</th>
                        {BRACKET_RELAYS_LIST.map((r) => (
                          <th key={r.id} className="p-2 font-bold">
                            {r.hp.replace(' HP', '')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-tiny">
                      <tr>
                        <td className="p-2 text-left font-bold text-slate-500">Power (W)</td>
                        {BRACKET_RELAYS_LIST.map((r) => (
                          <td key={r.id} className="p-2 font-bold text-slate-800 dark:text-slate-200">
                            {r.powerW}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 text-left font-bold text-amber-600 dark:text-amber-400">
                          Max. Connect (A)
                        </td>
                        {BRACKET_RELAYS_LIST.map((r) => (
                          <td key={r.id} className="p-2 font-bold text-amber-600 dark:text-amber-400">
                            {r.maxConnectCurrent.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 text-left font-bold text-blue-600 dark:text-blue-400">
                          Min. Release (A)
                        </td>
                        {BRACKET_RELAYS_LIST.map((r) => (
                          <td key={r.id} className="p-2 font-bold text-blue-600 dark:text-blue-400">
                            {r.minReleaseCurrent.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TABLA 3: RELÉ DE BOBINA DESNUDA (B-SERIES)                        */}
            {/* ================================================================= */}
            {(activeTableFilter === 'all' || activeTableFilter === 'bare_bobbin') && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      3. Relé de Bobina Desnuda (Tipo B5A..B16A)
                    </h4>
                  </div>
                  <BareBobbinRelayIcon size={55} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-b border-amber-300 dark:border-amber-700/60">
                        <th className="p-2">Power (HP)</th>
                        <th className="p-2">Model</th>
                        <th className="p-2 text-center">Max. Connect (A)</th>
                        <th className="p-2 text-center">Min. Release (A)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {BARE_BOBBIN_RELAYS_LIST.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors"
                        >
                          <td className="p-2 font-bold text-slate-900 dark:text-white">{row.hp}</td>
                          <td className="p-2 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {row.model}
                          </td>
                          <td className="p-2 text-center font-bold text-amber-600 dark:text-amber-400">
                            {row.maxConnectCurrent}
                          </td>
                          <td className="p-2 text-center text-blue-600 dark:text-blue-400">
                            {row.minReleaseCurrent}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TABLA 4: RELÉ CUADRADO COMPACTO QP2                               */}
            {/* ================================================================= */}
            {(activeTableFilter === 'all' || activeTableFilter === 'square') && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      4. Relé Amperimétrico Cuadrado Compacto (Tipo QP2)
                    </h4>
                  </div>
                  <SquareRelayIcon size={55} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-b border-amber-300 dark:border-amber-700/60">
                        <th className="p-2 text-left">Especificación</th>
                        {SQUARE_COMPACT_RELAYS_LIST.map((r) => (
                          <th key={r.id} className="p-1.5 font-bold">
                            {r.hp.replace(' HP', '')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-tiny">
                      <tr>
                        <td className="p-2 text-left font-bold text-slate-500">Power (W)</td>
                        {SQUARE_COMPACT_RELAYS_LIST.map((r) => (
                          <td key={r.id} className="p-1.5 font-bold text-slate-800 dark:text-slate-200">
                            {r.powerW}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 text-left font-bold text-amber-600 dark:text-amber-400">
                          Max. Connect (A)
                        </td>
                        {SQUARE_COMPACT_RELAYS_LIST.map((r) => (
                          <td key={r.id} className="p-1.5 font-bold text-amber-600 dark:text-amber-400">
                            {r.maxConnectCurrent}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 text-left font-bold text-blue-600 dark:text-blue-400">
                          Release (A)
                        </td>
                        {SQUARE_COMPACT_RELAYS_LIST.map((r) => (
                          <td key={r.id} className="p-1.5 font-bold text-blue-600 dark:text-blue-400">
                            {r.releaseCurrent}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TABLA 5: PROTECTORES TÉRMICOS DE ALTA POTENCIA (3 Y 5 HP)         */}
            {/* ================================================================= */}
            {(activeTableFilter === 'all' || activeTableFilter === 'heavy_duty') && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      5. Protectores Térmicos de Gran Potencia (3 HP y 5 HP)
                    </h4>
                  </div>
                  <HeavyDutyProtectorIcon size={65} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-b border-amber-300 dark:border-amber-700/60">
                        <th className="p-2">Especificación (HP)</th>
                        <th className="p-2 text-center">Overload Current (A)</th>
                        <th className="p-2 text-center">Movement Temp.</th>
                        <th className="p-2 text-center">Reply Return Temp.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {HEAVY_DUTY_PROTECTORS_LIST.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors"
                        >
                          <td className="p-2 font-bold text-slate-900 dark:text-white">
                            {row.hp} ({row.powerW} W)
                          </td>
                          <td className="p-2 text-center font-bold text-rose-600 dark:text-rose-400">
                            {row.overloadCurrent} A
                          </td>
                          <td className="p-2 text-center text-slate-600 dark:text-slate-400">
                            {row.movementTemp}
                          </td>
                          <td className="p-2 text-center text-slate-600 dark:text-slate-400">
                            {row.replyReturnTemp}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TABLA 6: PROTECTORES TÉRMICOS SERIE JRT4 (3/4")                   */}
            {/* ================================================================= */}
            {(activeTableFilter === 'all' || activeTableFilter === 'jrt4') && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      6. Protectores Térmicos Klixon Serie JRT4 (3/4")
                    </h4>
                  </div>
                  <Jrt4ProtectorIcon size={55} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-b border-amber-300 dark:border-amber-700/60">
                        <th className="p-2">Model</th>
                        <th className="p-2">Compressor Power</th>
                        <th className="p-2 text-center">Overload (A)</th>
                        <th className="p-2 text-center">Applied Temp.</th>
                        <th className="p-2 text-center">Restored Temp.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {JRT4_PROTECTORS_LIST.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors"
                        >
                          <td className="p-2 font-bold text-slate-900 dark:text-white">{row.model}</td>
                          <td className="p-2 text-slate-700 dark:text-slate-300">{row.powerDesc}</td>
                          <td className="p-2 text-center font-bold text-rose-600 dark:text-rose-400">
                            {row.overloadCurrent} A
                          </td>
                          <td className="p-2 text-center text-slate-600 dark:text-slate-400">
                            {row.appliedTemp}
                          </td>
                          <td className="p-2 text-center text-slate-600 dark:text-slate-400">
                            {row.restoredTemp}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 3: CRITERIOS TÉCNICOS Y REGLAS DE TALLER                          */}
      {/* ========================================================================= */}
      {activeTab === 'technician_guide' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm text-xs">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Criterios de Selección y Diagnóstico de Taller (Manual de Refrigeración)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Criterio 1: Connect Current */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                <Zap className="w-4 h-4" />
                <span>Corriente de Conexión (Connect / Pick-up)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                Es la intensidad mínima que debe circular por la <strong>bobina de marcha</strong> durante el instante inicial de rotor bloqueado para que el campo electromagnético sea capaz de vencer la gravedad y levantar el émbolo, cerrando el contacto de la bobina de arranque.
              </p>
              <div className="p-2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-mono border border-amber-500/20">
                ⚠️ Si pones un relé con Connect Current excesiva, el émbolo nunca subirá y el compresor no arrancará.
              </div>
            </div>

            {/* Criterio 2: Release Current */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                <Gauge className="w-4 h-4" />
                <span>Corriente de Desconexión (Release / Drop-out)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                Cuando el rotor acelera y supera el 75-80% de su velocidad de sincronismo, la intensidad en marcha cae bruscamente. Al bajar por debajo de la <strong>Release Current</strong>, la fuerza magnética ya no puede sostener el émbolo y este cae por gravedad, abriendo el circuito auxiliar.
              </p>
              <div className="p-2 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px] font-mono border border-blue-500/20">
                ⚠️ Si pones un relé con Release Current muy baja, el émbolo no caerá y quemará el bobinado de arranque.
              </div>
            </div>

            {/* Criterio 3: Temperatures */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                <Thermometer className="w-4 h-4" />
                <span>Applied vs Restored Temperature (Klixon)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                <strong>Applied Temperature (105-155 ℃):</strong> Temperatura a la que el disco bimetálico se deforma bruscamente y abre el circuito.<br />
                <strong>Restored Temperature (50-80 ℃):</strong> Temperatura a la que el disco se enfría y vuelve a conectar (tarda de 3 a 7 minutos).
              </p>
              <div className="p-2 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[10px] font-mono border border-rose-500/20">
                ⏱️ Nunca forzar el arranque antes de que el Klixon o la PTC se hayan enfriado a su temperatura de rearme.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
