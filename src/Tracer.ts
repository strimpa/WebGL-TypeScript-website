import * as THREE from "three"
import { IClickable } from "IClickable"
import { ExplodableBox } from "geometry/ExplodableBox"

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
        // find intersections
        this.raycaster.setFromCamera( this.mouse, camera );

        var intersects = this.raycaster.intersectObjects( objects, false );
        intersects.forEach(element => 
        {
            if (this.mouseWasDown && 'Click' in element.object)
            {
                (element.object as ExplodableBox).Hover();
            }
            else if ('Hover' in element.object)
            {
                (element.object as ExplodableBox).Hover();
            }
        });

        this.mouseWasDown = false;

        return intersects.length == 0;
    }
}
