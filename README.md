# Physics-Based Character Controller

A simple physics-based character controller using Rapier physics engine and Three.js for rendering. This project demonstrates how to create a character that responds to WASD movement and space for jumping, with realistic physics simulation and a third-person camera system.

## Features

- Physics-based character movement with WASD controls
- Jumping with space bar
- Capsule collider for the character
- Ground collision detection
- 3D rendering with Three.js
- Third-person camera system
- Camera-relative movement (character moves in the direction the camera is facing)
- Smooth character transitions and rotation
- Environmental collision handling
- Netlify deployment support

## Controls

- W: Move forward (relative to camera direction)
- A: Move left (relative to camera direction)
- S: Move backward (relative to camera direction)
- D: Move right (relative to camera direction)
- Space: Jump
- Mouse: Rotate camera around character

## Technologies Used

- Three.js - 3D rendering
- Rapier - Physics simulation
- Vite - Development server and bundler

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to http://localhost:5173 (or the URL shown in your terminal).

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

- `index.html` - Main HTML file
- `src/` - Source code directory
  - `main.js` - Entry point
  - `physics.js` - Rapier physics setup
  - `character.js` - Character controller
  - `input.js` - Input handling with camera-relative movement
  - `scene.js` - Three.js scene setup and third-person camera configuration

## How It Works

1. The physics world is initialized with Rapier
2. A ground plane and character capsule are created in both the physics world and the 3D scene
3. The third-person camera is configured to follow the character at a fixed distance
4. Input from WASD and space is captured and converted to movement directions relative to the camera's orientation
5. The character controller applies forces or velocities to the physics body based on input
6. The 3D mesh positions are updated based on the physics simulation
7. The camera follows the character and can be rotated around it with the mouse

## Third-Person Camera System

The third-person camera system in this project:

- Maintains a fixed distance from the character
- Follows the character as it moves through the world
- Allows rotation around the character using the mouse
- Ensures character movement is relative to the camera's orientation (e.g., pressing W always moves forward in the direction the camera is facing)
- Smoothly transitions as the character moves and rotates

## Deployment

This project is set up for easy deployment to Netlify. Simply connect your GitHub repository to Netlify and set the build command to `npm run build` and the publish directory to `dist`.

## License

This project is licensed under the ISC License.