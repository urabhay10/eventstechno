import React, { Component } from 'react';
import * as THREE from 'three';

export default class Scene extends Component {
    constructor() {
        super();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.renderer = null; // We'll initialize the renderer in componentDidMount
        this.meshes = []; // An array to store multiple planet meshes

        this.state = {
            rotationSpeed: 0.005,
            movementSpeed: 0.005,
            focus: 0, // Focus on the first planet initially
        };

        // Bind the key event handler
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
        this.setupScene();
        this.createPlanets();
        this.setupLight();
        this.setupCamera();
        this.setupRenderer();

        // Start the animation loop
        this.animate();
        
        // Add key event listener
        window.addEventListener('keydown', this.handleKeyPress);
    }

    componentWillUnmount() {
        // Remove key event listener when the component is unmounted
        window.removeEventListener('keydown', this.handleKeyPress);
    }

    setupScene() {
        // No need to create a new scene; it's already created in the constructor.
    }

    createPlanets() {
        const numPlanets = 18;
        const screenFactor = Math.min(window.innerWidth, window.innerHeight) / 600;
        const separation = 1.8 * screenFactor; // Adjust the separation between planets
        const planetSize = 0.3 * screenFactor; // Adjust the planet size

        for (let i = 0; i < numPlanets; i++) {
            const geometry = new THREE.SphereGeometry(planetSize, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: this.randomColor(),
            });

            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(i * separation - (numPlanets / 2) * separation, 0, 0);

            planet.addEventListener('click', () => this.handlePlanetClick(i));

            this.meshes.push(planet);
            this.scene.add(planet);
        }
    }

    setupLight() {
        // Ambient light to make all objects visible
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        // Directional light for shadows and highlights
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);
    }

    setupCamera() {
        this.camera.position.z = 10;
    }

    setupRenderer() {
        const canvas = document.querySelector('.webgl');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    randomColor() {
        const validHexChars = '0123456789ABCDEF';
        let color = '#';

        for (let i = 0; i < 6; i++) {
            color += validHexChars[Math.floor(Math.random() * 16)];
        }

        return color;
    }

    handleKeyPress(event) {
        if (event.key === 'ArrowRight' && this.state.focus < this.meshes.length - 1) {
            // Move focus to the right
            this.setState(prevState => ({ focus: prevState.focus + 1 }));
        } else if (event.key === 'ArrowLeft' && this.state.focus > 0) {
            // Move focus to the left
            this.setState(prevState => ({ focus: prevState.focus - 1 }));
        }
    }
    handlePlanetClick(index) {
        // Set the focus to the clicked planet
        this.setState({ focus: index });
    }
    animate = () => {
        requestAnimationFrame(this.animate);

        this.meshes.forEach((planet, index) => {
            if (index === this.state.focus) {
                // Enlarge the planet in focus
                planet.scale.set(1.5, 1.5, 1.5);
            } else {
                // Reset the scale for other planets
                planet.scale.set(1, 1, 1);
            }
        });

        // Adjust camera position based on the focus
        this.camera.position.x = this.meshes[this.state.focus].position.x;
        this.camera.lookAt(this.meshes[this.state.focus].position);
        

        this.renderer.render(this.scene, this.camera);
    };

    render() {
        return (
            <div>
                <canvas className='webgl' style={{ position: 'fixed', left: 0 }}></canvas>
            </div>
        );
    }
}
