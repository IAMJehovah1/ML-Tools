# ML Tools Utility Scripts

This directory contains utility scripts for interacting with the ML Tools API.

## Available Clients

### Python Client (`ml_client.py`)

A Python client library for the ML Tools API.

#### Requirements
```bash
pip install requests
```

#### Usage

**Basic Example:**
```python
from ml_client import MLToolsClient, ModelManager, PredictionRunner

# Initialize client
client = MLToolsClient('http://localhost:3000')

# Check API health
health = client.health_check()
print(f"API Status: {health['status']}")

# List active models
manager = ModelManager(client)
manager.list_models()

# Run a prediction
runner = PredictionRunner(client)
result = runner.run_prediction(
    model_id='your-model-id',
    input_data={'data': [1, 2, 3, 4, 5]}
)

# Run batch prediction
result = runner.run_batch_prediction(
    model_id='your-model-id',
    inputs=[
        {'data': [1, 2, 3]},
        {'data': [4, 5, 6]}
    ]
)
```

**Run as Script:**
```bash
python ml_client.py
```

### JavaScript/Node.js Client (`ml-client.js`)

A JavaScript client library for the ML Tools API that works in both Node.js and browsers.

#### Requirements
Node.js 18+ (for fetch API support) or a browser environment.

For older Node.js versions:
```bash
npm install node-fetch
```

#### Usage

**Basic Example:**
```javascript
const { MLToolsClient, ModelManager, PredictionRunner } = require('./ml-client');

async function main() {
  // Initialize client
  const client = new MLToolsClient('http://localhost:3000');

  // Check API health
  const health = await client.healthCheck();
  console.log(`API Status: ${health.status}`);

  // List active models
  const manager = new ModelManager(client);
  await manager.listModels();

  // Run a prediction
  const runner = new PredictionRunner(client);
  await runner.runPrediction(
    'your-model-id',
    { data: [1, 2, 3, 4, 5] }
  );

  // Run batch prediction
  await runner.runBatchPrediction(
    'your-model-id',
    [
      { data: [1, 2, 3] },
      { data: [4, 5, 6] }
    ]
  );
}

main().catch(console.error);
```

**Run as Script:**
```bash
node ml-client.js
```

**Use in Browser:**
```html
<script src="ml-client.js"></script>
<script>
  const client = new MLToolsClient('http://your-domain.com');
  
  client.getActiveModels().then(models => {
    console.log('Active models:', models);
  });
</script>
```

## API Reference

### MLToolsClient

Main client class for API interactions.

#### Constructor
```python
client = MLToolsClient(base_url, api_key=None)
```

Parameters:
- `base_url` (string): Base URL of the ML Tools API
- `api_key` (string, optional): API key for authentication

#### Methods

**predict(model_id, input_data)**
Run a single prediction.

**predict_batch(model_id, inputs)**
Run batch predictions.

**get_active_models()**
Get list of all active models.

**get_model(model_id)**
Get details about a specific model.

**health_check()**
Check API health status.

### ModelManager

Helper class for managing models.

#### Methods

**list_models()**
Print list of all active models.

**show_model_details(model_id)**
Print detailed information about a specific model.

### PredictionRunner

Helper class for running predictions.

#### Methods

**run_prediction(model_id, input_data, verbose=True)**
Run a prediction and optionally print results.

**run_batch_prediction(model_id, inputs, verbose=True)**
Run batch predictions and optionally print results.

## Examples

### Example 1: List All Active Models

**Python:**
```python
from ml_client import MLToolsClient, ModelManager

client = MLToolsClient('http://localhost:3000')
manager = ModelManager(client)
manager.list_models()
```

**JavaScript:**
```javascript
const { MLToolsClient, ModelManager } = require('./ml-client');

const client = new MLToolsClient('http://localhost:3000');
const manager = new ModelManager(client);
manager.listModels();
```

### Example 2: Run Image Classification

**Python:**
```python
from ml_client import MLToolsClient, PredictionRunner

client = MLToolsClient('http://localhost:3000')
runner = PredictionRunner(client)

# Assuming image is preprocessed into array
image_data = [[0.5, 0.3, 0.2], [0.1, 0.8, 0.9], ...]

result = runner.run_prediction(
    model_id='image-classifier-v1',
    input_data={'image': image_data}
)

print(f"Predicted class: {result['prediction']['result']}")
print(f"Confidence: {result['prediction']['confidence']}")
```

**JavaScript:**
```javascript
const { MLToolsClient, PredictionRunner } = require('./ml-client');

const client = new MLToolsClient('http://localhost:3000');
const runner = new PredictionRunner(client);

const imageData = [[0.5, 0.3, 0.2], [0.1, 0.8, 0.9], ...];

const result = await runner.runPrediction(
  'image-classifier-v1',
  { image: imageData }
);

console.log(`Predicted class: ${result.prediction.result}`);
console.log(`Confidence: ${result.prediction.confidence}`);
```

### Example 3: Batch Processing

**Python:**
```python
from ml_client import MLToolsClient, PredictionRunner

client = MLToolsClient('http://localhost:3000')
runner = PredictionRunner(client)

# Process multiple samples
samples = [
    {'features': [1.2, 3.4, 5.6]},
    {'features': [2.3, 4.5, 6.7]},
    {'features': [3.4, 5.6, 7.8]}
]

result = runner.run_batch_prediction(
    model_id='regression-model',
    inputs=samples
)

for pred in result['predictions']:
    print(f"Sample {pred['index']}: {pred['result']}")
```

**JavaScript:**
```javascript
const { MLToolsClient, PredictionRunner } = require('./ml-client');

const client = new MLToolsClient('http://localhost:3000');
const runner = new PredictionRunner(client);

const samples = [
  { features: [1.2, 3.4, 5.6] },
  { features: [2.3, 4.5, 6.7] },
  { features: [3.4, 5.6, 7.8] }
];

const result = await runner.runBatchPrediction(
  'regression-model',
  samples
);

result.predictions.forEach(pred => {
  console.log(`Sample ${pred.index}: ${pred.result}`);
});
```

### Example 4: Model Information

**Python:**
```python
from ml_client import MLToolsClient, ModelManager

client = MLToolsClient('http://localhost:3000')
manager = ModelManager(client)

# Show details for a specific model
manager.show_model_details('your-model-id')

# Or get raw data
model = client.get_model('your-model-id')
print(f"Model type: {model['type']}")
print(f"Input shape: {model['inputShape']}")
```

**JavaScript:**
```javascript
const { MLToolsClient, ModelManager } = require('./ml-client');

const client = new MLToolsClient('http://localhost:3000');
const manager = new ModelManager(client);

// Show details for a specific model
await manager.showModelDetails('your-model-id');

// Or get raw data
const model = await client.getModel('your-model-id');
console.log(`Model type: ${model.type}`);
console.log(`Input shape: ${model.inputShape}`);
```

## Authentication

If your API requires authentication, pass the API key when initializing the client:

**Python:**
```python
client = MLToolsClient('http://localhost:3000', api_key='your-api-key')
```

**JavaScript:**
```javascript
const client = new MLToolsClient('http://localhost:3000', 'your-api-key');
```

## Error Handling

Both clients raise/throw errors for HTTP errors and connection issues.

**Python:**
```python
try:
    result = client.predict(model_id, input_data)
except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e}")
except Exception as e:
    print(f"Error: {e}")
```

**JavaScript:**
```javascript
try {
  const result = await client.predict(modelId, inputData);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
```

## Contributing

Feel free to extend these clients with additional functionality:
- Add caching for models
- Implement retry logic
- Add request batching
- Add metrics collection
- Implement streaming predictions

## License

See the project LICENSE.md file for details.
