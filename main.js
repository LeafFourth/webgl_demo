var   canvasClicked = false;
var   canvasDClicked = false;
const canvasClassName = "model";

var   xLastScreen = 0;
var   yLastScreen = 0;

var   canvasEle = null;

var   viewAngle = 45;

function init()
{ 
  initEvents();
  
	initGL();
  updateMainViewAngle(viewAngle);
  
  canvasEle = document.getElementById("model");
  //alert(canvasEle.width);
  if (!canvasEle) {
    alert("critical");
    return;
  }
  
  onWindowResize();
}

function initEvents()
{
	window.onmouseup = onWindowMouseUp;
	window.onmousemove = onWindowMouseMove;
  window.onkeydown = onWindowKeyDown;
  
  window.onresize = onWindowResize;
	
	var canvas = document.getElementById(canvasClassName);
	canvas.onmousedown  = onCanvasMouseDown;
  canvas.onmousewheel = onCanvasMouseZoom;
  canvas.ondblclick   = onCanvasDClick;
}

function onWindowMouseDown()
{
}

function onWindowMouseMove(e)
{
	if (canvasClicked) {
    rotateMainModel([xLastScreen, e.screenY], [e.screenX, yLastScreen]);
    
    xLastScreen = e.screenX;
    yLastScreen = e.screenY;
		
	}
}

function onWindowMouseUp()
{
	if (canvasClicked) {
		//console.log("moveup on canvas");
		
		canvasClicked = false;
	}
}

function onCanvasMouseDown(e)
{
	canvasClicked = true;
	xLastScreen = e.screenX;
	yLastScreen = e.screenY;
	
	//console.log("mousedown on canvas");
}

function onCanvasMouseMove()
{
	
}

function onCanvasMouseZoom(e)
{
  if (e.wheelDelta > 0) {
    viewAngle -= 5;
    if (viewAngle < 20) {
      viewAngle = 20;
    }
  } else if (e.wheelDelta < 0) {
    viewAngle += 5;
    
    if (viewAngle > 160) {
      viewAngle = 160;
    }
  }
  
  updateMainViewAngle(viewAngle);
}

function onCanvasDClick(e)
{
  x = e.clientX / canvasEle.width;
  y = e.clientY / canvasEle.height;
  
  x = x * 2 - 1;
  y = 1 - y * 2;
  
  onGLDClick(x, y);
}

function openChapter(index)
{
  var pageName = "chapter-" + index;
  var htmlPage = "./chapters/chapter-" + index + ".html";
  window.open(htmlPage, pageName);
}

function onWindowKeyDown(e)
{
  var index = e.keyCode - 48;
  console.log(index);
  revertFace(index);
}

function onWindowResize()
{ 
  var canvasWidth = document.body.clientWidth;
  if (document.body.clientHeight < canvasWidth) {
    canvasWidth = document.body.clientHeight;
  }
  
  if (canvasWidth < 100) {
    canvasWidth = 100;
  }
  
  canvasEle.width = canvasWidth;
  canvasEle.height = canvasWidth;
  
  changViewPort(canvasWidth, canvasWidth);
}

