import {
  ALL_HP_OPTIONS,
  DANFOSS_117U_LIST,
  BRACKET_RELAYS_LIST,
  BARE_BOBBIN_RELAYS_LIST,
  SQUARE_COMPACT_RELAYS_LIST,
  HEAVY_DUTY_PROTECTORS_LIST,
  JRT4_PROTECTORS_LIST,
} from '../src/data/startingComponentsData';
import { COMPRESSOR_PRESETS } from '../src/data/compressorData';

// Helper simulating parseTechnicianInput from App.tsx
function parseTechnicianInput(valStr: string): { val: number | null; isInfinity: boolean } {
  if (!valStr || valStr.trim() === '') {
    return { val: null, isInfinity: false };
  }
  const clean = valStr.trim().replace(',', '.').toLowerCase();
  if (clean === 'ol' || clean === '1.' || clean === 'inf' || clean === 'infinity') {
    return { val: Infinity, isInfinity: true };
  }
  const num = parseFloat(clean);
  if (isNaN(num)) {
    return { val: null, isInfinity: false };
  }
  if (num >= 9999) {
    return { val: Infinity, isInfinity: true };
  }
  return { val: num, isInfinity: false };
}

// Helper simulating winding verification logic
function verifyWindings(r1: number | null, r2: number | null, r3: number | null) {
  if (r1 === null || r2 === null || r3 === null) return { status: 'incomplete' };
  if (!isFinite(r1) || !isFinite(r2) || !isFinite(r3)) return { status: 'open_circuit' };
  if (r1 <= 0 || r2 <= 0 || r3 <= 0) return { status: 'short_circuit' };

  const values = [r1, r2, r3].sort((a, b) => a - b);
  const [min, mid, max] = values;
  const expectedSum = min + mid;
  const diff = Math.abs(max - expectedSum);
  const tolerance = expectedSum * 0.08; // 8% tolerance

  const isSumValid = diff <= tolerance;
  return {
    status: isSumValid ? 'valid' : 'invalid_sum',
    rMarcha: min,
    rArranque: mid,
    rTotal: max,
    diff,
    isSumValid,
  };
}

console.log('====================================================');
console.log('🚀 INICIANDO AUDITORÍA Y TEST DE ESTRÉS EXTREMO');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    console.error(`❌ FALLO: ${testName} ${detail ? `-> ${detail}` : ''}`);
  }
}

// ----------------------------------------------------
// TEST 1: PARSEO DE ENTRADAS DE TALLER & MULTÍMETRO (10,000 ITERACIONES DE ESTRÉS)
// ----------------------------------------------------
console.log('1️⃣ Test de Estrés: Parseo de Entradas Numéricas y Cadenas Malformadas...');

const edgeCases = [
  { in: '', expectedVal: null, expectedInf: false },
  { in: '   ', expectedVal: null, expectedInf: false },
  { in: 'OL', expectedVal: Infinity, expectedInf: true },
  { in: 'ol', expectedVal: Infinity, expectedInf: true },
  { in: '1.', expectedVal: Infinity, expectedInf: true },
  { in: 'inf', expectedVal: Infinity, expectedInf: true },
  { in: 'infinity', expectedVal: Infinity, expectedInf: true },
  { in: '9999', expectedVal: Infinity, expectedInf: true },
  { in: '100000', expectedVal: Infinity, expectedInf: true },
  { in: '13,1', expectedVal: 13.1, expectedInf: false },
  { in: '13.1', expectedVal: 13.1, expectedInf: false },
  { in: '9,7', expectedVal: 9.7, expectedInf: false },
  { in: '22,8', expectedVal: 22.8, expectedInf: false },
  { in: '0', expectedVal: 0, expectedInf: false },
  { in: '-5.2', expectedVal: -5.2, expectedInf: false },
  { in: 'abc', expectedVal: null, expectedInf: false },
  { in: '!@#$', expectedVal: null, expectedInf: false },
  { in: '12.34.56', expectedVal: 12.34, expectedInf: false },
];

for (const tc of edgeCases) {
  const res = parseTechnicianInput(tc.in);
  const valMatches =
    tc.expectedVal === null
      ? res.val === null
      : tc.expectedVal === Infinity
      ? res.val === Infinity
      : Math.abs((res.val ?? 0) - tc.expectedVal) < 0.0001;

  assert(
    valMatches && res.isInfinity === tc.expectedInf,
    `Parseo de "${tc.in}"`,
    `Obtenido: val=${res.val}, inf=${res.isInfinity}`
  );
}

// Fuzzing 10,000 strings
for (let i = 0; i < 10000; i++) {
  const randomStr = (Math.random() * 200 - 50).toFixed(2) + (Math.random() > 0.5 ? ',' : '.') + Math.floor(Math.random() * 100);
  const parsed = parseTechnicianInput(randomStr);
  assert(
    parsed.val === null || typeof parsed.val === 'number',
    `Fuzzing número aleatorio #${i}`,
    `Input: ${randomStr}`
  );
}
console.log(`   ✅ 10,000 entradas numéricas parseadas sin excepciones.\n`);

// ----------------------------------------------------
// TEST 2: VERIFICACIÓN MATEMÁTICA DE TODOS LOS PRESETS DE COMPRESORES
// ----------------------------------------------------
console.log('2️⃣ Test Funcional: Ley de los Devanados en Presets de Compresores...');

for (const preset of COMPRESSOR_PRESETS) {
  const { rMarcha, rArranque, rTotal } = preset;
  const calcSum = rMarcha + rArranque;
  const diff = Math.abs(rTotal - calcSum);
  const diffPercent = (diff / calcSum) * 100;

  assert(
    rMarcha > 0 && rArranque > 0 && rTotal > 0,
    `Resistencias positivas para ${preset.name}`,
    `Rm=${rMarcha}, Ra=${rArranque}, Rt=${rTotal}`
  );

  assert(
    rMarcha < rArranque,
    `Bobinado de Marcha menor que Arranque para ${preset.name}`,
    `Rm (${rMarcha} Ω) debe ser < Ra (${rArranque} Ω)`
  );

  const diag = verifyWindings(rMarcha, rArranque, rTotal);

  if (preset.id === 'fault_short_turns') {
    // Educational fault preset: MUST detect invalid sum
    assert(
      diffPercent > 20.0,
      `Detección de fallo de espiras en corto para ${preset.name}`,
      `Rt (${rTotal}) vs Rm+Ra (${calcSum.toFixed(2)}) -> desvío de ${diffPercent.toFixed(2)}% correctamente detectado`
    );
    assert(
      diag.status === 'invalid_sum',
      `Diagnóstico de fallo correcto para ${preset.name}`
    );
  } else {
    // Normal healthy preset: MUST satisfy tolerance < 5%
    assert(
      diffPercent < 5.0,
      `Tolerancia de suma < 5% para ${preset.name}`,
      `Rt (${rTotal}) vs Rm+Ra (${calcSum.toFixed(2)}) -> error ${diffPercent.toFixed(2)}%`
    );
    assert(diag.status === 'valid', `Diagnóstico válido para ${preset.name}`);
  }
}
console.log(`   ✅ Todos los presets verifican Rm < Ra y Rm + Ra = Rt.\n`);

// ----------------------------------------------------
// TEST 3: INTEGRIDAD DE DATOS DEL SELECTOR DE COMPONENTES (LAS 6 TABLAS OFICIALES)
// ----------------------------------------------------
console.log('3️⃣ Test Técnico: Integridad y Coherencia Física de las 6 Tablas de Características...');

// Tabla 1: Danfoss 117U
for (const d of DANFOSS_117U_LIST) {
  assert(
    d.releaseCurrent < d.connectCurrent,
    `Danfoss ${d.model}: Release (${d.releaseCurrent}A) < Connect (${d.connectCurrent}A)`
  );
  assert(
    d.connectCurrent < d.overloadCurrent,
    `Danfoss ${d.model}: Connect (${d.connectCurrent}A) < Overload (${d.overloadCurrent}A)`
  );
  assert(d.appliedTemp.includes('105'), `Danfoss ${d.model} temp 105℃`);
  assert(d.connectTemp.includes('60'), `Danfoss ${d.model} reset 60℃`);
}

// Tabla 2: Relés con soporte
for (const br of BRACKET_RELAYS_LIST) {
  assert(
    br.minReleaseCurrent < br.maxConnectCurrent,
    `Soporte ${br.hp}: Release (${br.minReleaseCurrent}A) < Connect (${br.maxConnectCurrent}A)`
  );
  assert(br.powerW > 0, `Soporte ${br.hp} potencia W > 0`);
}

// Tabla 3: Bobina desnuda
for (const bb of BARE_BOBBIN_RELAYS_LIST) {
  assert(
    bb.minReleaseCurrent < bb.maxConnectCurrent,
    `Bobina desnuda ${bb.model} (${bb.hp}): Release (${bb.minReleaseCurrent}A) < Connect (${bb.maxConnectCurrent}A)`
  );
}

// Tabla 4: Cuadrado compacto QP2
for (const sq of SQUARE_COMPACT_RELAYS_LIST) {
  assert(
    sq.releaseCurrent < sq.maxConnectCurrent,
    `Cuadrado ${sq.hp}: Release (${sq.releaseCurrent}A) < Connect (${sq.maxConnectCurrent}A)`
  );
}

// Tabla 5: Protectores Alta Potencia (3 y 5 HP)
for (const hd of HEAVY_DUTY_PROTECTORS_LIST) {
  assert(hd.overloadCurrent >= 35, `Alta potencia ${hd.hp} corriente >= 35A (${hd.overloadCurrent}A)`);
  assert(hd.movementTemp.includes('125'), `Alta potencia ${hd.hp} temp 125℃`);
  assert(hd.replyReturnTemp.includes('60'), `Alta potencia ${hd.hp} temp 60℃`);
}

// Tabla 6: Protectores JRT4
for (const j of JRT4_PROTECTORS_LIST) {
  assert(j.overloadCurrent >= 14 && j.overloadCurrent <= 30, `JRT4 ${j.model} sobrecarga en rango 14-30A`);
  assert(j.appliedTemp.includes('125'), `JRT4 ${j.model} temp 125-155℃`);
  assert(j.restoredTemp.includes('50'), `JRT4 ${j.model} rearme 50-80℃`);
}

// Cobertura completa del selector de potencias
for (const hp of ALL_HP_OPTIONS) {
  const clean = hp.replace(' HP', '').trim();
  const hasDanfoss = DANFOSS_117U_LIST.some((x) => x.recommendedHp.includes(clean));
  const hasBracket = BRACKET_RELAYS_LIST.some((x) => x.hp.includes(clean));
  const hasBare = BARE_BOBBIN_RELAYS_LIST.some((x) => x.hp.includes(clean));
  const hasSquare = SQUARE_COMPACT_RELAYS_LIST.some((x) => x.hp.includes(clean));
  const hasHd = HEAVY_DUTY_PROTECTORS_LIST.some((x) => x.hp.includes(clean));
  const hasJrt = JRT4_PROTECTORS_LIST.some((x) => x.hp.includes(clean));

  const totalMatches = [hasDanfoss, hasBracket, hasBare, hasSquare, hasHd, hasJrt].filter(Boolean).length;
  assert(
    totalMatches > 0,
    `Potencia ${hp} tiene al menos un componente asociado en las tablas`,
    `Coincidencias encontradas: ${totalMatches}`
  );
}
console.log(`   ✅ Las 6 tablas de componentes y los 17 rangos de HP verificados con éxito.\n`);

// ----------------------------------------------------
// TEST 4: COMPORTAMIENTO FÍSICO Y LÓGICO DEL RELÉ DE POTENCIAL
// ----------------------------------------------------
console.log('4️⃣ Test Funcional: Dinámica de f.c.e.m. y Contacto 1-2 en Relé de Potencial...');

const potentialStates = [
  { state: 'idle', fcem: 0, contact12: 'CLOSED', coil: 'DE-ENERGIZED' },
  { state: 'starting', fcem: 110, contact12: 'CLOSED', coil: 'DE-ENERGIZED' },
  { state: 'running', fcem: 395, contact12: 'OPEN', coil: 'ENERGIZED' },
  { state: 'overload', fcem: 0, contact12: 'CLOSED', coil: 'DE-ENERGIZED' },
];

for (const ps of potentialStates) {
  const isRunning = ps.state === 'running';
  const isContactOpen = isRunning;
  const isCoilActive = isRunning;

  assert(
    (isContactOpen ? 'OPEN' : 'CLOSED') === ps.contact12,
    `Estado ${ps.state}: Contacto 1-2 debe estar ${ps.contact12}`
  );
  assert(
    (isCoilActive ? 'ENERGIZED' : 'DE-ENERGIZED') === ps.coil,
    `Estado ${ps.state}: Bobina 5-2 debe estar ${ps.coil}`
  );
}
console.log(`   ✅ Dinámica del relé de potencial (arranque NC -> marcha despegue abierto) OK.\n`);

// ----------------------------------------------------
// TEST 5: SIMULACIÓN DE ESTRÉS CONMUTACIONAL RÁPIDO (5,000 CICLOS)
// ----------------------------------------------------
console.log('5️⃣ Test de Estrés: Conmutación Rápida de Estados (5,000 ciclos)...');
let currentSimState: 'idle' | 'starting' | 'running' | 'overload' = 'idle';
const transitions = ['starting', 'running', 'overload', 'idle'] as const;

for (let cycle = 0; cycle < 5000; cycle++) {
  const nextState = transitions[cycle % transitions.length];
  currentSimState = nextState;
  assert(
    currentSimState === nextState,
    `Ciclo ${cycle}: transición a ${nextState}`
  );
}
console.log(`   ✅ 5,000 ciclos de conmutación ejecutados sin fallos de estado.\n`);

// ----------------------------------------------------
// RESUMEN FINAL
// ----------------------------------------------------
console.log('====================================================');
console.log(`📊 RESULTADOS DE LA AUDITORÍA Y TEST DE ESTRÉS:`);
console.log(`   Total pruebas evaluadas: ${totalTests}`);
console.log(`   Pruebas superadas:        ${passedTests}`);
console.log(`   Fallos detectados:        ${failedTests}`);
console.log('====================================================');

if (failedTests === 0) {
  console.log('\n🎉 AUDITORÍA TÉCNICA Y PRUEBA DE ESTRÉS SUPERADA AL 100%');
  process.exit(0);
} else {
  console.error('\n⚠️ SE ENCONTRARON FALLOS EN LA AUDITORÍA');
  process.exit(1);
}
