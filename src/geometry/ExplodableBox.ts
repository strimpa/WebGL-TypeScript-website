import * as THREE from "three"
import { IClickable } from "IClickable"

export class ExplodableBox extends THREE.Mesh implements IClickable
{
    #region
    private explodeCounter : number = 0.0;
    private hovered = false;
    private outline : THREE.LineSegments;
    private readonly expandSteps = 10;
    private edges : THREE.EdgesGeometry;
    private readonly indices = [
        0,1,2, // top
        2,3,0,

        4,5,6, // bottom
        6,7,4,

        8,9,10, // left
        10,11,8,

        12,13,14, // right
        14,15,12,

        16,17,18, // front
        18,19,16,

        20,21,22, // back
        22,23,20
    ];
    private readonly lineIndeces = [
        0,1,
        1,2, // top
        2,3,
        3,0,

        4,5,
        5,6, // bottom
        6,7,
        7,4,

        8,9,
        9,10, // left
        10,11,
        11,8,

        12,13,
        13,14, // right
        14,15,
        15,12,

        16,17,
        17,18, // front
        18,19,
        19,16,

        20,21,
        21,22, // back
        22,23,
        23,20
    ];

    private readonly vertices = new Float32Array([ 
            -1.0, -1.0, 1.0, // 0
            1.0, -1.0, 1.0,  // 1
            1.0, 1.0, 1.0,   // 2
            -1.0, 1.0, 1.0,  // 3

            -1.0, -1.0, -1.0,// 4
            1.0, -1.0,- 1.0, // 5
            1.0, 1.0, -1.0,  // 6
            -1.0, 1.0, -1.0, // 7

            -1.0, -1.0, 1.0, 
            -1.0, 1.0, 1.0, 
            -1.0, 1.0, -1.0, 
            -1.0, -1.0, -1.0, 

            1.0, -1.0, 1.0, 
            1.0, -1.0,- 1.0, 
            1.0, 1.0, -1.0, 
            1.0, 1.0, 1.0, 

            -1.0, -1.0, 1.0, // 0
            -1.0, -1.0, -1.0,// 4
            1.0, -1.0,- 1.0, // 5
            1.0, -1.0, 1.0,  // 1

            1.0, 1.0, 1.0,   // 2
            1.0, 1.0, -1.0,  // 6
            -1.0, 1.0, -1.0, // 7
            -1.0, 1.0, 1.0,  // 3
        ]);     

    private readonly normals = new Float32Array([ 
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,

            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
        ]);     
    #endregion

    Hover() : void
    {
        // reset after each frame process
        this.hovered = true;
    }

    Click() : void
    {

    }

    UpdateBuffers() : void
    {
        if (this.hovered)
        {
            if (this.explodeCounter < this.expandSteps)
                this.explodeCounter++;
        }
        else
        {
            if (this.explodeCounter > 0)
                this.explodeCounter--;
        }
        this.hovered = false;

        let newVertices = new Float32Array(this.vertices.length);
        let counter : number = 0; 
        this.vertices.forEach(element => {
            let newValue = element + this.normals[counter] * (this.explodeCounter / this.expandSteps);
            newVertices.set([newValue], counter);
            counter++;
        });

        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( newVertices, 3 ) ); 
        this.edges.setAttribute( 'position', new THREE.BufferAttribute( newVertices, 3 ) ); 
    }

    private InitialiseGeometry() : void
    {
        this.geometry.setIndex( this.indices );
        this.edges.setIndex( this.lineIndeces );

        this.UpdateBuffers();
        this.geometry.computeBoundingSphere();
        // itemSize = 3 because there are 3 values (components) per vertex
        this.geometry.setAttribute( 'normals', new THREE.BufferAttribute( this.normals, 3 ) ); 
        this.geometry.computeVertexNormals();
    }


    /**
     * standard cstor
     */
    constructor()
    {
        let geometry = new THREE.BufferGeometry();
        let material = new THREE.MeshPhongMaterial({
            color: 0x556655,
            specular: 0xFFFFFF,
            opacity: 0.8,
            transparent: true,
            shininess: 250,
            side: THREE.DoubleSide
        });
        super( geometry, material );
        this.receiveShadow = false;


        this.edges = new THREE.EdgesGeometry();
        this.geometry = geometry;
        this.InitialiseGeometry();

        this.material = material;

        let linematerial = new THREE.LineBasicMaterial( { color: 0xAABBAA, transparent: true } );
        this.outline = new THREE.LineSegments( this.edges, linematerial );
        this.add( this.outline );
    }
}