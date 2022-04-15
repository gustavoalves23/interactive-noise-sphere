import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import FramentShader from './Shaders/Fragment.glsl'
import VertexShader from './Shaders/Vertex.glsl'
import gsap from 'gsap'


/**
 * Base
 */
// Debug

const gui = new dat.GUI()
gui.close()
gui.domElement.style.display = 'none'

window.onload = () => {
    setTimeout(() => {
        const timeline = gsap.timeline() 
        timeline.to('.bar', {
            width: '100vw',
            duration: 1,
        })
        timeline.to('.half', {
            delay: 0,
            height: '5vh',
            duration: .5,
        }).then(() => {
        gui.domElement.style.display = 'block'

        })
        gui.reset()
    }, 1)
}

// window.onload = () => {
//     setTimeout(() => {
//         const timeline = gsap.timeline() 
//         timeline.to('.bar', {
//             width: '100vw',
//             duration: 1,
//         })
//         timeline.to('.half', {
//             delay: 2,
//             height: '5vh',
//             duration: 0.5,
//         })
//     }, 8000)
// }




// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const mouse = {
    x: 0.01,
    y: 0.01
}

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.SphereGeometry(1, 512, 512)

const colors = {
    firstColor: 0x8960fb,
    secondColor: 0xdc9f98,
}

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: VertexShader,
    fragmentShader: FramentShader,
    // wireframe: true,
    uniforms:{
        uMouse: {
            value: mouse
        },
        uTime: {
            value: 0.0
        },
        uTimeMultiplier: {
            value: 1.0
        },
        uPerlinFrequency: {
            value: 5.0
        },
        uPerlinAmplitude: {
            value: 0.5
        },
        uMouseStrength: {
            value: 0.5
        },
        uMouseArea: {
            value: 0.5
        },
        uBaseColor: {
            value: new THREE.Color(colors.firstColor)
        },
        uMouseColor: {
            value: new THREE.Color(colors.secondColor)
        }
    }
})

gui.add(material.uniforms.uTimeMultiplier, 'value', 0.0, 10.0).name('Time Multiplier');
gui.add(material.uniforms.uPerlinFrequency, 'value', 0.0, 10.0).name('Perlin Frequency')
gui.add(material.uniforms.uPerlinAmplitude, 'value', 0.0, 2.0).name('Perlin Amplitude')
gui.add(material.uniforms.uMouseStrength, 'value', 0.0, 1.5).name('Mouse Strength')
gui.add(material.uniforms.uMouseArea, 'value', 0.3, 1.0).name('Mouse Area')
gui.addColor(material.uniforms.uBaseColor, 'value').name('Base Color')
gui.addColor(material.uniforms.uMouseColor, 'value').name('Mouse Color')


// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



window.addEventListener('mousemove', event => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
    console.log(mouse);
})

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 4);
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color(0xe8e8e8))

gui.addColor({bgColor:0xe8e8e8}, 'bgColor').onChange(color => {
    renderer.setClearColor(new THREE.Color(color))

})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{

    // Update uniform
    material.uniforms.uTime.value = clock.getElapsedTime()



    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()