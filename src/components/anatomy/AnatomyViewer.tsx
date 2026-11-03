"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
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
  className?: string;
}

// Single interactive structure mesh (placeholder procedural geometry)
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
  // Determine color and emissive properties based on interactive quiz state
  let finalColor = structure.baseColor;
  let emissiveColor = "#000000";
  let emissiveIntensity = 0;

  if (isCorrect) {
    finalColor = "#10b981"; // Emerald green
    emissiveColor = "#059669";
    emissiveIntensity = 0.55;
  } else if (isIncorrect) {
    finalColor = "#ef4444"; // Rose red
    emissiveColor = "#dc2626";
    emissiveIntensity = 0.6;
  } else if (isHint) {
    finalColor = "#f59e0b"; // Pulsing amber hint
    emissiveColor = "#d97706";
    emissiveIntensity = 0.65;
  } else if (isHighlighted || isSelected) {
    finalColor = "#2563eb"; // Royal blue for question target
    emissiveColor = "#1d4ed8";
    emissiveIntensity = 0.5;
  } else if (isHovered) {
    finalColor = "#3b82f6"; // Lighter blue on hover
    emissiveColor = "#1e40af";
    emissiveIntensity = 0.3;
  }

  // Procedural geometry renderer based on structure type
  const renderGeometry = () => {
    switch (structure.geometryType) {
      case "sphere":
        return <sphereGeometry args={[structure.scale[0], 28, 28]} />;
      case "box":
        return (
          <boxGeometry
            args={[
              structure.scale[0],
              structure.scale[1],
              structure.scale[2],
            ]}
          />
        );
      case "cylinder":
      default:
        return (
          <cylinderGeometry
            args={[
              structure.scale[0],
              structure.scale[2],
              structure.scale[1],
              24,
            ]}
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
          peramban versi terbaru (Chrome, Firefox, atau Edge) dengan akselerasi
          hardware aktif.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-[400px] sm:h-[480px] lg:h-full min-h-[380px] bg-gradient-to-b from-[#f1f5f9] to-[#e2e8f0] rounded-[8px] border border-[#cbd5e1] overflow-hidden select-none ${className}`}
    >
      {/* Badge Top Left: Model Placeholder */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="bg-white/90 backdrop-blur-xs border border-[#cbd5e1] text-[#334155] text-[11px] font-semibold px-2.5 py-1 rounded-[5px] shadow-2xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0d6efd] animate-pulse"></span>
          <span>Model Placeholder 3D</span>
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
        <PerspectiveCamera makeDefault position={[0, 0, 4.2]} fov={45} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.85} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-5, -4, -4]} intensity={0.4} />
        <directionalLight position={[0, -5, 4]} intensity={0.25} />

        {/* Interactive Meshes */}
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

        {/* Camera Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={7.5}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Bottom Controls Helper Hint */}
      <div className="absolute bottom-2.5 inset-x-0 z-10 flex justify-center pointer-events-none">
        <span className="bg-white/85 backdrop-blur-xs text-[#475569] text-[11px] font-medium px-3 py-1 rounded-full border border-[#cbd5e1]/70 shadow-2xs">
          🖱️ Seret untuk memutar · Gulir untuk zoom · Klik kanan untuk menggeser
        </span>
      </div>
    </div>
  );
}
