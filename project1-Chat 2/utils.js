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
        0.1767767,  0.3061862,  -0.3535534,  0.0,
        0.2866116,  0.3695994,   0.1767767,  0.0,
        0.7391989,  0.2803301,   0.6123724,  0.0,
        0.3,       -0.25,        0.0,        1.0

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
     // Rotasyon açıları (derece cinsinden)
     const angleX = 30;
     const angleY = 45;
     const angleZ = 60;
 
     // Açıları radyan cinsine çevir
     const radX = angleX * Math.PI / 180;
     const radY = angleY * Math.PI / 180;
     const radZ = angleZ * Math.PI / 180;
 
     // Ölçeklendirme faktörleri
     const scaleX = 0.5;
     const scaleY = 0.5;
     const scaleZ = 1; // Z ekseninde ölçeklendirme yoksa 1 olarak alıyoruz
 
     // Öteleme miktarları
     const transX = 0.3;
     const transY = -0.25;
     const transZ = 0; // Z ekseninde öteleme yoksa 0 olarak alıyoruz
 
     // Rotasyon matrisleri
     const cosX = Math.cos(radX);
     const sinX = Math.sin(radX);
 
     const cosY = Math.cos(radY);
     const sinY = Math.sin(radY);
 
     const cosZ = Math.cos(radZ);
     const sinZ = Math.sin(radZ);
 
     // X ekseni etrafında rotasyon matrisi
     const rotX = [
         1,     0,      0,     0,
         0,  cosX,  -sinX,     0,
         0,  sinX,   cosX,     0,
         0,     0,      0,     1
     ];
 
     // Y ekseni etrafında rotasyon matrisi
     const rotY = [
        cosY,    0, sinY,   0,
           0,    1,    0,   0,
       -sinY,    0, cosY,   0,
           0,    0,    0,   1
     ];
 
     // Z ekseni etrafında rotasyon matrisi
     const rotZ = [
        cosZ, -sinZ,   0,   0,
        sinZ,  cosZ,   0,   0,
           0,     0,   1,   0,
           0,     0,   0,   1
     ];
 
     // Ölçeklendirme matrisi
     const scaleMatrix = [
         scaleX,      0,      0,    0,
              0, scaleY,      0,    0,
              0,      0, scaleZ,    0,
              0,      0,      0,    1
     ];
 
     // Öteleme matrisi
     const transMatrix = [
         1,     0,     0,    0,
         0,     1,     0,    0,
         0,     0,     1,    0,
         transX, transY, transZ, 1
     ];
 
     // Matris çarpımı için yardımcı fonksiyon
     function multiplyMatrices(a, b) {
         const result = new Array(16);
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
 
     // Rotasyon matrislerini birleştir (sırasıyla X, Y, Z)
     let rotationMatrix = multiplyMatrices(rotX, rotY);
     rotationMatrix = multiplyMatrices(rotationMatrix, rotZ);
 
     // Rotasyon ve ölçeklendirme matrislerini birleştir
     let transformMatrix = multiplyMatrices(scaleMatrix, rotationMatrix);
 
     // Son olarak öteleme matrisini uygula
     let modelViewMatrix = multiplyMatrices(transMatrix, transformMatrix);
 
     // Sonucu Float32Array formatına dönüştür ve döndür
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
    // Geçen süreyi hesapla
    const currentTime = (Date.now() - startTime) / 1000; // Saniye cinsinden
    const period = 10; // 10 saniyelik periyot
    const timeInPeriod = currentTime % period;

    // Animasyon parametresi (0 ile 1 arasında)
    let alpha;
    if (timeInPeriod <= 5) {
        // İlk 5 saniye: başlangıçtan hedefe
        alpha = timeInPeriod / 5;
    } else {
        // Sonraki 5 saniye: hedeften başlangıca
        alpha = 1 - ((timeInPeriod - 5) / 5);
    }

    // Başlangıç ve hedef dönüşüm değerleri
    // Rotasyon açıları (derece cinsinden)
    const startAngleX = 0;
    const startAngleY = 0;
    const startAngleZ = 0;

    const targetAngleX = 30;
    const targetAngleY = 45;
    const targetAngleZ = 60;

    // Ölçeklendirme faktörleri
    const startScaleX = 1;
    const startScaleY = 1;
    const startScaleZ = 1;

    const targetScaleX = 0.5;
    const targetScaleY = 0.5;
    const targetScaleZ = 1; // Z ekseninde ölçeklendirme yok

    // Öteleme miktarları
    const startTransX = 0;
    const startTransY = 0;
    const startTransZ = 0;

    const targetTransX = 0.3;
    const targetTransY = -0.25;
    const targetTransZ = 0; // Z ekseninde öteleme yok

    // Rotasyon açılarını interpolasyonla hesapla
    const angleX = startAngleX + alpha * (targetAngleX - startAngleX);
    const angleY = startAngleY + alpha * (targetAngleY - startAngleY);
    const angleZ = startAngleZ + alpha * (targetAngleZ - startAngleZ);

    // Ölçeklendirme faktörlerini interpolasyonla hesapla
    const scaleX = startScaleX + alpha * (targetScaleX - startScaleX);
    const scaleY = startScaleY + alpha * (targetScaleY - startScaleY);
    const scaleZ = startScaleZ + alpha * (targetScaleZ - startScaleZ);

    // Öteleme miktarlarını interpolasyonla hesapla
    const transX = startTransX + alpha * (targetTransX - startTransX);
    const transY = startTransY + alpha * (targetTransY - startTransY);
    const transZ = startTransZ + alpha * (targetTransZ - startTransZ);

    // Açıları radyan cinsine çevir
    const radX = angleX * Math.PI / 180;
    const radY = angleY * Math.PI / 180;
    const radZ = angleZ * Math.PI / 180;

    // Rotasyon matrisleri
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);

    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);

    const cosZ = Math.cos(radZ);
    const sinZ = Math.sin(radZ);

    // X ekseni etrafında rotasyon matrisi
    const rotX = [
        1,     0,      0,     0,
        0,  cosX,  -sinX,     0,
        0,  sinX,   cosX,     0,
        0,     0,      0,     1
    ];

    // Y ekseni etrafında rotasyon matrisi
    const rotY = [
       cosY,    0, sinY,   0,
          0,    1,    0,   0,
      -sinY,    0, cosY,   0,
          0,    0,    0,   1
    ];

    // Z ekseni etrafında rotasyon matrisi
    const rotZ = [
       cosZ, -sinZ,   0,   0,
       sinZ,  cosZ,   0,   0,
          0,     0,   1,   0,
          0,     0,   0,   1
    ];

    // Ölçeklendirme matrisi
    const scaleMatrix = [
        scaleX,      0,      0,    0,
             0, scaleY,      0,    0,
             0,      0, scaleZ,    0,
             0,      0,      0,    1
    ];

    // Öteleme matrisi
    const transMatrix = [
        1,     0,     0,    0,
        0,     1,     0,    0,
        0,     0,     1,    0,
        transX, transY, transZ, 1
    ];

    // Matris çarpımı için yardımcı fonksiyon
    function multiplyMatrices(a, b) {
        const result = new Array(16);
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

    // Rotasyon matrislerini birleştir (sırasıyla X, Y, Z)
    let rotationMatrix = multiplyMatrices(rotX, rotY);
    rotationMatrix = multiplyMatrices(rotationMatrix, rotZ);

    // Rotasyon ve ölçeklendirme matrislerini birleştir
    let transformMatrix = multiplyMatrices(scaleMatrix, rotationMatrix);

    // Son olarak öteleme matrisini uygula
    let modelViewMatrix = multiplyMatrices(transMatrix, transformMatrix);

    // Sonucu Float32Array formatına dönüştür ve döndür
    return new Float32Array(modelViewMatrix);
}



