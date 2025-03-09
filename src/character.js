import * as THREE from 'three';
import { createCharacterBody, isGrounded } from './physics.js';
import { updateCameraTarget } from './scene.js';
import { params } from './gui.js';

// Create the character
export function createCharacter(scene, world) {
    // Create the character mesh
    const characterGroup = new THREE.Group();
    
    // Create the capsule body
    const capsuleGeometry = new THREE.CapsuleGeometry(0.5, 1.0, 4, 8);
    const capsuleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3498db,
        roughness: 0.5,
        metalness: 0.3
    });
    const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
    capsuleMesh.castShadow = true;
    capsuleMesh.position.y = 0.5; // Offset to align with physics body
    characterGroup.add(capsuleMesh);
    
    // Add some details to the character
    addCharacterDetails(characterGroup);
    
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

// Add details to the character mesh
function addCharacterDetails(characterGroup) {
    // Add eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.2, 1.2, 0.4);
    characterGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-0.2, 1.2, 0.4);
    characterGroup.add(rightEye);
    
    // Add pupils
    const pupilGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(0.2, 1.2, 0.45);
    characterGroup.add(leftPupil);
    
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(-0.2, 1.2, 0.45);
    characterGroup.add(rightPupil);
}

// Update the character based on input
export function updateCharacter(character, input) {
    // Get the physics body
    const rigidBody = character.physicsBody.rigidBody;
    
    // Check if the character is grounded
    character.grounded = isGrounded(character.world, character.physicsBody);
    
    // Get the current velocity
    const velocity = rigidBody.linvel();
    
    // Calculate the movement direction
    const moveDirection = new THREE.Vector3(
        input.direction.right,
        0,
        -input.direction.forward
    ).normalize();
    
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
    }
    
    // Update the camera target to follow the character
    updateCameraTarget(character.mesh.position);
}