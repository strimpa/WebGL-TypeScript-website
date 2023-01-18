import * as THREE from "three";
import { Matrix4 } from "three";
import { ExplodableBox } from "./geometry/ExplodableBox.js";
import { LineManager } from "./LineManager.js";

const BOX_DIM_COUNT : number = 5.0;
const BOX_DISTANCE : number = 3.0;
const BOX_CREATION_OFFSET : number = - (BOX_DIM_COUNT * BOX_DISTANCE / 2) + 1;

/**
 * Managing the scene
 */
export class PortfolioScene extends THREE.Scene
{
    rotating = true;
    
    loader = new THREE.TextureLoader();
    light1 = new THREE.DirectionalLight( 0x00FF00, 0.5 );
    lineManager = new LineManager();

    objectRoot : THREE.Object3D;                            // Root for all objects that rotate together
    focusRoot : THREE.Object3D;                             // Temporary root for the cube in selection showing the content

    constructor()
    {
        super();
        this.objectRoot = new THREE.Object3D();
        this.objectRoot.name = "Object Root";
        this.focusRoot = new THREE.Object3D();
        this.focusRoot.name = "Focus Root";
    }

    get objects() : Array<ExplodableBox>
    {
        return this.objectRoot.children as Array<ExplodableBox>;
    }

    init()
    {
        //Load background texture
        this.loader.load('/media/bg.jpg' , (texture) =>
        {
            this.background = texture;
            texture.wrapS = THREE.MirroredRepeatWrapping;
            texture.wrapT = THREE.MirroredRepeatWrapping;
            // texture.repeat = new THREE.Vector2( .5, .5 ); 
        });

        let ambient = new THREE.AmbientLight( 0x111111 );
        this.add( ambient );
    
        this.fog = new THREE.Fog( 0x050505, 2000, 3500 );
    
        this.light1.position.set( 1, 1, 1 );
        this.add( this.light1 );
    
        this.add( this.objectRoot );
        for (let boxXIndex = 0; boxXIndex < BOX_DIM_COUNT; boxXIndex++)
        {
            for (let boxYIndex = 0; boxYIndex < BOX_DIM_COUNT; boxYIndex++)
            {
                for (let boxZIndex = 0; boxZIndex < BOX_DIM_COUNT; boxZIndex++)
                {
                    const box = new ExplodableBox();
                    box.position.x = BOX_CREATION_OFFSET + BOX_DISTANCE * boxXIndex;
                    box.position.y = BOX_CREATION_OFFSET + BOX_DISTANCE * boxYIndex;
                    box.position.z = BOX_CREATION_OFFSET + BOX_DISTANCE * boxZIndex;
                    this.objectRoot.add(box);
                }
            }
        }

        this.add(this.lineManager);
        this.add(this.focusRoot);
    }

    update() : void
    {
        if (this.rotating)
        {
            this.objectRoot.rotation.y += 0.005;
        }

        this.objectRoot.children.forEach(element => 
        {
            (element as ExplodableBox).Update();
        });

        
        if (this.IsFocusing())
        {
            (this.GetFocusObj() as ExplodableBox).Update();
        }
    
        this.lineManager.update();
    }

    setRotating (isRotating : boolean) : void
    {
        this.rotating = isRotating;
    }

    setLightPos (pos : THREE.Vector3) : void
    {
        this.light1.position.x = pos.x;
        this.light1.position.y = pos.y;
    }

    FocusOnObject(obj : THREE.Object3D)
    {
        if (this.IsFocusing())
        {
            let focusObj = this.GetFocusObj();
            this.objectRoot.add(focusObj);
            focusObj.matrixAutoUpdate = true;
        }
        else
        {
            obj.matrixAutoUpdate = false;
            let currentMatrix = obj.matrixWorld.clone();
            this.focusRoot.add(obj);
            obj.matrix = currentMatrix;
        }
    }

    IsFocusing() : boolean
    {
        return this.focusRoot.children.length > 0;
    }

    GetFocusObj() : THREE.Object3D
    {
        return this.focusRoot.children[0];
    }
}