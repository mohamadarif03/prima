/**
 * PRIMA — Atlas Anatomi 3D (Anggota Gerak Atas / Membrum Superius)
 * Vanilla JavaScript ES Module dengan Three.js v0.160.0
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* ==========================================================================
   1. State Aplikasi
   ========================================================================== */
const state = {
  structures: [],              // Data dari structures.json
  selectedStructureId: null,   // ID struktur terpilih
  hoveredMesh: null,           // Mesh yang sedang disorot kursor
  autoRotate: true,            // Toggle putar otomatis
  showLabels: true,            // Toggle label mengambang
  reducedMotion: false,        // Preferensi reduced motion pengguna
  isDirty: true,               // Flag render on-demand
  modelRoot: null,             // Root object 3D hasil pemuatan GLTF
  meshStructureMap: new Map(), // Mapping THREE.Mesh -> Struktur data
  defaultCameraPos: new THREE.Vector3(),
  defaultTarget: new THREE.Vector3(0, 0, 0),
  cameraTween: null,           // Animasi kamera yang sedang aktif
};

/* ==========================================================================
   2. Elemen DOM
   ========================================================================== */
const canvas = document.getElementById('webgl-canvas');
const stageContainer = document.getElementById('stage-container');
const loadingOverlay = document.getElementById('loading-overlay');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const errorCard = document.getElementById('error-card');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');
const floatingLabel = document.getElementById('floating-label');
const floatingLatin = document.getElementById('floating-latin');
const floatingIdName = document.getElementById('floating-idname');

// Panel info struktur
const panelEmpty = document.getElementById('panel-empty');
const panelContent = document.getElementById('panel-content');
const structureIdName = document.getElementById('structure-idname');
const structureLatin = document.getElementById('structure-latin');
const structureRegion = document.getElementById('structure-region');
const structureNote = document.getElementById('structure-note');
const chipsContainer = document.getElementById('chips-container');

// Tombol kontrol
const toggleAutoRotateBtn = document.getElementById('btn-toggle-autorotate');
const resetViewBtn = document.getElementById('btn-reset-view');
const zoomInBtn = document.getElementById('btn-zoom-in');
const zoomOutBtn = document.getElementById('btn-zoom-out');
const toggleLabelBtn = document.getElementById('btn-toggle-label');

/* ==========================================================================
   3. Inisialisasi Three.js (Scene, Camera, Renderer, Controls)
   ========================================================================== */
let scene, camera, renderer, controls, raycaster, pointer;
const pointerDownPos = new THREE.Vector2();

function initThree() {
  // Cek preferensi prefers-reduced-motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  state.reducedMotion = motionQuery.matches;
  if (state.reducedMotion) {
    state.autoRotate = false;
  }
  motionQuery.addEventListener('change', (e) => {
    state.reducedMotion = e.matches;
    if (state.reducedMotion) {
      setAutoRotate(false);
    }
  });

  // Scene
  scene = new THREE.Scene();

  // Camera
  const aspect = stageContainer.clientWidth / stageContainer.clientHeight;
  camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
  camera.position.set(0, 0.3, 3.2);

  // Renderer (transparan menyatu dengan gradien latar belakang, batasi pixel ratio maksimal 2)
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(stageContainer.clientWidth, stageContainer.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // Pencahayaan lembut
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xc8ddf2, 1.3);
  scene.add(hemiLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight1.position.set(4, 7, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xbad7f5, 0.85);
  dirLight2.position.set(-4, -2, -3);
  scene.add(dirLight2);

  // OrbitControls
  controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = state.autoRotate;
  controls.autoRotateSpeed = 1.0;
  controls.target.set(0, 0, 0);

  // Matikan putar otomatis saat pengguna mulai berinteraksi langsung
  controls.addEventListener('start', () => {
    if (state.autoRotate) {
      setAutoRotate(false);
    }
    requestRender();
  });

  controls.addEventListener('change', () => {
    requestRender();
  });

  // Raycaster & Pointer
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  // Event Listeners Canvas
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  window.addEventListener('resize', onWindowResize);

  // Render loop
  animate();
}

/* ==========================================================================
   4. Memuat Model GLTF dan structures.json
   ========================================================================== */
async function loadDataAndModel() {
  showLoading(0);
  hideError();

  try {
    // 1. Muat data structures.json
    const res = await fetch('./structures.json');
    if (!res.ok) throw new Error('Gagal memuat structures.json');
    state.structures = await res.json();
    renderChips();

    // 2. Muat model GLB dengan GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      './models/upper-limb.glb',
      (gltf) => {
        onModelLoaded(gltf);
        hideLoading();
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          showLoading(pct);
        } else {
          showLoading(null);
        }
      },
      (error) => {
        console.error('Error memuat berkas GLB:', error);
        showError(
          'Model 3D anggota gerak atas (upper-limb.glb) belum dapat dimuat. Pastikan berkas tersedia di folder ./models/.'
        );
      }
    );
  } catch (err) {
    console.error('Inisialisasi atlas gagal:', err);
    showError(
      'Terjadi kendala saat membaca data anatomi. Periksa koneksi lokal Anda dan coba lagi.'
    );
  }
}

function onModelLoaded(gltf) {
  if (state.modelRoot) {
    scene.remove(state.modelRoot);
  }

  const model = gltf.scene;
  state.modelRoot = model;

  // Catat nama semua node/mesh yang ada dalam model untuk debugging jika ada nama yang tidak cocok
  const availableMeshNames = [];

  // Konfigurasi material dan simpan referensi original
  model.traverse((child) => {
    if (child.isMesh) {
      availableMeshNames.push(child.name);

      // Clone material agar tidak saling bentrok saat disorot/diredupkan
      child.material = child.material ? child.material.clone() : new THREE.MeshStandardMaterial({ color: 0xe6edf5 });
      child.userData.originalEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000);
      child.userData.originalColor = child.material.color.clone();
      child.userData.originalOpacity = child.material.opacity ?? 1.0;
    }
  });

  // Hubungkan mesh dengan data struktur di structures.json
  state.meshStructureMap.clear();
  const matchedStructures = new Set();

  state.structures.forEach((struct) => {
    let found = false;
    model.traverse((child) => {
      if (child.isMesh) {
        // Cek nama mesh langsung atau nama parent
        const meshNames = struct.mesh.map((m) => m.toLowerCase());
        const childName = child.name.toLowerCase();
        const parentName = child.parent && child.parent.name ? child.parent.name.toLowerCase() : '';

        if (
          meshNames.includes(childName) ||
          meshNames.includes(parentName) ||
          meshNames.some((m) => childName.includes(m))
        ) {
          state.meshStructureMap.set(child, struct);
          child.userData.structureId = struct.id;
          found = true;
          matchedStructures.add(struct.id);
        }
      }
    });

    if (!found) {
      console.warn(
        `[PRIMA Atlas] Struktur "${struct.id_name}" (${struct.id}) tidak cocok dengan mesh model. Daftar mesh yang tersedia:`,
        availableMeshNames
      );
    }
  });

  // Otomatis pusatkan dan sesuaikan skala model ke ukuran kamera dengan Bounding Box
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center); // Pindahkan model sehingga titik pusat tepat di (0, 0, 0)

  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const radius = Math.max(sphere.radius, 1.0);

  // Atur jarak kamera dan batasan OrbitControls sesuai radius model
  const cameraDist = radius * 2.3;
  camera.position.set(0, radius * 0.1, cameraDist);
  state.defaultCameraPos.copy(camera.position);
  state.defaultTarget.set(0, 0, 0);

  controls.target.set(0, 0, 0);
  controls.minDistance = radius * 0.8;
  controls.maxDistance = radius * 4.2;
  controls.update();

  scene.add(model);
  requestRender();
}

/* ==========================================================================
   5. Interaksi: Raycasting (Klik & Hover)
   ========================================================================== */
function onPointerDown(e) {
  pointerDownPos.set(e.clientX, e.clientY);
}

function onPointerUp(e) {
  // Hanya proses klik jika pergerakan pointer kurang dari 6 piksel (bukan seretan orbit)
  const dist = pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY));
  if (dist > 6) return;

  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  if (!state.modelRoot) return;

  const meshes = [];
  state.modelRoot.traverse((c) => {
    if (c.isMesh) meshes.push(c);
  });

  const intersects = raycaster.intersectObjects(meshes, false);

  if (intersects.length > 0) {
    const hitMesh = intersects[0].object;
    const struct = state.meshStructureMap.get(hitMesh);
    if (struct) {
      selectStructure(struct.id);
      return;
    }
  }

  // Klik di area kosong: batalkan pilihan
  deselectStructure();
}

function onPointerMove(e) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  if (!state.modelRoot) return;

  const meshes = [];
  state.modelRoot.traverse((c) => {
    if (c.isMesh) meshes.push(c);
  });

  const intersects = raycaster.intersectObjects(meshes, false);

  if (intersects.length > 0) {
    const hitMesh = intersects[0].object;
    canvas.style.cursor = 'pointer';

    if (state.hoveredMesh !== hitMesh) {
      clearHover();
      state.hoveredMesh = hitMesh;
      if (!isMeshSelected(hitMesh)) {
        // Efek sorot halus saat kursor melayang di atas tulang
        hitMesh.material.emissive.setHex(0x1a3354);
        hitMesh.material.emissiveIntensity = 0.45;
        requestRender();
      }
    }
  } else {
    canvas.style.cursor = 'grab';
    clearHover();
  }
}

function clearHover() {
  if (state.hoveredMesh) {
    if (!isMeshSelected(state.hoveredMesh)) {
      state.hoveredMesh.material.emissive.copy(state.hoveredMesh.userData.originalEmissive);
      state.hoveredMesh.material.emissiveIntensity = 0;
      requestRender();
    }
    state.hoveredMesh = null;
  }
}

function isMeshSelected(mesh) {
  return mesh.userData.structureId && mesh.userData.structureId === state.selectedStructureId;
}

/* ==========================================================================
   6. Pemilihan Struktur & Sorotan Visual (Highlight & Dimming)
   ========================================================================== */
function selectStructure(id) {
  if (state.selectedStructureId === id) return;
  state.selectedStructureId = id;

  const struct = state.structures.find((s) => s.id === id);
  if (!struct) return;

  // 1. Perbarui sorot 3D: mesh terpilih emissive navy lembut, mesh lain diredupkan
  const selectedMeshes = [];

  if (state.modelRoot) {
    state.modelRoot.traverse((child) => {
      if (child.isMesh) {
        if (child.userData.structureId === id) {
          // Mesh terpilih: sorot navy lembut
          child.material.transparent = false;
          child.material.opacity = 1.0;
          child.material.emissive.setHex(0x142b47); // Navy emissive
          child.material.emissiveIntensity = 0.85;
          selectedMeshes.push(child);
        } else {
          // Mesh lain: sedikit diredupkan
          child.material.transparent = true;
          child.material.opacity = 0.45;
          child.material.emissive.copy(child.userData.originalEmissive);
          child.material.emissiveIntensity = 0;
        }
      }
    });
  }

  // 2. Perbarui panel informasi struktur
  updateStructurePanel(struct);

  // 3. Perbarui chip aktif
  updateActiveChip(id);

  // 4. Fokuskan kamera ke struktur (animasi halus jika bukan reduced motion)
  if (selectedMeshes.length > 0) {
    focusCameraOnMeshes(selectedMeshes);
  }

  requestRender();
}

function deselectStructure() {
  if (!state.selectedStructureId) return;
  state.selectedStructureId = null;

  // Kembalikan semua material mesh ke kondisi semula
  if (state.modelRoot) {
    state.modelRoot.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = false;
        child.material.opacity = child.userData.originalOpacity;
        child.material.emissive.copy(child.userData.originalEmissive);
        child.material.emissiveIntensity = 0;
      }
    });
  }

  // Kembalikan panel informasi ke ajakan awal
  updateStructurePanel(null);
  updateActiveChip(null);
  hideFloatingLabel();

  requestRender();
}

/* ==========================================================================
   7. Panel Informasi Struktur & Chip
   ========================================================================== */
function updateStructurePanel(struct) {
  if (!struct) {
    panelEmpty.classList.remove('hidden');
    panelContent.classList.add('hidden');
    return;
  }

  panelEmpty.classList.add('hidden');
  panelContent.classList.remove('hidden');

  structureIdName.textContent = struct.id_name;
  structureLatin.textContent = struct.latin;
  structureRegion.textContent = struct.region || 'Membrum superius / anggota gerak atas';
  structureNote.textContent = struct.note || 'Keterangan menyusul — perlu divalidasi dosen.';
}

function renderChips() {
  chipsContainer.innerHTML = '';

  state.structures.forEach((struct) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className =
      'structure-chip shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 border border-white/60 bg-white/45 text-[#06192f] hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f]';
    chip.setAttribute('data-id', struct.id);
    chip.setAttribute('aria-label', `Pilih tulang ${struct.id_name} (${struct.latin})`);

    chip.innerHTML = `<span>${struct.latin}</span> <span class="text-slate-400 font-normal text-[11px]">/ ${struct.id_name}</span>`;

    chip.addEventListener('click', () => {
      selectStructure(struct.id);
    });

    chipsContainer.appendChild(chip);
  });
}

function updateActiveChip(activeId) {
  const chips = chipsContainer.querySelectorAll('.structure-chip');
  chips.forEach((chip) => {
    const chipId = chip.getAttribute('data-id');
    if (chipId === activeId) {
      chip.className =
        'structure-chip shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 bg-[#06192f] text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f]';
      // Gulir chip aktif ke pandangan
      chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      chip.className =
        'structure-chip shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 border border-white/60 bg-white/45 text-[#06192f] hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f]';
    }
  });
}

/* ==========================================================================
   8. Label Mengambang 2D (Floating HTML Label)
   ========================================================================== */
const targetWorldPos = new THREE.Vector3();

function updateFloatingLabelPosition() {
  if (!state.showLabels || !state.selectedStructureId || !state.modelRoot) {
    hideFloatingLabel();
    return;
  }

  // Hitung pusat bounding box dari mesh struktur terpilih
  const meshes = [];
  state.modelRoot.traverse((c) => {
    if (c.isMesh && c.userData.structureId === state.selectedStructureId) {
      meshes.push(c);
    }
  });

  if (meshes.length === 0) {
    hideFloatingLabel();
    return;
  }

  const box = new THREE.Box3();
  meshes.forEach((m) => box.expandByObject(m));
  box.getCenter(targetWorldPos);

  // Proyeksikan koordinat 3D ke layar 2D
  const screenPos = targetWorldPos.clone().project(camera);

  // Jika posisi di belakang kamera, sembunyikan
  if (screenPos.z > 1.0) {
    hideFloatingLabel();
    return;
  }

  const widthHalf = stageContainer.clientWidth / 2;
  const heightHalf = stageContainer.clientHeight / 2;
  const x = screenPos.x * widthHalf + widthHalf;
  const y = -(screenPos.y * heightHalf) + heightHalf;

  // Cek apakah koordinat masih berada di dalam batas kanvas
  if (x < 10 || x > stageContainer.clientWidth - 10 || y < 10 || y > stageContainer.clientHeight - 10) {
    hideFloatingLabel();
    return;
  }

  const struct = state.structures.find((s) => s.id === state.selectedStructureId);
  if (struct) {
    floatingLatin.textContent = struct.latin;
    floatingIdName.textContent = struct.id_name;
  }

  floatingLabel.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y - 28)}px, 0)`;
  floatingLabel.classList.remove('opacity-0', 'pointer-events-none');
  floatingLabel.classList.add('opacity-100');
}

function hideFloatingLabel() {
  if (!floatingLabel) return;
  floatingLabel.classList.remove('opacity-100');
  floatingLabel.classList.add('opacity-0', 'pointer-events-none');
}

/* ==========================================================================
   9. Animasi Kamera (Smooth Tween)
   ========================================================================== */
function focusCameraOnMeshes(meshes) {
  if (state.reducedMotion) {
    // Jika prefers-reduced-motion aktif, langsung posisikan target
    const box = new THREE.Box3();
    meshes.forEach((m) => box.expandByObject(m));
    const target = box.getCenter(new THREE.Vector3());
    controls.target.copy(target);
    controls.update();
    requestRender();
    return;
  }

  const box = new THREE.Box3();
  meshes.forEach((m) => box.expandByObject(m));
  const newTarget = box.getCenter(new THREE.Vector3());

  startCameraTween(newTarget, 650);
}

function startCameraTween(targetPos, duration = 650) {
  const startTarget = controls.target.clone();
  const startTime = performance.now();

  state.cameraTween = {
    startTarget,
    endTarget: targetPos.clone(),
    startTime,
    duration,
  };
}

function updateCameraTween(currentTime) {
  if (!state.cameraTween) return;

  const { startTarget, endTarget, startTime, duration } = state.cameraTween;
  const elapsed = currentTime - startTime;
  const progress = Math.min(elapsed / duration, 1.0);

  // Easing: cubic-out
  const ease = 1 - Math.pow(1 - progress, 3);

  controls.target.lerpVectors(startTarget, endTarget, ease);
  controls.update();
  requestRender();

  if (progress >= 1.0) {
    state.cameraTween = null;
  }
}

/* ==========================================================================
   10. Tombol Kontrol (Putar Otomatis, Reset, Zoom, Toggle Label)
   ========================================================================== */
function setAutoRotate(enabled) {
  if (state.reducedMotion && enabled) return;
  state.autoRotate = enabled;
  controls.autoRotate = enabled;

  if (toggleAutoRotateBtn) {
    if (enabled) {
      toggleAutoRotateBtn.classList.add('bg-[#06192f]', 'text-white');
      toggleAutoRotateBtn.classList.remove('bg-white/45', 'text-[#06192f]');
      toggleAutoRotateBtn.setAttribute('aria-pressed', 'true');
    } else {
      toggleAutoRotateBtn.classList.remove('bg-[#06192f]', 'text-white');
      toggleAutoRotateBtn.classList.add('bg-white/45', 'text-[#06192f]');
      toggleAutoRotateBtn.setAttribute('aria-pressed', 'false');
    }
  }
  requestRender();
}

function setupControls() {
  // Putar otomatis
  if (toggleAutoRotateBtn) {
    toggleAutoRotateBtn.addEventListener('click', () => {
      setAutoRotate(!state.autoRotate);
    });
  }

  // Reset tampilan
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      deselectStructure();
      if (state.reducedMotion) {
        camera.position.copy(state.defaultCameraPos);
        controls.target.copy(state.defaultTarget);
        controls.update();
      } else {
        startCameraTween(state.defaultTarget, 600);
        // Lerp camera position
        const startPos = camera.position.clone();
        const startTime = performance.now();
        const duration = 600;
        function animateCam(t) {
          const prog = Math.min((t - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - prog, 3);
          camera.position.lerpVectors(startPos, state.defaultCameraPos, ease);
          controls.update();
          requestRender();
          if (prog < 1) requestAnimationFrame(animateCam);
        }
        requestAnimationFrame(animateCam);
      }
      requestRender();
    });
  }

  // Zoom In
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      camera.position.addScaledVector(dir, 0.4);
      controls.update();
      requestRender();
    });
  }

  // Zoom Out
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      camera.position.addScaledVector(dir, -0.4);
      controls.update();
      requestRender();
    });
  }

  // Toggle Label
  if (toggleLabelBtn) {
    toggleLabelBtn.addEventListener('click', () => {
      state.showLabels = !state.showLabels;
      if (state.showLabels) {
        toggleLabelBtn.classList.add('bg-[#06192f]', 'text-white');
        toggleLabelBtn.classList.remove('bg-white/45', 'text-[#06192f]');
        toggleLabelBtn.setAttribute('aria-pressed', 'true');
        updateFloatingLabelPosition();
      } else {
        toggleLabelBtn.classList.remove('bg-[#06192f]', 'text-white');
        toggleLabelBtn.classList.add('bg-white/45', 'text-[#06192f]');
        toggleLabelBtn.setAttribute('aria-pressed', 'false');
        hideFloatingLabel();
      }
      requestRender();
    });
  }

  // Tombol Coba Lagi pada kartu error
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      loadDataAndModel();
    });
  }
}

/* ==========================================================================
   11. State UI (Loading & Error Card)
   ========================================================================== */
function showLoading(pct) {
  if (!loadingOverlay) return;
  loadingOverlay.classList.remove('hidden');
  loadingOverlay.classList.add('flex');

  if (typeof pct === 'number') {
    progressBar.style.width = `${pct}%`;
    progressText.textContent = `Memuat model 3D... ${pct}%`;
  } else {
    progressBar.style.width = '75%';
    progressText.textContent = 'Menyiapkan anatomi 3D...';
  }
}

function hideLoading() {
  if (!loadingOverlay) return;
  loadingOverlay.classList.add('hidden');
  loadingOverlay.classList.remove('flex');
}

function showError(msg) {
  hideLoading();
  if (!errorCard) return;
  errorMessage.textContent = msg;
  errorCard.classList.remove('hidden');
  errorCard.classList.add('flex');
}

function hideError() {
  if (!errorCard) return;
  errorCard.classList.add('hidden');
  errorCard.classList.remove('flex');
}

/* ==========================================================================
   12. Render Loop (On-Demand & Animasi)
   ========================================================================== */
function onWindowResize() {
  if (!stageContainer || !renderer || !camera) return;
  const w = stageContainer.clientWidth;
  const h = stageContainer.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  requestRender();
}

function requestRender() {
  state.isDirty = true;
}

function animate(time = 0) {
  requestAnimationFrame(animate);

  // Animasi kamera yang sedang berjalan
  if (state.cameraTween) {
    updateCameraTween(time);
  }

  // Update controls
  if (controls) {
    controls.update();
  }

  // Perbarui label mengambang
  if (state.showLabels && state.selectedStructureId) {
    updateFloatingLabelPosition();
  }

  // Render jika perlu (autoRotate aktif, kamera bergerak, atau dirty)
  if (state.isDirty || controls.autoRotate || state.cameraTween) {
    renderer.render(scene, camera);
    state.isDirty = false;
  }
}

/* ==========================================================================
   13. Eksekusi Utama Saat Halaman Dimuat
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  initThree();
  setupControls();
  loadDataAndModel();
});
