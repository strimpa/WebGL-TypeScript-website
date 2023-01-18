import * as THREE from "three"
import { BufferGeometry } from "three";

export class LineManager extends THREE.Object3D
{
    private vertices : Float32Array = new Float32Array(
    [
        0.0, 0.0, 0.0,
        0.0, 0.0, 0.0
    ]);

    private readonly colours : Float32Array = new Float32Array(
    [
        1.0, 1.0, 1.0, 0.0,
        1.0, 1.0, 1.0, 1.0
    ]);
    
    private readonly currentPoistions : Float32Array = new Float32Array(
    [
        0.0, 0.0, 0.0
    ]);

    private currentDirection : Float32Array = new Float32Array(
    [
        1.0
    ]);
    
    private lines : THREE.LineSegments;
    private light : THREE.PointLight;

    constructor()
    {
        super();
        
        let linematerial = new THREE.LineBasicMaterial( { color: 0x666966, side: THREE.DoubleSide, linewidth:10, vertexColors: true, transparent:true } );
        let edges = new THREE.EdgesGeometry();
        edges.setAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );
        edges.setAttribute( 'color', new THREE.BufferAttribute( this.colours, 4 ) );
        this.lines = new THREE.LineSegments( edges, linematerial );
        this.add( this.lines );

        this.light = new THREE.PointLight();
        this.light.position.x = this.vertices[0];
        this.light.position.y = this.vertices[1];
        this.light.position.z = this.vertices[2];
        this.add(this.light);
    }

    private UpdateBuffers() : void
    {
        this.vertices = new Float32Array(
        [
            this.currentPoistions[0], this.currentPoistions[1], this.currentPoistions[2],
            this.currentPoistions[0], this.currentPoistions[1] - 10, this.currentPoistions[2],
        ]);

        this.lines.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );
    }

    update(): void
    {
        if (this.currentPoistions[1] >= 20 || 
            this.currentPoistions[1] <= -20)
        {
            this.currentDirection[0] *= -1;
        }

        this.currentPoistions[1] += this.currentDirection[0];

        this.UpdateBuffers()
    }
}