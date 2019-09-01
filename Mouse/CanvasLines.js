'use strict';

let ctx;
const MaxNum = Number.MAX_SAFE_INTEGER;

init();

function init() {
  createField();
  drawData();
}

function createField() {
  
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const bodyClientRect = document.body.getBoundingClientRect();
  
  canvas.style.cssText = 'pointer-events:none; position: absolute; left: 0px; top: 0px;';
  canvas.width = bodyClientRect.right;
  canvas.height = bodyClientRect.bottom;
  
  ctx = canvas.getContext('2d');
  
  onElementRectChange(document.body, function (height, width) {
    ctx.canvas.height = height;
    ctx.canvas.width = width;
  });
  
}

function drawGrid(minX, maxX, minY, maxY, color) {
  
  drawLine(true, minX, color);
  drawLine(true, maxX, color);
  drawLine(false, minY, color);
  drawLine(false, maxY, color);
  
}

function drawLine(isX, valueStr, color) {
  
  const moveToX = isX ? valueStr : 0;
  const lineToX = isX ? valueStr : MaxNum;
  const moveToY = isX ? 0 : valueStr;
  const lineToY = isX ? MaxNum : valueStr;
  
  ctx.beginPath();
  ctx.moveTo(moveToX, moveToY);
  ctx.lineTo(lineToX, lineToY);  
  ctx.strokeStyle = color;
  ctx.stroke();
  
}

function clearField() {
  ctx.clearRect(0, 0, MaxNum, MaxNum);
}

function drawData() {
  
  const checkbox = document.getElementById('canvaslinescheckbox');
  
  checkbox.addEventListener('change', function (e) {
    
    clearField();
    
    if (checkbox.checked) {
      document.addEventListener('mousemove', onMouseMove);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
    }
  });
}

function onMouseMove(event) {
  
  clearField();
  
  const mouseLinesColor = '#ffffff';
  const gridColor = '#ff7d7d';
  
  const offsetX = event.pageX;
  const offsetY = event.pageY;
  const pageXOffset = window.pageXOffset;
  const pageYOffset = window.pageYOffset;
  
  drawLine(true, offsetX, mouseLinesColor);
  drawLine(false, offsetY, mouseLinesColor);
  
  const element = document.elementFromPoint(offsetX - pageXOffset, offsetY - pageYOffset);
  
  if (element != null) {
    const clientRect = element.getBoundingClientRect();
    drawGrid(clientRect.left + pageXOffset, clientRect.right + pageXOffset,
      clientRect.top + pageYOffset, clientRect.bottom + pageYOffset, gridColor);
  }
}

function onElementRectChange(elm, callback) {
  
  let lastHeight = elm.offsetHeight, newHeight;
  let lastWidth = elm.offsetWidth, newWidth;
  
  (function run() {
    newHeight = elm.offsetHeight;
    newWidth = elm.offsetWidth;
    
    if ((lastHeight !== newHeight) || (lastWidth !== newWidth)) {
      callback(newHeight, newWidth);
    }
    
    lastHeight = newHeight;
    lastWidth = newWidth;
    
    if (elm.onElementHeightChangeTimer) {
      clearTimeout(elm.onElementHeightChangeTimer);
    }
    elm.onElementHeightChangeTimer = setTimeout(run, 250);
  })();
}
