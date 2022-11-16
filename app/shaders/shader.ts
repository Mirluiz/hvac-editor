export const vertex = () => {
  //   return `
  //    attribute vec4 aVertexPosition;
  //
  //    uniform mat4 uModelViewMatrix;
  //    uniform mat4 uProjectionMatrix;
  //
  //    void main() {
  //       gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  //    }
  // `;

  return `
    attribute vec2 a_position;

    uniform vec2 u_resolution;
    uniform mat3 u_matrix;
    
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
    }
  `;
};

export const fragment = () => {
  return `
    void main() {
      gl_FragColor = vec4(0, 0, 0, 1);
    }
  `;
};