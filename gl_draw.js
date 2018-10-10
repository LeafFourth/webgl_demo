var gl = null;

var simpleProgram = null;
var simpleVBuffer = null;
var simpleCBuffer = null;


var mainProgram = null;

var mainViewMatrix = null;
var mainWorldMatrix = null;
var mainProjectMatrix = null;

var mainVBuffer = null;
var mainTexCoorBuffer = null;
var mainNormalBuffer = null;
var mainTexture = null;
var mainDrawIndices = null;

var originVec0 = null;
var originVec1 = null;

var faceTrace0_0 = null;
var faceTrace1_0   = null;

var faceTrace0_1 = null;
var faceTrace1_1   = null;

var faceTrace0_2 = null;
var faceTrace1_2   = null;

var faceTrace0_3 = null;
var faceTrace1_3   = null;

var faceTrace0_4 = null;
var faceTrace1_4   = null;

var faceTrace0_5 = null;
var faceTrace1_5   = null;


var textureImage0 = null;
var textureImage1 = null;
var textureImage2 = null;
var textureImage3 = null;
var textureImage4 = null;
var textureImage5 = null;


var bkgProgram = null;

var bkgStatus = 0.0;
var increasePiece = 0.01;

var bkgStencilVBuffer = null;

var bkgVBuffer = null;


function initGL()
{
  const canvas = document.getElementById("model");
  gl = canvas.getContext("webgl", {stencil:true} );
  
  if (!gl) {
    alert("WebGL get context error");
  }
  
  if (typeof bianliang != "undefined" && showMode == "simple") {
    initSimpleGL();
  } else {
    initMainGL();
    initBkgGL();
  }
  
  function render()
  {
    drawScene();
    requestAnimationFrame(render);
  }
  
  render();
  
  setInterval("onBkgAnimate()", 50);
  
}

function initSimpleGL()
{
  simpleProgram = createProgram(simpleVShader, simpleFShader);
  
  simpleVBuffer = createGLArrayBuffer(simpleVertex);
  simpleCBuffer = createGLArrayBuffer(simpleColor);
}

function initMainGL()
{
  mainProgram = createProgram(texture2DVShader, texture2DFShader);
  
  mainProjectMatrix = createProjectionMatrix(90);
  mainWorldMatrix = createIdentityMatrix();
  translate(mainWorldMatrix, mainWorldMatrix, [0.0, 0.0, -8]);
  mainViewMatrix = createIdentityMatrix();
  
  mainTexCoorBuffer = createGLArrayBuffer(textureCoor);
  mainVBuffer = createGLArrayBuffer(vertexs);
  mainNormalBuffer = createGLArrayBuffer(vertexNormals);
  mainDrawIndices = createGLIndexBuffer(indices);
  
  textureImage0 = loadTexure("./0.png");
  textureImage1 = loadTexure("./1.png");
  textureImage2 = loadTexure("./2.png");
  textureImage3 = loadTexure("./3.png");
  textureImage4 = loadTexure("./4.png");
  textureImage5 = loadTexure("./5.png");
  
  initOriginNormals();
}

function initBkgGL()
{
  bkgProgram = createProgram(bkgVShader, bkgFShader);
  
  bkgStencilVBuffer = createGLArrayBuffer(bkgStencilVertex);
  bkgVBuffer = createGLArrayBuffer(bkgSquareVertex);
} 

function drawScene()
{
  clearScene();
  if (typeof bianliang != "undefined" && showMode == "simple") {
    drawSimpleScene();
  } else {
    drawMainScene();
    drawBkgScene();
  }
}

function clearScene()
{
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
  
  // Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
}

function drawSimpleScene()
{
  gl.useProgram(simpleProgram);
  
  const vertexLoca = gl.getAttribLocation(simpleProgram, "vertex");
  gl.bindBuffer(gl.ARRAY_BUFFER, simpleVBuffer);
	gl.vertexAttribPointer(vertexLoca, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vertexLoca);
  
  const colorLoca = gl.getAttribLocation(simpleProgram, "color");
  gl.bindBuffer(gl.ARRAY_BUFFER, simpleCBuffer);
	gl.vertexAttribPointer(colorLoca, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(colorLoca);
  
  const mode = gl.TRIANGLES;
	const first = 0;
  const count = 3;
  gl.drawArrays(mode, first, count);
}

function drawMainScene()
{
  gl.useProgram(mainProgram);
  
  const vertexLoca = gl.getAttribLocation(mainProgram, "vertex");
  gl.bindBuffer(gl.ARRAY_BUFFER, mainVBuffer);
	gl.vertexAttribPointer(vertexLoca, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vertexLoca);
  
  const texCoorLoca = gl.getAttribLocation(mainProgram, "texCoor");
  gl.bindBuffer(gl.ARRAY_BUFFER, mainTexCoorBuffer);
	gl.vertexAttribPointer(texCoorLoca, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(texCoorLoca);
  
  const normalLoca = gl.getAttribLocation(mainProgram, "vertexNormal");
  gl.bindBuffer(gl.ARRAY_BUFFER, mainNormalBuffer);
	gl.vertexAttribPointer(normalLoca, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(normalLoca);
  
  
  const lightDirLoca = gl.getUniformLocation(mainProgram, "lightDir");
  const lightDir = new Float32Array(3);
  lightDir[0] = 0;
  lightDir[1] = 0;
  lightDir[2] = -1;
  gl.uniform3fv(lightDirLoca, lightDir);
  
  const projectLoca = gl.getUniformLocation(mainProgram, "projectMatrix");
	gl.uniformMatrix4fv(projectLoca, false, mainProjectMatrix);
	//console.log("projectMatrix:" + projectMatrix);
	
	
	
	const modelLoca = gl.getUniformLocation(mainProgram, "worldMatrix");
	gl.uniformMatrix4fv(modelLoca, false, mainWorldMatrix);
  
  const worldLoca = gl.getUniformLocation(mainProgram, "viewMatrix");
	gl.uniformMatrix4fv(worldLoca, false, mainViewMatrix);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mainDrawIndices);
	const textureUniformLoca = gl.getUniformLocation(mainProgram, "sampler");
	for (var i = 0; i < 6; ++i) 
	{
		updateTexture(i, textureUniformLoca);
		
		const vertexCount = 6;
		const type = gl.UNSIGNED_SHORT;
		const offset = i * 6 *2;
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	}
  
}

function drawBkgScene()
{
  drawStencilScene();
  
  gl.disable(gl.STENCIL_TEST); //禁用模板测试
}

function updateTexture(index, texLoca)
{
	gl.activeTexture(gl.TEXTURE0);
	
	var tex = getVar("textureImage", index);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	
/* 	if (index == 0) {
		gl.bindTexture(gl.TEXTURE_2D, textureImage0);
	} else if (index == 1) {
		gl.bindTexture(gl.TEXTURE_2D, textureImage1);
	} else if (index == 2) {
		gl.bindTexture(gl.TEXTURE_2D, textureImage2);
	} else if (index == 3) {
		gl.bindTexture(gl.TEXTURE_2D, textureImage3);
	} else if (index == 4) {
		gl.bindTexture(gl.TEXTURE_2D, textureImage4);
	} else if (index == 5) {
		gl.bindTexture(gl.TEXTURE_2D, textureImage5);
	} */
	
	gl.uniform1i(texLoca, 0);
}



function rotateMainModel(bPoint, ePoint)
{
  if (typeof bianliang != "undefined" && showMode == "simple") {
    return;
  }
  
  var v = createNullVec4();
  subVec(v, bPoint, ePoint, 2);
  
  console.log(v);
  v[2] = 0;
  
  if (v[0] == 0 && v[1] == 0) {
    return;
  }
  
  rotateZ(v, v, [0, 0, 0], angle2Rad(90));
  
  console.log(v);
  
  var dist = distance(v, [0, 0, 0]);
  var angle = angle2Rad(dist);
  console.log(angle);
  var rotateMat = createIdentityMatrix();
  console.log(rotateMat);
  rotate(rotateMat, rotateMat, angle, v);
  
  console.log(rotateMat);
  
  multiply(mainViewMatrix, rotateMat, mainViewMatrix);
  
  updateNormalTraces(rotateMat);
}

function glLog(context)
{
  console.log(context);
}

function onGLDClick(x, y)
{
  if (typeof bianliang != "undefined" && showMode == "simple") {
    return;
  }
  
  var trans = createIdentityMatrix();
  var point = createNullVec4();
  var near  = createNullVec4();
  var far   = createNullVec4();
  var tmp   = createNullVec4();
  
  var tmpMt = createIdentityMatrix();
  
  invert(tmpMt, mainProjectMatrix);
  multiply(trans, tmpMt, trans);
  //multiply(trans, trans, tmpMt);
  
  
  invert(tmpMt, mainWorldMatrix);
  multiply(trans, tmpMt, trans);
   
  invert(tmpMt, mainViewMatrix);
  multiply(trans, tmpMt, trans);
  


  near[0] = x;
  near[1] = y;
  near[2] = -1;
  near[3] = 1;
  
  transformMat4(near, near, trans);

  far[0] = x;
  far[1] = y;
  far[2] = 1;
  far[3] = 1;
  
  transformMat4(far, far, trans);
  
  checkPick(near, far);
  return;
}

function checkPick(nearPoint, farPoint)
{
  var dista = 0;
  var face = -1;
  var result = createNullVec4();
  
  var nearP = createNullVec4();
  var farP = createNullVec4();
  
  homoCoor2NormalCoor(nearP, nearPoint);
  homoCoor2NormalCoor(farP, farPoint);
  
  console.log("nearP:" + nearP);
  console.log("farP:" + farP);
  
  for (var i = 0; i < 6; ++i) {
    const base = 6 * i;
    
    var pA = vertexs.slice(indices[base + 0] * 3, indices[base + 0] * 3 + 3);
    var pB = vertexs.slice(indices[base + 1] * 3, indices[base + 1] * 3 + 3);
    var pC = vertexs.slice(indices[base + 2] * 3, indices[base + 2] * 3 + 3);
    
    console.log("pA:" + pA);
    console.log("pB:" + pB);
    console.log("pC:" + pC);
    
    if (intersectSurfaceLine(pA, pB, pC, nearP, farP, result)) {
      if (face == -1) {
        face = i;
        dista = distance(nearP, result);

      } else {
        var d = distance(nearP, result);
        if (d < dista) {
          dista = d;
          face = i;
        }
      }
      
      continue;
    }
    
    pA = vertexs.slice(indices[base + 3] * 3, indices[base + 3] * 3 + 3);
    pB = vertexs.slice(indices[base + 4] * 3, indices[base + 4] * 3 + 3);
    pC = vertexs.slice(indices[base + 5] * 3, indices[base + 5] * 3 + 3);
    
    if (intersectSurfaceLine(pA, pB, pC, nearP, farP, result)) {
      if (face == -1) {
        face = i;
        dista = distance(nearP, result);
        //alert("click 3 :" + i);
      } else {
        const d = distance(nearP, result);
        if (d < dista) {
          dista = d;
          face = i;
          
        }
      }
    }
  }
  
  if (face != -1) {
    openChapter(face);
  }
}

function initOriginNormals()
{
  originVec0 = createNullVec4();
  originVec0[2] = 1;
  originVec1 = createNullVec4();
  originVec1[0] = 1;

  faceTrace0_0 = createNullVec4();
  faceTrace0_0[2] = 1;
  faceTrace1_0   = createNullVec4();
  faceTrace1_0[0] = 1;

  faceTrace0_1 = createNullVec4();
  faceTrace0_1[2] = -1;
  faceTrace1_1   = createNullVec4();
  faceTrace1_1[0] = -1;
  

  faceTrace0_2 = createNullVec4();
  faceTrace0_2[0] = 1;
  faceTrace1_2   = createNullVec4();
  faceTrace1_2[2] = -11;

  faceTrace0_3 = createNullVec4();
  faceTrace0_3[0] = -1;
  faceTrace1_3   = createNullVec4();
  faceTrace1_3[1] = -1;

  faceTrace0_4 = createNullVec4();
  faceTrace0_4[1] = 1;
  faceTrace1_4   = createNullVec4();
  faceTrace1_4[0] = -1;

  faceTrace0_5 = createNullVec4();
  faceTrace0_5[1] = -1;
  faceTrace1_5   = createNullVec4();
  faceTrace1_5[0] = 1;
}

function revertFace(index)
{
  if (typeof bianliang != "undefined" && showMode == "simple") {
    return;
  }
  
  console.log("revert to " + index);
  if (index < 0 || index > 6) {
	  return;
  }
  
  
  const trace0 = getVar("faceTrace0_", index);
  const trace1 = getVar("faceTrace1_", index);
  
  
  //转动目标面的法线到原始值
  {
    
    const trans = createIdentityMatrix();
    const ang = angle(trace0, originVec0);
    var ax = createNullVec4();
    
    cross(ax, trace0, originVec0);
    
    if ((ang < 0.1 && ang > -0.1) || (ang < (Math.PI + 0.1) && ang > (Math.PI - 0.1))) {
      const v = someAxis(trace0);
      cross(ax, trace0, v);
    }
    
    console.log('angle:' + ang.toString());
    console.log('axis:' + ax.toString());
    
    rotate(trans, trans, ang, ax);
    multiply(mainViewMatrix, trans, mainViewMatrix);
    
    
    updateNormalTraces(trans);
    
    console.log(trace0);
    console.log(trace1);
  }
  
  
  //沿着法线转动
  {
    const ang2 = angle(trace1, originVec1);
    const ax2 = createNullVec4();
    cross(ax2, trace1, originVec1);
    
    if (ang2 < 0.1 && ang2 > -0.1) {
      console.log("normal no rotate");
      return;  //没有夹角
    } else if (ang2 < (Math.PI + 0.1) && ang2 > (Math.PI - 0.1)) {  //180度
      console.log("normal rotate 180");
      const trans2 = createIdentityMatrix();
      rotate(trans2, trans2, ang2, trace0);
      multiply(mainViewMatrix, trans2, mainViewMatrix);
      updateNormalTraces(trans2);
      
      return;
    }
    
    const normal = createNullVec4();
    normal[0] = trace0[0];
    normal[1] = trace0[1];
    normal[2] = trace0[2];
    const ang3 = angle(normal, ax2);
    if (ang3 > Math.PI / 2) {  //小于90度，绕着法线转，大于90度，绕着法线的反方向转
      normal[0] = -trace0[0];
      normal[1] = -trace0[1];
      normal[2] = -trace0[2];
    }
    
    console.log('angle:' + ang2.toString());
    console.log('axis:' + ax2.toString());
    
    const trans2 = createIdentityMatrix();
    rotate(trans2, trans2, ang2, normal);
    multiply(mainViewMatrix, trans2, mainViewMatrix);
    updateNormalTraces(trans2);
  }
  
}

function updateNormalTraces(mt)
{
  for (var i = 0; i < 6; ++i) {
    const trace0 = getVar("faceTrace0_", i);
    const trace1 = getVar("faceTrace1_", i);
    
    transformMat4(trace0, trace0, mt);
  
    transformMat4(trace1, trace1, mt);
  }
}


function updateMainViewAngle(angle)
{
  if (typeof bianliang != "undefined" && showMode == "simple") {
    return;
  }
  
  mainProjectMatrix = createProjectionMatrix(angle);
}

function prepareStencil()
{   
  const sMask = 1;
  
  gl.clearStencil(0);
  gl.stencilMask(sMask);  //允许更改模板缓存以能够重置模板缓存
  gl.clear(gl.STENCIL_BUFFER_BIT);
  
  gl.colorMask(false, false, false, false);
  gl.depthMask(false);
  gl.disable(gl.DEPTH_TEST);
  
  gl.enable(gl.STENCIL_TEST);
  gl.stencilFunc(gl.ALWAYS, 1, sMask);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
}

function prepareStencilDraw()
{
  gl.colorMask(true, true, true, true);
  gl.depthMask(true);
  gl.enable(gl.DEPTH_TEST);
  
  gl.enable(gl.STENCIL_TEST);
  gl.stencilFunc(gl.EQUAL, 1, 1);
  gl.stencilMask(0);  //模板区域已经生成，禁止更改模板值
  //gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
}

function onBkgAnimate()
{
  bkgStatus += increasePiece;
  if (bkgStatus > 1.0) {
    bkgStatus = 0.0;
  }
}


function drawStencilScene()
{  
  gl.useProgram(bkgProgram);
  
  const vertexLoca = gl.getAttribLocation(bkgProgram, "vertex");
  const colorLoca = gl.getUniformLocation(bkgProgram, "color");
  const matLoca = gl.getUniformLocation(bkgProgram, "viewMatrix");
  
  const color = [
      bkgSquareColor[0] + bkgStatus, 
      bkgSquareColor[1] + bkgStatus, 
      bkgSquareColor[2] - bkgStatus, 
      1.0];
      
  if (bkgSquareColor[i] > 1.0) {
    bkgSquareColor[i] -= 1.0;
  }
  
  if (bkgSquareColor[i] > 1.0) {
    bkgSquareColor[i] -= 1.0;
  }
  
  if (bkgSquareColor[i] < 0.0) {
    bkgSquareColor[i] += 1.0;
  }  
  
  gl.uniform4fv(colorLoca, color);
  
	
  const mode = gl.TRIANGLES;
	const first = 0;
  const viewMatrix = createIdentityMatrix();
  for (var i = 0; i < 4; ++i) {
    
    prepareStencil();
    
    const mat = createIdentityMatrix();
    rotate(mat, viewMatrix, angle2Rad(i * 90), [0, 0, 1]);
    
    gl.uniformMatrix4fv(matLoca, false, mat);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bkgStencilVBuffer);
    gl.vertexAttribPointer(vertexLoca, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexLoca);
    gl.drawArrays(mode, first, 3);
    
    
    prepareStencilDraw();
    
    const mat2 = createIdentityMatrix();
    const matTmp = createIdentityMatrix();
    translate(matTmp, viewMatrix, [bkgStatus, 0.0, 0.0]);
    rotate(mat2, mat2, angle2Rad(i * 90), [0, 0, 1]);
    multiply(mat2, mat2, matTmp);
    
    gl.uniformMatrix4fv(matLoca, false, mat2);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bkgVBuffer);
    gl.vertexAttribPointer(vertexLoca, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexLoca);
    
    gl.drawArrays(mode, first, 6);
  }
}

function changViewPort(width, height)
{
  gl.viewport(0, 0, width, height);
}