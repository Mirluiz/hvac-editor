export const vertex = () => {
  return `
    attribute vec2 a_position;
    attribute vec3 a_color;

    uniform vec2 u_resolution;
    uniform mat3 u_matrix;
    
    varying vec4 vColor;
    
    void main() {
        // Multiply the position by the matrix.
        vec2 position = (u_matrix * vec3(a_position, 1)).xy;
      
        // convert the position from pixels to 0.0 to 1.0
        vec2 zeroToOne = position / u_resolution;
      
        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;
      
        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;
      
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        vColor =  vec4(a_color, 1.0);
    }
  `;
};

export const fragment = () => {
  return `
    precision mediump float;
    varying vec4 vColor;
    
    void main() {
      gl_FragColor = vColor;
    }
  `;
};
