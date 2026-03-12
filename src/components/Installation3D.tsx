import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Environment, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { SolarResult, BATTERY_INFO, INVERTER_BRANDS } from "@/lib/solar-calculations";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, ZoomIn } from "lucide-react";

interface Installation3DProps {
  result: SolarResult;
}

// ── Solar Panel ──
const SolarPanel = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);
  return (
    <group ref={ref} position={position} rotation={rotation}>
      {/* Panel frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.05, 1.6]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glass surface */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.85, 0.01, 1.5]} />
        <meshStandardMaterial color="#0f3460" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Grid lines on panel */}
      {[-0.5, -0.25, 0, 0.25, 0.5].map((z, i) => (
        <mesh key={`h-${i}`} position={[0, 0.04, z]}>
          <boxGeometry args={[0.85, 0.002, 0.005]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      ))}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={`v-${i}`} position={[x, 0.04, 0]}>
          <boxGeometry args={[0.005, 0.002, 1.5]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      ))}
    </group>
  );
};

// ── Panel Array on Roof ──
const PanelArray = ({ count, panelSize }: { count: number; panelSize: number }) => {
  const cols = Math.min(count, 4);
  const rows = Math.ceil(count / cols);
  const panels: [number, number, number][] = [];

  for (let r = 0; r < rows; r++) {
    const colsInRow = r === rows - 1 ? count - r * cols : cols;
    for (let c = 0; c < colsInRow; c++) {
      panels.push([
        (c - (colsInRow - 1) / 2) * 1.05,
        3.6 + r * 0.15,
        (r - (rows - 1) / 2) * 1.7 - 0.5,
      ]);
    }
  }

  return (
    <group>
      {panels.map((pos, i) => (
        <SolarPanel key={i} position={pos} rotation={[-0.35, 0, 0]} />
      ))}
      {/* Mounting rails */}
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={`rail-${i}`} position={[x > 0 ? Math.min(x, (cols - 1) * 0.525) : Math.max(x, -(cols - 1) * 0.525), 3.3, -0.5]}>
          <boxGeometry args={[0.04, 0.04, rows * 1.7 + 0.3]} />
          <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

// ── Building ──
const Building = () => (
  <group>
    {/* Main structure */}
    <mesh position={[0, 1.5, 0]}>
      <boxGeometry args={[6, 3, 5]} />
      <meshStandardMaterial color="#e8dcc8" roughness={0.9} />
    </mesh>
    {/* Roof */}
    <mesh position={[0, 3.15, 0]}>
      <boxGeometry args={[6.4, 0.3, 5.4]} />
      <meshStandardMaterial color="#8b7355" roughness={0.7} />
    </mesh>
    {/* Door */}
    <mesh position={[0, 1, 2.51]}>
      <boxGeometry args={[0.9, 1.8, 0.05]} />
      <meshStandardMaterial color="#5a3825" />
    </mesh>
    {/* Windows */}
    {[-1.8, 1.8].map((x, i) => (
      <mesh key={`win-${i}`} position={[x, 1.8, 2.51]}>
        <boxGeometry args={[0.7, 0.7, 0.05]} />
        <meshStandardMaterial color="#87ceeb" metalness={0.3} roughness={0.1} />
      </mesh>
    ))}
  </group>
);

// ── Hybrid Inverter Box ──
const InverterBox = ({ brand, size }: { brand: string; size: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  return (
    <group position={[3.2, 1.5, 2.3]}>
      <RoundedBox ref={ref} args={[0.6, 0.8, 0.2]} radius={0.03}>
        <meshStandardMaterial color="#1a3a2a" metalness={0.6} roughness={0.4} />
      </RoundedBox>
      {/* LED indicators */}
      {[0.2, 0.1, 0].map((y, i) => (
        <mesh key={`led-${i}`} position={[-0.15, y, 0.11]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color={i === 0 ? "#00ff88" : i === 1 ? "#00aaff" : "#ffaa00"} emissive={i === 0 ? "#00ff88" : i === 1 ? "#00aaff" : "#ffaa00"} emissiveIntensity={2} />
        </mesh>
      ))}
      {/* Screen */}
      <mesh position={[0.05, 0.15, 0.11]}>
        <boxGeometry args={[0.25, 0.15, 0.01]} />
        <meshStandardMaterial color="#003322" emissive="#003322" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, -0.3, 0.11]} fontSize={0.06} color="#cccccc" anchorX="center">
        {brand}
      </Text>
      <Text position={[0, -0.38, 0.11]} fontSize={0.04} color="#888888" anchorX="center">
        {(size / 1000).toFixed(1)} kVA Hybrid
      </Text>
    </group>
  );
};

// ── Battery Stack ──
const BatteryStack = ({ totalUnits, voltage, type }: { totalUnits: number; voltage: number; type: string }) => {
  const isLithium = type === "lithium";
  const displayUnits = Math.min(totalUnits, 8);
  const cols = Math.min(displayUnits, 4);
  const rows = Math.ceil(displayUnits / cols);

  return (
    <group position={[3.2, 0.3, 0.5]}>
      {/* Battery cabinet */}
      <mesh position={[0, rows * 0.22, 0]}>
        <boxGeometry args={[cols * 0.35 + 0.15, rows * 0.45 + 0.1, 0.45]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.3} roughness={0.7} transparent opacity={0.3} />
      </mesh>
      {Array.from({ length: displayUnits }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <group key={`batt-${i}`} position={[(col - (cols - 1) / 2) * 0.35, row * 0.35 + 0.15, 0]}>
            <RoundedBox args={[0.3, 0.25, 0.35]} radius={0.02}>
              <meshStandardMaterial
                color={isLithium ? "#1a3a4a" : "#3a2a1a"}
                metalness={0.5}
                roughness={0.5}
              />
            </RoundedBox>
            {/* Terminal */}
            <mesh position={[0, 0.14, 0.1]}>
              <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
              <meshStandardMaterial color="#cc8800" metalness={0.9} />
            </mesh>
          </group>
        );
      })}
      <Text position={[0, -0.15, 0.3]} fontSize={0.06} color="#888888" anchorX="center">
        {totalUnits}× {isLithium ? "LiFePO4" : type === "tubular" ? "Tubular" : "Lead-Acid"} • {voltage}V
      </Text>
    </group>
  );
};

// ── Cable runs ──
const Cable = ({
  start,
  end,
  color = "#ff4444",
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];
  const dir = new THREE.Vector3(...end).sub(new THREE.Vector3(...start));
  const len = dir.length();
  const orientation = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.normalize()
  );

  return (
    <mesh ref={ref} position={mid} quaternion={orientation}>
      <cylinderGeometry args={[0.015, 0.015, len, 6]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// ── Animated Sun ──
const AnimatedSun = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 8 + Math.sin(clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <Float speed={1} floatIntensity={0.3}>
      <mesh ref={ref} position={[-4, 8, -6]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={3} />
      </mesh>
      <pointLight position={[-4, 8, -6]} intensity={2} color="#ffcc44" distance={20} />
    </Float>
  );
};

// ── Ground ──
const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
    <planeGeometry args={[20, 20]} />
    <meshStandardMaterial color="#3a5a3a" roughness={0.95} />
  </mesh>
);

// ── Distribution Board ──
const DistributionBoard = () => (
  <group position={[2.5, 1.2, 2.51]}>
    <RoundedBox args={[0.35, 0.45, 0.05]} radius={0.02}>
      <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
    </RoundedBox>
    {/* Breakers */}
    {[-0.1, 0, 0.1].map((x, i) => (
      <mesh key={`brk-${i}`} position={[x, 0, 0.03]}>
        <boxGeometry args={[0.06, 0.15, 0.02]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    ))}
    <Text position={[0, -0.3, 0.03]} fontSize={0.04} color="#aaa" anchorX="center">
      DB Board
    </Text>
  </group>
);

// ── Full Scene ──
const Scene = ({ result }: { result: SolarResult }) => {
  const inverterInfo = INVERTER_BRANDS[result.inverterBrand];
  const bb = result.batteryBank;

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 3]} intensity={1.2} castShadow />

      <AnimatedSun />
      <Ground />
      <Building />
      <PanelArray count={result.estimatedPanels} panelSize={result.panelSize} />
      <InverterBox brand={inverterInfo.label} size={result.inverterSize} />
      <BatteryStack totalUnits={bb.totalUnits} voltage={result.batteryVoltage} type={result.batteryType} />
      <DistributionBoard />

      {/* Cable: Panels → Inverter (DC - blue) */}
      <Cable start={[1.5, 3.2, 2]} end={[3.2, 2, 2.3]} color="#00aaff" />
      {/* Cable: Inverter → Battery (DC - blue) */}
      <Cable start={[3.2, 1.1, 2.3]} end={[3.2, 0.8, 0.5]} color="#00aaff" />
      {/* Cable: Inverter → DB (AC - orange) */}
      <Cable start={[2.9, 1.5, 2.3]} end={[2.5, 1.2, 2.51]} color="#ff8800" />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={18}
        target={[0, 2, 0]}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// ── Info overlay ──
const InfoOverlay = ({ result }: { result: SolarResult }) => {
  const inverterInfo = INVERTER_BRANDS[result.inverterBrand];
  const battInfo = BATTERY_INFO[result.batteryType];

  return (
    <div className="absolute top-3 left-3 bg-card/90 backdrop-blur border border-border rounded-lg p-3 text-xs space-y-1 max-w-[180px]">
      <p className="font-semibold text-foreground text-sm">System Overview</p>
      <div className="space-y-0.5 text-muted-foreground">
        <p>☀️ {result.estimatedPanels}× {result.panelSize}W panels</p>
        <p>🔋 {inverterInfo.label} {(result.inverterSize / 1000).toFixed(1)}kVA</p>
        <p>⚡ {result.batteryBank.totalUnits}× {battInfo.label}</p>
        <p>📊 {result.dailyKwh}kWh/day</p>
      </div>
    </div>
  );
};

const Installation3D = ({ result }: Installation3DProps) => {
  const [showHelp, setShowHelp] = useState(true);

  if (result.estimatedPanels === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="p-4 sm:p-6 pb-2">
        <h3 className="font-semibold text-center text-foreground">
          🏠 3D Installation Preview
        </h3>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Drag to rotate • Scroll to zoom • Click and drag to pan
        </p>
      </div>

      <div className="relative w-full" style={{ height: 420 }}>
        <Canvas
          camera={{ position: [6, 5, 8], fov: 50 }}
          shadows
          gl={{ antialias: true, alpha: false }}
          style={{ background: "linear-gradient(180deg, #0a1628 0%, #1a2a3a 40%, #2a4a3a 100%)" }}
        >
          <Suspense fallback={null}>
            <Scene result={result} />
          </Suspense>
        </Canvas>

        <InfoOverlay result={result} />

        {/* Controls hint */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-3 right-3 bg-card/90 backdrop-blur border border-border rounded-lg p-2 flex items-center gap-2"
            >
              <div className="text-[10px] text-muted-foreground space-y-0.5">
                <p><RotateCcw className="w-3 h-3 inline mr-1" />Left-click drag: Rotate</p>
                <p><ZoomIn className="w-3 h-3 inline mr-1" />Scroll: Zoom in/out</p>
              </div>
              <button onClick={() => setShowHelp(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="text-[9px] bg-card/80 backdrop-blur px-2 py-1 rounded border border-border text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: "#00aaff" }} />DC
          </span>
          <span className="text-[9px] bg-card/80 backdrop-blur px-2 py-1 rounded border border-border text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: "#ff8800" }} />AC
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Installation3D;
