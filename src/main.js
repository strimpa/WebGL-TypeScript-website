import * as THREE from 'three';
import { WebGL } from 'WebGL';
import { CSS3DRenderer, CSS3DObject } from 'CSS3DRenderer';

if ( WebGL.isWebGLAvailable() == false) 
{

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'table_outside' ).appendChild( warning );

}

const contentWidth = 800;
const contentHeight = 1000;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, contentWidth / contentHeight, 0.1, 1000 );

const geomRenderer = new THREE.WebGLRenderer();
geomRenderer.setSize( contentWidth, contentHeight );
document.getElementById( 'table_outside' ).appendChild( geomRenderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );

//Load background texture
const loader = new THREE.TextureLoader();
loader.load('/media/bg.jpg' , function(texture)
            {
             scene.background = texture;
             texture.wrapS = THREE.MirroredRepeatWrapping;
             texture.wrapT = THREE.MirroredRepeatWrapping;
            // texture.repeat = new THREE.Vector2( .5, .5 ); 
            });

camera.position.z = 5;

function update()
{
    requestAnimationFrame( update );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    geomRenderer.render(scene, camera );
};

function resize()
{
    geomRenderer.render(scene, camera );
}

window.onresize = resize;

// import { OrbitControls } from 'OrbitControls';
// const controls = new OrbitControls( camera, renderer.domElement );
  
update();
