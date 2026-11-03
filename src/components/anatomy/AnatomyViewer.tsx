"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Center, useGLTF } from "@react-three/drei";
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

  // Clone scene so materials are isolated
  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Lookup map for structure by mesh name or id
  const structureByMeshId = useMemo(() => {
    const map = new Map<string, Anatomy3DStructure>();
    structures.forEach((s) => {
      map.set(s.meshId, s);
      map.set(s.id, s);
    });
    return map;
  }, [structures]);

  // Update materials dynamically when quiz states change
  useEffect(() => {
    cloned.traverse((child: any) => {
      if (child.isMesh) {
        const struct = structureByMeshId.get(child.name);
        if (!struct) return;

        const isCorrect = correctStructureId === struct.id;
        const isIncorrect = incorrectStructureId === struct.id;
        const isHint = hintStructureId === struct.id;
        const isHighlighted =
          highlightedStructureId === struct.id ||
          selectedStructureId === struct.id;
        const isHovered = hoveredStructureId === struct.id;

        // Ensure distinct material instance
        if (!child.material._isCustom) {
          child.material = child.material.clone();
          child.material._isCustom = true;
        }

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
        child.material.roughness = 0.4;
        child.material.metalness = 0.15;
      }
    });
  }, [
    cloned,
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
      <primitive
        object={cloned}
        scale={[1.35, 1.35, 1.35]}
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

  // Reset Camera View
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
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
      {/* Badge Top Left: Model Status */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="bg-white/95 backdrop-blur-xs border border-[#cbd5e1] text-[#334155] text-[11px] font-semibold px-2.5 py-1 rounded-[5px] shadow-2xs flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              modelUrl ? "bg-[#10b981]" : "bg-[#0d6efd]"
            } animate-pulse`}
          ></span>
          <span>{modelUrl ? "Model 3D Medis Nyata (BodyParts3D)" : "Model Placeholder 3D"}</span>
        </span>
      </div>

      {/* Control Buttons Top Right: Reset View */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          onClick={handleResetCamera}
          className="h-[30px] px-2.5 bg-white/90 hover:bg-white border border-[#cbd5e1] text-[#334155] text-[11.5px] font-semibold rounded-[5px] shadow-2xs transition flex items-center gap-1"
          title="Reset Sudut Pandang Kamera"
        >
          <i className="bi bi-arrow-counterclockwise text-[13px]"></i>
          <span className="hidden sm:inline">Reset Sudut</span>
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

        {/* Camera Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.8}
          maxDistance={7.5}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Bottom Controls Helper Hint */}
      <div className="absolute bottom-2.5 inset-x-0 z-10 flex justify-center pointer-events-none">
        <span className="bg-white/90 backdrop-blur-xs text-[#475569] text-[11px] font-medium px-3 py-1 rounded-full border border-[#cbd5e1]/70 shadow-2xs">
          🖱️ Seret untuk memutar · Gulir untuk zoom · Klik kanan untuk menggeser
        </span>
      </div>
    </div>
  );
}
