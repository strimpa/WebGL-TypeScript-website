import * as THREE from "three";
import { WebGL } from './WebGL.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { BufferGeometry } from "three";
import { ExplodableBox } from "./geometry/ExplodableBox.js"
import { Tracer } from "./Tracer.js"

let canvas : HTMLElement = document.getElementById( 'table_outside' );

if ( WebGL.isWebGLAvailable() == false) 
{
	const warning = WebGL.getWebGLErrorMessage();
	canvas.appendChild( warning );
}

const contentWidth = 800;
const contentHeight = 1000;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, contentWidth / contentHeight, 0.1, 1000 );
camera.position.z = 5;

let rotating = true;

const geomRenderer = new THREE.WebGLRenderer();
geomRenderer.setSize( contentWidth, contentHeight );
canvas.appendChild( geomRenderer.domElement );

let ambient = new THREE.AmbientLight( 0x111111 );
scene.add( ambient );

scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

const light1 = new THREE.DirectionalLight( 0x00FF00, 0.5 );
light1.position.set( 1, 1, 1 );
scene.add( light1 );

const box = new ExplodableBox();
scene.add( box );
// box.position.z = -15;

//Load background texture
const loader = new THREE.TextureLoader();
loader.load('/media/bg.jpg' , function(texture)
            {
             scene.background = texture;
             texture.wrapS = THREE.MirroredRepeatWrapping;
             texture.wrapT = THREE.MirroredRepeatWrapping;
            // texture.repeat = new THREE.Vector2( .5, .5 ); 
            });


let tracer = new Tracer(contentWidth, contentHeight);

function update()
{
    requestAnimationFrame( update );

    if (rotating)
    {
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
    }

    rotating = tracer.update(camera, [box]);

    box.UpdateBuffers();

    geomRenderer.render(scene, camera );
};

function resize()
{
    geomRenderer.render(scene, camera );
}

function mouseDownHandler(event)
{
    tracer.onDocumentMouseDown (event);
}
const middleX = contentWidth/2 + 150
const middleY = contentHeight/2
function mouseMoveHandler (event)
{
    tracer.onDocumentMouseMove( event );
    light1.position.x = (event.clientX - middleX) / contentWidth * 10;
    light1.position.y = - (event.clientY - middleY) / contentHeight * 10;
}

window.onresize = resize;

// import { OrbitControls } from 'OrbitControls';
// const controls = new OrbitControls( camera, renderer.domElement );
canvas.addEventListener( 'mousemove', (event) => mouseMoveHandler(event), false );
canvas.addEventListener( 'mousedown', (event) => mouseDownHandler(event), false );

update();
