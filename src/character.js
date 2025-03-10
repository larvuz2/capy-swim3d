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
// Debug flag
const DEBUG = true;

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
    capsuleMesh.castShadow = false; // Disable shadow casting for the invisible capsule
    capsuleMesh.receiveShadow = false; // Disable shadow receiving for the invisible capsule
    capsuleMesh.position.y = 0.5; // Offset to align with physics body
    characterGroup.add(capsuleMesh);
    
    // Load the capybara model - start with OBJ since that's what we have
    loadOBJModel(capsuleMesh);
    
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
    // Start with OBJ since that's what we have available
    loadOBJModel(capsuleMesh);
}

// Load OBJ model as primary format
function loadOBJModel(capsuleMesh) {
    const mtlLoader = new MTLLoader();
    
    if (DEBUG) console.log('Attempting to load capybara.obj model with materials...');
    
    // Set texture path to ensure textures are found
    mtlLoader.setPath('models/');
    
    mtlLoader.load('capybara.mtl', (materials) => {
        materials.preload();
        
        if (DEBUG) console.log('Successfully loaded MTL materials');
        
        // Set texture path for the materials
        materials.materials.capybara.map.image.src = 'models/textures/capybara_texture.png';
        
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/');
        
        objLoader.load('capybara.obj', (obj) => {
            if (DEBUG) console.log('Successfully loaded capybara.obj model with materials!');
            capybaraModel = obj;
            
            // Add the capybara model to the capsule mesh
            capsuleMesh.add(obj);
            
            // Scale the model to make it more visible
            obj.scale.set(1.5, 1.5, 1.5);
            
            // Position the model to align with the capsule
            obj.position.set(0, -0.5, 0);
            
            // Enable shadows for the model
            obj.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Make sure material is properly set
                    if (!child.material) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0x8B4513, // Brown color for capybara
                            roughness: 0.7,
                            metalness: 0.1
                        });
                    }
                    
                    // Log material info for debugging
                    if (DEBUG) console.log('Mesh material:', child.material);
                }
            });
            
            if (DEBUG) console.log('Capybara model added to scene with scale:', obj.scale);
            
            // OBJ doesn't support animations, so try to load separate animation file
            loadSeparateAnimation(obj);
        }, 
        // Progress callback
        (xhr) => {
            if (DEBUG) console.log('OBJ: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Error callback
        (error) => {
            console.warn('Error loading OBJ model with materials:', error);
            loadOBJWithoutMaterials(capsuleMesh);
        });
    }, 
    // Progress callback for MTL
    (xhr) => {
        if (DEBUG) console.log('MTL: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback for MTL
    (error) => {
        console.warn('Error loading MTL, trying OBJ without materials:', error);
        loadOBJWithoutMaterials(capsuleMesh);
    });
}

// Load OBJ without materials as fallback
function loadOBJWithoutMaterials(capsuleMesh) {
    if (DEBUG) console.log('Attempting to load capybara.obj model without materials...');
    
    const objLoader = new OBJLoader();
    objLoader.setPath('models/');
    
    objLoader.load('capybara.obj', (obj) => {
        if (DEBUG) console.log('Successfully loaded capybara.obj model without materials!');
        capybaraModel = obj;
        
        // Add the capybara model to the capsule mesh
        capsuleMesh.add(obj);
        
        // Scale the model to make it more visible
        obj.scale.set(1.5, 1.5, 1.5);
        
        // Position the model to align with the capsule
        obj.position.set(0, -0.5, 0);
        
        // Enable shadows for the model and apply a default material
        obj.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Apply a default material
                child.material = new THREE.MeshStandardMaterial({
                    color: 0x8B4513, // Brown color for capybara
                    roughness: 0.7,
                    metalness: 0.1
                });
                
                if (DEBUG) console.log('Applied default material to mesh');
            }
        });
        
        if (DEBUG) console.log('Capybara model added to scene without materials');
        
        // OBJ doesn't support animations, so try to load separate animation file
        loadSeparateAnimation(obj);
    }, 
    // Progress callback
    (xhr) => {
        if (DEBUG) console.log('OBJ (no materials): ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback
    (error) => {
        console.warn('Error loading OBJ model without materials:', error);
        // Try other formats as fallback
        loadGLTFModel(capsuleMesh);
    });
}

// Load GLTF/GLB model as fallback
function loadGLTFModel(capsuleMesh) {
    const loader = new GLTFLoader();
    
    if (DEBUG) console.log('Attempting to load capybara.glb model...');
    
    loader.load('models/capybara.glb', (gltf) => {
        if (DEBUG) console.log('Successfully loaded capybara.glb model!');
        capybaraModel = gltf.scene;
        
        // Add the capybara model to the capsule mesh
        capsuleMesh.add(capybaraModel);
        
        // Scale the model to make it more visible
        capybaraModel.scale.set(1.5, 1.5, 1.5);
        
        // Position the model to align with the capsule
        capybaraModel.position.set(0, -0.5, 0);
        
        // Enable shadows for the model
        capybaraModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        // Set up animations if available in the model
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(capybaraModel);
            const idleAction = mixer.clipAction(gltf.animations[0]); // Assumes first animation is idle
            idleAction.play();
            
            if (DEBUG) console.log('Loaded animations from model:', gltf.animations);
        } else {
            // If no animations in the model, try to load separate animation file
            loadSeparateAnimation(capybaraModel);
        }
    }, 
    // Progress callback
    (xhr) => {
        if (DEBUG) console.log('GLTF: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback
    (error) => {
        console.warn('Error loading GLTF model, trying FBX:', error);
        loadFBXModel(capsuleMesh);
    });
}

// Load FBX model as fallback
function loadFBXModel(capsuleMesh) {
    const loader = new FBXLoader();
    
    if (DEBUG) console.log('Attempting to load capybara.fbx model...');
    
    loader.load('models/capybara.fbx', (fbx) => {
        if (DEBUG) console.log('Successfully loaded capybara.fbx model!');
        capybaraModel = fbx;
        
        // Add the capybara model to the capsule mesh
        capsuleMesh.add(fbx);
        
        // Scale the model to make it more visible
        fbx.scale.set(0.015, 0.015, 0.015); // FBX models often need scaling
        
        // Position the model to align with the capsule
        fbx.position.set(0, -0.5, 0);
        
        // Enable shadows for the model
        fbx.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        // Set up animations if available
        if (fbx.animations && fbx.animations.length > 0) {
            mixer = new THREE.AnimationMixer(fbx);
            const idleAction = mixer.clipAction(fbx.animations[0]);
            idleAction.play();
            if (DEBUG) console.log('Loaded animations from FBX model');
        } else {
            // If no animations in the model, try to load separate animation file
            loadSeparateAnimation(fbx);
        }
    }, 
    // Progress callback
    (xhr) => {
        if (DEBUG) console.log('FBX: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback
    (error) => {
        console.warn('Error loading FBX model, trying DAE:', error);
        loadDAEModel(capsuleMesh);
    });
}

// Load DAE (Collada) model as final fallback
function loadDAEModel(capsuleMesh) {
    const loader = new ColladaLoader();
    
    if (DEBUG) console.log('Attempting to load capybara.dae model...');
    
    loader.load('models/capybara.dae', (collada) => {
        if (DEBUG) console.log('Successfully loaded capybara.dae model!');
        const dae = collada.scene;
        capybaraModel = dae;
        
        // Add the capybara model to the capsule mesh
        capsuleMesh.add(dae);
        
        // Scale the model to make it more visible
        dae.scale.set(1.5, 1.5, 1.5);
        
        // Position the model to align with the capsule
        dae.position.set(0, -0.5, 0);
        
        // Enable shadows for the model
        dae.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        // Check if there are animations in the DAE file
        if (collada.animations && collada.animations.length > 0) {
            mixer = new THREE.AnimationMixer(dae);
            const idleAction = mixer.clipAction(collada.animations[0]);
            idleAction.play();
            if (DEBUG) console.log('Loaded animations from DAE model');
        } else {
            // If no animations in the model, try to load separate animation file
            loadSeparateAnimation(dae);
        }
    }, 
    // Progress callback
    (xhr) => {
        if (DEBUG) console.log('DAE: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Error callback
    (error) => {
        console.error('All model loading attempts failed:', error);
        
        // Create a simple fallback model if all loading attempts fail
        createFallbackModel(capsuleMesh);
    });
}

// Load separate animation file
function loadSeparateAnimation(model) {
    if (!model) return;
    
    if (DEBUG) console.log('Loading separate animation file...');
    
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
            if (DEBUG) console.log('Loaded separate idle animation');
        } else {
            console.warn('No animations found in the separate animation file');
        }
    }, 
    // Progress callback
    (xhr) => {
        if (DEBUG) console.log('Animation: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
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
            if (DEBUG) console.log('Loaded GLTF animation');
        }
    }, undefined, (error) => {
        console.warn('Error loading GLTF animation:', error);
    });
}

// Create a simple fallback model if all loading attempts fail
function createFallbackModel(capsuleMesh) {
    if (DEBUG) console.log('Creating fallback capybara model...');
    
    // Create a simple shape to represent the capybara
    const geometry = new THREE.BoxGeometry(1, 0.8, 1.5); // More capybara-like proportions
    const material = new THREE.MeshStandardMaterial({
        color: 0x8B4513, // Brown color for capybara
        roughness: 0.7,
        metalness: 0.1
    });
    
    const fallbackModel = new THREE.Mesh(geometry, material);
    fallbackModel.castShadow = true;
    fallbackModel.receiveShadow = true;
    
    // Position the fallback model
    fallbackModel.position.set(0, 0, 0);
    
    // Add the fallback model to the capsule mesh
    capsuleMesh.add(fallbackModel);
    
    capybaraModel = fallbackModel;
    if (DEBUG) console.log('Fallback model created and added to scene');
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