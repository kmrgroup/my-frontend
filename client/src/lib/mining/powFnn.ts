import * as tf from '@tensorflow/tfjs';

// Neural network parameters - reduced for better performance
const INPUT_SIZE = 128; // Reduced from 256
const HIDDEN_SIZE = 64; // Reduced from 128
const OUTPUT_SIZE = 32;
const TRAINING_EPOCHS = 2; // Reduced from 5

interface TrainingResult {
  loss: number;
  accuracy: number;
  hash: string;
}

// Generate synthetic training data for the mining process
function generateTrainingData(timestamp: number, nonce: number): {
  xs: tf.Tensor2D;
  ys: tf.Tensor2D;
} {
  const batchSize = 16; // Reduced from 32
  const inputData = new Float32Array(batchSize * INPUT_SIZE);
  const outputData = new Float32Array(batchSize * OUTPUT_SIZE);

  // Use timestamp and nonce to seed the training data
  const seed = timestamp ^ nonce;

  for (let i = 0; i < batchSize; i++) {
    for (let j = 0; j < INPUT_SIZE; j++) {
      // Generate deterministic but complex input patterns
      inputData[i * INPUT_SIZE + j] = Math.sin(
        (seed + i * j) / (INPUT_SIZE * Math.PI)
      );
    }

    for (let j = 0; j < OUTPUT_SIZE; j++) {
      // Generate target patterns based on input
      outputData[i * OUTPUT_SIZE + j] = Math.cos(
        (seed + i * j) / (OUTPUT_SIZE * Math.PI)
      );
    }
  }

  return {
    xs: tf.tensor2d(inputData, [batchSize, INPUT_SIZE]),
    ys: tf.tensor2d(outputData, [batchSize, OUTPUT_SIZE])
  };
}

// Create a feedforward neural network model
function createModel(): tf.Sequential {
  const model = tf.sequential();

  model.add(tf.layers.dense({
    inputShape: [INPUT_SIZE],
    units: HIDDEN_SIZE,
    activation: 'relu',
    kernelInitializer: 'glorotNormal'
  }));

  model.add(tf.layers.dense({
    units: OUTPUT_SIZE,
    activation: 'sigmoid'
  }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['accuracy']
  });

  return model;
}

// Convert model weights to a deterministic hash
function modelToHash(model: tf.Sequential): string {
  const weights = model.getWeights();
  let hashInput = '';

  // Concatenate weight values
  weights.forEach(weight => {
    weight.data().then(data => {
      hashInput += Array.from(data).join('');
    });
  });

  // Simple hash function for demo
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(16).padStart(64, '0');
}

// Main POW-FNN mining function
export async function pow_fnn_hash(
  timestamp: number,
  nonce: number
): Promise<TrainingResult> {
  console.time('pow_fnn_total');

  try {
    // Initialize TensorFlow.js
    await tf.ready();
    console.log('TensorFlow.js backend:', tf.getBackend());

    // Try to use WebGL backend for better performance
    try {
      await tf.setBackend('webgl');
      console.log('Successfully set WebGL backend');
    } catch (error) {
      console.warn('WebGL backend failed, falling back to CPU:', error);
      await tf.setBackend('cpu');
      console.log('Using CPU backend');
    }

    console.time('model_creation');
    const model = createModel();
    console.timeEnd('model_creation');

    console.time('data_generation');
    const { xs, ys } = generateTrainingData(timestamp, nonce);
    console.timeEnd('data_generation');

    // Train the model
    console.time('model_training');
    const history = await model.fit(xs, ys, {
      epochs: TRAINING_EPOCHS,
      batchSize: 16,
      shuffle: true,
      verbose: 0
    });
    console.timeEnd('model_training');

    // Get final metrics
    const finalLoss = history.history.loss[history.history.loss.length - 1];
    const finalAccuracy = history.history.acc[history.history.acc.length - 1];

    // Generate hash from model weights
    console.time('hash_generation');
    const hash = modelToHash(model);
    console.timeEnd('hash_generation');

    // Memory cleanup
    tf.dispose([model, xs, ys]);

    // Convert tensor metrics to numbers and ensure they're strings for the API
    const loss = typeof finalLoss === 'number' ? finalLoss.toString() : (finalLoss as tf.Tensor).dataSync()[0].toString();
    const accuracy = typeof finalAccuracy === 'number' ? finalAccuracy.toString() : (finalAccuracy as tf.Tensor).dataSync()[0].toString();

    return {
      loss: parseFloat(loss),
      accuracy: parseFloat(accuracy),
      hash
    };
  } catch (error) {
    console.error('POW-FNN error:', error);
    throw new Error(`Mining computation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    console.timeEnd('pow_fnn_total');
    // Force garbage collection of tensors
    tf.engine().disposeVariables();
    tf.engine().startScope();
  }
}

// Verify if hash meets difficulty requirement
export function verifyPowFnn(
  result: TrainingResult,
  difficulty: number
): boolean {
  // Check if loss is below threshold and accuracy is acceptable
  const lossThreshold = 1 / Math.pow(2, difficulty);
  const accuracyThreshold = Math.max(0.7, 1 - (difficulty * 0.05)); // Adjust threshold based on difficulty
  return result.loss < lossThreshold && result.accuracy > accuracyThreshold;
}