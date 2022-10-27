import * as THREE from "three"

/**
 * Interface to opt into mouse interaction
 */
export interface IClickable
{
    Hover() : void;
    Click() : void;
}
