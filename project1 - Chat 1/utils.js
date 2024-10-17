function multiplyMatrices(matrixA, matrixB) {
    var result = [];

    for (var i = 0; i < 4; i++) {
        result[i] = [];
        for (var j = 0; j < 4; j++) {
            var sum = 0;
            for (var k = 0; k < 4; k++) {
                sum += matrixA[i * 4 + k] * matrixB[k * 4 + j];
            }
            result[i][j] = sum;
        }
    }

    // Flatten the result array
    return result.reduce((a, b) => a.concat(b), []);
}
function createIdentityMatrix() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}
function createScaleMatrix(scale_x, scale_y, scale_z) {
    return new Float32Array([
        scale_x, 0, 0, 0,
        0, scale_y, 0, 0,
        0, 0, scale_z, 0,
        0, 0, 0, 1
    ]);
}

function createTranslationMatrix(x_amount, y_amount, z_amount) {
    return new Float32Array([
        1, 0, 0, x_amount,
        0, 1, 0, y_amount,
        0, 0, 1, z_amount,
        0, 0, 0, 1
    ]);
}

function createRotationMatrix_Z(radian) {
    return new Float32Array([
        Math.cos(radian), -Math.sin(radian), 0, 0,
        Math.sin(radian), Math.cos(radian), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_X(radian) {
    return new Float32Array([
        1, 0, 0, 0,
        0, Math.cos(radian), -Math.sin(radian), 0,
        0, Math.sin(radian), Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_Y(radian) {
    return new Float32Array([
        Math.cos(radian), 0, Math.sin(radian), 0,
        0, 1, 0, 0,
        -Math.sin(radian), 0, Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function getTransposeMatrix(matrix) {
    return new Float32Array([
        matrix[0], matrix[4], matrix[8], matrix[12],
        matrix[1], matrix[5], matrix[9], matrix[13],
        matrix[2], matrix[6], matrix[10], matrix[14],
        matrix[3], matrix[7], matrix[11], matrix[15]
    ]);
}

const vertexShaderSource = `
attribute vec3 position;
attribute vec3 normal; // Normal vector for lighting

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

uniform vec3 lightDirection;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vNormal = vec3(normalMatrix * vec4(normal, 0.0));
    vLightDirection = lightDirection;

    gl_Position = vec4(position, 1.0) * projectionMatrix * modelViewMatrix; 
}

`

const fragmentShaderSource = `
precision mediump float;

uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float shininess;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vLightDirection);
    
    // Ambient component
    vec3 ambient = ambientColor;

    // Diffuse component
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * diffuseColor;

    // Specular component (view-dependent)
    vec3 viewDir = vec3(0.0, 0.0, 1.0); // Assuming the view direction is along the z-axis
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = spec * specularColor;

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}

`

/**
 * @WARNING DO NOT CHANGE ANYTHING ABOVE THIS LINE
 */



/**
 * 
 * @TASK1 Calculate the model view matrix by using the chatGPT
 */

function getChatGPTModelViewMatrix() {
    const transformationMatrix = new Float32Array([
        // you should paste the response of the chatGPT here:
        0.17677669, -0.28661165, 0.36959946, 0.3,
        0.30618623, 0.36959946, 0.14016505, -0.25,
       -0.35355338, 0.17677669, 0.30618623, 0.0,
        0.0, 0.0, 0.0, 1.0


    ]);
    return getTransposeMatrix(transformationMatrix);
}


/**
 * 
 * @TASK2 Calculate the model view matrix by using the given 
 * transformation methods and required transformation parameters
 * stated in transformation-prompt.txt
 */
function getModelViewMatrix() {
    // calculate the model view matrix by using the transformation
    // methods and return the modelView matrix in this method
    // Helper functions for rotation, scaling, and translation matrices
    function rotationXMatrix(theta) {
        const rad = (theta * Math.PI) / 180;
        return [
            1, 0, 0, 0,
            0, Math.cos(rad), -Math.sin(rad), 0,
            0, Math.sin(rad), Math.cos(rad), 0,
            0, 0, 0, 1
        ];
    }

    function rotationYMatrix(theta) {
        const rad = (theta * Math.PI) / 180;
        return [
            Math.cos(rad), 0, Math.sin(rad), 0,
            0, 1, 0, 0,
            -Math.sin(rad), 0, Math.cos(rad), 0,
            0, 0, 0, 1
        ];
    }

    function rotationZMatrix(theta) {
        const rad = (theta * Math.PI) / 180;
        return [
            Math.cos(rad), -Math.sin(rad), 0, 0,
            Math.sin(rad), Math.cos(rad), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    function scalingMatrix(sx, sy, sz) {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ];
    }

    function translationMatrix(tx, ty, tz) {
        return [
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1
        ];
    }

    // Rotation matrices
    const rotateX = rotationXMatrix(30);
    const rotateY = rotationYMatrix(45);
    const rotateZ = rotationZMatrix(60);

    // Scaling matrix
    const scale = scalingMatrix(0.5, 0.5, 0.5);

    // Translation matrix
    const translate = translationMatrix(0.3, -0.25, 0);

    // Multiply matrices in order: Rz * Ry * Rx * S * T
    function multiplyMatrices(a, b) {
        const result = new Array(16).fill(0);
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                result[row * 4 + col] =
                    a[row * 4 + 0] * b[0 * 4 + col] +
                    a[row * 4 + 1] * b[1 * 4 + col] +
                    a[row * 4 + 2] * b[2 * 4 + col] +
                    a[row * 4 + 3] * b[3 * 4 + col];
            }
        }
        return result;
    }

    // Combine transformations: Rz * Ry * Rx * S * T
    let modelViewMatrix = multiplyMatrices(rotateZ, rotateY);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotateX);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, scale);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, translate);

    // Return the final matrix as a Float32Array
    return new Float32Array(modelViewMatrix);
}

/**
 * 
 * @TASK3 Ask CHAT-GPT to animate the transformation calculated in 
 * task2 infinitely with a period of 10 seconds. 
 * First 5 seconds, the cube should transform from its initial 
 * position to the target position.
 * The next 5 seconds, the cube should return to its initial position.
 */
function getPeriodicMovement(startTime) {
    // this metdo should return the model view matrix at the given time
    // to get a smooth animation
        // Helper function for interpolation between two values
        function lerp(a, b, t) {
            return a * (1 - t) + b * t;
        }
    
        // Helper function for interpolating two matrices
        function lerpMatrix(matrixA, matrixB, t) {
            const result = new Array(16);
            for (let i = 0; i < 16; i++) {
                result[i] = lerp(matrixA[i], matrixB[i], t);
            }
            return result;
        }
    
        // Task 2’den alınan hedef dönüşüm matrisi
        const targetMatrix = new Float32Array([
            0.17677669, -0.28661165, 0.36959946, 0.3,
            0.30618623, 0.36959946, 0.14016505, -0.25,
           -0.35355338, 0.17677669, 0.30618623, 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);
    
        // Başlangıç matrisi (Identity Matrix)
        const initialMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    
        // Zaman hesaplama ve faz döngüsü
        const elapsed = (performance.now() - startTime) / 1000;
        const phase = elapsed % 10;
    
        // Interpolasyon faktörü: İlk 5 saniye ileri, sonraki 5 saniye geri
        const t = phase <= 5 ? phase / 5 : (10 - phase) / 5;
    
        // Başlangıç ve hedef matrisi arasında düzgün interpolasyon
        const interpolatedMatrix = lerpMatrix(initialMatrix, targetMatrix, t);
    
        // Float32Array olarak döndür
        return new Float32Array(interpolatedMatrix);
    }
    
    // Animasyon fonksiyonu
    function animateCube() {
        const startTime = performance.now();
    
        function render() {
            // Her karede güncellenmiş dönüşüm matrisini al
            const modelViewMatrix = getPeriodicMovement(startTime);
    
            // Render işlemini burada yap (örneğin WebGL ile kullanılabilir)
            console.log(modelViewMatrix);
    
            // Animasyonu sürdürmek için requestAnimationFrame kullan
            requestAnimationFrame(render);
        }
    
        // Animasyonu başlat
        render();
}



