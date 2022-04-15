import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import FramentShader from './Shaders/Fragment.glsl'
import VertexShader from './Shaders/Vertex.glsl'
import gsap from 'gsap'


/**
 * Base
 */
// Debug

const root = document.documentElement

let localContent = null;


const applySettings = (localContent) => {
    firstColorInput.value = localContent.firstColor
    secondColorInput.value = localContent.secondColor
    uTimeMultiplierInput.value = localContent.timeMultiplier
    uPerlinFrequencyInput.value = localContent.perlinFrequency
    uPerlinAmplitudeInput.value = localContent.perlinAmplitude
    uMouseStrengthInput.value = localContent.mouseStrength
    uMouseAreaInput.value = localContent.mouseArea

    material.uniforms.uTimeMultiplier.value = localContent.timeMultiplier
    material.uniforms.uPerlinFrequency.value = localContent.perlinFrequency
    material.uniforms.uPerlinAmplitude.value = localContent.perlinAmplitude
    material.uniforms.uMouseStrength.value = localContent.mouseStrength
    material.uniforms.uMouseArea.value = localContent.mouseArea
    material.uniforms.uBaseColor.value = new THREE.Color(localContent.firstColor)
    material.uniforms.uMouseColor.value = new THREE.Color(localContent.secondColor)


    root.style.setProperty('--first-color', localContent.firstColor)
    root.style.setProperty('--second-color', localContent.secondColor)
}



window.onload = () => {
    localStorage.getItem('content') && applySettings(JSON.parse(localStorage.getItem('content')))
    
    document.getElementsByClassName('hello-text')[0].style.opacity = '1'
    document.getElementsByClassName('hello-text')[1].style.opacity = '1'

    setTimeout(() => {
        const timeline = gsap.timeline() 
        timeline.to('.bar', {
            width: '100vw',
            duration: 1,
        })
        timeline.to('.half', {
            delay: 1.5,
            height: '5vh',
            duration: .5,
        })
    }, 6000)
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

console.log(localContent);


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
            value: 0
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
            value:  0.5
        },
        uMouseArea: {
            value: 0.5
        },
        uBaseColor: {
            value: new THREE.Color('#8960fb')
        },
        uMouseColor: {
            value: new THREE.Color('#dc9f98')
        }
    }
})

const firstColorInput = document.querySelector('input[name="first-color"]')
const secondColorInput = document.querySelector('input[name="second-color"]')
const uTimeMultiplierInput = document.querySelector('input[name="time-multiplier"]')
const uPerlinFrequencyInput = document.querySelector('input[name="perlin-frequency"]')
const uPerlinAmplitudeInput = document.querySelector('input[name="perlin-amplitude"]')
const uMouseStrengthInput = document.querySelector('input[name="mouse-strength"]')
const uMouseAreaInput = document.querySelector('input[name="mouse-area"]')
const resetButton = document.querySelector('button[name="reset"]')


const saveOnLocalStorage = () => {
    localStorage.setItem('content', JSON.stringify({
        firstColor: firstColorInput.value,
        secondColor: secondColorInput.value,
        timeMultiplier: uTimeMultiplierInput.value,
        perlinFrequency: uPerlinFrequencyInput.value,
        perlinAmplitude: uPerlinAmplitudeInput.value,
        mouseStrength: uMouseStrengthInput.value,
        mouseArea: uMouseAreaInput.value,
    }))
}

firstColorInput.addEventListener('input', (e) => {
    material.uniforms.uBaseColor.value = new THREE.Color(e.target.value)
    root.style.setProperty('--first-color', e.target.value)
    saveOnLocalStorage()
})

secondColorInput.addEventListener('input', (e) => {
    material.uniforms.uMouseColor.value = new THREE.Color(e.target.value)
    root.style.setProperty('--second-color', e.target.value)
    saveOnLocalStorage()

})

uTimeMultiplierInput.addEventListener('input', (e) => {
    material.uniforms.uTimeMultiplier.value = e.target.value
    saveOnLocalStorage()

})

uPerlinFrequencyInput.addEventListener('input', (e) => {
    material.uniforms.uPerlinFrequency.value = e.target.value
    saveOnLocalStorage()

})

uPerlinAmplitudeInput.addEventListener('input', (e) => {
    material.uniforms.uPerlinAmplitude.value = e.target.value
    saveOnLocalStorage()

})

uMouseStrengthInput.addEventListener('input', (e) => {
    material.uniforms.uMouseStrength.value = e.target.value
    saveOnLocalStorage()

})

uMouseAreaInput.addEventListener('input', (e) => {
    material.uniforms.uMouseArea.value = e.target.value
    saveOnLocalStorage()

})

resetButton.addEventListener('click', () => {
    localStorage.removeItem('content')
    location.reload()
})




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