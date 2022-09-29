const renderer = new CSS3DRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const objectCSS = new CSS3DObject( document.getElementById('textExample') );
objectCSS.position.x = objectCSS.position.y = objectCSS.position.z = 0;
objectCSS.width = 50;
scene.add( objectCSS );

function update()
{   
    renderer.render( scene, camera );
}
