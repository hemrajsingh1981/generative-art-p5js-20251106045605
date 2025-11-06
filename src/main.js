import p5 from 'p5';

const sketch = (p) => {
  let noiseScale = 0.01;
  let noiseStrength = 100;
  let animationSpeed = 1;
  let colorPalette = [p.color(255, 0, 0), p.color(0, 255, 0), p.color(0, 0, 255)];
  let numShapes = 50;

  p.setup = () => {
    const container = document.getElementById('canvas-container');
    if (!container) {
      console.error('Canvas container #canvas-container not found!');
      return;
    }
    const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('canvas-container');
    p.background(20);

    // UI Elements
    const speedSlider = p.createSlider(0.1, 5, 1, 0.1);
    speedSlider.parent('canvas-container');
    speedSlider.position(10, 10);
    speedSlider.style('width', '150px');
    speedSlider.input(() => { animationSpeed = speedSlider.value(); });

    const colorSelect = p.createSelect();
    colorSelect.parent('canvas-container');
    colorSelect.position(10, 40);
    colorSelect.option('Red/Green/Blue', 0);
    colorSelect.option('Pastel', 1);
    colorSelect.option('Monochrome', 2);
    colorSelect.changed(() => {
      const selected = colorSelect.value();
      if (selected == 0) colorPalette = [p.color(255, 0, 0), p.color(0, 255, 0), p.color(0, 0, 255)];
      else if (selected == 1) colorPalette = [p.color(135, 206, 235), p.color(144, 238, 144), p.color(255, 182, 193)];
      else colorPalette = [p.color(50), p.color(100), p.color(150)];
    });

    // Adjust noise strength based on container size
    noiseStrength = Math.min(container.offsetWidth, container.offsetHeight) * 0.3;
  };

  p.draw = () => {
    p.background(20);
    const time = p.frameCount * 0.01 * animationSpeed;

    for (let i = 0; i < numShapes; i++) {
      const angle = p.map(i, 0, numShapes, 0, p.TWO_PI);
      // Use simplex noise for position, scaled by noiseStrength
      const r = p.sqrt(p.noise(time + i * noiseScale)) * noiseStrength;
      const x = p.width / 2 + p.cos(angle) * r;
      const y = p.height / 2 + p.sin(angle) * r;

      // Use simplex noise for color selection
      const shapeColorIndex = p.floor(p.noise(time * 0.5 + i * 0.1) * colorPalette.length);
      p.fill(colorPalette[shapeColorIndex]);
      p.noStroke();
      p.ellipse(x, y, 20, 20);
    }
  };

  // Handle window resizing to update canvas size
  p.windowResized = () => {
    const container = document.getElementById('canvas-container');
    if (container) {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      noiseStrength = Math.min(container.offsetWidth, container.offsetHeight) * 0.3;
    }
  };
};

new p5(sketch);