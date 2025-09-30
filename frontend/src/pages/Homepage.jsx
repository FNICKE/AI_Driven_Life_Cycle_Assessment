import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Cpu,
  Activity,
  BarChart3,
  LayoutDashboard,
  Lightbulb,
  Scale,
  TrendingUp,
  ShieldCheck,
  Eye,
  Building2,
  Landmark,
  Microscope,
} from "lucide-react";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Simple Tailwind Button component
const Button = ({ children, className = "", onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Advanced Mining Complex Scene
const MiningComplexScene = ({ containerRef }) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 100);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(20, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    // Colored accent lights
    const redLight = new THREE.PointLight(0xff4444, 0.8, 30);
    redLight.position.set(-10, 5, -10);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x4444ff, 0.8, 30);
    blueLight.position.set(10, 5, 10);
    scene.add(blueLight);

    // Main scene group
    const miningComplex = new THREE.Group();

    // Create advanced mining tower
    const createMiningTower = () => {
      const tower = new THREE.Group();

      // Main structure with metallic material
      const towerGeometry = new THREE.CylinderGeometry(1, 1.5, 12);
      const towerMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444,
        shininess: 100,
        specular: 0x666666,
      });
      const towerMesh = new THREE.Mesh(towerGeometry, towerMaterial);
      towerMesh.position.y = 6;
      towerMesh.castShadow = true;
      tower.add(towerMesh);

      // Tower details and platforms
      for (let i = 0; i < 4; i++) {
        const platformGeometry = new THREE.CylinderGeometry(2, 2, 0.3);
        const platformMaterial = new THREE.MeshPhongMaterial({
          color: 0x666666,
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = 2 + i * 2.5;
        platform.castShadow = true;
        tower.add(platform);

        // Blinking lights on platforms
        const lightGeometry = new THREE.SphereGeometry(0.1);
        const lightMaterial = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0xff0000 : 0x00ff00,
          emissive: i % 2 === 0 ? 0xff0000 : 0x00ff00,
          emissiveIntensity: 0.5,
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(1.8, 2 + i * 2.5, 0);
        tower.add(light);
      }

      // Rotating radar/scanner on top
      const radarGeometry = new THREE.ConeGeometry(0.8, 2);
      const radarMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
      });
      const radar = new THREE.Mesh(radarGeometry, radarMaterial);
      radar.position.y = 13;
      tower.add(radar);

      return { group: tower, radar };
    };

    const { group: tower, radar } = createMiningTower();
    miningComplex.add(tower);

    // Advanced excavator with detailed parts
    const createAdvancedExcavator = () => {
      const excavator = new THREE.Group();

      // Main body with gradient-like effect
      const bodyGeometry = new THREE.BoxGeometry(3, 1.5, 2);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xffaa00,
        shininess: 80,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.75;
      body.castShadow = true;
      excavator.add(body);

      // Articulated arm system
      const armBase = new THREE.Group();
      const armGeometry = new THREE.CylinderGeometry(0.2, 0.25, 4);
      const armMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
      const arm1 = new THREE.Mesh(armGeometry, armMaterial);
      arm1.position.set(0, 2, 0);
      arm1.rotation.z = -Math.PI / 4;
      armBase.add(arm1);

      const arm2 = new THREE.Mesh(armGeometry, armMaterial);
      arm2.position.set(2, 0, 0);
      arm2.rotation.z = Math.PI / 3;
      armBase.add(arm2);

      // Advanced bucket with teeth
      const bucketGroup = new THREE.Group();
      const bucketGeometry = new THREE.SphereGeometry(0.8, 8, 6, 0, Math.PI);
      const bucketMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
      const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
      bucketGroup.add(bucket);

      // Bucket teeth
      for (let i = 0; i < 5; i++) {
        const toothGeometry = new THREE.ConeGeometry(0.05, 0.3);
        const tooth = new THREE.Mesh(toothGeometry, bucketMaterial);
        tooth.position.set((i - 2) * 0.3, -0.6, 0.6);
        tooth.rotation.x = Math.PI;
        bucketGroup.add(tooth);
      }

      bucketGroup.position.set(4, -1, 0);
      armBase.add(bucketGroup);
      armBase.position.set(1.5, 0.75, 0);
      excavator.add(armBase);

      // Detailed track system
      const createTrack = (side) => {
        const trackGroup = new THREE.Group();

        // Main track body
        const trackGeometry = new THREE.BoxGeometry(3.5, 0.8, 0.6);
        const trackMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const trackBody = new THREE.Mesh(trackGeometry, trackMaterial);
        trackGroup.add(trackBody);

        // Track wheels
        for (let i = 0; i < 4; i++) {
          const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.7);
          const wheel = new THREE.Mesh(wheelGeometry, trackMaterial);
          wheel.position.set(-1.5 + i * 1, 0, 0);
          wheel.rotation.z = Math.PI / 2;
          trackGroup.add(wheel);
        }

        trackGroup.position.set(0, -0.4, side * 1.2);
        return trackGroup;
      };

      excavator.add(createTrack(1));
      excavator.add(createTrack(-1));

      return { group: excavator, armBase, bucketGroup };
    };

    const {
      group: excavator,
      armBase,
      bucketGroup,
    } = createAdvancedExcavator();
    excavator.position.set(-8, 0, -5);
    miningComplex.add(excavator);

    // Floating holographic ore crystals
    const crystals = [];
    const createCrystal = (x, y, z, color, size) => {
      const crystalGroup = new THREE.Group();

      // Main crystal
      const crystalGeometry = new THREE.OctahedronGeometry(size);
      const crystalMaterial = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        emissive: color,
        emissiveIntensity: 0.2,
      });
      const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
      crystalGroup.add(crystal);

      // Glow effect
      const glowGeometry = new THREE.SphereGeometry(size * 1.5);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.1,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      crystalGroup.add(glow);

      crystalGroup.position.set(x, y, z);
      return { group: crystalGroup, crystal, glow };
    };

    const crystalColors = [
      0xff6b35, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xfeca57, 0xff9ff3,
    ];
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = Math.random() * 8 + 2;
      const z = (Math.random() - 0.5) * 30;
      const color =
        crystalColors[Math.floor(Math.random() * crystalColors.length)];
      const size = 0.3 + Math.random() * 0.5;

      const crystalData = createCrystal(x, y, z, color, size);
      crystals.push(crystalData);
      miningComplex.add(crystalData.group);
    }

    // Create terrain
    const createTerrain = () => {
      const terrainGeometry = new THREE.PlaneGeometry(60, 60, 32, 32);
      const vertices = terrainGeometry.attributes.position.array;

      for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 2] =
          Math.sin(vertices[i] * 0.1) * Math.cos(vertices[i + 1] * 0.1) * 0.5;
      }
      terrainGeometry.attributes.position.needsUpdate = true;
      terrainGeometry.computeVertexNormals();

      const terrainMaterial = new THREE.MeshLambertMaterial({
        color: 0x4a3728,
        transparent: true,
        opacity: 0.4,
      });
      const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
      terrain.rotation.x = -Math.PI / 2;
      terrain.position.y = -2;
      terrain.receiveShadow = true;

      return terrain;
    };

    const terrain = createTerrain();
    scene.add(terrain);
    scene.add(miningComplex);

    camera.position.set(15, 10, 15);
    camera.lookAt(0, 0, 0);

    // Animation
    let time = 0;
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      // Radar rotation
      radar.rotation.y += 0.03;

      // Excavator arm movement
      armBase.rotation.y = Math.sin(time * 0.5) * 0.3;
      bucketGroup.rotation.x = Math.sin(time * 0.7) * 0.2;

      // Crystal animations
      crystals.forEach((crystal, index) => {
        crystal.crystal.rotation.x += 0.01 * (index % 2 === 0 ? 1 : -1);
        crystal.crystal.rotation.y += 0.015 * (index % 3 === 0 ? 1 : -1);
        crystal.group.position.y += Math.sin(time + index) * 0.002;
        crystal.glow.scale.setScalar(1 + Math.sin(time * 2 + index) * 0.1);
      });

      // Dynamic camera movement
      const radius = 20;
      camera.position.x = Math.sin(time * 0.1) * radius;
      camera.position.z = Math.cos(time * 0.1) * radius;
      camera.position.y = 8 + Math.sin(time * 0.05) * 3;
      camera.lookAt(0, 2, 0);

      // Dynamic lighting
      redLight.intensity = 0.5 + Math.sin(time * 2) * 0.3;
      blueLight.intensity = 0.5 + Math.cos(time * 1.5) * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      if (
        container &&
        renderer.domElement &&
        container.contains(renderer.domElement)
      ) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return null;
};

// Circular Economy Scene
const CircularEconomyScene = ({ containerRef }) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const lights = [
      { color: 0xff0080, position: [10, 10, 10] },
      { color: 0x0080ff, position: [-10, 10, -10] },
      { color: 0x80ff00, position: [10, -10, -10] },
      { color: 0xff8000, position: [-10, -10, 10] },
    ];

    lights.forEach((light) => {
      const pointLight = new THREE.PointLight(light.color, 0.8, 50);
      pointLight.position.set(...light.position);
      scene.add(pointLight);
    });

    const circularSystem = new THREE.Group();

    // Central AI Core
    const createAICore = () => {
      const coreGroup = new THREE.Group();

      const innerGeometry = new THREE.IcosahedronGeometry(1.2);
      const innerMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x004444,
        transparent: true,
        opacity: 0.8,
      });
      const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
      coreGroup.add(innerCore);

      const outerGeometry = new THREE.IcosahedronGeometry(2);
      const outerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const outerCore = new THREE.Mesh(outerGeometry, outerMaterial);
      coreGroup.add(outerCore);

      const rings = [];
      for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(2.5 + i * 0.5, 0.05);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.5,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        ring.rotation.y = Math.random() * Math.PI * 2;
        rings.push(ring);
        coreGroup.add(ring);
      }

      return { group: coreGroup, innerCore, outerCore, rings };
    };

    const { group: aiCore, innerCore, outerCore, rings } = createAICore();
    circularSystem.add(aiCore);

    // Process nodes
    const processNodes = [];
    const nodeData = [
      { name: "Mining", color: 0xff4444 },
      { name: "Processing", color: 0x44ff44 },
      { name: "Manufacturing", color: 0x4444ff },
      { name: "Use", color: 0xffff44 },
      { name: "Collection", color: 0xff44ff },
      { name: "Recycling", color: 0x44ffff },
    ];

    nodeData.forEach((data, index) => {
      const angle = (index / nodeData.length) * Math.PI * 2;
      const radius = 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const nodeGroup = new THREE.Group();

      const nodeGeometry = new THREE.BoxGeometry(1.5, 2, 1.5);
      const nodeMaterial = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.2,
      });
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.y = 1;
      nodeGroup.add(node);

      nodeGroup.position.set(x, 0, z);
      processNodes.push({ group: nodeGroup, node, data });
      circularSystem.add(nodeGroup);
    });

    scene.add(circularSystem);

    camera.position.set(12, 8, 12);
    camera.lookAt(0, 0, 0);

    // Animation
    let time = 0;
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      innerCore.rotation.x += 0.005;
      innerCore.rotation.y += 0.01;
      outerCore.rotation.x -= 0.003;
      outerCore.rotation.y -= 0.007;

      const pulse = 1 + Math.sin(time * 3) * 0.1;
      innerCore.scale.setScalar(pulse);

      rings.forEach((ring, index) => {
        ring.rotation.z += 0.01 * (index + 1);
      });

      processNodes.forEach((nodeData, index) => {
        nodeData.node.rotation.y += 0.02;
      });

      const cameraAngle = time * 0.1;
      camera.position.x = Math.cos(cameraAngle) * 15;
      camera.position.z = Math.sin(cameraAngle) * 15;
      camera.position.y = 8 + Math.sin(time * 0.3) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (
        container &&
        renderer.domElement &&
        container.contains(renderer.domElement)
      ) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return null;
};

// Smart Factory Scene
const SmartFactoryScene = ({ containerRef }) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 20, 80);

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const neonLights = [
      { color: 0x00ff41, position: [10, 15, 5], intensity: 2 },
      { color: 0xff0080, position: [-10, 12, -8], intensity: 1.5 },
      { color: 0x0080ff, position: [8, 8, -12], intensity: 1.8 },
    ];

    neonLights.forEach((light) => {
      const pointLight = new THREE.PointLight(light.color, light.intensity, 40);
      pointLight.position.set(...light.position);
      scene.add(pointLight);
    });

    const factoryComplex = new THREE.Group();

    // Robotic arms
    const createRoboticArm = (x, z, color) => {
      const robotGroup = new THREE.Group();

      const baseGeometry = new THREE.CylinderGeometry(0.8, 1, 1.5);
      const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = 0.75;
      robotGroup.add(base);

      const joint1Geometry = new THREE.SphereGeometry(0.4);
      const jointMaterial = new THREE.MeshPhongMaterial({ color: color });
      const joint1 = new THREE.Mesh(joint1Geometry, jointMaterial);
      joint1.position.y = 1.5;
      robotGroup.add(joint1);

      const arm1Geometry = new THREE.CylinderGeometry(0.2, 0.25, 3);
      const armMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
      const arm1 = new THREE.Mesh(arm1Geometry, armMaterial);
      arm1.position.y = 3;
      robotGroup.add(arm1);

      robotGroup.position.set(x, 0, z);
      return { group: robotGroup, joint1 };
    };

    const robots = [
      createRoboticArm(-8, -5, 0x00ff41),
      createRoboticArm(0, -5, 0xff0080),
      createRoboticArm(8, -5, 0x0080ff),
    ];

    robots.forEach((robot) => {
      factoryComplex.add(robot.group);
    });

    scene.add(factoryComplex);

    camera.position.set(18, 12, 18);
    camera.lookAt(0, 5, 0);

    // Animation
    let time = 0;
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      robots.forEach((robot, index) => {
        robot.joint1.rotation.y = Math.sin(time + index) * 0.5;
      });

      const cameraRadius = 25;
      camera.position.x = Math.sin(time * 0.1) * cameraRadius;
      camera.position.z = Math.cos(time * 0.1) * cameraRadius;
      camera.position.y = 12 + Math.sin(time * 0.05) * 3;
      camera.lookAt(0, 5, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (
        container &&
        renderer.domElement &&
        container.contains(renderer.domElement)
      ) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return null;
};

export default function Homepage() {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(0);

  // Refs for sections and GSAP animations
  const heroRefs = useRef([]);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const esgRef = useRef(null);
  const useCaseRef = useRef(null);
  const contactRef = useRef(null);

  // 3D scene refs
  const miningSceneRef = useRef(null);
  const circularSceneRef = useRef(null);
  const factorySceneRef = useRef(null);

  // Navigation functions
  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    // Hero animations
    gsap.fromTo(
      heroRefs.current.filter(Boolean),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.3 }
    );

    // Scroll animations
    const sections = [aboutRef, featuresRef, esgRef, useCaseRef, contactRef];
    sections.forEach((ref) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
            },
          }
        );
      }
    });

    // Auto-rotate 3D scenes
    const sceneInterval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % 3);
    }, 10000);

    return () => clearInterval(sceneInterval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Hero Section with Advanced 3D Background and Video */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-20 z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 3D Background Container */}
        <div className="absolute top-0 left-0 w-full h-full opacity-60 z-5">
          <div
            ref={miningSceneRef}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              currentScene === 0 ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            ref={circularSceneRef}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              currentScene === 1 ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            ref={factorySceneRef}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              currentScene === 2 ? "opacity-100" : "opacity-0"
            }`}
          />

          <MiningComplexScene containerRef={miningSceneRef} />
          <CircularEconomyScene containerRef={circularSceneRef} />
          <SmartFactoryScene containerRef={factorySceneRef} />
        </div>

        {/* Top-Right Navigation */}
        <div className="absolute top-6 right-6 flex gap-4 z-20">
          <Button
            onClick={handleRegister}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            Register
          </Button>
          <Button
            onClick={handleLogin}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
          >
            Login
          </Button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <h1
            ref={(el) => (heroRefs.current[0] = el)}
            className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent"
          >
            AI-Driven Life Cycle Assessment
          </h1>
          <h2
            ref={(el) => (heroRefs.current[1] = el)}
            className="text-2xl md:text-3xl font-bold mb-4 text-gray-200"
          >
            Next-Generation LCA Tool
          </h2>
          <p
            ref={(el) => (heroRefs.current[2] = el)}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 drop-shadow-lg"
          >
            Advancing Circularity and Sustainability in Metallurgy and Mining
          </p>

          <div
            ref={(el) => (heroRefs.current[3] = el)}
            className="mt-10 bg-slate-800/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto border border-slate-600/50"
          >
            <p className="text-2xl font-bold mb-6 text-white">
              Track, Predict & Optimize Environmental Impacts
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-blue-300 font-semibold">
                  Energy Analysis
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💧</div>
                <div className="text-cyan-300 font-semibold">Water Impact</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-green-300 font-semibold">
                  CO₂ Reduction
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">♻️</div>
                <div className="text-purple-300 font-semibold">Circularity</div>
              </div>
            </div>
          </div>

          <div
            ref={(el) => (heroRefs.current[4] = el)}
            className="mt-12 flex gap-8 justify-center flex-wrap"
          >
            <Button
              onClick={handleRegister}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-10 py-4 text-xl font-bold shadow-2xl shadow-green-500/30 transform hover:scale-105 transition-all duration-300"
            >
              Get Started
            </Button>
            <Button
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-10 py-4 text-xl font-bold shadow-2xl shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
            >
              Explore Features
            </Button>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none z-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  3 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="py-24 px-6 text-center max-w-6xl mx-auto relative"
      >
        {/* 3D Background for About Section */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 z-0 pointer-events-none">
          <div
            ref={miningSceneRef}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              currentScene === 0 ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            ref={circularSceneRef}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              currentScene === 1 ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            ref={factorySceneRef}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              currentScene === 2 ? "opacity-100" : "opacity-0"
            }`}
          />

          <MiningComplexScene containerRef={miningSceneRef} />
          <CircularEconomyScene containerRef={circularSceneRef} />
          <SmartFactoryScene containerRef={factorySceneRef} />
        </div>

        <div className="mb-12 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            About the Revolutionary Tool
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-8 rounded-full"></div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-600/30 shadow-2xl">
          <p className="text-gray-300 text-xl leading-relaxed mb-6">
            This cutting-edge AI-powered platform is specifically designed for
            the{" "}
            <span className="text-blue-400 font-bold bg-blue-400/10 px-2 py-1 rounded">
              Ministry of Mines
            </span>{" "}
            to revolutionize environmental impact assessment in mining and
            metallurgy operations.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-6 rounded-xl border border-indigo-400/30">
              <div className="text-3xl mb-3">🌍</div>
              <h4 className="text-indigo-400 font-bold mb-2">
                Carbon Footprint Prediction
              </h4>
              <p className="text-gray-300 text-sm">
                Advanced ML models for accurate CO₂ emission forecasting
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-400/30">
              <div className="text-3xl mb-3">💧</div>
              <h4 className="text-blue-400 font-bold mb-2">
                Water Impact Analysis
              </h4>
              <p className="text-gray-300 text-sm">
                Comprehensive water consumption and quality assessment
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-400/30">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="text-green-400 font-bold mb-2">
                Energy Optimization
              </h4>
              <p className="text-gray-300 text-sm">
                Smart energy usage tracking and renewable integration
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-2xl border border-slate-500/30">
            <p className="text-lg text-gray-200">
              <strong>Mission:</strong> Promoting sustainable and circular
              mining practices through data-driven insights and AI-powered
              recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="py-24 bg-gradient-to-br from-slate-800 to-slate-700 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Next-Generation Features
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powered by advanced AI algorithms and real-time data processing
              for unprecedented mining intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Cpu className="w-12 h-12 text-blue-400 mb-4" />,
                title: "AI-Powered Predictions",
                desc: "Machine learning models trained on global mining data to predict CO₂ emissions, energy consumption, and water usage with 95% accuracy.",
                gradient: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-400/30",
                features: [
                  "Real-time forecasting",
                  "Pattern recognition",
                  "Anomaly detection",
                ],
              },
              {
                icon: <Activity className="w-12 h-12 text-purple-400 mb-4" />,
                title: "Scenario Simulation",
                desc: "Advanced 'what-if' analysis engine to test sustainability scenarios like replacing virgin materials with recycled content.",
                gradient: "from-purple-500/20 to-pink-500/20",
                border: "border-purple-400/30",
                features: [
                  "Multi-variable testing",
                  "Risk assessment",
                  "Impact modeling",
                ],
              },
              {
                icon: <BarChart3 className="w-12 h-12 text-green-400 mb-4" />,
                title: "Smart Benchmarking",
                desc: "Compare mining operations, processes, and facilities using comprehensive sustainability metrics and industry standards.",
                gradient: "from-green-500/20 to-emerald-500/20",
                border: "border-green-400/30",
                features: [
                  "Performance ranking",
                  "Best practice identification",
                  "Gap analysis",
                ],
              },
              {
                icon: (
                  <LayoutDashboard className="w-12 h-12 text-indigo-400 mb-4" />
                ),
                title: "Interactive Dashboards",
                desc: "Immersive data visualization with 3D models, Sankey diagrams, heat maps, and real-time monitoring displays.",
                gradient: "from-indigo-500/20 to-blue-500/20",
                border: "border-indigo-400/30",
                features: [
                  "3D visualizations",
                  "Custom reports",
                  "Mobile responsive",
                ],
              },
              {
                icon: <Lightbulb className="w-12 h-12 text-yellow-400 mb-4" />,
                title: "AI Recommendation Engine",
                desc: "Intelligent suggestions for sustainable alternatives including renewable energy, efficient transport, and waste reduction.",
                gradient: "from-yellow-500/20 to-orange-500/20",
                border: "border-yellow-400/30",
                features: [
                  "Optimization algorithms",
                  "Cost-benefit analysis",
                  "Implementation roadmaps",
                ],
              },
              {
                icon: <Scale className="w-12 h-12 text-red-400 mb-4" />,
                title: "Policy & Compliance Hub",
                desc: "Evidence-based data support for regulatory compliance, ESG reporting, and sustainable development goal alignment.",
                gradient: "from-red-500/20 to-pink-500/20",
                border: "border-red-400/30",
                features: [
                  "Regulatory tracking",
                  "ESG metrics",
                  "Audit trails",
                ],
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-sm p-8 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-500 border ${feature.border} group`}
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.desc}
                </p>
                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESG Impact Section */}
      <section
        ref={esgRef}
        className="py-24 px-6 bg-gradient-to-br from-slate-900 to-slate-800"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            ESG Impact Revolution
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-gray-300 mb-16 max-w-4xl mx-auto">
            Transforming the mining industry through measurable Environmental,
            Social, and Governance improvements
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: (
                  <TrendingUp className="w-16 h-16 text-green-400 mb-6 mx-auto" />
                ),
                title: "Economic Excellence",
                value: "↑ 35% Efficiency Boost",
                desc: "Dramatic productivity improvements through AI-optimized resource utilization and predictive maintenance systems.",
                color: "from-green-500 to-emerald-600",
                bgGradient: "from-green-500/20 to-emerald-500/20",
                border: "border-green-400/30",
                metrics: [
                  "Cost reduction: 25%",
                  "Resource efficiency: 40%",
                  "Downtime reduction: 50%",
                ],
              },
              {
                icon: (
                  <ShieldCheck className="w-16 h-16 text-blue-400 mb-6 mx-auto" />
                ),
                title: "Social Responsibility",
                value: "↑ Community Safety+",
                desc: "Enhanced worker safety protocols and community impact assessments through real-time monitoring and risk prediction.",
                color: "from-blue-500 to-cyan-600",
                bgGradient: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-400/30",
                metrics: [
                  "Safety incidents: -60%",
                  "Community engagement: +80%",
                  "Health monitoring: 24/7",
                ],
              },
              {
                icon: (
                  <Eye className="w-16 h-16 text-purple-400 mb-6 mx-auto" />
                ),
                title: "Governance Excellence",
                value: "100% Transparency",
                desc: "Complete compliance with international sustainability standards through blockchain-verified reporting and audit trails.",
                color: "from-purple-500 to-pink-600",
                bgGradient: "from-purple-500/20 to-pink-500/20",
                border: "border-purple-400/30",
                metrics: [
                  "Compliance rate: 100%",
                  "Report automation: 90%",
                  "Audit readiness: Real-time",
                ],
              },
            ].map((impact, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${impact.bgGradient} backdrop-blur-sm p-8 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-500 border ${impact.border} group`}
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {impact.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {impact.title}
                </h3>
                <div
                  className={`text-xl font-bold bg-gradient-to-r ${impact.color} text-white rounded-xl px-4 py-2 mb-4 inline-block shadow-lg`}
                >
                  {impact.value}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {impact.desc}
                </p>
                <div className="space-y-2">
                  {impact.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-400">
                        {metric.split(":")[0]}:
                      </span>
                      <span className="text-white font-semibold">
                        {metric.split(":")[1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Impact Statistics */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-600/30">
            <h3 className="text-2xl font-bold mb-8 text-white">
              Global Impact Projections
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  number: "2.5B",
                  label: "Tons CO₂ Saved Annually",
                  icon: "🌍",
                },
                { number: "40%", label: "Water Usage Reduction", icon: "💧" },
                { number: "150+", label: "Mining Sites Optimized", icon: "⛏️" },
                { number: "$12B", label: "Cost Savings Generated", icon: "💰" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section
        ref={useCaseRef}
        className="py-24 bg-gradient-to-br from-slate-800 to-slate-700 px-6"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Who Benefits from Our Platform?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-gray-300 mb-16 max-w-4xl mx-auto">
            Empowering diverse stakeholders across the mining ecosystem with
            intelligent insights and actionable data
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <Building2 className="w-16 h-16 text-blue-400 mb-6 mx-auto" />
                ),
                title: "Mining Enterprises",
                desc: "Comprehensive sustainability tracking, operational optimization, and ESG compliance for mining companies of all sizes.",
                gradient: "from-blue-500/20 to-indigo-500/20",
                border: "border-blue-400/30",
                benefits: [
                  "Real-time operational insights",
                  "Predictive maintenance scheduling",
                  "Environmental impact reduction",
                  "Regulatory compliance automation",
                ],
              },
              {
                icon: (
                  <Landmark className="w-16 h-16 text-green-400 mb-6 mx-auto" />
                ),
                title: "Government & Policy Makers",
                desc: "Data-driven policy formulation, regulatory oversight, and national sustainability goal tracking for government agencies.",
                gradient: "from-green-500/20 to-emerald-500/20",
                border: "border-green-400/30",
                benefits: [
                  "Evidence-based policy making",
                  "National sustainability tracking",
                  "Industry performance monitoring",
                  "Economic impact assessment",
                ],
              },
              {
                icon: (
                  <Microscope className="w-16 h-16 text-purple-400 mb-6 mx-auto" />
                ),
                title: "Research Institutions",
                desc: "Advanced analytics platform for academic research, innovation development, and sustainable technology assessment.",
                gradient: "from-purple-500/20 to-pink-500/20",
                border: "border-purple-400/30",
                benefits: [
                  "Comprehensive data access",
                  "Advanced modeling tools",
                  "Collaborative research platform",
                  "Innovation impact analysis",
                ],
              },
            ].map((useCase, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${useCase.gradient} backdrop-blur-sm p-8 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-500 border ${useCase.border} group`}
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {useCase.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {useCase.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {useCase.desc}
                </p>
                <div className="space-y-3">
                  {useCase.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm text-gray-300"
                    >
                      <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer
        ref={contactRef}
        className="py-16 px-6 bg-gradient-to-br from-slate-900 to-black border-t border-slate-700"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Connect With Our Innovation Team
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Ready to revolutionize your mining operations? Get in touch with
              our experts for a personalized demonstration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-600/30 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-white">
                Send Us a Message
              </h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-4 rounded-xl bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-4 rounded-xl bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Organization / Company"
                  className="w-full px-4 py-4 rounded-xl bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
                <select className="w-full px-4 py-4 rounded-xl bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm">
                  <option>Select Your Interest</option>
                  <option>Mining Operations Optimization</option>
                  <option>ESG Compliance & Reporting</option>
                  <option>AI-Powered Predictions</option>
                  <option>Government Policy Support</option>
                  <option>Research Collaboration</option>
                </select>
                <textarea
                  placeholder="Tell us about your mining challenges and goals..."
                  rows="4"
                  className="w-full px-4 py-4 rounded-xl bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none"
                ></textarea>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-4 text-lg font-bold shadow-xl shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                  Schedule a Demo
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-600/30 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  Quick Connect
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      📧
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        Email Support
                      </div>
                      <div className="text-gray-400 text-sm">
                        innovation@mining-lca.gov.in
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      📞
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        Direct Line
                      </div>
                      <div className="text-gray-400 text-sm">
                        +91-11-2345-6789
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      🏢
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        Office Hours
                      </div>
                      <div className="text-gray-400 text-sm">
                        Mon-Fri, 9:00 AM - 6:00 PM IST
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-600/30 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  Platform Highlights
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-2xl font-bold text-green-400">50+</div>
                    <div className="text-sm text-gray-400">Mining Sites</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-2xl font-bold text-purple-400">
                      24/7
                    </div>
                    <div className="text-sm text-gray-400">Monitoring</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-2xl font-bold text-yellow-400">
                      95%
                    </div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-2xl font-bold text-cyan-400">AI</div>
                    <div className="text-sm text-gray-400">Powered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-slate-700 text-center">
            <p className="text-gray-400 mb-2">
              Ministry of Mines – AI LCA Tool | Driving Circularity &
              Sustainability in Mining
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 Ministry of Mines, Government of India. All rights
              reserved. | Making Mining Sustainable for Future Generations
            </p>
          </div>
        </div>
      </footer>

      {/* CSS Animation for floating particles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}