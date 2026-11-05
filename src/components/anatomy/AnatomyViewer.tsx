"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { TrackballControls, PerspectiveCamera, Center, useGLTF } from "@react-three/drei";
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

const CAPUT_HEAD_MUSCLE_NAMES = new Set([
  "frontalis",
  "occipitalis",
  "epicranial-aponeurosis",
  "temporoparietalis",
  "orbicularis-oculi",
  "corrugator-supercilii",
  "procerus",
  "nasalis",
  "depressor-septi-nasi",
  "levator-labii-superioris-alaeque-nasi",
  "levator-labii-superioris",
  "zygomaticus-minor",
  "zygomaticus-major",
  "levator-anguli-oris",
  "risorius",
  "orbicularis-oris",
  "buccinator",
  "depressor-anguli-oris",
  "depressor-labii-inferioris",
  "mentalis",
  "masseter",
  "temporalis",
  "medial-pterygoid",
  "lateral-pterygoid",
  "platysma",
  "sternocleidomastoid",
  "digastric",
  "stylohyoid",
  "mylohyoid",
  "geniohyoid",
  "sternohyoid",
  "omohyoid",
  "sternothyroid",
  "thyrohyoid",
  "scalenus-anterior",
  "scalenus-medius",
  "scalenus-posterior",
  "longus-colli",
  "longus-capitis",
  "rectus-capitis-anterior",
  "rectus-capitis-lateralis",
]);

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
    const isCaput = structures.some(
      (s) =>
        s.id.startsWith("struct-c-") ||
        s.id.startsWith("caput-") ||
        s.meshId === "frontalis"
    );

    // If using muscles model for Head/Caput, isolate only the head & facial muscles
    if (modelUrl.includes("muscles") && isCaput) {
      const headGroup = new THREE.Group();
      headGroup.name = "HeadMusclesGroup";
      scene.traverse((c: any) => {
        if (c.isMesh && CAPUT_HEAD_MUSCLE_NAMES.has(c.name)) {
          headGroup.add(c.clone());
        }
      });
      const box = new THREE.Box3().setFromObject(headGroup);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const s = 2.45 / (maxDim || 1);

      // Re-center all child meshes so headGroup center is exactly at (0, 0, 0)
      headGroup.children.forEach((child) => {
        child.position.sub(center);
      });

      headGroup.scale.set(s, s, s);
      return headGroup;
    }

    const c = scene.clone(true);
    if (modelUrl.includes("skull")) {
      // Skull model from VRE has Z pointing up; rotate upright and normalize
      c.rotation.x = -Math.PI / 2;
    }

    const box = new THREE.Box3().setFromObject(c);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 2.45 / (maxDim || 1);
    c.scale.set(s, s, s);
    c.position.set(-center.x * s, -center.y * s, -center.z * s);

    return c;
  }, [scene, modelUrl, structures]);

  // Lookup map for structure by mesh name or id
  const structureByMeshId = useMemo(() => {
    const map = new Map<string, Anatomy3DStructure>();
    structures.forEach((s) => {
      map.set(s.meshId, s);
      map.set(s.id, s);
    });
    return map;
  }, [structures]);

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
        } else if (modelUrl.includes("muscles")) {
          if (child.name.includes("aponeurosis")) {
            child.material.color.set("#e2e8f0"); // Whitish aponeurotic tendon
            child.material.roughness = 0.4;
            child.material.metalness = 0.08;
          } else {
            child.material.color.set("#b91c1c"); // Authentic anatomical muscle striated deep crimson
            child.material.roughness = 0.55;
            child.material.metalness = 0.05;
          }
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
        } else if (modelUrl.includes("muscles")) {
          finalColor = child.name.includes("aponeurosis") ? "#e2e8f0" : "#b91c1c";
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
    <Center key={modelUrl}>
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

  // Automatically reset camera view whenever modelUrl changes so the new layer is instantly centered and framed
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [modelUrl]);

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
      {/* Top Left Badge: Model Status */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="bg-white/95 backdrop-blur-xs border border-[#cbd5e1] text-[#334155] text-[11px] font-semibold px-2.5 py-1 rounded-[5px] shadow-2xs flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              modelUrl ? "bg-[#10b981]" : "bg-[#0d6efd]"
            } animate-pulse`}
          ></span>
          <span>{modelUrl ? "Model 3D Nyata" : "Model 3D"}</span>
        </span>
      </div>

      {/* Top Right: Reset View */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleResetCamera}
          className="h-[28px] px-2.5 bg-white/95 hover:bg-white border border-[#cbd5e1] text-[#334155] text-[11px] font-semibold rounded-[5px] shadow-2xs transition flex items-center gap-1 cursor-pointer"
          title="Reset Sudut Pandang Kamera"
        >
          <i className="bi bi-arrow-counterclockwise text-[12px]"></i>
          <span>Reset</span>
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

        {/* Omnidirectional 360 Free Rotation Controls */}
        <TrackballControls
          ref={controlsRef}
          rotateSpeed={2.4}
          zoomSpeed={1.2}
          panSpeed={0.8}
          staticMoving={false}
          dynamicDampingFactor={0.16}
          minDistance={1.2}
          maxDistance={7.5}
        />
      </Canvas>

      {/* Bottom Controls Helper Hint */}
      <div className="absolute bottom-2.5 inset-x-0 z-10 flex justify-center pointer-events-none px-3">
        <span className="bg-white/95 backdrop-blur-xs text-[#475569] text-[11px] font-medium px-3 py-1 rounded-full border border-[#cbd5e1] shadow-2xs text-center">
          🖱️ Seret untuk memutar 360° · Gulir untuk zoom · Klik kanan untuk menggeser
        </span>
      </div>
    </div>
  );
}
