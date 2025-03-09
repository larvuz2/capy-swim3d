import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Camera and controls references
let camera;
let controls;
let cameraOffset = new THREE.Vector3(0, 2, 5); // Default camera offset (behind and above)

export function initScene() {
    // Create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue background
    
    // Create the camera
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 5, 10);
    
    // Create the renderer
    const canvas = document.getElementById('canvas');
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    
    // Configure orbit controls for third-person view
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Configure for third-person camera
    controls.minDistance = 5; // Minimum distance from target
    controls.maxDistance = 5; // Set equal to minDistance for fixed distance
    controls.enableZoom = false; // Disable zooming to maintain consistent distance
    controls.enablePan = false; // Disable panning for a focused third-person experience
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent camera from going below ground
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
    
    // Create a ground plane (visual only, physics will be added separately)
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a5e1a,
        roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add some obstacles
    addObstacles(scene);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Update camera aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        // Update renderer size
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    
    return { scene, camera, renderer };
}

function addObstacles(scene) {
    // Add some boxes as obstacles
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8b4513,
        roughness: 0.7 
    });
    
    // Create several boxes at different positions
    const boxPositions = [
        { x: -8, y: 1, z: -5 },
        { x: 8, y: 1, z: -7 },
        { x: 0, y: 1, z: -15 },
        { x: -5, y: 1, z: 10 },
        { x: 10, y: 1, z: 5 }
    ];
    
    boxPositions.forEach(position => {
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(position.x, position.y, position.z);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
    });
    
    // Add a ramp
    const rampGeometry = new THREE.BoxGeometry(10, 1, 5);
    const rampMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x808080,
        roughness: 0.6 
    });
    const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
    ramp.position.set(0, 0.5, 10);
    ramp.rotation.x = Math.PI / 12; // Slight incline
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    scene.add(ramp);
}

export function render(scene, camera, renderer) {
    controls.update(); // Update orbit controls
    renderer.render(scene, camera);
}

// Function to update camera to follow the character
export function updateCameraTarget(position) {
    // Update the orbit controls target to follow the character
    controls.target.copy(position);
}

// Get the camera's forward direction (projected onto XZ plane)
export function getCameraDirection() {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    
    // Project onto XZ plane (horizontal)
    direction.y = 0;
    direction.normalize();
    
    return direction;
}

// Get the camera's right direction
export function getCameraRight() {
    const forward = getCameraDirection();
    const right = new THREE.Vector3();
    
    // Right is perpendicular to forward and up
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));
    right.normalize();
    
    return right;
}

// Export camera and controls for use in other modules
export { camera, controls };