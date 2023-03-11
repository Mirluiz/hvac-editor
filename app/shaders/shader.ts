export const vertex = () => {
  return `
    attribute vec2 a_position;
    attribute vec3 a_color;
    varying vec4 vColor;
    
    uniform mat3 u_matrix;
    
    void main() {
        gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
        // gl_Position = vec4(a_position, 0, 1);
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
