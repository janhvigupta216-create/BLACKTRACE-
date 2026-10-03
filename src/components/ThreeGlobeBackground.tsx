import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeGlobeBackgroundProps {
  isSearching?: boolean;
  isFocused?: boolean;
}

export const ThreeGlobeBackground: React.FC<ThreeGlobeBackgroundProps> = ({
  isSearching = false,
  isFocused = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    isSearching,
    isFocused,
    targetSpeed: 0.0015,
    currentSpeed: 0.0015,
    mouseX: 0,
    mouseY: 0,
    targetRotationX: 0,
    targetRotationY: 0
  });

  // Keep state ref in sync
  useEffect(() => {
    stateRef.current.isSearching = isSearching;
    stateRef.current.isFocused = isFocused;
    stateRef.current.targetSpeed = isSearching ? 0.008 : isFocused ? 0.0035 : 0.0015;
  }, [isSearching, isFocused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to CSS background');
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.setClearColor(0x050505, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = isMobile ? 260 : 210;

    // Create Cyber Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Globe Node Points
    const radius = 75;
    const nodeCount = isMobile ? 350 : 800;
    const nodePositions: number[] = [];
    const nodeColors: number[] = [];
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      nodePositions.push(x, y, z);
      const vec = new THREE.Vector3(x, y, z);
      nodes.push(vec);

      // Monochrome gradient brightness
      const brightness = Math.random() * 0.6 + 0.4;
      nodeColors.push(brightness, brightness, brightness);
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
    nodeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(nodeColors, 3));

    const nodeMaterial = new THREE.PointsMaterial({
      size: isMobile ? 1.8 : 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
    globeGroup.add(nodePoints);

    // 2. Interconnecting Cyber Lines between neighboring nodes
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxDistance = 22;

    for (let i = 0; i < nodes.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < nodes.length; j++) {
        if (connections > (isMobile ? 2 : 3)) break;
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < maxDistance) {
          linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);

          const alpha = 1 - dist / maxDistance;
          lineColors.push(alpha * 0.4, alpha * 0.4, alpha * 0.4);
          lineColors.push(alpha * 0.4, alpha * 0.4, alpha * 0.4);
          connections++;
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    globeGroup.add(linesMesh);

    // 3. Cyber Scanning Rings around the globe
    const ringGeometry1 = new THREE.RingGeometry(radius * 1.15, radius * 1.16, 64);
    const ringMaterial1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
    ring1.rotation.x = Math.PI / 3;
    globeGroup.add(ring1);

    const ringGeometry2 = new THREE.RingGeometry(radius * 1.25, radius * 1.255, 64);
    const ringMaterial2 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
    ring2.rotation.y = Math.PI / 4;
    globeGroup.add(ring2);

    // 4. Floating Ambient Data Particles
    const particleCount = isMobile ? 80 : 180;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 350;
      particlePositions[i + 1] = (Math.random() - 0.5) * 250;
      particlePositions[i + 2] = (Math.random() - 0.5) * 200;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.3
    });
    const ambientParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(ambientParticles);

    // 5. Mouse Parallax handling
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      stateRef.current.mouseX = (event.clientX / innerWidth - 0.5) * 2;
      stateRef.current.mouseY = (event.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 6. Responsive resize observer
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. Render Loop with tab visibility handling
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Pause rendering if document is hidden to save GPU
      if (document.hidden) return;

      const delta = clock.getDelta();
      const state = stateRef.current;

      // Smooth speed interpolation
      state.currentSpeed += (state.targetSpeed - state.currentSpeed) * 0.05;

      // Continuous rotation
      globeGroup.rotation.y += state.currentSpeed;
      globeGroup.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.08;

      // Scanning rings rotation
      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.0015;

      // Mouse Parallax smooth lerp
      const targetRotY = state.mouseX * 0.35;
      const targetRotX = state.mouseY * 0.25;
      camera.position.x += (state.mouseX * 15 - camera.position.x) * 0.04;
      camera.position.y += (-state.mouseY * 15 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Subtle particle float
      ambientParticles.rotation.y += 0.0004;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer?.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="three-globe-container"
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      style={{ opacity: 0.85 }}
    >
      {/* Cyber radar grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30" />
      <div className="absolute inset-0 bg-radial-vignette" />
    </div>
  );
};
