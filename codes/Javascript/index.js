import * as THREE from '../../node_modules/three/src/Three.js';

let scene, camera, renderer;
let objects = []; // Array to hold our scrollable objects
let scrollPosition = 0;
let targetScrollPosition = 0;
const breakpoints = [];
let currentBreak = 0;

let canScroll = true;
let breakActive = false;

// Initialize Three.js
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.z = 5; // Set initial camera position

    // Add some example planes
    for (let i = 0; i < 10; i++) {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00000 });
        const plane = new THREE.Mesh(geometry, material);
        // plane.position.y = i * -5; // Stagger planes vertically
        scene.add(plane);
        objects.push(plane);
    }

    for (let i = 0; i < objects.length; i++) {

        breakpoints.push(i * 15);
    }

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('wheel', onScroll);

    console.log('Scene initialized');
}


// Handle scrolling
function onScroll(event) {
    if (canScroll) {
        canScroll = false;
        if (event.deltaY > 0) {
            if (currentBreak < breakpoints.length -1) {
                currentBreak++;
            }
        } else if (event.deltaY < 0) {
            if (currentBreak > 0) {
                currentBreak--;
            }
        }
        setTimeout(() => {
            canScroll = true;
        }, 500
        )
        console.log(currentBreak)
    } else if (canScroll === false) {
        targetScrollPosition = 0; // scroll sensitivity
    }
}

// Smooth animation loop
function animate() {
    requestAnimationFrame(animate);



    // Apply scroll position to objects
    objects.forEach((obj, index) => {
        obj.position.y = -index * 15 + scrollPosition; // Adjust based on scroll
    });

    // Check for breakpoints
    breakpoints.forEach((point) => {
        if (Math.abs(scrollPosition - point) < 10) {
            breakActive === true;
            canScroll === false;

            if (breakActive === true) {
                targetScrollPosition = point; // Snap to breakpoint
            } else if (breakActive === false) {
                targetScrollPosition = targetScrollPosition;
            } else {
                console.log("breakActive cannot be read");
            }




        }
    });

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
