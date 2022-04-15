varying vec2 mouseVector;
varying vec3 actualPos;
uniform vec2 uMouse;
uniform float uMouseArea;
uniform vec3 uBaseColor;
uniform vec3 uMouseColor;



void main() {

  float distanceToTheMouse = distance(uMouse.xy, actualPos.xy);

  float mouseNearColorIntensity = 1. - smoothstep(0., uMouseArea * 6., distanceToTheMouse * 2.) ;

   vec3 mixedColor = mix(uBaseColor, uMouseColor, clamp(mouseNearColorIntensity, 0., 1.));

  gl_FragColor = vec4(vec3(mixedColor), 1.);
}