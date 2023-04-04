function generateIconImageData(color) {
    const canvas = new OffscreenCanvas(19, 19);
    const ctx = canvas.getContext('2d');
  
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(9, 9, 9, 0, 2 * Math.PI);
    ctx.fill();
  
    return ctx.getImageData(0, 0, 19, 19);
  }
  