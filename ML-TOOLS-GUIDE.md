# ML Tools for AI Advancement

This documentation describes the Machine Learning tools integrated into this platform to support AI development and advancement.

## Overview

The ML Tools suite provides a comprehensive set of modules for managing the entire machine learning lifecycle:

1. **ML Model Management** - Store, version, and manage trained models
2. **Dataset Management** - Organize and track training datasets
3. **Training Job Management** - Configure and monitor model training
4. **Experiment Tracking** - Track experiments and compare results
5. **Inference API** - Deploy models for production inference

## Modules

### 1. ML Model (`ml-model`)

The ML Model module allows you to store and manage trained machine learning models.

#### Features:
- Upload model files (TensorFlow, PyTorch, ONNX, Scikit-learn, etc.)
- Version control for models
- Store model metadata (input/output shapes, metrics)
- Mark models as active for inference
- Link to training datasets
- Tag models for organization

#### Fields:
- **Model Name**: Descriptive name for the model
- **Model Version**: Semantic version (e.g., 1.0.0)
- **Model Type**: Framework used (TensorFlow, PyTorch, ONNX, etc.)
- **Model File**: The trained model file
- **Configuration File**: Optional JSON configuration
- **Input/Output Shape**: Model specifications
- **Metrics**: Accuracy, precision, recall, F1 score
- **Training Dataset**: Link to the dataset used for training
- **Active**: Whether the model is available for inference

#### Usage:
1. Navigate to "ML Models" in the admin bar
2. Click "New ML Model"
3. Fill in the model details
4. Upload your trained model file
5. Optionally upload a configuration file
6. Set metrics and link to training dataset
7. Mark as "Active" to make available for inference

### 2. ML Dataset (`ml-dataset`)

The Dataset module helps you organize and track all datasets used for training, validation, and testing.

#### Features:
- Upload dataset files (CSV, JSON, ZIP, etc.)
- Track dataset versions
- Store dataset statistics
- Document preprocessing steps
- Categorize by task type (classification, regression, NLP, etc.)

#### Fields:
- **Dataset Name**: Descriptive name
- **Version**: Dataset version
- **Dataset Type**: Training, validation, test, or production
- **Task Type**: Classification, regression, object detection, etc.
- **Data File**: The dataset file
- **Labels File**: Optional labels/annotations
- **Statistics**: Mean, std, min, max
- **Preprocessing Steps**: Document data preprocessing
- **Number of Samples/Classes**: Dataset size information

#### Usage:
1. Navigate to "ML Datasets" in the admin bar
2. Click "New ML Dataset"
3. Upload your dataset file
4. Specify the task type and dataset type
5. Add statistics and preprocessing information
6. Save the dataset

### 3. Training Job (`ml-training-job`)

The Training Job module tracks model training runs and their configurations.

#### Features:
- Configure training hyperparameters
- Link to training and validation datasets
- Track training status
- Store training logs and metrics
- Link to resulting trained models

#### Fields:
- **Job Name**: Descriptive name for the training run
- **Model Type**: Framework to use
- **Training/Validation Datasets**: Links to datasets
- **Status**: Pending, running, completed, failed, cancelled
- **Hyperparameters**: JSON configuration
- **Epochs, Batch Size, Learning Rate**: Training parameters
- **Optimizer**: Adam, SGD, RMSprop, etc.
- **Training Script**: Upload your training code
- **Training Metrics**: Final loss, accuracy, best epoch
- **Result Model**: Link to the trained model

#### Usage:
1. Navigate to "Training Jobs" in the admin bar
2. Click "New Training Job"
3. Configure training parameters
4. Link to your training dataset
5. Upload training script (optional)
6. Track the job status
7. Link the resulting model when complete

### 4. ML Experiment (`ml-experiment`)

The Experiment module helps you track and compare multiple training runs.

#### Features:
- Define experiment hypothesis and objectives
- Track multiple training jobs
- Compare against baseline models
- Record experiment results and conclusions
- Parameter tuning tracking

#### Fields:
- **Experiment Name**: Descriptive name
- **Hypothesis**: What you're testing
- **Objective**: What you're optimizing for
- **Baseline Model**: Model to compare against
- **Training Jobs**: All runs in this experiment
- **Best Model**: Best performing model
- **Parameters**: Parameters being tuned
- **Results**: Aggregate metrics and improvements
- **Conclusions**: Key findings

#### Usage:
1. Navigate to "ML Experiments" in the admin bar
2. Click "New ML Experiment"
3. Define your hypothesis and objective
4. Link a baseline model (optional)
5. Add training jobs as you run experiments
6. Record results and conclusions
7. Link the best performing model

### 5. Inference API (`ml-inference-api`)

The Inference API provides REST endpoints for running predictions using trained models.

#### Endpoints:

##### POST `/api/v1/ml/predict`
Run a single prediction.

**Request:**
```json
{
  "modelId": "model-id-here",
  "input": {
    "data": [/* your input data */]
  }
}
```

**Response:**
```json
{
  "modelId": "model-id-here",
  "modelName": "My Model",
  "modelVersion": "1.0.0",
  "prediction": {
    "result": "prediction result",
    "confidence": 0.95,
    "processingTime": 0.123
  },
  "timestamp": "2025-12-24T11:22:45.465Z"
}
```

##### POST `/api/v1/ml/predict-batch`
Run batch predictions.

**Request:**
```json
{
  "modelId": "model-id-here",
  "inputs": [
    { "data": [/* input 1 */] },
    { "data": [/* input 2 */] }
  ]
}
```

**Response:**
```json
{
  "modelId": "model-id-here",
  "modelName": "My Model",
  "modelVersion": "1.0.0",
  "predictions": [
    { "index": 0, "result": "result 1", "confidence": 0.95 },
    { "index": 1, "result": "result 2", "confidence": 0.92 }
  ],
  "batchSize": 2,
  "timestamp": "2025-12-24T11:22:45.465Z"
}
```

##### GET `/api/v1/ml/models/active`
List all active models.

**Response:**
```json
{
  "models": [
    {
      "id": "model-id",
      "name": "My Model",
      "version": "1.0.0",
      "type": "tensorflow",
      "inputShape": "[224, 224, 3]",
      "outputShape": "[10]"
    }
  ],
  "count": 1
}
```

##### GET `/api/v1/ml/models/:modelId`
Get details about a specific model.

##### GET `/api/v1/ml/health`
Health check endpoint.

#### Usage:
1. Mark a model as "Active" in the ML Model module
2. Make HTTP requests to the inference endpoints
3. Send input data in the request body
4. Receive predictions in the response

## Workflow Example

Here's a typical workflow using these tools:

### 1. Prepare Dataset
```
1. Navigate to "ML Datasets"
2. Create new dataset
3. Upload training data (e.g., images.zip)
4. Set type to "Training"
5. Specify task type (e.g., "Classification")
6. Add statistics and preprocessing steps
```

### 2. Create Experiment
```
1. Navigate to "ML Experiments"
2. Create new experiment
3. Define hypothesis: "CNN architecture will improve accuracy"
4. Set objective: "Maximize Accuracy"
5. Link baseline model (if available)
```

### 3. Configure Training Job
```
1. Navigate to "Training Jobs"
2. Create new training job
3. Link to training dataset
4. Set hyperparameters:
   - Epochs: 50
   - Batch Size: 32
   - Learning Rate: 0.001
   - Optimizer: Adam
5. Upload training script
6. Link to experiment
```

### 4. Train Model
```
1. Execute training (externally)
2. Update job status to "Running"
3. When complete, update status to "Completed"
4. Add training metrics
```

### 5. Register Trained Model
```
1. Navigate to "ML Models"
2. Create new model
3. Upload trained model file
4. Set version (e.g., 1.0.0)
5. Add metrics from training
6. Link to training dataset
7. Link from training job
8. Mark as "Active" for inference
```

### 6. Update Experiment
```
1. Navigate back to experiment
2. Add completed training job
3. If this is the best model, link as "Best Model"
4. Update results with metrics
5. Add conclusions
```

### 7. Deploy for Inference
```
1. Use the Inference API
2. Call POST /api/v1/ml/predict
3. Send model ID and input data
4. Receive predictions
```

## API Integration Examples

### Python Example
```python
import requests

# Single prediction
response = requests.post(
    'http://your-domain.com/api/v1/ml/predict',
    json={
        'modelId': 'your-model-id',
        'input': {
            'data': [1, 2, 3, 4, 5]
        }
    }
)
result = response.json()
print(f"Prediction: {result['prediction']['result']}")
print(f"Confidence: {result['prediction']['confidence']}")
```

### JavaScript Example
```javascript
// Batch prediction
const response = await fetch('http://your-domain.com/api/v1/ml/predict-batch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    modelId: 'your-model-id',
    inputs: [
      { data: [1, 2, 3] },
      { data: [4, 5, 6] }
    ]
  })
});

const result = await response.json();
console.log('Predictions:', result.predictions);
```

### cURL Example
```bash
# Get active models
curl http://your-domain.com/api/v1/ml/models/active

# Run prediction
curl -X POST http://your-domain.com/api/v1/ml/predict \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "your-model-id",
    "input": {"data": [1, 2, 3, 4, 5]}
  }'
```

## Best Practices

### Model Management
- Use semantic versioning for models (MAJOR.MINOR.PATCH)
- Always document input/output shapes
- Store model metrics for comparison
- Link models to their training datasets
- Only mark production-ready models as "Active"

### Dataset Management
- Version datasets when they change
- Document all preprocessing steps
- Store dataset statistics
- Separate training, validation, and test sets
- Use consistent naming conventions

### Training Management
- Always link training jobs to datasets
- Document hyperparameters in detail
- Store training logs
- Link completed jobs to experiments
- Record training metrics

### Experiment Tracking
- Define clear hypotheses
- Set measurable objectives
- Compare against baselines
- Document all findings
- Archive completed experiments

### Inference
- Test models before marking active
- Monitor inference performance
- Log predictions for analysis
- Handle errors gracefully
- Version your APIs

## Extending the Tools

These modules are built on Apostrophe CMS and can be extended:

### Add Custom Fields
Edit the module's `index.js` to add new fields:
```javascript
fields: {
  add: {
    myCustomField: {
      type: 'string',
      label: 'My Custom Field'
    }
  }
}
```

### Add Custom Methods
Add methods to process models or data:
```javascript
methods(self) {
  return {
    async myCustomMethod() {
      // Your code here
    }
  };
}
```

### Add API Endpoints
Extend the inference API with new endpoints:
```javascript
apiRoutes(self) {
  return {
    post: {
      async '/api/v1/ml/my-endpoint'(req) {
        // Your endpoint logic
      }
    }
  };
}
```

## Troubleshooting

### Models not appearing in active list
- Verify the model is marked as "Active"
- Check that the model piece is published
- Ensure proper permissions

### Inference API returning errors
- Verify model ID is correct
- Check input format matches model specifications
- Review server logs for detailed errors

### Cannot upload model files
- Check file size limits
- Verify file type is allowed
- Ensure proper permissions

## Next Steps

To advance AI development with these tools:

1. **Integrate with training frameworks**: Connect to TensorFlow, PyTorch, or other frameworks
2. **Add model serving**: Implement actual model loading and inference
3. **Build dashboards**: Create visualization for metrics and comparisons
4. **Automate workflows**: Add automated training pipelines
5. **Enhance APIs**: Add authentication, rate limiting, monitoring
6. **Scale infrastructure**: Deploy on cloud platforms with GPU support

## Support and Resources

- Apostrophe CMS Documentation: https://docs.apostrophecms.org/
- TensorFlow: https://www.tensorflow.org/
- PyTorch: https://pytorch.org/
- ONNX: https://onnx.ai/

## License

See the project LICENSE.md file for details.
