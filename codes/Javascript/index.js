import * as THREE from '../../node_modules/three/src/Three.js';
import { gsap } from '../../node_modules/gsap/all.js';

let scene, camera, renderer;
let objects = []; // Array to hold our scrollable objects
let planesContent = [
    {
        plane: 1,
        layout: "basic", // Layout type
        title: "Who am I?",
        description: "This is merely a test. Nothing more, nothing less",
        image: "example1.png"
    },
    {
        plane: 2,
        layout: "detailed", // Layout type
        title: "American declaration on the empire of Japan",
        description: "Japan has, therefore, undertaken a surprise offensive extending throughout the Pacific area. The facts of yesterday and today speak for themselves. The people of the United States have already formed their opinions and well understand the implications to the very life and safety of our Nation. As Commander in Chief of the Army and Navy I have directed that all measures be taken for our defense. But always will our whole Nation remember the character of the onslaught against us. No matter how long it may take us to overcome this premeditated invasion, the American people in their righteous might will win through to absolute victory.",
        image: "example2.png",
        extraInfo: "~ Franklin D. Rooseveld"
    }
];

// Scroll variables
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
    camera.position.y = 0;

    // Add planes with content from planesContent array
    planesContent.forEach((content, index) => {
        const plane = createTextPlane(content); // Pass content for each plane
        plane.position.y = index * -12.5; // Stagger planes vertically
        scene.add(plane);
        objects.push(plane);
    });

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('wheel', onScroll);

    console.log('Scene initialized');
}

// Create a plane with dynamic content and layout
function createTextPlane(content) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth; // Resolution of the texture
    canvas.height = window.innerHeight;

    // Fill background
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // This function basically be a lot of math, DO NOT TOUCH!!!
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, x, y);
                line = words[i] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    // Layout-specifiek ontwerp toepassen
    if (content.layout === "basic") {
        // Basis layout: Titel en beschrijving
        context.fillStyle = 'white';
        context.font = '64px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText(content.title, canvas.width / 2, 185);

        context.font = '32px Arial';
        wrapText(context, content.description, canvas.width / 2, canvas.height / 2, 1200, 40);
    } else if (content.layout === "detailed") {
        // Gedetailleerde layout: Titel, beschrijving, afbeelding en extra informatie
        context.fillStyle = 'white';
        context.font = '64px Arial';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillText(content.title, 50, 85);

        context.font = '32px Arial';
        wrapText(context, content.description, 50, 180, 1000, 40);

        // Plaats voor afbeelding
        context.fillStyle = 'gray';
        context.fillRect(canvas.width - 400, 100, 300, 200);
        context.fillStyle = 'white';
        context.fillText("Image: " + content.image, canvas.width - 250, 320);

        // Extra informatie
        wrapText(context, content.extraInfo, 50, canvas.height - 200, 1800, 40);
    }

    // Create texture
    const texture = new THREE.CanvasTexture(canvas);

    // Create material and geometry
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(16, 9); // Adjust size if needed
    return new THREE.Mesh(geometry, material);
}

// Handle scrolling
function onScroll(scroll) {
    if (canScroll) {
        canScroll = false;
        newScroll = scroll.deltaY;

        if (newScroll > 0 && currCam < objects.length) {
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

// Animation loop
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
