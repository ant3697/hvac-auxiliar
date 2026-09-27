export interface Danfoss117URelay {
  id: string;
  model: string;
  connectCurrent: number; // A
  releaseCurrent: number; // A
  overloadCurrent: number; // A
  appliedTemp: string; // ℃
  connectTemp: string; // ℃
  recommendedHp: string;
  approxPowerW: number;
  description: string;
}

export interface BracketAmperometricRelay {
  id: string;
  hp: string;
  powerW: number;
  maxConnectCurrent: number; // A
  minReleaseCurrent: number; // A
  format: string;
}

export interface BareBobbinRelay {
  id: string;
  hp: string;
  model: string;
  maxConnectCurrent: number; // A
  minReleaseCurrent: number; // A
  approxPowerW: number;
}

export interface SquareCompactRelay {
  id: string;
  hp: string;
  powerW: number;
  maxConnectCurrent: number; // A
  releaseCurrent: number; // A
  format: string;
}

export interface HeavyDutyProtector {
  id: string;
  hp: string;
  powerW: number;
  overloadCurrent: number; // A
  movementTemp: string;
  replyReturnTemp: string;
  variants: string;
  application: string;
}

export interface Jrt4Protector {
  id: string;
  model: string;
  powerDesc: string;
  hp: string;
  powerW: number;
  overloadCurrent: number; // A
  appliedTemp: string;
  restoredTemp: string;
  variants: string;
}

// 1. Relé Combinado Danfoss 117U (Relé + Klixon en bloque)
export const DANFOSS_117U_LIST: Danfoss117URelay[] = [
  {
    id: '117u_2010',
    model: '117 μ 2010',
    connectCurrent: 2.0,
    releaseCurrent: 1.6,
    overloadCurrent: 4.0,
    appliedTemp: '105 ± 10 ℃',
    connectTemp: '60 ± 10 ℃',
    recommendedHp: '1/12 - 1/8 HP',
    approxPowerW: 93,
    description: 'Relé de intensidad con protector bimetálico circular integrado para pequeños compresores domésticos.',
  },
  {
    id: '117u_2030',
    model: '117 μ 2030',
    connectCurrent: 3.0,
    releaseCurrent: 2.6,
    overloadCurrent: 5.0,
    appliedTemp: '105 ± 10 ℃',
    connectTemp: '60 ± 10 ℃',
    recommendedHp: '1/6 - 1/5 HP',
    approxPowerW: 135,
    description: 'Modelo estándar para refrigeradores domésticos de 1/6 a 1/5 CV. Bobina horizontal exterior.',
  },
  {
    id: '117u_2040',
    model: '117 μ 2040',
    connectCurrent: 4.0,
    releaseCurrent: 3.6,
    overloadCurrent: 6.5,
    appliedTemp: '105 ± 10 ℃',
    connectTemp: '60 ± 10 ℃',
    recommendedHp: '1/4 HP',
    approxPowerW: 180,
    description: 'Para compresores de 1/4 CV tipo Danfoss TL / FR con corte térmico calibrado a 6.5 A.',
  },
  {
    id: '117u_2050',
    model: '117 μ 2050',
    connectCurrent: 4.6,
    releaseCurrent: 4.2,
    overloadCurrent: 6.5,
    appliedTemp: '105 ± 10 ℃',
    connectTemp: '60 ± 10 ℃',
    recommendedHp: '1/3 HP',
    approxPowerW: 245,
    description: 'Para compresores comerciales de 1/3 CV (botelleros, vitrinas). Alta corriente de retención.',
  },
];

// 2. Relés Amperimétricos con Soporte Metálico (Tipo Texas Instruments / Aspera / Embraco)
export const BRACKET_RELAYS_LIST: BracketAmperometricRelay[] = [
  { id: 'br_1_8', hp: '1/8 HP', powerW: 93, maxConnectCurrent: 3.0, minReleaseCurrent: 2.6, format: 'Con soporte metálico' },
  { id: 'br_1_6', hp: '1/6 HP', powerW: 125, maxConnectCurrent: 3.6, minReleaseCurrent: 3.0, format: 'Con soporte metálico' },
  { id: 'br_1_5', hp: '1/5 HP', powerW: 150, maxConnectCurrent: 4.25, minReleaseCurrent: 3.35, format: 'Con soporte metálico' },
  { id: 'br_1_4', hp: '1/4 HP', powerW: 180, maxConnectCurrent: 4.75, minReleaseCurrent: 3.75, format: 'Con soporte metálico' },
  { id: 'br_1_3', hp: '1/3 HP', powerW: 245, maxConnectCurrent: 5.3, minReleaseCurrent: 4.25, format: 'Con soporte metálico' },
  { id: 'br_3_8', hp: '3/8 HP', powerW: 275, maxConnectCurrent: 6.0, minReleaseCurrent: 4.75, format: 'Con soporte metálico' },
  { id: 'br_1_2', hp: '1/2 HP', powerW: 375, maxConnectCurrent: 6.5, minReleaseCurrent: 5.0, format: 'Con soporte metálico' },
];

// 3. Relé de Bobina Desnuda Vertical (Tipo B5A..B16A)
export const BARE_BOBBIN_RELAYS_LIST: BareBobbinRelay[] = [
  { id: 'bb_b5a15', hp: '1/12 HP', model: 'B5A15', maxConnectCurrent: 1.85, minReleaseCurrent: 1.6, approxPowerW: 61 },
  { id: 'bb_b8a10', hp: '1/8 HP', model: 'B8A10', maxConnectCurrent: 2.43, minReleaseCurrent: 2.07, approxPowerW: 93 },
  { id: 'bb_b10a19', hp: '1/6 HP', model: 'B10A19', maxConnectCurrent: 3.0, minReleaseCurrent: 2.56, approxPowerW: 125 },
  { id: 'bb_b12a12', hp: '1/5 HP', model: 'B12A12', maxConnectCurrent: 3.5, minReleaseCurrent: 2.95, approxPowerW: 150 },
  { id: 'bb_b16a13', hp: '1/4 HP', model: 'B16A13', maxConnectCurrent: 5.15, minReleaseCurrent: 4.85, approxPowerW: 180 },
  { id: 'bb_b9a11', hp: '1/3 HP', model: 'B9A11', maxConnectCurrent: 7.0, minReleaseCurrent: 5.9, approxPowerW: 245 },
];

// 4. Relé Amperimétrico Compacto en Caja Cuadrada Negra (Tipo QP2 / Baquelita)
export const SQUARE_COMPACT_RELAYS_LIST: SquareCompactRelay[] = [
  { id: 'sq_1_12', hp: '1/12 HP', powerW: 61, maxConnectCurrent: 2.0, releaseCurrent: 1.6, format: 'Carcasa cuadrada baquelita' },
  { id: 'sq_1_10', hp: '1/10 HP', powerW: 74, maxConnectCurrent: 2.5, releaseCurrent: 2.0, format: 'Carcasa cuadrada baquelita' },
  { id: 'sq_1_8', hp: '1/8 HP', powerW: 93, maxConnectCurrent: 3.0, releaseCurrent: 2.6, format: 'Carcasa cuadrada baquelita' },
  { id: 'sq_1_7', hp: '1/7 HP', powerW: 105, maxConnectCurrent: 3.3, releaseCurrent: 2.8, format: 'Carcasa cuadrada baquelita' },
  { id: 'sq_1_6', hp: '1/6 HP', powerW: 125, maxConnectCurrent: 3.6, releaseCurrent: 3.0, format: 'Carcasa cuadrada baquelita' },
  { id: 'sq_1_5', hp: '1/5 HP', powerW: 150, maxConnectCurrent: 4.75, releaseCurrent: 3.35, format: 'Carcasa cuadrada baquelita' },
  { id: 'sq_1_4', hp: '1/4 HP', powerW: 180, maxConnectCurrent: 5.35, releaseCurrent: 4.25, format: 'Carcasa cuadrada baquelita' },
  { id: 'sq_1_3', hp: '1/3 HP', powerW: 245, maxConnectCurrent: 6.0, releaseCurrent: 4.75, format: 'Carcasa cuadrada baquelita' },
  { id: 'sq_1_2', hp: '1/2 HP', powerW: 370, maxConnectCurrent: 7.5, releaseCurrent: 6.0, format: 'Carcasa cuadrada baquelita' },
];

// 5. Protectores Térmicos de Gran Potencia (3 HP y 5 HP)
export const HEAVY_DUTY_PROTECTORS_LIST: HeavyDutyProtector[] = [
  {
    id: 'hd_3hp',
    hp: '3 HP',
    powerW: 2200,
    overloadCurrent: 35,
    movementTemp: '125 ± 10 ℃',
    replyReturnTemp: '60 ± 10 ℃',
    variants: 'Modelo A (Tornillo M4/M5) y Modelo B (Cable flexible)',
    application: 'Cámaras frigoríficas industriales, centrales de frío y enfriadoras de agua de 3 CV.',
  },
  {
    id: 'hd_5hp',
    hp: '5 HP',
    powerW: 3700,
    overloadCurrent: 40,
    movementTemp: '125 ± 10 ℃',
    replyReturnTemp: '60 ± 10 ℃',
    variants: 'Modelo A (Tornillo M4/M5) y Modelo B (Cable flexible)',
    application: 'Túneles de congelación y unidades condensadoras de 5 CV con alto amperaje continuo.',
  },
];

// 6. Protectores Térmicos Bimetálicos Klixon Serie JRT4 (450W a 1500W)
export const JRT4_PROTECTORS_LIST: Jrt4Protector[] = [
  {
    id: 'jrt4_2_3',
    model: 'JRT4-2/3',
    powerDesc: '450W (2/3 HP)',
    hp: '2/3 HP',
    powerW: 450,
    overloadCurrent: 14,
    appliedTemp: '125 - 155 ℃',
    restoredTemp: '50 - 80 ℃',
    variants: 'A (Faston recto), B (Curvado), C (Cable blindado)',
  },
  {
    id: 'jrt4_10',
    model: 'JRT4-10',
    powerDesc: '750W (1 HP)',
    hp: '1 HP',
    powerW: 750,
    overloadCurrent: 16,
    appliedTemp: '125 - 155 ℃',
    restoredTemp: '50 - 80 ℃',
    variants: 'A (Faston recto), B (Curvado), C (Cable blindado)',
  },
  {
    id: 'jrt4_13',
    model: 'JRT4-13',
    powerDesc: '975W (1.3 HP)',
    hp: '1.3 HP',
    powerW: 975,
    overloadCurrent: 20,
    appliedTemp: '125 - 155 ℃',
    restoredTemp: '50 - 80 ℃',
    variants: 'A (Faston recto), B (Curvado), C (Cable blindado)',
  },
  {
    id: 'jrt4_15',
    model: 'JRT4-15',
    powerDesc: '1100W (1.5 HP)',
    hp: '1.5 HP',
    powerW: 1100,
    overloadCurrent: 24,
    appliedTemp: '125 - 155 ℃',
    restoredTemp: '50 - 80 ℃',
    variants: 'A (Faston recto), B (Curvado), C (Cable blindado)',
  },
  {
    id: 'jrt4_20',
    model: 'JRT4-20',
    powerDesc: '1500W (2 HP)',
    hp: '2 HP',
    powerW: 1500,
    overloadCurrent: 30,
    appliedTemp: '125 - 155 ℃',
    restoredTemp: '50 - 80 ℃',
    variants: 'A (Faston recto), B (Curvado), C (Cable blindado)',
  },
];

// Lista consolidada de potencias para selector global
export const ALL_HP_OPTIONS = [
  '1/12 HP',
  '1/10 HP',
  '1/8 HP',
  '1/7 HP',
  '1/6 HP',
  '1/5 HP',
  '1/4 HP',
  '1/3 HP',
  '3/8 HP',
  '1/2 HP',
  '2/3 HP',
  '1 HP',
  '1.3 HP',
  '1.5 HP',
  '2 HP',
  '3 HP',
  '5 HP',
] as const;
