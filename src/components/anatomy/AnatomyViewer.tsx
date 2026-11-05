"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, TrackballControls, PerspectiveCamera, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Anatomy3DStructure } from "@/lib/mock-data";

interface AnatomyViewerProps {
  structures: Anatomy3DStructure[];
  selectedStructureId: string | null;
  highlightedStructureId: string | null;
  correctStructureId: string | null;
  incorrectStructureId: string | null;
  hintStructureId: string | null;
  onMeshClick: (structureId: string) => void;
  modelUrl?: string;
  className?: string;
}

// Interactive Real GLB Model loaded via Drei
interface RealGLBModelProps {
  modelUrl: string;
  structures: Anatomy3DStructure[];
  selectedStructureId: string | null;
  highlightedStructureId: string | null;
  correctStructureId: string | null;
  incorrectStructureId: string | null;
  hintStructureId: string | null;
  hoveredStructureId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

function RealGLBModel({
  modelUrl,
  structures,
  selectedStructureId,
  highlightedStructureId,
  correctStructureId,
  incorrectStructureId,
  hintStructureId,
  hoveredStructureId,
  onHover,
  onClick,
}: RealGLBModelProps) {
  const { scene } = useGLTF(modelUrl);

  // Clone scene & normalize dimensions
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    if (modelUrl.includes("skull")) {
      // Skull model from VRE has Z pointing up; rotate upright and normalize
      c.rotation.x = -Math.PI / 2;
      const s = 2.45 / (maxDim || 1);
      c.scale.set(s, s, s);
    } else if (modelUrl.includes("head")) {
      const s = 2.4 / (maxDim || 1);
      c.scale.set(s, s, s);
    } else if (maxDim > 5 || maxDim < 0.5) {
      const s = 2.4 / (maxDim || 1);
      c.scale.set(s, s, s);
    } else {
      c.scale.set(1.35, 1.35, 1.35);
    }
    return c;
  }, [scene, modelUrl]);

  // Lookup map for structure by mesh name or id
  const structureByMeshId = useMemo(() => {
    const map = new Map<string, Anatomy3DStructure>();
    structures.forEach((s) => {
      map.set(s.meshId, s);
      map.set(s.id, s);
    });
    return map;
  }, [structures]);

  // Currently selected structure for 3D Pin Indicator
  const selectedStruct = useMemo(() => {
    return structures.find(
      (s) => s.id === selectedStructureId || s.meshId === selectedStructureId
    );
  }, [structures, selectedStructureId]);

  // Update materials dynamically when states change
  useEffect(() => {
    cloned.traverse((child: any) => {
      if (child.isMesh) {
        if (!child.material._isCustom) {
          child.material = child.material.clone();
          child.material._isCustom = true;
        }

        if (modelUrl.includes("skull")) {
          child.material.color.set("#e5dcc5"); // Authentic skull bone ivory
          child.material.roughness = 0.45;
          child.material.metalness = 0.05;
        } else if (modelUrl.includes("head")) {
          child.material.color.set("#d4a373");
          child.material.roughness = 0.6;
          child.material.metalness = 0.02;
        }

        const struct = structureByMeshId.get(child.name);
        if (!struct) return;

        const isCorrect = correctStructureId === struct.id;
        const isIncorrect = incorrectStructureId === struct.id;
        const isHint = hintStructureId === struct.id;
        const isHighlighted =
          highlightedStructureId === struct.id ||
          selectedStructureId === struct.id;
        const isHovered = hoveredStructureId === struct.id;

        let finalColor = struct.baseColor;
        let emissiveColor = "#000000";
        let emissiveIntensity = 0;

        if (isCorrect) {
          finalColor = "#10b981"; // Emerald green
          emissiveColor = "#059669";
          emissiveIntensity = 0.65;
        } else if (isIncorrect) {
          finalColor = "#ef4444"; // Rose red
          emissiveColor = "#dc2626";
          emissiveIntensity = 0.7;
        } else if (isHint) {
          finalColor = "#f59e0b"; // Pulsing amber
          emissiveColor = "#d97706";
          emissiveIntensity = 0.8;
        } else if (isHighlighted) {
          finalColor = "#2563eb"; // Royal blue
          emissiveColor = "#1d4ed8";
          emissiveIntensity = 0.55;
        } else if (isHovered) {
          finalColor = "#38bdf8"; // Light sky blue
          emissiveColor = "#0284c7";
          emissiveIntensity = 0.45;
        }

        child.material.color.set(finalColor);
        child.material.emissive.set(emissiveColor);
        child.material.emissiveIntensity = emissiveIntensity;
      }
    });
  }, [
    cloned,
    modelUrl,
    structureByMeshId,
    correctStructureId,
    incorrectStructureId,
    hintStructureId,
    highlightedStructureId,
    selectedStructureId,
    hoveredStructureId,
  ]);

  return (
    <Center>
      <group>
        <primitive
          object={cloned}
          onClick={(e: any) => {
            e.stopPropagation();
            const struct = structureByMeshId.get(e.object.name);
            if (struct) {
              onClick(struct.id);
            }
          }}
          onPointerOver={(e: any) => {
            e.stopPropagation();
            const struct = structureByMeshId.get(e.object.name);
            if (struct) {
              onHover(struct.id);
            }
          }}
          onPointerOut={(e: any) => {
            e.stopPropagation();
            onHover(null);
          }}
        />

        {/* 3D Anatomical Pin Indicator for Selected Structure */}
        {selectedStruct && (
          <group position={selectedStruct.position}>
            {/* Core glowing marker */}
            <mesh>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial
                color="#0d6efd"
                emissive="#2563eb"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Outer halo ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.085, 0.13, 24]} />
              <meshBasicMaterial
                color="#38bdf8"
                side={THREE.DoubleSide}
                transparent
                opacity={0.85}
              />
            </mesh>
          </group>
        )}
      </group>
    </Center>
  );
}

// Single interactive structure mesh (placeholder procedural geometry fallback)
interface StructureMeshProps {
  structure: Anatomy3DStructure;
  isHovered: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  isHint: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

function StructureMesh({
  structure,
  isHovered,
  isSelected,
  isHighlighted,
  isCorrect,
  isIncorrect,
  isHint,
  onHover,
  onClick,
}: StructureMeshProps) {
  let finalColor = structure.baseColor;
  let emissiveColor = "#000000";
  let emissiveIntensity = 0;

  if (isCorrect) {
    finalColor = "#10b981";
    emissiveColor = "#059669";
    emissiveIntensity = 0.55;
  } else if (isIncorrect) {
    finalColor = "#ef4444";
    emissiveColor = "#dc2626";
    emissiveIntensity = 0.6;
  } else if (isHint) {
    finalColor = "#f59e0b";
    emissiveColor = "#d97706";
    emissiveIntensity = 0.65;
  } else if (isHighlighted || isSelected) {
    finalColor = "#2563eb";
    emissiveColor = "#1d4ed8";
    emissiveIntensity = 0.5;
  } else if (isHovered) {
    finalColor = "#3b82f6";
    emissiveColor = "#1e40af";
    emissiveIntensity = 0.3;
  }

  const renderGeometry = () => {
    switch (structure.geometryType) {
      case "sphere":
        return <sphereGeometry args={[structure.scale[0], 28, 28]} />;
      case "box":
        return (
          <boxGeometry
            args={[structure.scale[0], structure.scale[1], structure.scale[2]]}
          />
        );
      case "cylinder":
      default:
        return (
          <cylinderGeometry
            args={[structure.scale[0], structure.scale[2], structure.scale[1], 24]}
          />
        );
    }
  };

  return (
    <mesh
      position={structure.position}
      rotation={structure.rotation}
      onClick={(e) => {
        e.stopPropagation();
        onClick(structure.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(structure.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      castShadow
      receiveShadow
    >
      {renderGeometry()}
      <meshStandardMaterial
        color={finalColor}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
        roughness={structure.category === "tulang" ? 0.35 : 0.6}
        metalness={0.1}
      />
    </mesh>
  );
}

interface CameraControllerProps {
  controlMode: "trackball" | "orbit";
  isAutoRotating: boolean;
  targetView: { position: [number, number, number]; up: [number, number, number] } | null;
  onViewTransitionEnd: () => void;
  controlsRef: React.MutableRefObject<any>;
}

function CameraController({
  controlMode,
  isAutoRotating,
  targetView,
  onViewTransitionEnd,
  controlsRef,
}: CameraControllerProps) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    // Smooth transition to preset target view
    if (targetView) {
      const targetPos = new THREE.Vector3(...targetView.position);
      const targetUp = new THREE.Vector3(...targetView.up);
      camera.position.lerp(targetPos, 0.14);
      camera.up.lerp(targetUp, 0.14);
      camera.lookAt(0, 0, 0);

      if (controlsRef.current) {
        controlsRef.current.target?.set?.(0, 0, 0);
        controlsRef.current.update?.();
      }

      if (camera.position.distanceTo(targetPos) < 0.04) {
        camera.position.copy(targetPos);
        camera.up.copy(targetUp);
        camera.lookAt(0, 0, 0);
        if (controlsRef.current) {
          controlsRef.current.target?.set?.(0, 0, 0);
          controlsRef.current.update?.();
        }
        onViewTransitionEnd();
      }
      return;
    }

    // Auto rotate around origin Y axis when enabled
    if (isAutoRotating) {
      const angle = delta * 0.9;
      const x = camera.position.x;
      const z = camera.position.z;
      camera.position.x = x * Math.cos(angle) - z * Math.sin(angle);
      camera.position.z = x * Math.sin(angle) + z * Math.cos(angle);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.target?.set?.(0, 0, 0);
        controlsRef.current.update?.();
      }
    }
  });

  return controlMode === "trackball" ? (
    <TrackballControls
      key="trackball"
      ref={controlsRef}
      rotateSpeed={2.4}
      zoomSpeed={1.2}
      panSpeed={0.8}
      staticMoving={false}
      dynamicDampingFactor={0.16}
      minDistance={1.2}
      maxDistance={7.5}
    />
  ) : (
    <OrbitControls
      key="orbit"
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={1.2}
      maxDistance={7.5}
      dampingFactor={0.06}
    />
  );
}

export function AnatomyViewer({
  structures,
  selectedStructureId,
  highlightedStructureId,
  correctStructureId,
  incorrectStructureId,
  hintStructureId,
  onMeshClick,
  modelUrl,
  className = "",
}: AnatomyViewerProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);
  const [controlMode, setControlMode] = useState<"trackball" | "orbit">("trackball");
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [targetView, setTargetView] = useState<{
    position: [number, number, number];
    up: [number, number, number];
  } | null>(null);
  const controlsRef = useRef<any>(null);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setIsWebGLSupported(!!gl);
    } catch {
      setIsWebGLSupported(false);
    }
  }, []);

  // Update cursor on hover
  useEffect(() => {
    document.body.style.cursor = hoveredId ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hoveredId]);

  // Handle Preset Views
  const handleSelectView = (
    view: "anterior" | "posterior" | "lateral-right" | "lateral-left" | "superior" | "inferior"
  ) => {
    setIsAutoRotating(false);
    switch (view) {
      case "anterior":
        setTargetView({ position: [0, 0, 3.8], up: [0, 1, 0] });
        break;
      case "posterior":
        setTargetView({ position: [0, 0, -3.8], up: [0, 1, 0] });
        break;
      case "lateral-right":
        setTargetView({ position: [3.8, 0, 0], up: [0, 1, 0] });
        break;
      case "lateral-left":
        setTargetView({ position: [-3.8, 0, 0], up: [0, 1, 0] });
        break;
      case "superior":
        setTargetView({ position: [0, 3.8, 0.001], up: [0, 0, -1] });
        break;
      case "inferior":
        // Base of skull (Basis Cranii / Norma Basalis)
        setTargetView({ position: [0, -3.8, 0.001], up: [0, 0, 1] });
        break;
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    setIsAutoRotating(false);
    setTargetView({ position: [0, 0, 3.8], up: [0, 1, 0] });
  };

  if (!isWebGLSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#f8f9fa] border border-[#e2e8f0] rounded-[8px] text-center">
        <div className="w-12 h-12 rounded-full bg-[#fee2e2] text-[#dc2626] flex items-center justify-center text-[22px] mb-3">
          <i className="bi bi-exclamation-octagon"></i>
        </div>
        <h4 className="text-[14px] font-bold text-[#1e293b]">
          Akselerasi Grafis 3D Tidak Didukung
        </h4>
        <p className="text-[12px] text-[#64748b] max-w-sm mt-1 leading-relaxed">
          Browser atau perangkat kamu tidak mendukung WebGL. Silakan gunakan
          peramban versi terbaru dengan akselerasi hardware aktif.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-[400px] sm:h-[480px] lg:h-full min-h-[380px] bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] rounded-[8px] border border-[#cbd5e1] overflow-hidden select-none ${className}`}
    >
      {/* Top Left Controls: Model Badge & 360 Mode Switch */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
        <span className="bg-white/95 backdrop-blur-xs border border-[#cbd5e1] text-[#334155] text-[11px] font-semibold px-2.5 py-1 rounded-[5px] shadow-2xs flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              modelUrl ? "bg-[#10b981]" : "bg-[#0d6efd]"
            } animate-pulse`}
          ></span>
          <span>{modelUrl ? "Model 3D Nyata" : "Model 3D"}</span>
        </span>

        {/* Mode Rotasi: 360 Bebas vs Meja Putar */}
        <div className="inline-flex rounded-[6px] border border-[#cbd5e1] bg-white/95 backdrop-blur-xs p-0.5 shadow-2xs">
          <button
            onClick={() => {
              setControlMode("trackball");
              setIsAutoRotating(false);
            }}
            className={`px-2 py-0.5 text-[10.5px] font-semibold rounded-[4px] transition flex items-center gap-1 cursor-pointer ${
              controlMode === "trackball"
                ? "bg-[#0d6efd] text-white shadow-xs"
                : "text-[#64748b] hover:text-[#1e293b]"
            }`}
            title="Rotasi bebas 360° ke segala arah (atas, bawah, samping, terbalik) tanpa batas polar"
          >
            <i className="bi bi-globe"></i>
            <span>360° Bebas</span>
          </button>
          <button
            onClick={() => {
              setControlMode("orbit");
              setIsAutoRotating(false);
            }}
            className={`px-2 py-0.5 text-[10.5px] font-semibold rounded-[4px] transition flex items-center gap-1 cursor-pointer ${
              controlMode === "orbit"
                ? "bg-[#0d6efd] text-white shadow-xs"
                : "text-[#64748b] hover:text-[#1e293b]"
            }`}
            title="Rotasi meja putar (turntable) dengan batas sudut kemiringan"
          >
            <i className="bi bi-arrow-repeat"></i>
            <span>Meja Putar</span>
          </button>
        </div>
      </div>

      {/* Top Right Controls: Preset Views, Auto-Rotate & Reset */}
      <div className="absolute top-3 right-3 z-10 flex flex-wrap items-center justify-end gap-1.5">
        {/* Preset Angles Quick Bar */}
        <div className="hidden sm:flex items-center gap-1 bg-white/95 backdrop-blur-xs border border-[#cbd5e1] p-0.5 rounded-[6px] shadow-2xs text-[10.5px]">
          <button
            onClick={() => handleSelectView("anterior")}
            className="px-1.5 py-0.5 rounded-[4px] hover:bg-[#f1f5f9] text-[#475569] font-medium transition cursor-pointer"
            title="Tampak Depan (Anterior)"
          >
            Depan
          </button>
          <button
            onClick={() => handleSelectView("posterior")}
            className="px-1.5 py-0.5 rounded-[4px] hover:bg-[#f1f5f9] text-[#475569] font-medium transition cursor-pointer"
            title="Tampak Belakang (Posterior)"
          >
            Belakang
          </button>
          <button
            onClick={() => handleSelectView("lateral-right")}
            className="px-1.5 py-0.5 rounded-[4px] hover:bg-[#f1f5f9] text-[#475569] font-medium transition cursor-pointer"
            title="Tampak Kanan (Lateral Dextra)"
          >
            Kanan
          </button>
          <button
            onClick={() => handleSelectView("lateral-left")}
            className="px-1.5 py-0.5 rounded-[4px] hover:bg-[#f1f5f9] text-[#475569] font-medium transition cursor-pointer"
            title="Tampak Kiri (Lateral Sinistra)"
          >
            Kiri
          </button>
          <button
            onClick={() => handleSelectView("superior")}
            className="px-1.5 py-0.5 rounded-[4px] hover:bg-[#f1f5f9] text-[#475569] font-medium transition cursor-pointer"
            title="Tampak Atas (Superior / Calvaria)"
          >
            Atas
          </button>
          <button
            onClick={() => handleSelectView("inferior")}
            className="px-1.5 py-0.5 rounded-[4px] hover:bg-[#eff6ff] text-[#0d6efd] font-semibold transition cursor-pointer"
            title="Tampak Bawah (Basis Cranii / Dasar Tengkorak)"
          >
            Basis Cranii
          </button>
        </div>

        {/* Auto Rotate Toggle */}
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`h-[28px] px-2 border rounded-[5px] text-[11px] font-semibold shadow-2xs transition flex items-center gap-1 cursor-pointer ${
            isAutoRotating
              ? "bg-[#0d6efd] text-white border-[#0d6efd]"
              : "bg-white/95 hover:bg-white text-[#334155] border-[#cbd5e1]"
          }`}
          title="Putar Otomatis 360 Derajat"
        >
          <i className={`bi ${isAutoRotating ? "bi-pause-fill" : "bi-play-fill"} text-[12px]`}></i>
          <span className="hidden md:inline">{isAutoRotating ? "Berhenti" : "Auto 360°"}</span>
        </button>

        {/* Reset Camera Button */}
        <button
          onClick={handleResetCamera}
          className="h-[28px] px-2 bg-white/95 hover:bg-white border border-[#cbd5e1] text-[#334155] text-[11px] font-semibold rounded-[5px] shadow-2xs transition flex items-center gap-1 cursor-pointer"
          title="Reset Sudut Pandang Kamera ke Tampak Depan"
        >
          <i className="bi bi-arrow-counterclockwise text-[12px]"></i>
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* 3D Canvas Scene */}
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 3.8]} fov={45} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.3}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-5, -4, -4]} intensity={0.5} />
        <directionalLight position={[0, -5, 4]} intensity={0.3} />

        {/* Interactive Meshes */}
        <Suspense fallback={null}>
          {modelUrl ? (
            <RealGLBModel
              modelUrl={modelUrl}
              structures={structures}
              selectedStructureId={selectedStructureId}
              highlightedStructureId={highlightedStructureId}
              correctStructureId={correctStructureId}
              incorrectStructureId={incorrectStructureId}
              hintStructureId={hintStructureId}
              hoveredStructureId={hoveredId}
              onHover={setHoveredId}
              onClick={onMeshClick}
            />
          ) : (
            <group>
              {structures.map((struct) => (
                <StructureMesh
                  key={struct.id}
                  structure={struct}
                  isHovered={hoveredId === struct.id}
                  isSelected={selectedStructureId === struct.id}
                  isHighlighted={highlightedStructureId === struct.id}
                  isCorrect={correctStructureId === struct.id}
                  isIncorrect={incorrectStructureId === struct.id}
                  isHint={hintStructureId === struct.id}
                  onHover={setHoveredId}
                  onClick={onMeshClick}
                />
              ))}
            </group>
          )}
        </Suspense>

        {/* Omnidirectional 360 Camera Controls */}
        <CameraController
          controlMode={controlMode}
          isAutoRotating={isAutoRotating}
          targetView={targetView}
          onViewTransitionEnd={() => setTargetView(null)}
          controlsRef={controlsRef}
        />
      </Canvas>

      {/* Bottom Controls Helper Hint */}
      <div className="absolute bottom-2.5 inset-x-0 z-10 flex justify-center pointer-events-none px-3">
        <span className="bg-white/95 backdrop-blur-xs text-[#334155] text-[11px] font-medium px-3 py-1 rounded-full border border-[#cbd5e1] shadow-2xs text-center leading-tight">
          {controlMode === "trackball" ? (
            <>🌐 <strong>Rotasi Bebas 360° Aktif:</strong> Seret mouse ke segala arah (atas, bawah, samping, jungkir balik) · Gulir untuk zoom · Klik kanan untuk geser</>
          ) : (
            <>🔄 <strong>Mode Meja Putar:</strong> Seret untuk rotasi horizontal · Gulir zoom · Klik kanan geser</>
          )}
        </span>
      </div>
    </div>
  );
}
