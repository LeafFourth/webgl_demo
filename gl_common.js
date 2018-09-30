function createProgram(vSource, fSource)
{ 
	const vertexShader = loadShader(gl.VERTEX_SHADER, vSource);
	const fsShader = loadShader(gl.FRAGMENT_SHADER, fSource);

	var glProgram = gl.createProgram();
	gl.attachShader(glProgram, vertexShader);
	gl.attachShader(glProgram, fsShader);
	gl.linkProgram(glProgram);

	if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
		alert("program error");
			
		return null;
	}

	return glProgram;
}

function loadShader(type, source)
{
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("shader error");
			
		return null;
	}
	return shader;
}

function createGLArrayBuffer(dataArray)
{
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataArray), gl.STATIC_DRAW);
  
  return buffer;
}

function createGLIndexBuffer(dataArray)
{
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dataArray), gl.STATIC_DRAW);
  
  return buffer;
}

function createProjectionMatrix(angle)
{
  if (angle > 160)
    return null;
  
  const ret  = createIdentityMatrix();
	const angleRad = angle2Rad(angle);
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	
	perspective(ret, angleRad, aspect, 1, 100);
  
  return ret;
}

function loadTexure(url)
{
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
	
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);
	
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	
	const image = new Image();
	image.onload = function() {
		//alert("123");
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	
	}
	image.src = url;
//	image.crossOrigin = "anonymous";

	return texture;
	
}

function getVar(base, index)
{
	var pend = index.toString();
		
	var val = base + index.toString();
	return eval(val);
}

function angle2Rad(angle)
{
  return angle * Math.PI / 180;
}