# Physics-Based Character Controller

A simple physics-based character controller using Rapier physics engine and Three.js for rendering. This project demonstrates how to create a character that responds to WASD movement and space for jumping, with realistic physics simulation.

## Features

- Physics-based character movement with WASD controls
- Jumping with space bar
- Capsule collider for the character
- Ground collision detection
- 3D rendering with Three.js
- Orbit camera controls
- Smooth character transitions
- Environmental collision handling
- Netlify deployment support
- Custom 3D character model support (capybara)

## Controls

- W: Move forward
- A: Move left
- S: Move backward
- D: Move right
- Space: Jump
- Mouse: Rotate camera

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

### Adding Your 3D Capybara Model

1. Place your 3D model files in the `models/` directory:
   - Supported formats: GLTF/GLB (recommended), FBX, OBJ, DAE
   - Example: `models/capybara.glb`
   
2. If your model uses external textures, place them in the `models/textures/` directory:
   - Example: `models/textures/capybara_texture.png`

3. The code will automatically try to load the model in the following order:
   - GLTF/GLB (preferred)
   - FBX
   - OBJ (with MTL materials)
   - DAE (Collada)

4. If your model needs position or scale adjustments, you can modify the relevant parameters in `src/character.js`

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
  - `input.js` - Input handling
  - `scene.js` - Three.js scene setup
- `models/` - Directory for 3D model files
  - `textures/` - Directory for texture files

## How It Works

1. The physics world is initialized with Rapier
2. A ground plane and character capsule are created in both the physics world and the 3D scene
3. The capybara 3D model is loaded and attached to the capsule collider
4. The capsule is made invisible, so only the capybara model is visible
5. Input from WASD and space is captured and converted to movement directions
6. The character controller applies forces or velocities to the physics body based on input
7. The 3D mesh positions are updated based on the physics simulation
8. The camera follows the character
9. If the model includes animations, the idle animation is played

## Deployment

This project is set up for easy deployment to Netlify. Simply connect your GitHub repository to Netlify and set the build command to `npm run build` and the publish directory to `dist`.

## License

This project is licensed under the ISC License. 