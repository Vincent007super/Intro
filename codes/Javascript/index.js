import * as THREE from '../../node_modules/three/src/Three.js';
import { gsap } from '../../node_modules/gsap/all.js';

let scene, camera, renderer;
let objects = [1, 1, 1, 1, 1]; // Array to hold our scrollable objects

let objectCount = objects.length;

// Scrollin variables
let scroll;
let newScroll;
let canScroll = true;
let currCam = 1; // Where the Camera currently is

// Initialize Three.js
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.z = 5; // Set initial camera position
    camera.position.y = 0

    // Add some example planes
    for (let i = 0; i < objectCount; i++) {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00000 });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.y = i * -12.5; // Stagger planes vertically
        scene.add(plane);
        objects.push(plane);
    }

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('wheel', onScroll);

    console.log('Scene initialized');
}


// Handle scrolling
function onScroll(scroll) {
    if (canScroll) {
        canScroll = false;
        console.log("gebruiker scrollt");
        newScroll = scroll.deltaY;
        console.log(newScroll);
        console.log("The user can scroll: " + canScroll);
        console.log(objectCount)
        if (newScroll > 0 && currCam < objectCount) {
            currCam++;
        } else if (newScroll < 0 && currCam > 1) {
            currCam--;
        } else {
            canScroll = true;
            return;
        }

        const targetY = -12.5 * (currCam - 1); // Target y-position
        gsap.timeline()
            .to(camera.position, { z: 10, duration: 0.5 }) // Move camera back
            .to(camera.position, { y: targetY, duration: 0.5 }) // Slide camera down
            .to(camera.position, { z: 5, duration: 0.5 }) // Move camera forward
            .call(() => { canScroll = true; }); // Re-enable scrolling after animation

        console.log(`Camera moved to plane ${currCam}, new y: ${targetY}`);
    }

}
// animation loop
function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

// Resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize everything
init();
animate();
