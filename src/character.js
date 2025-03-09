import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { createCharacterBody, isGrounded } from './physics.js';
import { params } from './gui.js';
import { getCameraRotation } from './camera.js';

// Animation mixer for the capybara model
let mixer;
// Reference to the loaded model
let capybaraModel;

// Create the character
export function createCharacter(scene, world) {
    // Create the character mesh
    const characterGroup = new THREE.Group();
    
    // Create the capsule body
    const capsuleGeometry = new THREE.CapsuleGeometry(0.5, 1.0, 4, 8);
    const capsuleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3498db,
        roughness: 0.5,
        metalness: 0.3,
        transparent: true,
        opacity: 0 // Make the capsule invisible
    });
    const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
    capsuleMesh.castShadow = true;
    capsuleMesh.position.y = 0.5; // Offset to align with physics body
    characterGroup.add(capsuleMesh);
    
    // Load the capybara model
    loadCapybaraModel(capsuleMesh);
    
    // Add the character to the scene
    scene.add(characterGroup);
    
    // Create the physics body for the character
    const startPosition = { x: 0, y: 2, z: 0 };
    const physicsBody = createCharacterBody(world, startPosition);
    
    // Set the initial position of the character mesh
    characterGroup.position.copy(startPosition);
    
    // Create the character object
    const character = {
        mesh: characterGroup,
        physicsBody: physicsBody,
        velocity: new THREE.Vector3(),
        rotation: new THREE.Euler(),
        grounded: false,
        world: world
    };
    
    return character;
}

// Load the capybara model and add it to the capsule mesh
function loadCapybaraModel(capsuleMesh) {
    // Try to load the model in different formats, starting with GLTF/GLB
    loadGLTFModel(capsuleMesh);
}

// Load GLTF/GLB model
function loadGLTFModel(capsuleMesh) {
    const loader = new GLTFLoader();
    
    loader.load('models/capybara.glb', (gltf) => {
        capybaraModel = gltf.scene;
        
        // Add the capybara model to the capsule mesh
        capsuleMesh.add(capybaraModel);
        
        // Adjust position if needed
        // capybaraModel.position.set(0, -0.5, 0);
        
        // Adjust scale if needed
        // capybaraModel.scale.set(0.5, 0.5, 0.5);
        
        // Set up animations if available in the model
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(capybaraModel);
            const idleAction = mixer.clipAction(gltf.animations[0]); // Assumes first animation is idle
            idleAction.play();
            
            // Log available animations for debugging
            console.log('Loaded animations from model:', gltf.animations);
        } else {
            // If no animations in the model, try to load separate animation file
            loadSeparateAnimation(capybaraModel);
        }
    }, 
    // Progress callback
    (xhr) => {
        console.log('GLTF: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback
    (error) => {
        console.warn('Error loading GLTF model, trying FBX:', error);
        loadFBXModel(capsuleMesh);
    });
}

// Load separate animation file
function loadSeparateAnimation(model) {
    if (!model) return;
    
    console.log('Loading separate animation file...');
    
    // Try to load the idle animation from FBX file
    const animLoader = new FBXLoader();
    animLoader.load('models/animations/capybara_idle.fbx', (animationObject) => {
        // Create animation mixer
        mixer = new THREE.AnimationMixer(model);
        
        // Get the animation clip
        if (animationObject.animations && animationObject.animations.length > 0) {
            const idleClip = animationObject.animations[0];
            const idleAction = mixer.clipAction(idleClip);
            idleAction.play();
            console.log('Loaded separate idle animation');
        } else {
            console.warn('No animations found in the separate animation file');
        }
    }, 
    // Progress callback
    (xhr) => {
        console.log('Animation: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback
    (error) => {
        console.warn('Error loading separate animation file:', error);
        
        // Try alternative animation formats
        tryAlternativeAnimationFormats(model);
    });
}

// Try to load animations in different formats
function tryAlternativeAnimationFormats(model) {
    // Try GLTF animation
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('models/animations/capybara_idle.glb', (gltf) => {
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            const idleAction = mixer.clipAction(gltf.animations[0]);
            idleAction.play();
            console.log('Loaded GLTF animation');
        }
    }, undefined, (error) => {
        console.warn('Error loading GLTF animation:', error);
    });
}

// Load FBX model as fallback
function loadFBXModel(capsuleMesh) {
    const loader = new FBXLoader();
    
    loader.load('models/capybara.fbx', (fbx) => {
        capybaraModel = fbx;
        
        // Add the capybara model to the capsule mesh
        capsuleMesh.add(fbx);
        
        // Adjust position if needed
        // fbx.position.set(0, -0.5, 0);
        
        // Adjust scale if needed
        // fbx.scale.set(0.01, 0.01, 0.01); // FBX models often need scaling
        
        // Set up animations if available
        if (fbx.animations && fbx.animations.length > 0) {
            mixer = new THREE.AnimationMixer(fbx);
            const idleAction = mixer.clipAction(fbx.animations[0]);
            idleAction.play();
            console.log('Loaded animations from FBX model');
        } else {
            // If no animations in the model, try to load separate animation file
            loadSeparateAnimation(fbx);
        }
    }, 
    // Progress callback
    (xhr) => {
        console.log('FBX: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback
    (error) => {
        console.warn('Error loading FBX model, trying OBJ:', error);
        loadOBJModel(capsuleMesh);
    });
}

// Load OBJ model as fallback
function loadOBJModel(capsuleMesh) {
    const mtlLoader = new MTLLoader();
    
    mtlLoader.load('models/capybara.mtl', (materials) => {
        materials.preload();
        
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        
        objLoader.load('models/capybara.obj', (obj) => {
            capybaraModel = obj;
            
            // Add the capybara model to the capsule mesh
            capsuleMesh.add(obj);
            
            // Adjust position if needed
            // obj.position.set(0, -0.5, 0);
            
            // Adjust scale if needed
            // obj.scale.set(0.5, 0.5, 0.5);
            
            // OBJ doesn't support animations, so try to load separate animation
            loadSeparateAnimation(obj);
        }, 
        // Progress callback
        (xhr) => {
            console.log('OBJ: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Error callback
        (error) => {
            console.warn('Error loading OBJ model, trying DAE:', error);
            loadDAEModel(capsuleMesh);
        });
    }, undefined, (error) => {
        console.warn('Error loading MTL, trying OBJ without materials:', error);
        
        const objLoader = new OBJLoader();
        objLoader.load('models/capybara.obj', (obj) => {
            capybaraModel = obj;
            capsuleMesh.add(obj);
            
            // OBJ doesn't support animations, so try to load separate animation
            loadSeparateAnimation(obj);
        }, undefined, (error) => {
            console.warn('Error loading OBJ model, trying DAE:', error);
            loadDAEModel(capsuleMesh);
        });
    });
}

// Load DAE (Collada) model as final fallback
function loadDAEModel(capsuleMesh) {
    const loader = new ColladaLoader();
    
    loader.load('models/capybara.dae', (collada) => {
        const dae = collada.scene;
        capybaraModel = dae;
        
        // Add the capybara model to the capsule mesh
        capsuleMesh.add(dae);
        
        // Adjust position if needed
        // dae.position.set(0, -0.5, 0);
        
        // Adjust scale if needed
        // dae.scale.set(0.5, 0.5, 0.5);
        
        // Check if there are animations in the DAE file
        if (collada.animations && collada.animations.length > 0) {
            mixer = new THREE.AnimationMixer(dae);
            const idleAction = mixer.clipAction(collada.animations[0]);
            idleAction.play();
            console.log('Loaded animations from DAE model');
        } else {
            // If no animations in the model, try to load separate animation file
            loadSeparateAnimation(dae);
        }
    }, 
    // Progress callback
    (xhr) => {
        console.log('DAE: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback
    (error) => {
        console.error('All model loading attempts failed:', error);
    });
}

// Add details to the character mesh
function addCharacterDetails(characterGroup) {
    // This function is no longer needed as we're using the capybara model
    // Keeping it for backward compatibility but not adding any details
}

// Update the character based on input
export function updateCharacter(character, input, deltaTime) {
    // Get the physics body
    const rigidBody = character.physicsBody.rigidBody;
    
    // Check if the character is grounded
    character.grounded = isGrounded(character.world, character.physicsBody);
    
    // Get the current velocity
    const velocity = rigidBody.linvel();
    
    // Get camera rotation for movement direction
    const cameraRotation = getCameraRotation();
    
    // Calculate the movement direction relative to camera
    const moveDirection = new THREE.Vector3(0, 0, 0);
    
    if (input.direction.forward !== 0 || input.direction.right !== 0) {
        // Get forward and right directions based on camera rotation
        const forward = new THREE.Vector3(
            Math.sin(cameraRotation),
            0,
            Math.cos(cameraRotation)
        );
        
        const right = new THREE.Vector3(
            Math.sin(cameraRotation + Math.PI/2),
            0,
            Math.cos(cameraRotation + Math.PI/2)
        );
        
        // Combine directions based on input
        moveDirection.add(forward.multiplyScalar(input.direction.forward));
        moveDirection.add(right.multiplyScalar(input.direction.right));
        
        // Normalize if moving
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
        }
    }
    
    // Apply movement force if grounded
    if (character.grounded) {
        // Apply movement force
        rigidBody.applyImpulse(
            { 
                x: moveDirection.x * params.movementSpeed, 
                y: 0, 
                z: moveDirection.z * params.movementSpeed 
            }, 
            true
        );
        
        // Apply jump force
        if (input.jump) {
            rigidBody.applyImpulse({ x: 0, y: params.jumpForce, z: 0 }, true);
        }
    } else {
        // Apply smaller movement force in air for air control
        rigidBody.applyImpulse(
            { 
                x: moveDirection.x * params.movementSpeed * params.airControlFactor, 
                y: 0, 
                z: moveDirection.z * params.movementSpeed * params.airControlFactor 
            }, 
            true
        );
    }
    
    // Limit horizontal velocity
    if (Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z) > params.maxVelocity) {
        const horizontalVelocity = new THREE.Vector2(velocity.x, velocity.z).normalize().multiplyScalar(params.maxVelocity);
        rigidBody.setLinvel(
            { 
                x: horizontalVelocity.x, 
                y: velocity.y, 
                z: horizontalVelocity.y 
            }, 
            true
        );
    }
    
    // Update the character mesh position and rotation
    const position = rigidBody.translation();
    character.mesh.position.set(position.x, position.y, position.z);
    
    // Rotate the character in the direction of movement if moving
    if (moveDirection.length() > 0.1) {
        const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
        character.mesh.rotation.y = targetRotation;
    } else {
        // If not moving, align character with camera direction
        character.mesh.rotation.y = cameraRotation;
    }
    
    // Update animation mixer if it exists
    if (mixer && deltaTime) {
        mixer.update(deltaTime);
    }
}