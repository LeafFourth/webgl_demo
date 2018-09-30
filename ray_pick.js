const zero_guard = 0.00001;

function rayPickLog(val)
{
  //return;
  
  console.log(val);
}

function test1()
{
  const pA = createNullVec4();
  const pB = createNullVec4();
  const pC = createNullVec4();
  const endA = createNullVec4();
  const endB = createNullVec4();
  const out = createNullVec4();
  
  pA[0] = 0;
  pA[1] = 0;
  pA[2] = 0;
  
  pB[0] = 2;
  pB[1] = 0;
  pB[2] = 2;
  
  pC[0] = 0;
  pC[1] = 2;
  pC[2] = 2;
  
  endA[0] = 0;
  endA[1] = 0;
  endA[2] = 2;
  
  endB[0] = 2;
  endB[1] = 2;
  endB[2] = 0;
  
  if (intersectSurfaceLine(pA, pB, pC, endA, endB, out)) {
    rayPickLog(out);
  } else {
    rayPickLog("error");
  }
}


function test2()
{
  const pA = createNullVec4();
  const pB = createNullVec4();
  const pC = createNullVec4();
  const endA = createNullVec4();
  const endB = createNullVec4();
  const out = createNullVec4();
  
  pA[0] = 2;
  pA[1] = 0;
  pA[2] = 1;
  
  pB[0] = 2;
  pB[1] = 0;
  pB[2] = 2;
  
  pC[0] = 0;
  pC[1] = 2;
  pC[2] = 2;
  
  endA[0] = 0;
  endA[1] = 0;
  endA[2] = 2;
  
  endB[0] = 2;
  endB[1] = 2;
  endB[2] = 0;
  
  if (intersectSurfaceLine(pA, pB, pC, endA, endB, out)) {
    rayPickLog(out);
  } else {
    rayPickLog("error");
  }
}

//pA、pB、pC是三个三维点,确定一个三角形
//endA和endB是两个三维点，确定一条线段
//如果存在焦点，则返回true，out为交点
function intersectSurfaceLine(pA, pB, pC, endA, endB, out)
{
  var ret = false;
  const surfaceNornal = createNullVec4();
  const side0 = createNullVec4();
  const side1 = createNullVec4();
  
  const nLine = createNullVec4();

  getNormal(pA, pB, side0);
  getNormal(pA, pC, side1);

  cross(surfaceNornal, side0, side1);
  
  if (surfaceNornal[0] == 0 && surfaceNornal[1] == 0 && surfaceNornal[2] == 0) {
    rayPickLog("surface error");
    return false;
  }
  
  getNormal(endA, endB, nLine);
  
  rayPickLog("surface normal:" + surfaceNornal);
  rayPickLog("line normal:" + nLine);
  
  if ((nLine[0] * surfaceNornal[0]
      + nLine[1] * surfaceNornal[1]
      + nLine[2] * surfaceNornal[2]) == 0) {
    rayPickLog("surface and line parallel");    
    
    return false;   //直线和面平行
  }
  
  var baseScale = -1;
  baseScale = getBaseScale(nLine);
  if (baseScale < 0) {
    rayPickLog("line error");  
    return false;
  }
  
  rayPickLog("getBaseScale:" + baseScale.toString());
  
  ret = intersect(surfaceNornal, pA, nLine, endA, baseScale, out);
  
  if (!ret)
    return false;
  
  rayPickLog("out:" + out);
  ret = surfacePointInSurface(pA, pB, pC, out);
  
  rayPickLog("in surface:" + ret);
  return ret;
}

function getNormal(pA, pB, out)
{
  out[0] = pB[0] - pA[0];
  out[1] = pB[1] - pA[1];
  out[2] = pB[2] - pA[2];
}

function getBaseScale(nAB)
{
    //找到不为0的偏量
  var baseScale = null;  //0 for x; 1 for y, 2 for z;
  while(1) {
    if (nAB[0] != 0) {
      baseScale = 0;
      
      if (nAB[0] > -zero_guard && nAB[0] < zero_guard) {
      } else {
        break;
      }
    }
    
    if (nAB[1] != 0) {
      if (baseScale == null) {
        baseScale = 1;
      }
      
      if (nAB[1] > -zero_guard && nAB[1] < zero_guard) {
      } else {
        baseScale = 1;
        break;
      }
    }
    
    if (nAB[2] != 0) {
      if (baseScale == null) {
        baseScale = 2;
      }
      
      if (nAB[2] > -zero_guard && nAB[2] < zero_guard) {
      } else {
        baseScale = 2;
        break;
      }
    }
    
    break;
  }
  
  if (baseScale == null)
    return -1;
    
  return baseScale;
}

function intersect(nSurface, point, nLine, linePoint, baseScale, out)
{
  var ret = false;
  if (baseScale == 0) {
    ret = xBaseInsect(nSurface, point, nLine, linePoint, out);
  } else if (baseScale == 1) {
    ret = yBaseInsect(nSurface, point, nLine, linePoint, out);
  } else if (baseScale == 2) {
    ret = zBaseInsect(nSurface, point, nLine, linePoint, out);
  }
  
  return ret;
}

function xBaseInsect(nSurface, point, nLine, linePoint, out)
{
  var yK = (nLine[1] / nLine[0]);
  var yT = (nLine[1] / nLine[0]) * (-linePoint[0]) + linePoint[1];
  
  var zK = (nLine[2] / nLine[0]);
  var zT = (nLine[2] / nLine[0]) * (-linePoint[0]) + linePoint[2];
  
  var surfaceK = nSurface[0] + yK * nSurface[1] + zK * nSurface[2];
  var surfaceT = (-point[0]) * nSurface[0] + (yT - point[1]) * nSurface[1] + (zT - point[2]) * nSurface[2];
  
  if (surfaceK == 0)
    return false;
  
  out[0] = (-surfaceT) / surfaceK;
  out[1] = yK * out[0] + yT;
  out[2] = zK * out[0] + zT;
  
  return true;
}

function yBaseInsect(nSurface, point, nLine, linePoint, out)
{
  var xK = (nLine[0] / nLine[1]);
  var xT = (nLine[0] / nLine[1]) * (-linePoint[1]) + linePoint[0];
  
  rayPickLog("y base");
  
  var zK = (nLine[2] / nLine[1]);
  var zT = (nLine[2] / nLine[1]) * (-linePoint[1]) + linePoint[2];
  
  var surfaceK = xK * nSurface[0] + nSurface[1] + zK * nSurface[2];
  var surfaceT = (xT - point[0]) * nSurface[0] + (-point[1]) * nSurface[1] + (zT - point[2]) * nSurface[2];
  
  if (surfaceK == 0)
    return false;
  
  out[1] = (-surfaceT) / surfaceK;
  out[0] = xK * out[1] + xT;
  out[2] = zK * out[1] + zT;
  
  return true;
}

function zBaseInsect(nSurface, point, nLine, linePoint, out)
{
  var xK = (nLine[0] / nLine[2]);
  var xT = (nLine[0] / nLine[2]) * (-linePoint[2]) + linePoint[0];
  
  rayPickLog("z base");
  
  var yK = (nLine[1] / nLine[2]);
  var yT = (nLine[1] / nLine[2]) * (-linePoint[2]) + linePoint[1];
  
  var surfaceK = xK * nSurface[0] + yK * nSurface[1] + nSurface[2];
  var surfaceT = (xT - point[0]) * nSurface[0] + (yT - point[1]) * nSurface[1] + (-point[2]) * nSurface[2];
  
  if (surfaceK == 0)
    return false;
  
  out[2] = (-surfaceT) / surfaceK;
  out[0] = xK * out[2] + xT;
  out[1] = yK * out[2] + yT;
  return true;
}

//面内的点，从垂直于x、y或z的面上(二维上)判断点在面以内
function surfacePointInSurface(pA, pB, pC, point)
{
  var x1 = pB[0] - pA[0];
  var y1 = pB[1] - pA[1];
  var z1 = pB[2] - pA[2];
  
  var x2 = pC[0] - pA[0];
  var y2 = pC[1] - pA[1];
  var z2 = pC[2] - pA[2];
  
  var x3 = pC[0] - pB[0];
  var y3 = pC[1] - pB[1];
  var z3 = pC[2] - pB[2];
  
  var ret = false;
  
  var base = null;  //
  
  while (1) {
    if ((y1 != 0 || z1 != 0) &&
        (y2 != 0 || z2 != 0) &&
        (y3 != 0 || z3 != 0)) {
      base = 0;  //yz面
      rayPickLog("check in yz");
      break;
    }
    
    if ((x1 != 0 || z1 != 0) &&
        (x2 != 0 || z2 != 0) &&
        (x3 != 0 || z3 != 0)) {
      base = 1;  //xz面
      rayPickLog("check in xz");
      break;
    }
    
    if ((x1 != 0 || y1 != 0) &&
        (x2 != 0 || y2 != 0) &&
        (x3 != 0 || y3 != 0)) {
      base = 2;  //xy面
      rayPickLog("check in xy");
      break;
    }
    
    rayPickLog("check in no face");
    
    break;
  }

  if (base == null)
    return ret;
  
  if (base == 0) {
    //xy 面
    ret = yzPointInSurface2D(pA, pB, pC, point);
  } else if (base == 1) {
    ret = xzPointInSurface2D(pA, pB, pC, point);
  } else if (base == 2) {
    ret = xyPointInSurface2D(pA, pB, pC, point);
  }
  
  return ret;
}

function xyPointInSurface2D(pA, pB, pC, p)
{
  var pointA = createNullVec4();
  var pointB = createNullVec4();
  var pointC = createNullVec4();
  var point  = createNullVec4();
  
  pointA[0] = pA[0];
  pointA[1] = pA[1];
  
  pointB[0] = pB[0];
  pointB[1] = pB[1];
  
  pointC[0] = pC[0];
  pointC[1] = pC[1];
  
  point[0]  = p[0];
  point[1]  = p[1];
  
  return pointInSurface2D(pointA, pointB, pointC, point);
}

function yzPointInSurface2D(pA, pB, pC, p)
{
  var pointA = createNullVec4();
  var pointB = createNullVec4();
  var pointC = createNullVec4();
  var point  = createNullVec4();
  
  pointA[0] = pA[1];
  pointA[1] = pA[2];
  
  pointB[0] = pB[1];
  pointB[1] = pB[2];
  
  pointC[0] = pC[1];
  pointC[1] = pC[2];
  
  point[0]  = p[1];
  point[1]  = p[2];
  
  return pointInSurface2D(pointA, pointB, pointC, point);
}

function xzPointInSurface2D(pA, pB, pC, p)
{
  var pointA = createNullVec4();
  var pointB = createNullVec4();
  var pointC = createNullVec4();
  var point  = createNullVec4();
  
  pointA[0] = pA[0];
  pointA[1] = pA[2];
  
  pointB[0] = pB[0];
  pointB[1] = pB[2];
  
  pointC[0] = pC[0];
  pointC[1] = pC[2];
  
  point[0]  = p[0];
  point[1]  = p[2];
  
  return pointInSurface2D(pointA, pointB, pointC, point);
}

//点P在三角形内，则如果 "AB的向量*k + 则AC的向量*t = AP的向量"， 则 "k >=0, t >= 0, k + t <= 1"
function pointInSurface2D(pA, pB, pC, p)
{
  rayPickLog("pointInSurface2D pA:" + pA);
  rayPickLog("pointInSurface2D pB:" + pB);
  rayPickLog("pointInSurface2D pC:" + pC);
  rayPickLog("pointInSurface2D p:" + p);
  
  var AB = createNullVec4();
  var AC = createNullVec4();
  var AP = createNullVec4();
  var k = 0;
  var t = 0;
  
  AB[0] = pB[0] - pA[0];
  AB[1] = pB[1] - pA[1];
  
  AC[0] = pC[0] - pA[0];
  AC[1] = pC[1] - pA[1];
  
  AP[0] = p[0] - pA[0];
  AP[1] = p[1] - pA[1];
  
  //k AB[0] + t AC[0] = AP[0];
  //k AB[1] + t AC[1] = AP[1];
  
  var getted = false;
  while (1) {
    
    if (AB[0] == 0) {
      //如果 AB[0] == 0;
      
      if (AC[0] != 0) {
        //如果 AC[0] != 0;
        
        t = AP[0] / AC[0];
        
        if (AB[1] != 0) {
          //
          
          k = (AP[1] - t  * AC[1]) / AB[1];
          getted = true;
          break;
        }
        
        //AB[1] == 0
        const val = t * AC[1] - AP[1];
        if (val > -zero_guard && val < zero_guard) {
          //t AC[1] == AP[1]
          
          k = 0;
          getted = true;
          break;
        }
        
        //无解
        break;
        
      }
      
      
      //如果 AC[0] == 0;则只能通过"k AB[1] + t AC[1] = AP[1]" 求解
      
      if (AP[0] < -zero_guard && AP[0] > zero_guard) {
        //AP[0] != 0,使得"k AB[0] + t AC[0] = AP[0]" 左右不平等，无解
        break;
      }
        
      //通过"k AB[1] + t AC[1] = AP[1]" 求解
      if (AB[1] == 0) {
        k = 0;
        
        if (AC[1] != 0) {
          t = AP[1] / AC[1];
          
          getted = true;
          break;
        }
        
        //AC[1] == 0
        if (AP[1] < -zero_guard && AP[1] > zero_guard) {
          //AP[1] != 0,使得"k AB[1] + t AC[1] = AP[1]" 左右不平等，无解
          break;
        }
        t = 0;
        getted = true;
        break;
      }
           
      //如果 AB[1] != 0
      
      if (AC[1] == 0) {
        k = AP[1] / AB[1];        
        t = 0;
        
        getted = true;
        break;
      }
      
      //AC[1] != 0, 假设AC[1] == 0, 求之中一个解(此时应该是两条线重合了)
      k = AP[1] / AB[1];        
      t = 0;
      
      getted = true;
      break;
    }
    
    //AB[0] != 0
      
    //据"k AB[0] + t AC[0] = AP[0]", 以t为基换算k
    const kK = (-AC[0]) / AB[0];
    const kT = AP[0] / AB[0];
    
    
    //带入"k AB[1] + t AC[1] = AP[1]"
    const nt = kK * AB[1] + AC[1];
    const val = AP[1] - kT * AB[1];
    
    t = val / nt;
    k = kK * t +kT;
    
    getted = true;
    break;
  }
  
  if (!getted)
    return false;
  
  rayPickLog("in line, t:" + t + ", k:" + k);
  
  if (t >= 0 && k >= 0 && t + k <= 1)
    return true;
  
  return false;
}