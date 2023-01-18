import * as THREE from "three"
import { ExplodableBox } from "./geometry/ExplodableBox"

/**
 * Logic about scene ray casting
 */
export class Tracer
{
    private raycaster : THREE.Raycaster; 
    private mouse : THREE.Vector2;
    private width : number;
    private height : number;
    private mouseWasDown : boolean;
    
    constructor(width, height)
    {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.width = width;
        this.height = height;
    }

    onDocumentMouseMove( event ) : void
    {
        // the following line would stop any other event handler from firing
        // (such as the mouse's TrackballControls)
        // event.preventDefault();
        
        // update the mouse variable
        this.mouse.x = ( (event.clientX - 150) / this.width ) * 2 - 1;
        this.mouse.y = - ( event.clientY / this.height ) * 2 + 1;
    }

    onDocumentMouseDown (event )
    {
        this.mouseWasDown = true;
    }

    update(camera, objects : ExplodableBox[]) : boolean
    {
        let scene = globalThis.app.scene;
        let somethingWasHit = false;
        if (scene.IsFocusing())
        {
            if (this.mouseWasDown)
            {
                (scene.GetFocusObj() as ExplodableBox).Click();
                somethingWasHit = true;
            }
        }
        else
        {
            // find intersections
            this.raycaster.setFromCamera( this.mouse, camera );

            var intersects = this.raycaster.intersectObjects( objects, false );
            if (intersects.length > 0)
            {
                let FirstHit = intersects[0].object;
                if (this.mouseWasDown && 'Click' in FirstHit)
                {
                    (FirstHit as ExplodableBox).Click();
                }
                else if ('Hover' in FirstHit)
                {
                    (FirstHit as ExplodableBox).Hover();
                }

                somethingWasHit = true;
            }
        }

        this.mouseWasDown = false;

        return somethingWasHit == false;
    }
}
