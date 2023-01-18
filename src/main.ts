import * as THREE from "three";
import { WebGL } from './WebGL.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { BufferGeometry, Vector2, Vector3 } from "three";
import { Tracer } from "./Tracer.js"
import { PortfolioScene } from "./PortfolioScene.js";
import { ContentManager as CtntMgr } from "./ContentManager.js";

let canvas : HTMLElement = document.getElementById( 'table_outside' );
declare global
{ 
    var app : App;
}

if ( WebGL.isWebGLAvailable() == false) 
{
	const warning = WebGL.getWebGLErrorMessage();
	canvas.appendChild( warning );
}

class App
{
    contentWidth = 800;
    contentHeight = 1000;
    camera = new THREE.PerspectiveCamera( 75, this.contentWidth / this.contentHeight, 0.1, 1000 );
    geomRenderer = new THREE.WebGLRenderer();
    scene = new PortfolioScene();
    tracer = new Tracer(this.contentWidth, this.contentHeight);
    middleX = this.contentWidth/2 + 150;
    middleY = this.contentHeight/2;
    cntntMgr = new CtntMgr();

    init() : void
    {
        this.camera.position.z = 35;

        this.scene.init();

        this.geomRenderer.setSize( this.contentWidth, this.contentHeight );
        canvas.appendChild( this.geomRenderer.domElement );

        this.cntntMgr.load();
        
        // import { OrbitControls } from 'OrbitControls';
        // const controls = new OrbitControls( camera, renderer.domElement );
        canvas.addEventListener( 'mousemove', (event) => this.mouseMoveHandler(event), false );
        canvas.addEventListener( 'mousedown', (event) => this.mouseDownHandler(event), false );
        window.addEventListener( 'resize', (event) => this.resizeHandler(event), false );
    }

    update() : void
    {
        let nothingHit = this.tracer.update(this.camera, this.scene.objects);
        this.scene.setRotating(nothingHit);
        this.scene.update();

        this.geomRenderer.render(this.scene, this.camera );

        requestAnimationFrame( () => this.update() );
    };

    resizeHandler( event) : void
    {
        this.geomRenderer.render(this.scene, this.camera );
    }

    mouseDownHandler(event) : void
    {
        this.tracer.onDocumentMouseDown (event);
    }

    mouseMoveHandler (event) : void
    {
        this.tracer.onDocumentMouseMove( event );
        this.scene.setLightPos(
            new Vector3(
                (event.clientX - this.middleX) / this.contentWidth * 10,
                - (event.clientY - this.middleY) / this.contentHeight * 10,
                0.0
            ));
    }
}

globalThis.app = new App();
globalThis.app.init();
globalThis.app.update();
