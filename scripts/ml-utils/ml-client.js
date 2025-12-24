/**
 * ML Tools JavaScript Client
 * A JavaScript/Node.js client library for interacting with the ML Tools API
 */

class MLToolsClient {
  /**
   * Initialize the ML Tools client
   * @param {string} baseUrl - Base URL of the ML Tools API
   * @param {string} apiKey - Optional API key for authentication
   */
  constructor(baseUrl, apiKey = null) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  /**
   * Make an HTTP request
   * @private
   */
  async _request(method, path, data = null) {
    const url = `${this.baseUrl}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (this.apiKey) {
      options.headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Run a single prediction
   * @param {string} modelId - ID of the model to use
   * @param {Object} inputData - Input data for prediction
   * @returns {Promise<Object>} Prediction result
   */
  async predict(modelId, inputData) {
    return await this._request('POST', '/api/v1/ml/predict', {
      modelId,
      input: inputData
    });
  }

  /**
   * Run batch predictions
   * @param {string} modelId - ID of the model to use
   * @param {Array<Object>} inputs - List of input data for predictions
   * @returns {Promise<Object>} Batch prediction results
   */
  async predictBatch(modelId, inputs) {
    return await this._request('POST', '/api/v1/ml/predict-batch', {
      modelId,
      inputs
    });
  }

  /**
   * Get list of all active models
   * @returns {Promise<Array<Object>>} List of active models
   */
  async getActiveModels() {
    const result = await this._request('GET', '/api/v1/ml/models/active');
    return result.models;
  }

  /**
   * Get details about a specific model
   * @param {string} modelId - ID of the model
   * @returns {Promise<Object>} Model details
   */
  async getModel(modelId) {
    return await this._request('GET', `/api/v1/ml/models/${modelId}`);
  }

  /**
   * Check API health
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    return await this._request('GET', '/api/v1/ml/health');
  }
}

class ModelManager {
  /**
   * Helper class for managing ML models
   * @param {MLToolsClient} client - ML Tools client instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Print list of all active models
   */
  async listModels() {
    const models = await this.client.getActiveModels();

    console.log('\n' + '='.repeat(80));
    console.log(`Active Models (${models.length})`);
    console.log('='.repeat(80) + '\n');

    models.forEach((model, i) => {
      console.log(`${i + 1}. ${model.name} (v${model.version})`);
      console.log(`   ID: ${model.id}`);
      console.log(`   Type: ${model.type}`);
      console.log(`   Input Shape: ${model.inputShape || 'N/A'}`);
      console.log(`   Output Shape: ${model.outputShape || 'N/A'}`);
      console.log();
    });
  }

  /**
   * Print detailed information about a model
   * @param {string} modelId - ID of the model
   */
  async showModelDetails(modelId) {
    const model = await this.client.getModel(modelId);

    console.log('\n' + '='.repeat(80));
    console.log(`Model Details: ${model.name}`);
    console.log('='.repeat(80) + '\n');

    console.log(`ID: ${model.id}`);
    console.log(`Version: ${model.version}`);
    console.log(`Type: ${model.type}`);
    console.log(`Framework: ${model.framework || 'N/A'}`);
    console.log(`Description: ${model.description || 'N/A'}`);
    console.log(`Input Shape: ${model.inputShape || 'N/A'}`);
    console.log(`Output Shape: ${model.outputShape || 'N/A'}`);
    console.log(`Active: ${model.active}`);

    if (model.metrics) {
      console.log('\nMetrics:');
      Object.entries(model.metrics).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    }

    console.log(`\nCreated: ${model.createdAt || 'N/A'}`);
    console.log(`Updated: ${model.updatedAt || 'N/A'}`);
    console.log();
  }
}

class PredictionRunner {
  /**
   * Helper class for running predictions
   * @param {MLToolsClient} client - ML Tools client instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Run a prediction and optionally print results
   * @param {string} modelId - ID of the model to use
   * @param {Object} inputData - Input data for prediction
   * @param {boolean} verbose - Whether to print results
   * @returns {Promise<Object>} Prediction result
   */
  async runPrediction(modelId, inputData, verbose = true) {
    const result = await this.client.predict(modelId, inputData);

    if (verbose) {
      console.log('\n' + '='.repeat(80));
      console.log('Prediction Result');
      console.log('='.repeat(80) + '\n');

      console.log(`Model: ${result.modelName} (v${result.modelVersion})`);
      console.log(`Timestamp: ${result.timestamp}`);
      console.log('\nPrediction:');
      console.log(`  Result: ${result.prediction.result}`);
      console.log(`  Confidence: ${(result.prediction.confidence * 100).toFixed(2)}%`);
      console.log(`  Processing Time: ${result.prediction.processingTime.toFixed(3)}s`);
      console.log();
    }

    return result;
  }

  /**
   * Run batch predictions and optionally print results
   * @param {string} modelId - ID of the model to use
   * @param {Array<Object>} inputs - List of input data for predictions
   * @param {boolean} verbose - Whether to print results
   * @returns {Promise<Object>} Batch prediction results
   */
  async runBatchPrediction(modelId, inputs, verbose = true) {
    const result = await this.client.predictBatch(modelId, inputs);

    if (verbose) {
      console.log('\n' + '='.repeat(80));
      console.log('Batch Prediction Results');
      console.log('='.repeat(80) + '\n');

      console.log(`Model: ${result.modelName} (v${result.modelVersion})`);
      console.log(`Batch Size: ${result.batchSize}`);
      console.log(`Timestamp: ${result.timestamp}`);
      console.log('\nPredictions:');

      result.predictions.forEach(pred => {
        console.log(`  [${pred.index}] Result: ${pred.result} | ` +
                   `Confidence: ${(pred.confidence * 100).toFixed(2)}%`);
      });
      console.log();
    }

    return result;
  }
}

// Example usage
async function main() {
  // Initialize client
  const client = new MLToolsClient('http://localhost:3000');

  // Check API health
  try {
    const health = await client.healthCheck();
    console.log(`API Status: ${health.status}`);
    console.log(`Version: ${health.version}`);
  } catch (error) {
    console.error(`Error connecting to API: ${error.message}`);
    process.exit(1);
  }

  // List active models
  const manager = new ModelManager(client);
  await manager.listModels();

  // Example: Run a prediction (replace with actual model ID)
  // const runner = new PredictionRunner(client);
  // await runner.runPrediction(
  //   'your-model-id',
  //   { data: [1, 2, 3, 4, 5] }
  // );

  // Example: Run batch prediction
  // await runner.runBatchPrediction(
  //   'your-model-id',
  //   [
  //     { data: [1, 2, 3] },
  //     { data: [4, 5, 6] }
  //   ]
  // );
}

// Export for use as a module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MLToolsClient,
    ModelManager,
    PredictionRunner
  };
}

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}
