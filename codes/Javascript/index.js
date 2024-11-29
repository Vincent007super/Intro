import * as THREE from '../../node_modules/three/src/Three.js';

let scene, camera, renderer = [];

// initialize webgl and three.js ----------------------------------------------------------------------------------------
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 0;
    console.log('Initial camera position:', camera.position);

    window.addEventListener('resize', onWindowResize);
}

// General code -----------------------------------------------------------------------------------------------------------------

function animate() {

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();

console.log('Script fully loaded and executed');