import React from 'react';

interface FingerSealingIllustrationProps {
  currentPsi: number;
  isCompressing: boolean;
  isMeasuringRetention: boolean;
  verdict?: string;
}

/**
 * High-fidelity Vecteezy-style vector illustration of a technician's hand and pointing
 * index finger sealing the compressor discharge tube (test de compresión manual).
 *
 * Vector characteristics based on the reference vector illustration:
 * - Professional technician sleeve / cuff entering from top-left
 * - Anatomically proportioned hand clenched in a tight, firm fist
 * - Realistic curled thumb and fingers (middle, ring, pinky) with defined knuckles and creases
 * - Extended, powerful index finger pressing directly down on the tube orifice (cx: 370, cy: 30)
 * - Rich vector cel-shading, warm skin gradient fills, crisp contour line art, and dorsal highlights
 * - Natural fingernail with lunula and specular sheen
 * - Dynamic physical reactions:
 *    * Sealed state (< 180 PSI): finger flattened against tube mouth with compression flush
 *    * Overcome state (>= 180 PSI / ~12.5 bar): pressure blasts the finger upwards (-8px),
 *      releasing high-velocity air vapor jets, escape wisps, and acoustic alert badge.
 */
export const FingerSealingIllustration: React.FC<FingerSealingIllustrationProps> = ({
  currentPsi,
  isCompressing,
  isMeasuringRetention,
}) => {
  // Human finger seal can typically withstand up to ~180 PSI (~12.5 bar)
  const isOvercomeByPressure = isCompressing && currentPsi >= 180;
  const isVibrating = isCompressing;

  // Physical displacement when air pressure overcomes the finger
  const fingerLiftY = isOvercomeByPressure ? -9 : 0;
  const fingerLiftX = isOvercomeByPressure ? -4 : 0;
  const fingerRotation = isOvercomeByPressure ? -4.5 : 0;

  // Pressure in bar for technical metric
  const barVal = (currentPsi * 0.0689476).toFixed(1);

  return (
    <g id="vecteezyHandPointingCompressorTest">
      <defs>
        {/* Warm Caucasian/Mediterranean skin tone gradient (Light coming from top-left) */}
        <linearGradient id="vSkinPrimary" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#ffeedd" />
          <stop offset="30%" stopColor="#fed7aa" />
          <stop offset="65%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        {/* Index finger gradient (extra dorsal light highlight) */}
        <linearGradient id="vIndexSkin" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#fff3e5" />
          <stop offset="40%" stopColor="#fed7aa" />
          <stop offset="75%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>

        {/* Deep ambient occlusion / underside shadow */}
        <linearGradient id="vShadowCore" x1="30%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#c2410c" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#9a3412" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#5a1f06" stopOpacity="0.9" />
        </linearGradient>

        {/* Dorsal specular edge highlight */}
        <linearGradient id="vDorsalSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#fff7ed" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fed7aa" stopOpacity="0" />
        </linearGradient>

        {/* Realistic fingernail gradient */}
        <linearGradient id="vFingernail" x1="0%" y1="0%" x2="100%" y2="90%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="45%" stopColor="#fecdd3" />
          <stop offset="85%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>

        {/* Technician uniform sleeve gradient */}
        <linearGradient id="vSleeveGrad" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="40%" stopColor="#1d4ed8" />
          <stop offset="85%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Technician cuff ribbing */}
        <linearGradient id="vCuffGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>

        {/* Soft shadow cast on compressor dome */}
        <filter id="vHandDropShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>

        {/* Air blast glow */}
        <filter id="airBlastGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main Hand & Finger Group with interactive vibration, lift, and recoil */}
      <g
        className={isVibrating && !isOvercomeByPressure ? 'animate-[pulse_0.12s_infinite]' : ''}
        transform={`translate(${fingerLiftX}, ${fingerLiftY}) rotate(${fingerRotation}, 310, -10)`}
        style={{
          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* 1. Ambient drop shadow cast by hand on compressor body */}
        <ellipse
          cx="330"
          cy="42"
          rx="52"
          ry="15"
          fill="#000000"
          opacity="0.38"
          filter="url(#vHandDropShadow)"
        />

        {/* ============================================================== */}
        {/* 2. TECHNICIAN WORKSHOP SLEEVE & CUFF (Entering from top-left)  */}
        {/* ============================================================== */}
        <g id="technicianSleeve">
          {/* Sleeve fabric body */}
          <path
            d={`
              M 185 -70
              C 200 -72, 222 -62, 238 -50
              L 220 -18
              C 206 -28, 190 -38, 175 -42
              Z
            `}
            fill="url(#vSleeveGrad)"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Sleeve fabric folds & highlights */}
          <path
            d="M 195 -62 C 208 -52, 220 -44, 226 -34"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 180 -48 C 192 -42, 204 -35, 214 -24"
            fill="none"
            stroke="#0b1329"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Elastic / Hemmed cuff trim */}
          <path
            d={`
              M 238 -50
              C 246 -44, 248 -32, 242 -22
              L 220 -18
              C 214 -26, 218 -38, 226 -44
              Z
            `}
            fill="url(#vCuffGrad)"
            stroke="#172554"
            strokeWidth="1.8"
          />
          {/* Cuff seam lines */}
          <path
            d="M 232 -46 L 223 -20"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="1.1"
            strokeDasharray="2,2"
            opacity="0.75"
          />
        </g>

        {/* ============================================================== */}
        {/* 3. WRIST & BACK OF HAND (DORSUM)                               */}
        {/* ============================================================== */}
        <g id="handDorsum">
          {/* Main solid hand silhouette (Vecteezy high-fidelity vector) */}
          <path
            d={`
              M 238 -45
              C 255 -38, 276 -28, 298 -16
              C 310 -10, 322 -2, 332 5
              C 342 11, 352 17, 362 23
              C 368 26.5, 373 29, 372.5 32
              C 372 36, 365 37.5, 358 35.5
              C 348 32, 340 27, 334 23
              C 328 20, 320 22, 314 26
              C 305 31, 296 34, 286 33
              C 275 32, 266 26, 256 21
              C 245 16, 235 12, 225 3
              C 216 -6, 212 -18, 218 -28
              C 222 -36, 229 -41, 238 -45
              Z
            `}
            fill="url(#vSkinPrimary)"
            stroke="#5c2009"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Dorsal light reflection across the metacarpal ridge */}
          <path
            d={`
              M 242 -41
              C 260 -34, 280 -24, 302 -13
              C 316 -6, 328 2, 338 8
              C 348 14, 356 19, 364 24
            `}
            fill="none"
            stroke="url(#vDorsalSheen)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Tendon hint of Extensor Digitorum */}
          <path
            d="M 252 -32 C 270 -24, 288 -14, 306 -5"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* Under-palm deep shadow layer */}
          <path
            d={`
              M 218 -28
              C 214 -12, 222 2, 234 11
              C 246 16, 258 22, 270 27
              C 282 32, 295 33, 304 31
              C 312 28, 319 23, 326 21
              C 334 23, 342 27, 350 31
              C 358 35.5, 365 37.5, 365 37.5
              C 352 31, 342 24, 334 20
              C 324 16, 314 18, 305 22
              C 294 26, 282 26, 272 21
              C 260 16, 246 12, 236 4
              C 226 -4, 220 -16, 221 -26
              Z
            `}
            fill="url(#vShadowCore)"
          />
        </g>

        {/* ============================================================== */}
        {/* 4. CURLED FINGERS (Middle, Ring, Pinky folded into fist)        */}
        {/* ============================================================== */}
        <g id="foldedFingersFist">
          {/* Middle Finger Knuckle & Pad (Curled tightly beneath index) */}
          <path
            d={`
              M 295 10
              C 304 8, 314 10, 319 16
              C 324 22, 321 28, 313 29
              C 304 30, 296 26, 292 20
            `}
            fill="#f97316"
            stroke="#5c2009"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Middle finger crease & shadow */}
          <path
            d="M 302 12 C 309 14, 314 19, 314 24"
            fill="none"
            stroke="#7c2d12"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 300 20 C 306 23, 312 25, 311 28"
            fill="none"
            stroke="#9a3412"
            strokeWidth="1.0"
            strokeLinecap="round"
          />

          {/* Ring Finger Knuckle (Curled next to middle) */}
          <path
            d={`
              M 276 18
              C 284 16, 293 18, 297 24
              C 301 29, 298 34, 290 35
              C 282 35, 275 31, 272 25
            `}
            fill="#ea580c"
            stroke="#5c2009"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 282 20 C 288 22, 292 26, 292 30"
            fill="none"
            stroke="#7c2d12"
            strokeWidth="1.1"
            strokeLinecap="round"
          />

          {/* Little / Pinky Finger (Curled deep on the bottom flank) */}
          <path
            d={`
              M 258 22
              C 265 20, 273 22, 276 27
              C 279 32, 276 36, 269 36
              C 262 36, 256 31, 254 26
            `}
            fill="#c2410c"
            stroke="#5c2009"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>

        {/* ============================================================== */}
        {/* 5. TUCKED THUMB (Resting firmly across the curled fingers)     */}
        {/* ============================================================== */}
        <g id="tuckedThumb">
          {/* Thumb fleshy mound (Thenar eminence) */}
          <path
            d={`
              M 244 -8
              C 255 -12, 268 -6, 276 2
              C 284 10, 286 20, 278 26
              C 270 30, 258 26, 250 18
              C 244 11, 240 2, 244 -8
              Z
            `}
            fill="#fed7aa"
            stroke="#5c2009"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Thumb outer phalanx wrapping across the fist */}
          <path
            d={`
              M 266 0
              C 278 4, 289 10, 294 18
              C 298 24, 294 30, 285 31
              C 276 31, 268 25, 263 18
            `}
            fill="#fdba74"
            stroke="#5c2009"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Thumb skin flexion creases */}
          <path
            d="M 252 6 C 260 10, 268 14, 270 20"
            fill="none"
            stroke="#9a3412"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 272 8 C 279 12, 284 16, 284 22"
            fill="none"
            stroke="#7c2d12"
            strokeWidth="1.1"
            strokeLinecap="round"
          />

          {/* Thumb fingernail */}
          <path
            d="M 284 16 C 289 18, 292 22, 290 26 C 287 28, 283 27, 281 23"
            fill="#fecdd3"
            stroke="#9a3412"
            strokeWidth="0.8"
          />
        </g>

        {/* ============================================================== */}
        {/* 6. EXTENDED INDEX FINGER (The hero pointing element)           */}
        {/* ============================================================== */}
        <g id="pointingIndexFinger">
          {/* Base of index finger (MCP Knuckle - nudillo metacarpofalángico) */}
          {/* Main index finger shaft contour */}
          <path
            d={`
              M 302 -16
              C 314 -8, 328 1, 338 7
              C 348 13, 357 19, 366 24.5
              C 370 26.5, 373 29, 372.5 32
              C 371.5 35.5, 365 37, 358 35.5
              C 350 33, 342 27, 334 23
              C 326 19, 318 16, 310 13
            `}
            fill="url(#vIndexSkin)"
            stroke="#5c2009"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Top highlight ridge along the pointing index finger */}
          <path
            d={`
              M 306 -12
              C 317 -5, 329 3, 339 9
              C 349 15, 358 20, 365 24
            `}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.0"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* MCP Knuckle Creases (Nudillo base del índice) */}
          <g id="mcpCreases">
            <path
              d="M 300 -14 C 305 -16, 310 -15, 312 -11"
              fill="none"
              stroke="#7c2d12"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M 303 -11 C 307 -13, 312 -12, 314 -8"
              fill="none"
              stroke="#9a3412"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <path
              d="M 297 -17 C 301 -19, 306 -18, 308 -14"
              fill="none"
              stroke="#b45309"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* PIP Joint Creases (Articulación interfalángica proximal media) */}
          <g id="pipCreases">
            <path
              d="M 330 4 C 334 2, 339 3, 342 7"
              fill="none"
              stroke="#7c2d12"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M 333 7 C 337 5, 342 6, 344 10"
              fill="none"
              stroke="#9a3412"
              strokeWidth="1.0"
              strokeLinecap="round"
            />
          </g>

          {/* DIP Joint Creases (Articulación distal junto a la uña) */}
          <g id="dipCreases">
            <path
              d="M 353 17 C 356 15, 360 16, 362 20"
              fill="none"
              stroke="#7c2d12"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M 355 20 C 358 18, 362 19, 364 23"
              fill="none"
              stroke="#9a3412"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
          </g>

          {/* Realistic Fingernail (Uña del dedo índice) */}
          <g id="vIndexFingernail" transform="translate(360, 22.5) rotate(28)">
            {/* Cuticle / base shadow */}
            <ellipse cx="5" cy="3.5" rx="5.5" ry="3.5" fill="#9a3412" opacity="0.3" />
            {/* Nail plate body */}
            <path
              d="M 0 0 C 3 -1.2, 8.5 -1, 10.5 1.5 C 11.5 3.5, 10.5 6.5, 8.5 7.5 C 5 8.5, 1 7.5, 0 5 Z"
              fill="url(#vFingernail)"
              stroke="#7c2d12"
              strokeWidth="0.85"
            />
            {/* Lunula (white crescent at base of nail) */}
            <path
              d="M 0 1.2 C 1.8 1.6, 2.2 3.8, 0.4 4.8"
              fill="#ffffff"
              opacity="0.8"
            />
            {/* Specular curved glint on nail surface */}
            <path
              d="M 2 1.2 Q 6 0.8 9 2.5"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.0"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>

          {/* Fingertip contact pad pressing firmly on the copper discharge mouth */}
          {/* Center of tube orifice is (370, 30). Pad flattens against the rim. */}
          <ellipse
            cx="369.5"
            cy="31.5"
            rx="5.5"
            ry="3.8"
            fill={isCompressing ? '#dc2626' : '#ea580c'}
            opacity={isCompressing ? 0.85 : 0.55}
          />
          {/* Pressure blanching / compression rim */}
          {isCompressing && !isOvercomeByPressure && (
            <ellipse
              cx="369.5"
              cy="31"
              rx="4"
              ry="2.4"
              fill="#fef08a"
              opacity="0.75"
            />
          )}
        </g>
      </g>

      {/* ============================================================== */}
      {/* 7. DYNAMIC PRESSURE EFFECTS & TECHNICAL HVAC FEEDBACK          */}
      {/* ============================================================== */}

      {/* CASE A: High pressure overcomes finger seal (>= 180 PSI / ~12.5 bar) */}
      {isOvercomeByPressure && (
        <g id="pressureEscapingJets">
          {/* 1. Expansion blast rings at the tube opening (370, 30) */}
          <ellipse
            cx="370"
            cy="28"
            rx="14"
            ry="6"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            opacity="0.8"
            filter="url(#airBlastGlow)"
            className="animate-ping"
          />
          <ellipse
            cx="370"
            cy="25"
            rx="22"
            ry="9"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* 2. High velocity escaping gas jet streams (air shooting sideways) */}
          <g strokeLinecap="round">
            {/* Right escaping jet */}
            <path
              d="M 374 26 L 402 16"
              stroke="#38bdf8"
              strokeWidth="3.2"
              className="animate-pulse"
            />
            <path
              d="M 376 30 L 408 28"
              stroke="#ffffff"
              strokeWidth="2.4"
            />
            <path
              d="M 373 22 L 396 8"
              stroke="#7dd3fc"
              strokeWidth="2"
            />
            {/* Left escaping jet */}
            <path
              d="M 364 26 L 344 14"
              stroke="#38bdf8"
              strokeWidth="3"
              className="animate-pulse"
            />
            <path
              d="M 362 30 L 336 26"
              stroke="#ffffff"
              strokeWidth="2.2"
            />
          </g>

          {/* 3. Escaping vapor / atomized oil puffs */}
          <circle cx="400" cy="18" r="5" fill="#e0f2fe" opacity="0.85" />
          <circle cx="412" cy="26" r="4" fill="#ffffff" opacity="0.9" />
          <circle cx="342" cy="16" r="4.5" fill="#bae6fd" opacity="0.8" />
          <circle cx="330" cy="24" r="3.5" fill="#ffffff" opacity="0.85" />

          {/* 4. Acoustic & Technical verdict badge */}
          <g transform="translate(385, -12)">
            {/* Badge container with glow */}
            <rect
              x="0"
              y="0"
              width="150"
              height="26"
              rx="5"
              fill="#0369a1"
              stroke="#38bdf8"
              strokeWidth="1.5"
              filter="url(#airBlastGlow)"
            />
            {/* Sound blast icon */}
            <text
              x="12"
              y="17"
              fontSize="13"
              textAnchor="middle"
            >
              💨
            </text>
            <text
              x="22"
              y="12"
              fill="#ffffff"
              fontSize="9"
              fontWeight="900"
              fontFamily="monospace"
              letterSpacing="0.4"
            >
              ¡VENCE LA FUERZA DEL DEDO!
            </text>
            <text
              x="22"
              y="21"
              fill="#7dd3fc"
              fontSize="7.5"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {barVal} bar ({Math.round(currentPsi)} PSI) • Válvulas OK
            </text>
          </g>
        </g>
      )}

      {/* CASE B: Compressing and holding firmly under 180 PSI */}
      {isCompressing && !isOvercomeByPressure && (
        <g id="fingerHoldingWell" transform="translate(372, -8)">
          <rect
            x="0"
            y="0"
            width="132"
            height="22"
            rx="4"
            fill="#064e3b"
            stroke="#10b981"
            strokeWidth="1.2"
            className="drop-shadow-md"
          />
          <text
            x="8"
            y="14"
            fontSize="10"
          >
            ✋
          </text>
          <text
            x="24"
            y="10"
            fill="#a7f3d0"
            fontSize="8"
            fontWeight="bold"
            fontFamily="monospace"
          >
            SELLANDO DESCARGA
          </text>
          <text
            x="24"
            y="18.5"
            fill="#6ee7b7"
            fontSize="7"
            fontFamily="monospace"
          >
            Presión: {barVal} bar ({Math.round(currentPsi)} PSI)
          </text>
        </g>
      )}

      {/* CASE C: Retention measurement (Compressor stopped, checking valve back-leak) */}
      {isMeasuringRetention && (
        <g id="fingerRetentionCheck" transform="translate(372, -8)">
          <rect
            x="0"
            y="0"
            width="132"
            height="22"
            rx="4"
            fill="#1e1b4b"
            stroke="#818cf8"
            strokeWidth="1.2"
            className="drop-shadow-md"
          />
          <text
            x="8"
            y="14"
            fontSize="10"
          >
            ⏱️
          </text>
          <text
            x="24"
            y="10"
            fill="#c7d2fe"
            fontSize="8"
            fontWeight="bold"
            fontFamily="monospace"
          >
            TEST DE RETENCIÓN
          </text>
          <text
            x="24"
            y="18.5"
            fill="#e0e7ff"
            fontSize="7"
            fontFamily="monospace"
          >
            {barVal} bar ({Math.round(currentPsi)} PSI)
          </text>
        </g>
      )}

      {/* CASE D: Idle state ready to test */}
      {!isCompressing && !isMeasuringRetention && (
        <g id="fingerRestingTag" transform="translate(378, -6)">
          <rect
            x="0"
            y="0"
            width="106"
            height="18"
            rx="3.5"
            fill="#0f172a"
            stroke="#475569"
            strokeWidth="1"
            className="drop-shadow-sm"
          />
          <circle cx="8" cy="9" r="3" fill="#38bdf8" />
          <text
            x="16"
            y="12"
            fill="#cbd5e1"
            fontSize="7.5"
            fontFamily="monospace"
            fontWeight="bold"
          >
            MÉTODO DEL DEDO
          </text>
        </g>
      )}
    </g>
  );
};
