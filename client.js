import * as THREE from 'three'
import { Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from './jsm/loaders/FontLoader.js';

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

var material = new THREE.MeshPhongMaterial( { color: 0x7F7C82 })

loadSTL();

addShadowedLight( -0.5, -0.5, -0.5, 0xffffff, 1.35 );
addShadowedLight( 0.5, 0.5, 0.5, 0xffffff, 1.35 );

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.autoRotate = 1.0;

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()

function addShadowedLight( x, y, z, color, intensity ) {

    const directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = - 0.002;

}

function loadSTL()
{
    const loader = new STLLoader()
    loader.load(
        '/full_skull.stl',
        function (geometry) {
            const mesh = new THREE.Mesh(geometry, material)
            mesh.rotation.x = -(Math.PI / 2);
            scene.add(mesh)
            var bbox = new THREE.BoxHelper( mesh )
            bbox.update()
            scene.add( bbox );
            const font_loader = new FontLoader();
            font_loader.load('./fonts/F25 Bank Printer_Regular.json', function(font) {
                const text_geom_1 = new TextGeometry("DCM to STL", {
                    font: font,
                    size: 0.05,
                    height: 0.1,
                });

                const text_mesh_1 = new Mesh(text_geom_1, material)
                text_mesh_1.castShadow = true;
                text_mesh_1.rotation.z =  (Math.PI / 2)
                text_mesh_1.rotation.y =  -(Math.PI / 2)
                text_mesh_1.rotation.x = Math.PI
                text_mesh_1.position.x = -0.75
                text_mesh_1.position.y = 0
                text_mesh_1.position.z = 0.85
                scene.add(text_mesh_1)

                const text_geom_2 = new TextGeometry("Parser", {
                    font: font,
                    size: 0.05,
                    height: 0.1,
                });

                const text_mesh_2 = new Mesh(text_geom_2, material)
                text_mesh_2.castShadow = true;
                text_mesh_2.rotation.z =  (Math.PI / 2)
                text_mesh_2.rotation.y =  -(Math.PI / 2)
                text_mesh_2.rotation.x = Math.PI
                text_mesh_2.position.x = -0.75
                text_mesh_2.position.y = 0
                text_mesh_2.position.z = 0.75
                scene.add(text_mesh_2)
            });
        },
        (error) => {
            console.log(error)
        }
    )
}
