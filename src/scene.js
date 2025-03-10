import * as THREE from 'three';

export function initScene() {
    // Create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue background
    
    // Create the camera
    const camera = new THREE.PerspectiveCamera(
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
    
    // Remove any axis helpers that might be in the scene
    scene.traverse((object) => {
        if (object instanceof THREE.AxesHelper || 
            object instanceof THREE.GridHelper || 
            (object instanceof THREE.LineSegments && object.type === 'LineSegments')) {
            scene.remove(object);
        }
    });
    
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
    renderer.render(scene, camera);
} 