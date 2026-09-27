import React from 'react';

export type PotentialRelaySvgMode = 'both' | 'csir' | 'csr';
export type PotentialRelayVisualStyle = 'technical' | 'dynamic';

export interface OfficialPotentialRelaySvgProps {
  mode?: PotentialRelaySvgMode;
  visualStyle?: PotentialRelayVisualStyle;
  simState?: 'idle' | 'starting' | 'running' | 'overload';
  fcemVoltage?: number;
  selectedPin?: string | null;
  onSelectPin?: (pin: string) => void;
  className?: string;
}

export const OfficialPotentialRelaySvg: React.FC<OfficialPotentialRelaySvgProps> = ({
  mode = 'both',
  visualStyle = 'dynamic',
  simState = 'idle',
  fcemVoltage = 0,
  selectedPin = null,
  onSelectPin,
  className = '',
}) => {
  const isStarting = simState === 'starting';
  const isRunning = simState === 'running';
  const isOverload = simState === 'overload';
  const isActive = isStarting || isRunning;

  // Contact 1-2 is Normally Closed (NC): Closed in idle & starting, OPENS in running by f.c.e.m.
  const isContact12Open = isRunning;
  const isCoilEnergized = isRunning || (isStarting && fcemVoltage > 250);

  // Dynamic colors for electrical flow
  const isDynamic = visualStyle === 'dynamic';

  // Palette in dynamic mode
  const colorL1 = !isDynamic ? '#000000' : isOverload ? '#ef4444' : isActive ? '#0284c7' : '#475569'; // C1 - Phase line (Cyan/Blue)
  const colorL2 = !isDynamic ? '#000000' : isOverload ? '#ef4444' : isActive ? '#10b981' : '#475569'; // C2 - Neutral/Line 2 (Emerald)
  const colorStartCap = !isDynamic
    ? '#000000'
    : isOverload
    ? '#ef4444'
    : isStarting
    ? '#f59e0b'
    : '#64748b'; // Start Capacitor branch (Amber during start, gray when disconnected)
  const colorRunCap = !isDynamic
    ? '#000000'
    : isOverload
    ? '#ef4444'
    : isActive
    ? '#06b6d4'
    : '#64748b'; // Run Capacitor branch (Cyan active in start and run)
  const colorRelayCoil = !isDynamic
    ? '#000000'
    : isOverload
    ? '#ef4444'
    : isCoilEnergized
    ? '#a855f7'
    : isStarting
    ? '#c084fc'
    : '#475569'; // Coil 5-2 sensing f.c.e.m. (Purple)
  const colorWindingAux = !isDynamic
    ? '#000000'
    : isOverload
    ? '#ef4444'
    : isStarting
    ? '#f59e0b'
    : isRunning
    ? '#06b6d4'
    : '#475569'; // Auxiliary winding (Amber on start, Cyan in CSR run)
  const colorWindingMain = !isDynamic
    ? '#000000'
    : isOverload
    ? '#ef4444'
    : isActive
    ? '#10b981'
    : '#475569'; // Main winding (Emerald)

  // Compute viewBox depending on display mode
  let viewBox = '0 0 800 1000';
  if (mode === 'csir') {
    viewBox = '0 30 800 440';
  } else if (mode === 'csr') {
    viewBox = '0 550 800 450';
  }

  const renderPin = (cx: number, cy: number, num: string, schemeYOffset: number) => {
    const isSelected = selectedPin === num;
    const pinColor = isDynamic
      ? num === '5'
        ? colorL1
        : num === '2'
        ? colorRelayCoil
        : num === '1'
        ? colorStartCap
        : num === '4'
        ? colorL2
        : '#94a3b8'
      : '#000000';

    return (
      <g
        key={`pin-${num}-${schemeYOffset}`}
        onClick={() => onSelectPin && onSelectPin(num)}
        className="cursor-pointer group"
      >
        <title>{`Borne ${num} del Relé de Potencial (Clic para detalles)`}</title>
        {isSelected && (
          <circle
            cx={cx}
            cy={cy}
            r="23"
            fill="none"
            stroke="#a855f7"
            strokeWidth="3.5"
            strokeDasharray="4 2"
            className="animate-spin"
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        )}
        <circle
          cx={cx}
          cy={cy}
          r="16"
          fill={isSelected ? '#f3e8ff' : '#ffffff'}
          stroke={isSelected ? '#a855f7' : isDynamic ? pinColor : '#000000'}
          strokeWidth={isSelected ? '3' : '2'}
          className="transition-all group-hover:stroke-purple-600 group-hover:scale-105"
        />
        <text
          x={cx}
          y={cy}
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif"
          fontSize="20"
          fontWeight="bold"
          fill={isSelected ? '#7e22ce' : isDynamic ? pinColor : '#000000'}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {num}
        </text>
      </g>
    );
  };

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width="100%"
        height="100%"
        className="max-w-[850px] h-auto select-none transition-all duration-300 drop-shadow-md rounded-xl"
        style={{
          backgroundColor: '#ffffff',
        }}
      >
        <defs>
          <style>{`
            .wire { stroke: ${isDynamic ? '#475569' : '#000000'}; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
            .wire-thin { stroke: ${isDynamic ? '#64748b' : '#000000'}; stroke-width: 1.5; fill: none; stroke-linecap: round; stroke-linejoin: round; }
            .box { stroke: ${isDynamic ? '#334155' : '#000000'}; stroke-width: 2; fill: #ffffff; }
            .box-thick { stroke: ${isDynamic ? '#1e293b' : '#000000'}; stroke-width: 2.5; fill: #ffffff; }
            .terminal { stroke: ${isDynamic ? '#334155' : '#000000'}; stroke-width: 2; fill: #ffffff; }
            .dot { fill: ${isDynamic ? '#334155' : '#000000'}; stroke: none; }
            .txt { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 22px; fill: #000000; }
            .txt-bold { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 24px; font-weight: bold; fill: #000000; text-anchor: middle; dominant-baseline: central; }
            .txt-num { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 20px; fill: #000000; text-anchor: middle; dominant-baseline: central; }
            .txt-center { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 21px; fill: #000000; text-anchor: middle; }
          `}</style>

          {/* Glow filter for active elements */}
          <filter id="svg-glow-purple" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="svg-glow-amber" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="svg-glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="#ffffff" />

        {/* ====================================================================== */}
        {/* ESQUEMA SUPERIOR (CSIR)                                                */}
        {/* ====================================================================== */}
        {(mode === 'both' || mode === 'csir') && (
          <g id="esquema-superior">
            {/* Header Badge (Dynamic Mode) */}
            {isDynamic && (
              <g id="badge-csir">
                <rect x="25" y="45" width="370" height="34" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
                <circle cx="45" cy="62" r="5" fill="#f59e0b" />
                <text x="60" y="68" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#0f172a">
                  CSIR con Relé de Potencial (Solo C. Arranque)
                </text>
              </g>
            )}

            {/* Etiquetas C1 y C2 */}
            <rect className="box-thick" x="25" y="115" width="52" height="42" stroke={isDynamic ? colorL1 : '#000000'} strokeWidth={isDynamic ? '2.8' : '2.5'} />
            <text className="txt-bold" x="51" y="136" fill={isDynamic ? colorL1 : '#000000'}>C1</text>

            <rect className="box-thick" x="25" y="210" width="52" height="42" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.8' : '2.5'} />
            <text className="txt-bold" x="51" y="231" fill={isDynamic ? colorL2 : '#000000'}>C2</text>

            {/* Caja Relé de potencial */}
            <rect
              className="box"
              x="165"
              y="112"
              width="150"
              height="146"
              stroke={isDynamic && isCoilEnergized ? '#a855f7' : isDynamic ? '#475569' : '#000000'}
              strokeWidth={isDynamic && isCoilEnergized ? '2.8' : '2'}
              fill={isDynamic && isCoilEnergized ? '#faf5ff' : '#ffffff'}
            />

            {/* Bornes circulares numerados del relé */}
            {renderPin(195, 138, '5', 0)}
            {renderPin(285, 138, '2', 0)}
            {renderPin(228, 186, '6', 0)}
            {renderPin(195, 232, '4', 0)}
            {renderPin(285, 232, '1', 0)}

            {/* Bobina del relé entre 5 y 2 */}
            <path
              className="wire-thin"
              d="M 211,138 
                 c 2.5,-12 9.5,-12 12,0 
                 c 2.5,-12 9.5,-12 12,0 
                 c 2.5,-12 9.5,-12 12,0 
                 c 2.5,-12 9.5,-12 12,0 
                 c 2.5,-12 9.5,-12 12,0 L 269,138"
              stroke={isDynamic ? colorRelayCoil : '#000000'}
              strokeWidth={isDynamic ? (isCoilEnergized ? '3' : '2') : '1.5'}
              filter={isDynamic && isCoilEnergized ? 'url(#svg-glow-purple)' : 'none'}
            />

            {/* Badge de Tensión en Bobina 5-2 */}
            {isDynamic && (
              <g>
                <rect x="206" y="105" width="68" height="18" rx="4" fill={isCoilEnergized ? '#a855f7' : '#f1f5f9'} stroke={isCoilEnergized ? '#7e22ce' : '#cbd5e1'} strokeWidth="1" />
                <text x="240" y="117.5" fontFamily="monospace" fontSize="11" fontWeight="bold" fill={isCoilEnergized ? '#ffffff' : '#64748b'} textAnchor="middle">
                  {fcemVoltage > 0 ? `${fcemVoltage}V (5-2)` : '0V (5-2)'}
                </text>
              </g>
            )}

            {/* Contacto NC entre bornes 2 y 1 */}
            <line className="wire" x1="285" y1="154" x2="285" y2="183" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} />
            <line className="wire" x1="285" y1="195" x2="285" y2="216" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} />
            
            {/* Placas de contacto 1-2 */}
            <line className="wire" x1="272" y1="183" x2="298" y2="183" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} />
            <line
              className="wire"
              x1={isDynamic && isContact12Open ? '264' : '272'}
              y1={isDynamic && isContact12Open ? '203' : '195'}
              x2={isDynamic && isContact12Open ? '290' : '298'}
              y2={isDynamic && isContact12Open ? '203' : '195'}
              stroke={isDynamic ? (isContact12Open ? '#ef4444' : colorStartCap) : '#000000'}
              strokeWidth={isDynamic ? '2.5' : '2'}
            />
            {/* Línea diagonal de apertura NC */}
            <line
              className="wire"
              x1={isDynamic && isContact12Open ? '256' : '266'}
              y1={isDynamic && isContact12Open ? '214' : '202'}
              x2={isDynamic && isContact12Open ? '304' : '304'}
              y2={isDynamic && isContact12Open ? '154' : '162'}
              stroke={isDynamic ? (isContact12Open ? '#ef4444' : '#64748b') : '#000000'}
              strokeWidth={isDynamic ? (isContact12Open ? '3' : '2') : '2'}
              strokeDasharray={isDynamic && isContact12Open ? '3 2' : 'none'}
            />

            {/* Badge de estado del contacto NC 1-2 */}
            {isDynamic && (
              <g>
                <rect x="296" y="174" width="70" height="18" rx="4" fill={isContact12Open ? '#fee2e2' : '#fef3c7'} stroke={isContact12Open ? '#ef4444' : '#f59e0b'} strokeWidth="1" />
                <text x="331" y="186.5" fontFamily="monospace" fontSize="9.5" fontWeight="bold" fill={isContact12Open ? '#dc2626' : '#b45309'} textAnchor="middle">
                  {isContact12Open ? 'ABIERTO (f.c.e.m.)' : 'CERRADO (NC)'}
                </text>
              </g>
            )}

            {/* Cableado hacia relé y condensador de arranque */}
            {/* C1 a borne 5 */}
            <line className="wire" x1="77" y1="136" x2="179" y2="136" stroke={isDynamic ? colorL1 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            
            {/* C2 a borne 4 */}
            <line className="wire" x1="77" y1="231" x2="179" y2="231" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <circle className="dot" cx="126" cy="231" r="4.5" fill={isDynamic ? colorL2 : '#000000'} />
            <line className="wire" x1="126" y1="231" x2="126" y2="390" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <line className="wire" x1="126" y1="390" x2="435" y2="390" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />

            {/* Salidas inferiores hacia condensador de arranque */}
            <line className="wire" x1="195" y1="248" x2="195" y2="278" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.4' : '2'} />
            <line className="wire" x1="195" y1="278" x2="228" y2="278" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.4' : '2'} />

            <line className="wire" x1="285" y1="248" x2="285" y2="278" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '2.4' : '2'} />
            <line className="wire" x1="285" y1="278" x2="242" y2="278" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '2.4' : '2'} />

            {/* Bloque dieléctrico cuando el condensador está en carga */}
            {isDynamic && isStarting && (
              <rect x="228" y="264" width="14" height="40" fill="#facc15" filter="url(#svg-glow-amber)" />
            )}

            {/* Placas del condensador de arranque */}
            <line className="wire" x1="228" y1="264" x2="228" y2="304" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '3.5' : '2'} />
            <line className="wire" x1="242" y1="264" x2="242" y2="304" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '3.5' : '2'} />

            {/* Badge de estado del condensador */}
            {isDynamic && (
              <g>
                <rect x="210" y="308" width="80" height="15" rx="3" fill={isStarting ? '#fef3c7' : '#f1f5f9'} stroke={isStarting ? '#f59e0b' : '#cbd5e1'} strokeWidth="1" />
                <text x="250" y="319" fontFamily="monospace" fontSize="9" fontWeight="bold" fill={isStarting ? '#b45309' : '#64748b'} textAnchor="middle">
                  {isStarting ? 'EN CARGA (12A)' : 'DESCONECTADO'}
                </text>
              </g>
            )}

            {/* Líneas a motor y protector */}
            {/* Línea superior desde borne 5 a protector (C) */}
            <polyline className="wire" points="195,122 195,108 435,108" stroke={isDynamic ? colorL1 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />

            {/* Línea desde contacto 2 a borne arranque (S) */}
            <polyline
              className="wire"
              points="285,122 285,126 422,126 422,201 435,201"
              stroke={isDynamic ? (isStarting ? colorStartCap : colorRelayCoil) : '#000000'}
              strokeWidth={isDynamic ? '2.6' : '2'}
            />

            {/* Terminales C, S, R del compresor */}
            <circle className="terminal" cx="441" cy="108" r="6" stroke={isDynamic ? colorL1 : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} fill="#ffffff" />
            <text className="txt-bold" x="441" y="80" fill={isDynamic ? colorL1 : '#000000'}>C</text>

            <circle className="terminal" cx="441" cy="201" r="6" stroke={isDynamic ? colorWindingAux : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} fill="#ffffff" />
            <text className="txt-bold" x="441" y="174" fill={isDynamic ? colorWindingAux : '#000000'}>S</text>

            <circle className="terminal" cx="441" cy="390" r="6" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} fill="#ffffff" />
            <text className="txt-bold" x="441" y="418" fill={isDynamic ? colorL2 : '#000000'}>R</text>

            {/* Protector térmico bimetálico (Klixon) */}
            <path
              className="box"
              d="M 515,108 C 515,94 610,94 610,108 C 610,122 515,122 515,108 Z"
              stroke={isDynamic && isOverload ? '#ef4444' : isDynamic ? '#334155' : '#000000'}
              strokeWidth={isDynamic && isOverload ? '2.5' : '2'}
              fill={isDynamic && isOverload ? '#fee2e2' : '#ffffff'}
            />
            <circle className="terminal" cx="533" cy="108" r="4.5" stroke={isDynamic ? colorL1 : '#000000'} />
            <circle className="terminal" cx="592" cy="108" r="4.5" stroke={isDynamic ? colorL1 : '#000000'} />
            <path
              className="wire-thin"
              d={isDynamic && isOverload ? "M 533,108 Q 562.5,82 585,96" : "M 533,108 Q 562.5,95 592,108"}
              stroke={isDynamic && isOverload ? '#ef4444' : isDynamic ? colorL1 : '#000000'}
              strokeWidth={isDynamic ? '2.5' : '1.5'}
            />
            <line className="wire" x1="447" y1="108" x2="515" y2="108" stroke={isDynamic ? colorL1 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <line className="wire" x1="610" y1="108" x2="720" y2="108" stroke={isDynamic ? (isOverload ? '#94a3b8' : colorL1) : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />

            {/* Flecha indicadora protector */}
            <line className="wire-thin" x1="620" y1="57" x2="568" y2="92" stroke={isDynamic ? '#64748b' : '#000000'} />
            <text className="txt-center" x="625" y="45" fill={isDynamic ? '#1e293b' : '#000000'} fontSize="18" fontWeight="bold">
              Protector de motor (Klixon)
            </text>

            {/* Conexión hacia Bobina de Arranque */}
            <polyline className="wire" points="447,201 668,201 668,187" stroke={isDynamic ? (isStarting ? colorStartCap : isRunning ? '#94a3b8' : '#64748b') : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <circle className="dot" cx="668" cy="108" r="4" fill={isDynamic ? (isOverload ? '#94a3b8' : colorL1) : '#000000'} />
            <line className="wire" x1="668" y1="108" x2="668" y2="122" stroke={isDynamic ? (isOverload ? '#94a3b8' : isStarting ? colorStartCap : isRunning ? '#94a3b8' : '#64748b') : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />

            {/* Espiras Bobina de Arranque (3 bucles entrelazados) */}
            <path
              className="wire"
              d="M 668,122
                 C 638,122 638,144 668,144
                 C 676,144 676,134 668,134
                 C 638,134 638,156 668,156
                 C 676,156 676,146 668,146
                 C 638,146 638,168 668,168
                 C 676,168 676,158 668,158
                 C 638,158 638,180 668,180
                 L 668,187"
              stroke={isDynamic ? (isOverload ? '#94a3b8' : isStarting ? colorStartCap : isRunning ? '#94a3b8' : '#64748b') : '#000000'}
              strokeWidth={isDynamic ? (isStarting ? '3.5' : '2.5') : '2'}
              filter={isDynamic && isStarting ? 'url(#svg-glow-amber)' : 'none'}
            />

            {/* Espiras Bobina de Marcha (11 bucles entrelazados) */}
            <line className="wire" x1="720" y1="108" x2="720" y2="122" stroke={isDynamic ? (isOverload ? '#94a3b8' : colorWindingMain) : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <path
              className="wire"
              d="M 720,122
                 C 690,122 690,144 720,144 C 728,144 728,134 720,134
                 C 690,134 690,156 720,156 C 728,156 728,146 720,146
                 C 690,146 690,168 720,168 C 728,168 728,158 720,158
                 C 690,158 690,180 720,180 C 728,180 728,170 720,170
                 C 690,170 690,192 720,192 C 728,192 728,182 720,182
                 C 690,182 690,204 720,204 C 728,204 728,194 720,194
                 C 690,194 690,216 720,216 C 728,216 728,206 720,206
                 C 690,206 690,228 720,228 C 728,228 728,218 720,218
                 C 690,218 690,240 720,240 C 728,240 728,230 720,230
                 C 690,230 690,252 720,252 C 728,252 728,242 720,242
                 C 690,242 690,264 720,264 C 728,264 728,254 720,254
                 C 690,254 690,276 720,276 C 728,276 728,266 720,266
                 C 690,266 690,288 720,288 C 728,288 728,278 720,278
                 C 690,278 690,300 720,300 C 728,300 728,290 720,290
                 C 690,290 690,312 720,312 C 728,312 728,302 720,302
                 C 690,302 690,324 720,324 C 728,324 728,314 720,314
                 C 690,314 690,336 720,336 C 728,336 728,326 720,326
                 C 690,326 690,348 720,348 C 728,348 728,338 720,338
                 C 690,338 690,360 720,360 C 728,360 728,350 720,350
                 C 690,350 690,372 720,372
                 L 720,390"
              stroke={isDynamic ? (isOverload ? '#94a3b8' : colorWindingMain) : '#000000'}
              strokeWidth={isDynamic ? (isActive ? '3.5' : '2.5') : '2'}
            />
            <line className="wire" x1="720" y1="390" x2="447" y2="390" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />

            {/* Textos explicativos superiores */}
            <text className="txt" x="219" y="340" fill={isDynamic ? '#1e293b' : '#000000'} fontSize="18" fontWeight="bold">
              Condensador de arranque
            </text>
            <text className="txt" x="502" y="146" fill={isDynamic ? (isStarting ? '#b45309' : '#1e293b') : '#000000'}>Bobina de</text>
            <text className="txt" x="502" y="174" fill={isDynamic ? (isStarting ? '#b45309' : '#1e293b') : '#000000'}>arranque</text>
            <text className="txt" x="599" y="278" fill={isDynamic ? (isActive ? '#047857' : '#1e293b') : '#000000'}>Bobina de</text>
            <text className="txt" x="599" y="306" fill={isDynamic ? (isActive ? '#047857' : '#1e293b') : '#000000'}>marcha</text>

            {/* Símbolo dinámico del motor funcionando a 2.850 RPM (Tacómetro del banco de pruebas) */}
            {isDynamic && (
              <g id="official-motor-running-symbol-csir" transform="translate(615, 215)">
                <circle
                  cx="0"
                  cy="0"
                  r="34"
                  fill="none"
                  stroke={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : '#10b981'}
                  strokeWidth="1.6"
                  strokeDasharray="5 3"
                  opacity={isActive ? '0.4' : '0.1'}
                  className={isActive ? 'animate-ping' : ''}
                  style={{ animationDuration: isStarting ? '1.4s' : '2.2s' }}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="26"
                  fill={isOverload ? '#1c0707' : isStarting ? '#1c1505' : isRunning ? '#022c22' : '#0f172a'}
                  fillOpacity="0.95"
                  stroke={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : isRunning ? '#059669' : '#334155'}
                  strokeWidth="1.8"
                  filter={isActive ? 'drop-shadow(0 0 10px rgba(16,185,129,0.55))' : undefined}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="23"
                  fill="none"
                  stroke={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : isRunning ? '#10b981' : '#475569'}
                  strokeWidth="2.2"
                  strokeDasharray="4 2.5"
                >
                  {isActive && (
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 0 0"
                      to="360 0 0"
                      dur={isStarting ? '0.4s' : '0.8s'}
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                <g>
                  {isActive && (
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 0 0"
                      to="360 0 0"
                      dur={isStarting ? '0.35s' : '0.55s'}
                      repeatCount="indefinite"
                    />
                  )}
                  <path d="M 0 0 L -3 -14 A 14.5 14.5 0 0 1 3 -14 Z" fill={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : isRunning ? '#10b981' : '#475569'} fillOpacity="0.45" />
                  <path d="M 0 0 L 13 -4 A 14.5 14.5 0 0 1 10 10 Z" fill={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : isRunning ? '#10b981' : '#475569'} fillOpacity="0.45" />
                  <path d="M 0 0 L -10 10 A 14.5 14.5 0 0 1 -13 -4 Z" fill={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : isRunning ? '#10b981' : '#475569'} fillOpacity="0.45" />
                </g>
                <circle cx="0" cy="0" r="13" fill={isOverload ? '#1c0707' : isStarting ? '#1c1505' : isRunning ? '#022c22' : '#0a0f1d'} stroke={isOverload ? '#ef4444' : isStarting ? '#fbbf24' : isRunning ? '#34d399' : '#475569'} strokeWidth="1.2" />
                <text x="0" y="1" fill="#ffffff" fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">{isOverload ? '0' : isStarting ? '1.450' : isRunning ? '2.850' : '0'}</text>
                <text x="0" y="8" fill={isOverload ? '#fca5a5' : isStarting ? '#fde68a' : isRunning ? '#6ee7b7' : '#94a3b8'} fontSize="4.2" fontWeight="900" textAnchor="middle" fontFamily="monospace">RPM</text>
              </g>
            )}
          </g>
        )}

        {/* Separador entre esquemas en vista 'both' */}
        {mode === 'both' && (
          <g id="separator-line">
            <line x1="20" y1="495" x2="780" y2="495" stroke={isDynamic ? '#cbd5e1' : '#000000'} strokeWidth="1" strokeDasharray="6 4" />
          </g>
        )}

        {/* ====================================================================== */}
        {/* ESQUEMA INFERIOR (CSR)                                                 */}
        {/* ====================================================================== */}
        {(mode === 'both' || mode === 'csr') && (
          <g id="esquema-inferior" transform="translate(0, 520)">
            {/* Header Badge (Dynamic Mode) */}
            {isDynamic && (
              <g id="badge-csr">
                <rect x="25" y="45" width="415" height="34" rx="6" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
                <circle cx="45" cy="62" r="5" fill="#10b981" />
                <text x="60" y="68" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#065f46">
                  CSR con Relé de Potencial (Doble Condensador)
                </text>
              </g>
            )}

            {/* Etiquetas C1 y C2 */}
            <rect className="box-thick" x="25" y="115" width="52" height="42" stroke={isDynamic ? colorL1 : '#000000'} strokeWidth={isDynamic ? '2.8' : '2.5'} />
            <text className="txt-bold" x="51" y="136" fill={isDynamic ? colorL1 : '#000000'}>C1</text>

            <rect className="box-thick" x="25" y="210" width="52" height="42" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.8' : '2.5'} />
            <text className="txt-bold" x="51" y="231" fill={isDynamic ? colorL2 : '#000000'}>C2</text>

            {/* Caja Relé de potencial */}
            <rect
              className="box"
              x="165"
              y="112"
              width="150"
              height="146"
              stroke={isDynamic && isCoilEnergized ? '#a855f7' : isDynamic ? '#475569' : '#000000'}
              strokeWidth={isDynamic && isCoilEnergized ? '2.8' : '2'}
              fill={isDynamic && isCoilEnergized ? '#faf5ff' : '#ffffff'}
            />

            {/* Bornes circulares numerados del relé */}
            {renderPin(195, 138, '5', 520)}
            {renderPin(285, 138, '2', 520)}
            {renderPin(228, 186, '6', 520)}
            {renderPin(195, 232, '4', 520)}
            {renderPin(285, 232, '1', 520)}

            {/* Bobina del relé entre 5 y 2 */}
            <path
              className="wire-thin"
              d="M 211,138 
                 c 2.5,-12 9.5,-12 12,0 
                 c 2.5,-12 9.5,-12 12,0 
                 c 2.5,-12 9.5,-12 12,0 
                 c 2.5,-12 9.5,-12 12,0 
                 c 2.5,-12 9.5,-12 12,0 L 269,138"
              stroke={isDynamic ? colorRelayCoil : '#000000'}
              strokeWidth={isDynamic ? (isCoilEnergized ? '3' : '2') : '1.5'}
              filter={isDynamic && isCoilEnergized ? 'url(#svg-glow-purple)' : 'none'}
            />

            {/* Badge de Tensión en Bobina 5-2 */}
            {isDynamic && (
              <g>
                <rect x="206" y="105" width="68" height="18" rx="4" fill={isCoilEnergized ? '#a855f7' : '#f1f5f9'} stroke={isCoilEnergized ? '#7e22ce' : '#cbd5e1'} strokeWidth="1" />
                <text x="240" y="117.5" fontFamily="monospace" fontSize="11" fontWeight="bold" fill={isCoilEnergized ? '#ffffff' : '#64748b'} textAnchor="middle">
                  {fcemVoltage > 0 ? `${fcemVoltage}V (5-2)` : '0V (5-2)'}
                </text>
              </g>
            )}

            {/* Contacto NC entre bornes 2 y 1 */}
            <line className="wire" x1="285" y1="154" x2="285" y2="183" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} />
            <line className="wire" x1="285" y1="195" x2="285" y2="216" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} />
            <line className="wire" x1="272" y1="183" x2="298" y2="183" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} />
            <line
              className="wire"
              x1={isDynamic && isContact12Open ? '264' : '272'}
              y1={isDynamic && isContact12Open ? '203' : '195'}
              x2={isDynamic && isContact12Open ? '290' : '298'}
              y2={isDynamic && isContact12Open ? '203' : '195'}
              stroke={isDynamic ? (isContact12Open ? '#ef4444' : colorStartCap) : '#000000'}
              strokeWidth={isDynamic ? '2.5' : '2'}
            />
            <line
              className="wire"
              x1={isDynamic && isContact12Open ? '256' : '266'}
              y1={isDynamic && isContact12Open ? '214' : '202'}
              x2={isDynamic && isContact12Open ? '304' : '304'}
              y2={isDynamic && isContact12Open ? '154' : '162'}
              stroke={isDynamic ? (isContact12Open ? '#ef4444' : '#64748b') : '#000000'}
              strokeWidth={isDynamic ? (isContact12Open ? '3' : '2') : '2'}
              strokeDasharray={isDynamic && isContact12Open ? '3 2' : 'none'}
            />

            {/* Badge de estado del contacto NC 1-2 */}
            {isDynamic && (
              <g>
                <rect x="296" y="174" width="70" height="18" rx="4" fill={isContact12Open ? '#fee2e2' : '#fef3c7'} stroke={isContact12Open ? '#ef4444' : '#f59e0b'} strokeWidth="1" />
                <text x="331" y="186.5" fontFamily="monospace" fontSize="9.5" fontWeight="bold" fill={isContact12Open ? '#dc2626' : '#b45309'} textAnchor="middle">
                  {isContact12Open ? 'ABIERTO (f.c.e.m.)' : 'CERRADO (NC)'}
                </text>
              </g>
            )}

            {/* Cableado hacia relé */}
            <line className="wire" x1="77" y1="136" x2="179" y2="136" stroke={isDynamic ? colorL1 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            
            <line className="wire" x1="77" y1="231" x2="179" y2="231" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <circle className="dot" cx="126" cy="231" r="4.5" fill={isDynamic ? colorL2 : '#000000'} />
            <line className="wire" x1="126" y1="231" x2="126" y2="390" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <line className="wire" x1="126" y1="390" x2="435" y2="390" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />

            {/* Conexiones a condensadores duales (Arranque y Marcha) */}
            {/* Rama izquierda desde borne 4 a ambos condensadores */}
            <line className="wire" x1="195" y1="248" x2="195" y2="338" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <line className="wire" x1="195" y1="338" x2="228" y2="338" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <line className="wire" x1="195" y1="288" x2="228" y2="288" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <circle className="dot" cx="195" cy="288" r="4.5" fill={isDynamic ? colorL2 : '#000000'} />

            {/* Bloque dieléctrico cuando los condensadores están en carga */}
            {isDynamic && isStarting && (
              <rect x="228" y="274" width="14" height="40" fill="#facc15" filter="url(#svg-glow-amber)" />
            )}
            {isDynamic && isActive && (
              <rect x="228" y="324" width="14" height="40" fill="#facc15" filter="url(#svg-glow-cyan)" />
            )}

            {/* Placas de Condensador de Arranque (superior) */}
            <line className="wire" x1="228" y1="274" x2="228" y2="314" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '3.5' : '2'} />
            <line className="wire" x1="242" y1="274" x2="242" y2="314" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '3.5' : '2'} />

            {/* Placas de Condensador de Marcha (inferior) */}
            <line className="wire" x1="228" y1="324" x2="228" y2="364" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '3.5' : '2'} />
            <line className="wire" x1="242" y1="324" x2="242" y2="364" stroke={isDynamic ? colorRunCap : '#000000'} strokeWidth={isDynamic ? '3.5' : '2'} />

            {/* Retorno del Condensador de Arranque hacia borne 1 */}
            <line className="wire" x1="285" y1="248" x2="285" y2="288" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '2.4' : '2'} />
            <line className="wire" x1="285" y1="288" x2="242" y2="288" stroke={isDynamic ? (isContact12Open ? '#94a3b8' : colorStartCap) : '#000000'} strokeWidth={isDynamic ? '2.4' : '2'} />

            {/* Retorno del Condensador de Marcha directo a línea de borne 2 */}
            <polyline
              className="wire"
              points="242,338 408,338 408,136 295,136"
              stroke={isDynamic ? colorRunCap : '#000000'}
              strokeWidth={isDynamic ? '2.6' : '2'}
            />
            <circle className="dot" cx="295" cy="136" r="4" fill={isDynamic ? colorRunCap : '#000000'} />

            {/* Badges de estado de los condensadores */}
            {isDynamic && (
              <g>
                <rect x="248" y="278" width="85" height="15" rx="3" fill={isStarting ? '#fef3c7' : '#f1f5f9'} stroke={isStarting ? '#f59e0b' : '#cbd5e1'} strokeWidth="1" />
                <text x="290" y="289" fontFamily="monospace" fontSize="8.5" fontWeight="bold" fill={isStarting ? '#b45309' : '#64748b'} textAnchor="middle">
                  {isStarting ? 'ARRANQUE (12A)' : 'DESCONECTADO'}
                </text>

                <rect x="248" y="328" width="95" height="15" rx="3" fill={isActive ? '#e0f2fe' : '#f1f5f9'} stroke={isActive ? '#0284c7' : '#cbd5e1'} strokeWidth="1" />
                <text x="295" y="339" fontFamily="monospace" fontSize="8.5" fontWeight="bold" fill={isActive ? '#0369a1' : '#64748b'} textAnchor="middle">
                  {isActive ? 'MARCHA PERMANENTE' : 'INACTIVO'}
                </text>
              </g>
            )}

            {/* Líneas a motor y protector */}
            {/* Línea superior desde borne 5 a protector (C) */}
            <polyline className="wire" points="195,122 195,108 435,108" stroke={isDynamic ? colorL1 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />

            {/* Línea desde borne 2 a borne arranque (S) */}
            <polyline
              className="wire"
              points="285,122 285,126 418,126 418,201 435,201"
              stroke={isDynamic ? (isStarting ? colorStartCap : isRunning ? colorRunCap : colorRelayCoil) : '#000000'}
              strokeWidth={isDynamic ? '2.6' : '2'}
            />

            {/* Terminales C, S, R del compresor */}
            <circle className="terminal" cx="441" cy="108" r="6" stroke={isDynamic ? colorL1 : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} fill="#ffffff" />
            <text className="txt-bold" x="441" y="80" fill={isDynamic ? colorL1 : '#000000'}>C</text>

            <circle className="terminal" cx="441" cy="201" r="6" stroke={isDynamic ? colorWindingAux : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} fill="#ffffff" />
            <text className="txt-bold" x="441" y="174" fill={isDynamic ? colorWindingAux : '#000000'}>S</text>

            <circle className="terminal" cx="441" cy="390" r="6" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.5' : '2'} fill="#ffffff" />
            <text className="txt-bold" x="441" y="418" fill={isDynamic ? colorL2 : '#000000'}>R</text>

            {/* Protector térmico bimetálico (Klixon) */}
            <path
              className="box"
              d="M 515,108 C 515,94 610,94 610,108 C 610,122 515,122 515,108 Z"
              stroke={isDynamic && isOverload ? '#ef4444' : isDynamic ? '#334155' : '#000000'}
              strokeWidth={isDynamic && isOverload ? '2.5' : '2'}
              fill={isDynamic && isOverload ? '#fee2e2' : '#ffffff'}
            />
            <circle className="terminal" cx="533" cy="108" r="4.5" stroke={isDynamic ? colorL1 : '#000000'} />
            <circle className="terminal" cx="592" cy="108" r="4.5" stroke={isDynamic ? colorL1 : '#000000'} />
            <path
              className="wire-thin"
              d={isDynamic && isOverload ? "M 533,108 Q 562.5,82 585,96" : "M 533,108 Q 562.5,95 592,108"}
              stroke={isDynamic && isOverload ? '#ef4444' : isDynamic ? colorL1 : '#000000'}
              strokeWidth={isDynamic ? '2.5' : '1.5'}
            />
            <line className="wire" x1="447" y1="108" x2="515" y2="108" stroke={isDynamic ? colorL1 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <line className="wire" x1="610" y1="108" x2="720" y2="108" stroke={isDynamic ? (isOverload ? '#94a3b8' : colorL1) : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />

            {/* Flecha indicadora protector */}
            <line className="wire-thin" x1="620" y1="57" x2="568" y2="92" stroke={isDynamic ? '#64748b' : '#000000'} />
            <text className="txt-center" x="625" y="45" fill={isDynamic ? '#1e293b' : '#000000'} fontSize="18" fontWeight="bold">
              Protector de motor (Klixon)
            </text>

            {/* Conexión hacia Bobina de Arranque */}
            <polyline className="wire" points="447,201 668,201 668,187" stroke={isDynamic ? (isStarting ? colorStartCap : isRunning ? colorRunCap : '#64748b') : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <circle className="dot" cx="668" cy="108" r="4" fill={isDynamic ? (isOverload ? '#94a3b8' : colorL1) : '#000000'} />
            <line className="wire" x1="668" y1="108" x2="668" y2="122" stroke={isDynamic ? (isOverload ? '#94a3b8' : isStarting ? colorStartCap : isRunning ? colorRunCap : '#64748b') : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />

            {/* Espiras Bobina de Arranque */}
            <path
              className="wire"
              d="M 668,122
                 C 638,122 638,144 668,144
                 C 676,144 676,134 668,134
                 C 638,134 638,156 668,156
                 C 676,156 676,146 668,146
                 C 638,146 638,168 668,168
                 C 676,168 676,158 668,158
                 C 638,158 638,180 668,180
                 L 668,187"
              stroke={isDynamic ? (isOverload ? '#94a3b8' : isStarting ? colorStartCap : isRunning ? colorRunCap : '#64748b') : '#000000'}
              strokeWidth={isDynamic ? (isActive ? '3.5' : '2.5') : '2'}
              filter={isDynamic && isStarting ? 'url(#svg-glow-amber)' : isDynamic && isRunning ? 'url(#svg-glow-cyan)' : 'none'}
            />

            {/* Espiras Bobina de Marcha */}
            <line className="wire" x1="720" y1="108" x2="720" y2="122" stroke={isDynamic ? (isOverload ? '#94a3b8' : colorWindingMain) : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />
            <path
              className="wire"
              d="M 720,122
                 C 690,122 690,144 720,144 C 728,144 728,134 720,134
                 C 690,134 690,156 720,156 C 728,156 728,146 720,146
                 C 690,146 690,168 720,168 C 728,168 728,158 720,158
                 C 690,158 690,180 720,180 C 728,180 728,170 720,170
                 C 690,170 690,192 720,192 C 728,192 728,182 720,182
                 C 690,182 690,204 720,204 C 728,204 728,194 720,194
                 C 690,194 690,216 720,216 C 728,216 728,206 720,206
                 C 690,206 690,228 720,228 C 728,228 728,218 720,218
                 C 690,218 690,240 720,240 C 728,240 728,230 720,230
                 C 690,230 690,252 720,252 C 728,252 728,242 720,242
                 C 690,242 690,264 720,264 C 728,264 728,254 720,254
                 C 690,254 690,276 720,276 C 728,276 728,266 720,266
                 C 690,266 690,288 720,288 C 728,288 728,278 720,278
                 C 690,278 690,300 720,300 C 728,300 728,290 720,290
                 C 690,290 690,312 720,312 C 728,312 728,302 720,302
                 C 690,302 690,324 720,324 C 728,324 728,314 720,314
                 C 690,314 690,336 720,336 C 728,336 728,326 720,326
                 C 690,326 690,348 720,348 C 728,348 728,338 720,338
                 C 690,338 690,360 720,360 C 728,360 728,350 720,350
                 C 690,350 690,372 720,372
                 L 720,390"
              stroke={isDynamic ? (isOverload ? '#94a3b8' : colorWindingMain) : '#000000'}
              strokeWidth={isDynamic ? (isActive ? '3.5' : '2.5') : '2'}
            />
            <line className="wire" x1="720" y1="390" x2="447" y2="390" stroke={isDynamic ? colorL2 : '#000000'} strokeWidth={isDynamic ? '2.6' : '2'} />

            {/* Textos explicativos inferiores */}
            <text className="txt" x="350" y="290" fill={isDynamic ? '#1e293b' : '#000000'} fontSize="16" fontWeight="bold">
              Cond. arranque
            </text>
            <text className="txt" x="350" y="340" fill={isDynamic ? '#0369a1' : '#000000'} fontSize="16" fontWeight="bold">
              Cond. marcha
            </text>
            <text className="txt" x="502" y="146" fill={isDynamic ? (isStarting ? '#b45309' : isRunning ? '#0369a1' : '#1e293b') : '#000000'}>Bobina de</text>
            <text className="txt" x="502" y="174" fill={isDynamic ? (isStarting ? '#b45309' : isRunning ? '#0369a1' : '#1e293b') : '#000000'}>arranque</text>
            <text className="txt" x="599" y="278" fill={isDynamic ? (isActive ? '#047857' : '#1e293b') : '#000000'}>Bobina de</text>
            <text className="txt" x="599" y="306" fill={isDynamic ? (isActive ? '#047857' : '#1e293b') : '#000000'}>marcha</text>

            {/* Símbolo dinámico del motor funcionando a 2.850 RPM (Tacómetro del banco de pruebas) */}
            {isDynamic && (
              <g id="official-motor-running-symbol-csr" transform="translate(615, 215)">
                <circle
                  cx="0"
                  cy="0"
                  r="34"
                  fill="none"
                  stroke={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : '#10b981'}
                  strokeWidth="1.6"
                  strokeDasharray="5 3"
                  opacity={isActive ? '0.4' : '0.1'}
                  className={isActive ? 'animate-ping' : ''}
                  style={{ animationDuration: isStarting ? '1.4s' : '2.2s' }}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="26"
                  fill={isOverload ? '#1c0707' : isStarting ? '#1c1505' : isRunning ? '#022c22' : '#0f172a'}
                  fillOpacity="0.95"
                  stroke={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : isRunning ? '#059669' : '#334155'}
                  strokeWidth="1.8"
                  filter={isActive ? 'drop-shadow(0 0 10px rgba(16,185,129,0.55))' : undefined}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="23"
                  fill="none"
                  stroke={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : isRunning ? '#10b981' : '#475569'}
                  strokeWidth="2.2"
                  strokeDasharray="4 2.5"
                >
                  {isActive && (
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 0 0"
                      to="360 0 0"
                      dur={isStarting ? '0.4s' : '0.8s'}
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                <g>
                  {isActive && (
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 0 0"
                      to="360 0 0"
                      dur={isStarting ? '0.35s' : '0.55s'}
                      repeatCount="indefinite"
                    />
                  )}
                  <path d="M 0 0 L -3 -14 A 14.5 14.5 0 0 1 3 -14 Z" fill={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : isRunning ? '#10b981' : '#475569'} fillOpacity="0.45" />
                  <path d="M 0 0 L 13 -4 A 14.5 14.5 0 0 1 10 10 Z" fill={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : isRunning ? '#10b981' : '#475569'} fillOpacity="0.45" />
                  <path d="M 0 0 L -10 10 A 14.5 14.5 0 0 1 -13 -4 Z" fill={isOverload ? '#ef4444' : isStarting ? '#f59e0b' : isRunning ? '#10b981' : '#475569'} fillOpacity="0.45" />
                </g>
                <circle cx="0" cy="0" r="13" fill={isOverload ? '#1c0707' : isStarting ? '#1c1505' : isRunning ? '#022c22' : '#0a0f1d'} stroke={isOverload ? '#ef4444' : isStarting ? '#fbbf24' : isRunning ? '#34d399' : '#475569'} strokeWidth="1.2" />
                <text x="0" y="1" fill="#ffffff" fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">{isOverload ? '0' : isStarting ? '1.450' : isRunning ? '2.850' : '0'}</text>
                <text x="0" y="8" fill={isOverload ? '#fca5a5' : isStarting ? '#fde68a' : isRunning ? '#6ee7b7' : '#94a3b8'} fontSize="4.2" fontWeight="900" textAnchor="middle" fontFamily="monospace">RPM</text>
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
