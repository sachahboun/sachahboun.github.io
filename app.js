function linefunction(x) {
  slopeInput = document.getElementById("slope");
  let slope = parseInt(slopeInput.value);


  let result = slope * x;

  return result;
}

class Perceptron {
  weight0 = 0;
  weight1 = 0;
  learning_rate = 0;
  cum_error = 0
  cum_x = 0
  cum_y = 0

  constructor(lr) {
    this.weight0 = Math.random() * 2 - 1;
    this.weight1 = Math.random() * 2 - 1;
    this.learning_rate = lr;
  }

  sign(x) {
    if (x >= 0) return 1;
    else return -1;
  }

  predict(x, y) {
    let result = this.sign(this.weight0 * x + this.weight1 * y);
    return result;
  }

  train(x, y, answer) {
    let prediction = this.predict(x, y);
    let error = answer - prediction;

    this.weight0 = this.weight0 + error * 2 * x * this.learning_rate;
    this.weight1 = this.weight1 + error * 2 *  y * this.learning_rate;
  }

  f(x) {
    return -(this.weight0 / this.weight1) * x;
  }

  getF() {
    return (
      Math.round(-(this.weight0 / this.weight1) * 10000) / 10000 +
      " * x + " +
      '0'
    );
  }
}

function generateRandomPoints(pointCount, minDistance) {
  const canvasWidth = 700;
  const canvasHeight = 700;
  const excludePixels = 80;
  const points = [];

  const k = 30; // Maximum number of attempts to find a valid point
  const cellSize = minDistance / Math.sqrt(2);
  const gridWidth = Math.ceil((canvasWidth - 2 * excludePixels) / cellSize);
  const gridHeight = Math.ceil((canvasHeight - 2 * excludePixels) / cellSize);

  const grid = new Array(gridWidth * gridHeight);
  const active = [];

  // Function to check if a point is within the bounds and at least 'minDistance' away from other points
  function isValid(x, y) {
    if (
      x >= excludePixels &&
      x < canvasWidth - excludePixels &&
      y >= excludePixels &&
      y < canvasHeight - excludePixels
    ) {
      x = Math.round(x); // Round x to the nearest integer
      y = Math.round(y); // Round y to the nearest integer
      const cellX = Math.floor((x - excludePixels) / cellSize);
      const cellY = Math.floor((y - excludePixels) / cellSize);
      const minGridX = Math.max(0, cellX - 2);
      const maxGridX = Math.min(gridWidth - 1, cellX + 2);
      const minGridY = Math.max(0, cellY - 2);
      const maxGridY = Math.min(gridHeight - 1, cellY + 2);

      for (let gridY = minGridY; gridY <= maxGridY; gridY++) {
        for (let gridX = minGridX; gridX <= maxGridX; gridX++) {
          const cellIndex = gridY * gridWidth + gridX;
          if (grid[cellIndex]) {
            const dx = x - grid[cellIndex][0];
            const dy = y - grid[cellIndex][1];
            const distanceSquared = dx * dx + dy * dy;
            if (distanceSquared < minDistance * minDistance) {
              return false;
            }
          }
        }
      }
      return true;
    }
    return false;
  }

  // Generate the first point randomly within the canvas boundaries
  const initialX =
    excludePixels + Math.random() * (canvasWidth - 2 * excludePixels);
  const initialY =
    excludePixels + Math.random() * (canvasHeight - 2 * excludePixels);
  points.push({ x: Math.round(initialX), y: Math.round(initialY) });
  const initialCellX = Math.floor((initialX - excludePixels) / cellSize);
  const initialCellY = Math.floor((initialY - excludePixels) / cellSize);
  grid[initialCellY * gridWidth + initialCellX] = [
    Math.round(initialX),
    Math.round(initialY),
  ];
  active.push([initialX, initialY]);

  while (points.length < pointCount && active.length > 0) {
    const randomIndex = Math.floor(Math.random() * active.length);
    const [currentX, currentY] = active[randomIndex];
    let found = false;

    for (let i = 0; i < k; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = (Math.random() + 1) * minDistance;
      const newX = currentX + distance * Math.cos(angle);
      const newY = currentY + distance * Math.sin(angle);

      if (isValid(newX, newY)) {
        points.push({ x: Math.round(newX), y: Math.round(newY) });
        active.push([newX, newY]);
        const cellX = Math.floor((newX - excludePixels) / cellSize);
        const cellY = Math.floor((newY - excludePixels) / cellSize);
        grid[cellY * gridWidth + cellX] = [Math.round(newX), Math.round(newY)];
        found = true;
        break;
      }
    }

    if (!found) {
      active.splice(randomIndex, 1);
    }
  }

  return points;
}

function shuffleArray(array) {
    const shuffledArray = array.slice(); // Create a copy of the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

// Example usage:
const pointCount = 100; // Adjust the number of points as needed
const minDistance = 20; // Adjust the minimum distance between points as needed

const generatedPoints = generateRandomPoints(pointCount, minDistance);
console.log("Total Points:", generatedPoints.length);

function setup() {
  canvasElement = document.getElementById("canvas");
  let canvas = createCanvas(700, 700);
  canvas.parent(canvasElement);

  lrInput = document.getElementById("lr");
  lr = lrInput.value;

  perceptron = new Perceptron(lr/10000);

  points = shuffleArray(generateRandomPoints(80, 50));

  start = false
  frameRate(120)

  let startButton = document.getElementById('start')
  startButton.addEventListener("click", function() {
    start = !start
    startButton.innerHTML = start ? 'Stop' : 'Start'
    });
}

function draw() {

  points=shuffleArray(points)

  lrInput = document.getElementById("lr");
  lr = lrInput.value;
  perceptron.learning_rate = lr/1000000

  background(255);





  predictionElement = document.getElementById("prediction");
  predictionElement.innerHTML = perceptron.getF();

  if(start){
    index = Math.floor(Math.random() * points.length)
    trainLabel = points[index].y < linefunction(points[index].x) ? -1 : 1;
    perceptron.train(points[index].x,points[index].y,trainLabel)
  }

  //perceptron.startBatch()
  for (let i = 0; i < points.length; i++) {
    label = points[i].y < linefunction(points[i].x) ? -1 : 1;
    predictedLabel = points[i].y < perceptron.f(points[i].x) ? -1 : 1;

    trainLabel = points[i].y < linefunction(points[i].x) ? -1 : 1;
    //perceptron.trainBatch(points[i].x,points[i].y,trainLabel)

    if (predictedLabel == label) fill(0, 255, 0);
    else if (points[i].y < linefunction(points[i].x)) fill(255, 255, 255);
    else fill(0, 0, 0);
    ellipse(points[i].x, height - points[i].y, 10, 10);
  }
  //perceptron.endBatch(points.length)

  stroke(255, 0, 0);
  line(0, 700 - perceptron.f(0), 700, 700 - perceptron.f(700));

  stroke(0, 0, 255);
  line(0, 700 - linefunction(0), 700, 700 - linefunction(700));
}
