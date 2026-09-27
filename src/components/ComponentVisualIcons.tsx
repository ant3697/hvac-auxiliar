import React from 'react';

interface VisualIconProps {
  className?: string;
  size?: number;
}

// 1. Relé Combinado Danfoss 117U (Bobina horizontal izquierda + Bloque negro + Klixon redondo derecho)
export const Danfoss117UIcon: React.FC<VisualIconProps> = ({ className = '', size = 120 }) => (
  <svg
    viewBox="0 0 160 90"
    width={size}
    height={(size * 90) / 160}
    className={`select-none ${className}`}
  >
    <defs>
      <linearGradient id="danfoss-coil" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
      <linearGradient id="danfoss-body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#262626" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
    </defs>
    {/* Bobina horizontal externa a la izquierda */}
    <rect x="10" y="28" width="18" height="34" rx="4" fill="#171717" stroke="#404040" strokeWidth="1.5" />
    <path d="M 2 45 L 10 45" stroke="#525252" strokeWidth="4" strokeLinecap="round" />
    <rect x="18" y="24" width="22" height="42" rx="3" fill="url(#danfoss-coil)" stroke="#78350f" strokeWidth="1" />
    {/* Espiras de cobre */}
    <line x1="22" y1="25" x2="22" y2="65" stroke="#fde68a" strokeWidth="1" strokeOpacity="0.7" />
    <line x1="26" y1="25" x2="26" y2="65" stroke="#fde68a" strokeWidth="1" strokeOpacity="0.7" />
    <line x1="30" y1="25" x2="30" y2="65" stroke="#fde68a" strokeWidth="1" strokeOpacity="0.7" />
    <line x1="34" y1="25" x2="34" y2="65" stroke="#fde68a" strokeWidth="1" strokeOpacity="0.7" />
    {/* Cuerpo central negro */}
    <rect x="38" y="16" width="68" height="58" rx="6" fill="url(#danfoss-body)" stroke="#525252" strokeWidth="1.5" />
    {/* Terminales faston superiores */}
    <rect x="48" y="8" width="5" height="10" fill="#d4d4d8" stroke="#71717a" strokeWidth="0.8" rx="1" />
    <rect x="62" y="6" width="5" height="12" fill="#d4d4d8" stroke="#71717a" strokeWidth="0.8" rx="1" />
    <rect x="76" y="8" width="5" height="10" fill="#d4d4d8" stroke="#71717a" strokeWidth="0.8" rx="1" />
    {/* Etiqueta 117U */}
    <rect x="48" y="44" width="34" height="18" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
    <text x="65" y="52" fontFamily="monospace" fontSize="6" fontWeight="bold" fill="#713f12" textAnchor="middle">
      Relay
    </text>
    <text x="65" y="59" fontFamily="monospace" fontSize="6.5" fontWeight="bold" fill="#1c1917" textAnchor="middle">
      117U 2030
    </text>
    {/* Klixon redondo integrado a la derecha */}
    <circle cx="125" cy="45" r="22" fill="#171717" stroke="#404040" strokeWidth="2" />
    <circle cx="125" cy="45" r="17" fill="#262626" />
    {/* Bornes del klixon */}
    <circle cx="118" cy="38" r="3" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
    <circle cx="132" cy="38" r="3" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
    <circle cx="125" cy="53" r="3" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
    {/* Etiqueta circular Klixon */}
    <path d="M 112 58 Q 125 64 138 58" stroke="#84cc16" strokeWidth="4" fill="none" strokeLinecap="round" />
  </svg>
);

// 2. Relé Amperimétrico con Soporte Metálico (Tipo Texas Instruments / Embraco)
export const BracketRelayIcon: React.FC<VisualIconProps> = ({ className = '', size = 110 }) => (
  <svg
    viewBox="0 0 130 110"
    width={size}
    height={(size * 110) / 130}
    className={`select-none ${className}`}
  >
    <defs>
      <linearGradient id="metal-bracket" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="50%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
    </defs>
    {/* Soporte metálico trasero */}
    <path
      d="M 22 18 L 108 18 L 108 30 L 98 30 L 98 90 L 108 90 L 108 100 L 22 100 Z"
      fill="url(#metal-bracket)"
      stroke="#64748b"
      strokeWidth="1.5"
    />
    <circle cx="28" cy="24" r="3.5" fill="#475569" />
    <circle cx="28" cy="94" r="3.5" fill="#475569" />
    {/* Cuerpo del relé negro */}
    <rect x="32" y="24" width="66" height="66" rx="5" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
    {/* Ventana de la bobina de cobre */}
    <rect x="46" y="34" width="38" height="28" rx="3" fill="#09090b" stroke="#27272a" />
    <rect x="50" y="37" width="30" height="22" rx="2" fill="#d97706" />
    {/* Espiras de cobre */}
    <line x1="55" y1="37" x2="55" y2="59" stroke="#fef08a" strokeWidth="1" />
    <line x1="60" y1="37" x2="60" y2="59" stroke="#fef08a" strokeWidth="1" />
    <line x1="65" y1="37" x2="65" y2="59" stroke="#fef08a" strokeWidth="1" />
    <line x1="70" y1="37" x2="70" y2="59" stroke="#fef08a" strokeWidth="1" />
    <line x1="75" y1="37" x2="75" y2="59" stroke="#fef08a" strokeWidth="1" />
    {/* Contactos hembra inferiores y terminal faston */}
    <circle cx="48" cy="74" r="4.5" fill="#09090b" stroke="#71717a" strokeWidth="1" />
    <circle cx="82" cy="74" r="4.5" fill="#09090b" stroke="#71717a" strokeWidth="1" />
    <rect x="60" y="10" width="10" height="16" fill="#fde047" stroke="#ca8a04" rx="1" />
  </svg>
);

// 3. Relé de Bobina Desnuda Vertical (Tipo B5A..B16A con émbolo central)
export const BareBobbinRelayIcon: React.FC<VisualIconProps> = ({ className = '', size = 110 }) => (
  <svg
    viewBox="0 0 120 120"
    width={size}
    height={size}
    className={`select-none ${className}`}
  >
    {/* Base de plástico blanco/marfil */}
    <rect x="25" y="75" width="70" height="28" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
    {/* Terminales faston en la base */}
    <rect x="18" y="86" width="12" height="6" fill="#cbd5e1" stroke="#64748b" rx="1" />
    <rect x="18" y="94" width="12" height="6" fill="#cbd5e1" stroke="#64748b" rx="1" />
    {/* Carrete cilíndrico */}
    <ellipse cx="60" cy="72" rx="28" ry="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
    {/* Devanado de cobre */}
    <rect x="36" y="38" width="48" height="34" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1" />
    <line x1="42" y1="38" x2="42" y2="72" stroke="#fde68a" strokeWidth="1.2" />
    <line x1="48" y1="38" x2="48" y2="72" stroke="#fde68a" strokeWidth="1.2" />
    <line x1="54" y1="38" x2="54" y2="72" stroke="#fde68a" strokeWidth="1.2" />
    <line x1="60" y1="38" x2="60" y2="72" stroke="#fde68a" strokeWidth="1.2" />
    <line x1="66" y1="38" x2="66" y2="72" stroke="#fde68a" strokeWidth="1.2" />
    <line x1="72" y1="38" x2="72" y2="72" stroke="#fde68a" strokeWidth="1.2" />
    <line x1="78" y1="38" x2="78" y2="72" stroke="#fde68a" strokeWidth="1.2" />
    {/* Disco superior del carrete */}
    <ellipse cx="60" cy="38" rx="28" ry="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
    {/* Émbolo central blanco que sobresale */}
    <rect x="52" y="12" width="16" height="30" rx="3" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.2" />
    <ellipse cx="60" cy="12" rx="8" ry="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
  </svg>
);

// 4. Relé Amperimétrico Cuadrado Compacto (Tipo QP2 / Baquelita Negra)
export const SquareRelayIcon: React.FC<VisualIconProps> = ({ className = '', size = 110 }) => (
  <svg
    viewBox="0 0 120 110"
    width={size}
    height={(size * 110) / 120}
    className={`select-none ${className}`}
  >
    {/* Cuerpo cuadrado negro */}
    <rect x="22" y="20" width="76" height="76" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
    {/* Relieve circular central */}
    <circle cx="60" cy="58" r="18" fill="#27272a" stroke="#525252" strokeWidth="1" />
    {/* Contactos hembra para bornes compresor */}
    <circle cx="44" cy="74" r="5" fill="#09090b" stroke="#fbbf24" strokeWidth="1.5" />
    <circle cx="76" cy="74" r="5" fill="#09090b" stroke="#fbbf24" strokeWidth="1.5" />
    <circle cx="60" cy="42" r="5" fill="#09090b" stroke="#fbbf24" strokeWidth="1.5" />
    {/* Terminal Faston dorado superior */}
    <path d="M 52 10 L 68 10 L 68 20 L 52 20 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
    <circle cx="60" cy="14" r="2" fill="#78350f" />
    {/* Marcas de grabado */}
    <text x="36" y="34" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#71717a">
      1
    </text>
    <text x="80" y="34" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#71717a">
      2
    </text>
  </svg>
);

// 5. Protectores Térmicos de Gran Potencia (3 y 5 HP con bornes de tornillo A o cable B)
export const HeavyDutyProtectorIcon: React.FC<VisualIconProps> = ({ className = '', size = 120 }) => (
  <svg
    viewBox="0 0 140 100"
    width={size}
    height={(size * 100) / 140}
    className={`select-none ${className}`}
  >
    {/* Base circular grande */}
    <ellipse cx="70" cy="65" rx="46" ry="24" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
    <rect x="24" y="36" width="92" height="30" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
    <ellipse cx="70" cy="36" rx="46" ry="24" fill="#27272a" stroke="#525252" strokeWidth="2" />
    {/* Bornes de tornillo pesados de alta potencia */}
    <rect x="42" y="16" width="10" height="22" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" rx="1" />
    <circle cx="47" cy="16" r="6" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
    <line x1="44" y1="16" x2="50" y2="16" stroke="#334155" strokeWidth="2" />

    <rect x="88" y="16" width="10" height="22" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" rx="1" />
    <circle cx="93" cy="16" r="6" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
    <line x1="90" y1="16" x2="96" y2="16" stroke="#334155" strokeWidth="2" />

    {/* Cable con capuchón protector */}
    <path d="M 93 26 C 93 4 125 10 120 28" fill="none" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
    <rect x="112" y="24" width="16" height="8" rx="2" fill="#93c5fd" stroke="#2563eb" strokeWidth="1" />
  </svg>
);

// 6. Protectores Térmicos Bimetálicos Klixon Serie JRT4 (Redondos 3/4")
export const Jrt4ProtectorIcon: React.FC<VisualIconProps> = ({ className = '', size = 110 }) => (
  <svg
    viewBox="0 0 120 110"
    width={size}
    height={(size * 110) / 120}
    className={`select-none ${className}`}
  >
    {/* Cuerpo redondo de baquelita */}
    <ellipse cx="60" cy="74" rx="34" ry="18" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
    <rect x="26" y="44" width="68" height="30" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
    <ellipse cx="60" cy="44" rx="34" ry="18" fill="#27272a" stroke="#525252" strokeWidth="1.5" />
    {/* Tapa metálica bimetálica interior */}
    <ellipse cx="60" cy="44" rx="24" ry="11" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
    {/* Terminales Faston rectos / acodados */}
    <rect x="42" y="14" width="9" height="24" rx="1.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
    <circle cx="46.5" cy="20" r="2" fill="#475569" />

    <rect x="69" y="14" width="9" height="24" rx="1.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
    <circle cx="73.5" cy="20" r="2" fill="#475569" />
  </svg>
);
