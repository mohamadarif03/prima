"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface StructureItem {
  id: string;
  id_name: string;
  latin: string;
  region: string;
  mesh: string[];
  note: string;
}

interface AtlasCanvasProps {
  structures: StructureItem[];
  selectedStructureId: string | null;
  onSelectStructure: (id: string | null) => void;
  autoRotate: boolean;
  onAutoRotateChange: (val: boolean) => void;
  showLabels: boolean;
  onLoadingProgress: (pct: number | null) => void;
  onLoadSuccess: () => void;
  onLoadError: (err: string) => void;
  resetTrigger: number;
  zoomTrigger: { type: "in" | "out"; count: number };
  onFloatingLabelChange: (data: { x: number; y: number; visible: boolean } | null) => void;
}

export default function AtlasCanvas({
  structures,
  selectedStructureId,
  onSelectStructure,
  autoRotate,
  onAutoRotateChange,
  showLabels,
  onLoadingProgress,
  onLoadSuccess,
  onLoadError,
  resetTrigger,
  zoomTrigger,
  onFloatingLabelChange,
}: AtlasCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References to keep state across renders without reinitializing Three scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRootRef = useRef<THREE.Group | null>(null);
  const meshStructureMapRef = useRef<Map<THREE.Mesh, StructureItem>>(new Map());
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);
  const defaultCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const defaultTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraTweenRef = useRef<{
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
    startTime: number;
    duration: number;
  } | null>(null);

  const reducedMotionRef = useRef<boolean>(false);
  const isDirtyRef = useRef<boolean>(true);
  const animFrameIdRef = useRef<number | null>(null);

  // 1. Initial Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;
    if (reducedMotionRef.current) {
      onAutoRotateChange(false);
    }
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) onAutoRotateChange(false);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.set(0, 0.3, 3.2);
    cameraRef.current = camera;

    // Renderer (transparent, matching page gradient)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    // Soft Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xc8ddf2, 1.3);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(4, 7, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xbad7f5, 0.85);
    dirLight2.position.set(-4, -2, -3);
    scene.add(dirLight2);

    // OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate && !reducedMotionRef.current;
    controls.autoRotateSpeed = 1.0;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    controls.addEventListener("start", () => {
      onAutoRotateChange(false);
      isDirtyRef.current = true;
    });

    controls.addEventListener("change", () => {
      isDirtyRef.current = true;
    });

    // Raycasting & Pointer Tracking
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pointerDownPos = new THREE.Vector2();

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos.set(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dist = pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY));
      if (dist > 6) return; // Ignore drag

      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      if (!modelRootRef.current) return;

      const meshes: THREE.Mesh[] = [];
      modelRootRef.current.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) meshes.push(c as THREE.Mesh);
      });

      const intersects = raycaster.intersectObjects(meshes, false);
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const struct = meshStructureMapRef.current.get(hitMesh);
        if (struct) {
          onSelectStructure(struct.id);
          return;
        }
      }

      // Deselect on empty canvas click
      onSelectStructure(null);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      if (!modelRootRef.current) return;

      const meshes: THREE.Mesh[] = [];
      modelRootRef.current.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) meshes.push(c as THREE.Mesh);
      });

      const intersects = raycaster.intersectObjects(meshes, false);
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        canvas.style.cursor = "pointer";

        if (hoveredMeshRef.current !== hitMesh) {
          clearHover();
          hoveredMeshRef.current = hitMesh;
          const isSelected =
            hitMesh.userData.structureId &&
            hitMesh.userData.structureId === selectedStructureId;
          if (!isSelected) {
            (hitMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x1a3354);
            (hitMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.45;
            isDirtyRef.current = true;
          }
        }
      } else {
        canvas.style.cursor = "grab";
        clearHover();
      }
    };

    const clearHover = () => {
      if (hoveredMeshRef.current) {
        const mesh = hoveredMeshRef.current;
        const isSelected =
          mesh.userData.structureId &&
          mesh.userData.structureId === selectedStructureId;
        if (!isSelected) {
          (mesh.material as THREE.MeshStandardMaterial).emissive.copy(
            mesh.userData.originalEmissive
          );
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
          isDirtyRef.current = true;
        }
        hoveredMeshRef.current = null;
      }
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      isDirtyRef.current = true;
    };
    window.addEventListener("resize", handleResize);

    // Load Model
    onLoadingProgress(0);
    const loader = new GLTFLoader();
    loader.load(
      "/models/upper-limb.glb",
      (gltf) => {
        const model = gltf.scene;
        modelRootRef.current = model;

        const availableMeshNames: string[] = [];

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            availableMeshNames.push(mesh.name);
            const stdMat = mesh.material as THREE.MeshStandardMaterial;
            mesh.material = stdMat ? stdMat.clone() : new THREE.MeshStandardMaterial({ color: 0xe6edf5 });
            mesh.userData.originalEmissive = (mesh.material as THREE.MeshStandardMaterial).emissive.clone();
            mesh.userData.originalOpacity = (mesh.material as THREE.MeshStandardMaterial).opacity ?? 1.0;
          }
        });

        // Map meshes to structures
        meshStructureMapRef.current.clear();
        structures.forEach((struct) => {
          let found = false;
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              const meshNames = struct.mesh.map((m) => m.toLowerCase());
              const childName = mesh.name.toLowerCase();
              const parentName = mesh.parent && mesh.parent.name ? mesh.parent.name.toLowerCase() : "";

              if (
                meshNames.includes(childName) ||
                meshNames.includes(parentName) ||
                meshNames.some((m) => childName.includes(m))
              ) {
                meshStructureMapRef.current.set(mesh, struct);
                mesh.userData.structureId = struct.id;
                found = true;
              }
            }
          });

          if (!found) {
            console.warn(
              `[PRIMA Atlas] Struktur "${struct.id_name}" (${struct.id}) tidak cocok dengan mesh model. Daftar mesh tersedia:`,
              availableMeshNames
            );
          }
        });

        // Auto-center and fit to camera using Bounding Box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const radius = Math.max(sphere.radius, 1.0);

        const cameraDist = radius * 2.3;
        camera.position.set(0, radius * 0.1, cameraDist);
        defaultCameraPosRef.current.copy(camera.position);
        defaultTargetRef.current.set(0, 0, 0);

        controls.target.set(0, 0, 0);
        controls.minDistance = radius * 0.8;
        controls.maxDistance = radius * 4.2;
        controls.update();

        scene.add(model);
        isDirtyRef.current = true;
        onLoadSuccess();
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          onLoadingProgress(pct);
        } else {
          onLoadingProgress(null);
        }
      },
      (err) => {
        console.error("GLTF load error:", err);
        onLoadError(
          "Model 3D anggota gerak atas (upper-limb.glb) belum dapat dimuat. Pastikan berkas tersedia di folder /models/."
        );
      }
    );

    // Animation Loop
    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Camera Tween
      if (cameraTweenRef.current) {
        const { startTarget, endTarget, startTime, duration } = cameraTweenRef.current;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1.0);
        const ease = 1 - Math.pow(1 - progress, 3);

        controls.target.lerpVectors(startTarget, endTarget, ease);
        controls.update();
        isDirtyRef.current = true;

        if (progress >= 1.0) {
          cameraTweenRef.current = null;
        }
      }

      controls.update();

      // Render on-demand
      if (isDirtyRef.current || controls.autoRotate || cameraTweenRef.current) {
        renderer.render(scene, camera);
        isDirtyRef.current = false;
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // 2. React to autoRotate prop changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate && !reducedMotionRef.current;
      isDirtyRef.current = true;
    }
  }, [autoRotate]);

  // 3. React to selectedStructureId changes (Highlighting & Camera Tween & Floating Label)
  useEffect(() => {
    const model = modelRootRef.current;
    const camera = cameraRef.current;
    const container = containerRef.current;
    if (!model || !camera || !container) return;

    const selectedMeshes: THREE.Mesh[] = [];

    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const stdMat = mesh.material as THREE.MeshStandardMaterial;

        if (mesh.userData.structureId === selectedStructureId) {
          stdMat.transparent = false;
          stdMat.opacity = 1.0;
          stdMat.emissive.setHex(0x142b47); // Navy emissive
          stdMat.emissiveIntensity = 0.85;
          selectedMeshes.push(mesh);
        } else if (selectedStructureId) {
          stdMat.transparent = true;
          stdMat.opacity = 0.45;
          stdMat.emissive.copy(mesh.userData.originalEmissive);
          stdMat.emissiveIntensity = 0;
        } else {
          // Deselected: restore all
          stdMat.transparent = false;
          stdMat.opacity = mesh.userData.originalOpacity;
          stdMat.emissive.copy(mesh.userData.originalEmissive);
          stdMat.emissiveIntensity = 0;
        }
      }
    });

    // Camera Focus & Floating Label
    if (selectedMeshes.length > 0) {
      const box = new THREE.Box3();
      selectedMeshes.forEach((m) => box.expandByObject(m));
      const targetPos = box.getCenter(new THREE.Vector3());

      if (reducedMotionRef.current) {
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetPos);
          controlsRef.current.update();
        }
      } else {
        cameraTweenRef.current = {
          startTarget: controlsRef.current ? controlsRef.current.target.clone() : new THREE.Vector3(),
          endTarget: targetPos.clone(),
          startTime: performance.now(),
          duration: 650,
        };
      }

      // Project floating label coordinates
      if (showLabels) {
        const screenPos = targetPos.clone().project(camera);
        if (screenPos.z <= 1.0) {
          const widthHalf = container.clientWidth / 2;
          const heightHalf = container.clientHeight / 2;
          const x = screenPos.x * widthHalf + widthHalf;
          const y = -(screenPos.y * heightHalf) + heightHalf;
          onFloatingLabelChange({ x: Math.round(x), y: Math.round(y - 28), visible: true });
        } else {
          onFloatingLabelChange(null);
        }
      } else {
        onFloatingLabelChange(null);
      }
    } else {
      onFloatingLabelChange(null);
    }

    isDirtyRef.current = true;
  }, [selectedStructureId, showLabels]);

  // 4. React to Reset Trigger
  useEffect(() => {
    if (resetTrigger === 0) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (reducedMotionRef.current) {
      camera.position.copy(defaultCameraPosRef.current);
      controls.target.copy(defaultTargetRef.current);
      controls.update();
    } else {
      cameraTweenRef.current = {
        startTarget: controls.target.clone(),
        endTarget: defaultTargetRef.current.clone(),
        startTime: performance.now(),
        duration: 600,
      };
      // Smooth position lerp
      const startPos = camera.position.clone();
      const startTime = performance.now();
      const duration = 600;
      const animateCam = (t: number) => {
        const prog = Math.min((t - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        camera.position.lerpVectors(startPos, defaultCameraPosRef.current, ease);
        controls.update();
        isDirtyRef.current = true;
        if (prog < 1) requestAnimationFrame(animateCam);
      };
      requestAnimationFrame(animateCam);
    }
    isDirtyRef.current = true;
  }, [resetTrigger]);

  // 5. React to Zoom Trigger
  useEffect(() => {
    if (zoomTrigger.count === 0) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const step = zoomTrigger.type === "in" ? 0.4 : -0.4;
    camera.position.addScaledVector(dir, step);
    controls.update();
    isDirtyRef.current = true;
  }, [zoomTrigger]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
        aria-label="Model 3D Tulang Anggota Gerak Atas. Gunakan tetikus atau sentuhan untuk memutar dan memperbesar."
      />
    </div>
  );
}
