# ML Tools Quick Start Guide

Get started with the ML Tools for AI advancement in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- MongoDB 6.0+ installed and running
- Repository cloned locally

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure the Platform

1. Edit `app.js` and set your `shortnamePrefix` (if not already set)
2. Edit `domains.js` for your domain configuration
3. Edit `sites/index.js` - update `CHANGEME` values for security

## Step 3: Create Admin User

```bash
node app @apostrophecms/user:add admin admin --site=dashboard
```

Enter a password when prompted.

## Step 4: Start the Platform

```bash
npm run dev
```

## Step 5: Access the Dashboard

Open your browser and navigate to:
```
http://dashboard.localhost:3000/login
```

Login with the admin credentials you created.

## Step 6: Create Your First Site

1. Click "Sites" in the admin bar
2. Click "New Site"
3. Enter a shortname (e.g., `mysite`)
4. Set an admin password
5. Choose a theme
6. Click "Save"

## Step 7: Access ML Tools

1. Login to your site at `http://mysite.localhost:3000/login`
2. In the admin bar, you'll see new menu items:
   - ML Models
   - ML Datasets
   - Training Jobs
   - ML Experiments

## Step 8: Upload Your First Dataset

1. Click "ML Datasets" in the admin bar
2. Click "New ML Dataset"
3. Fill in the details:
   - Dataset Name: "Iris Dataset"
   - Version: "1.0.0"
   - Dataset Type: "Training"
   - Task Type: "Classification"
   - Description: "Classic iris flower dataset"
4. Upload your dataset file
5. Add metadata:
   - Number of Samples: 150
   - Number of Classes: 3
   - Features: '["sepal_length", "sepal_width", "petal_length", "petal_width"]'
6. Click "Save"

## Step 9: Register a Model

1. Click "ML Models" in the admin bar
2. Click "New ML Model"
3. Fill in the details:
   - Model Name: "Iris Classifier"
   - Model Version: "1.0.0"
   - Model Type: "TensorFlow" (or your framework)
   - Description: "Classifies iris flowers"
4. Upload your trained model file
5. Add specifications:
   - Input Shape: "[4]"
   - Output Shape: "[3]"
6. Link to your training dataset
7. Add metrics:
   - Accuracy: 0.95
   - Precision: 0.94
   - Recall: 0.96
   - F1 Score: 0.95
8. Check "Active for Inference"
9. Click "Save"

## Step 10: Test the Inference API

Using the Python client:

```bash
cd scripts/ml-utils
python ml_client.py
```

Or using curl:

```bash
# Get active models
curl http://mysite.localhost:3000/api/v1/ml/models/active

# Run a prediction (replace MODEL_ID with your model's ID)
curl -X POST http://mysite.localhost:3000/api/v1/ml/predict \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "MODEL_ID",
    "input": {"data": [5.1, 3.5, 1.4, 0.2]}
  }'
```

## Step 11: Create an Experiment

1. Click "ML Experiments" in the admin bar
2. Click "New ML Experiment"
3. Fill in:
   - Experiment Name: "Hyperparameter Tuning"
   - Hypothesis: "Increasing network depth will improve accuracy"
   - Objective: "Maximize Accuracy"
4. Add parameters to tune:
   - Name: "num_layers", Type: "Integer", Range: "[2, 5]"
   - Name: "learning_rate", Type: "Float", Range: "[0.0001, 0.01]"
5. Click "Save"

## Step 12: Track a Training Job

1. Click "Training Jobs" in the admin bar
2. Click "New Training Job"
3. Fill in:
   - Job Name: "Iris Classifier Training Run 1"
   - Model Type: "TensorFlow"
   - Link Training Dataset (select your dataset)
4. Configure parameters:
   - Epochs: 50
   - Batch Size: 32
   - Learning Rate: 0.001
   - Optimizer: "Adam"
5. Upload training script (optional)
6. Link to experiment
7. Click "Save"

## Next Steps

### Integrate with Your Training Code

Use the training template:

```bash
cd scripts/ml-utils
python training_template.py \
  --data /path/to/your/data \
  --config config.json \
  --output trained_model.h5
```

### Use the API Clients

**Python:**
```python
from ml_client import MLToolsClient, PredictionRunner

client = MLToolsClient('http://mysite.localhost:3000')
runner = PredictionRunner(client)

result = runner.run_prediction(
    model_id='your-model-id',
    input_data={'data': [5.1, 3.5, 1.4, 0.2]}
)
```

**JavaScript:**
```javascript
const { MLToolsClient, PredictionRunner } = require('./ml-client');

const client = new MLToolsClient('http://mysite.localhost:3000');
const runner = new PredictionRunner(client);

const result = await runner.runPrediction(
  'your-model-id',
  { data: [5.1, 3.5, 1.4, 0.2] }
);
```

### Build Your Workflow

1. **Prepare Data** → Upload to ML Datasets
2. **Create Experiment** → Define what you're testing
3. **Configure Training** → Create training jobs
4. **Train Models** → Run training externally
5. **Register Models** → Upload trained models
6. **Evaluate** → Add metrics and results
7. **Deploy** → Mark as active for inference
8. **Predict** → Use the inference API

## Troubleshooting

### Cannot access localhost:3000
- Ensure MongoDB is running
- Check that port 3000 is not in use
- Try `npm run dev` again

### Modules not appearing in admin bar
- Check that modules are registered in `sites/index.js`
- Restart the server
- Clear browser cache

### API endpoints returning 404
- Verify the site is running
- Check the URL format
- Ensure model is marked as "Active"

### File upload issues
- Check file size limits
- Verify file type is allowed
- Ensure sufficient disk space

## Getting Help

- Read the full guide: `ML-TOOLS-GUIDE.md`
- Check API documentation in the guide
- Review example scripts in `scripts/ml-utils/`
- Review Apostrophe CMS docs: https://docs.apostrophecms.org/

## Advanced Usage

### Custom Training Integration

Create a bridge between your training code and ML Tools:

```python
import requests

# After training
response = requests.post(
    'http://mysite.localhost:3000/api/v1/ml/models',
    json={
        'modelName': 'My Model',
        'modelVersion': '1.0.0',
        'metrics': {
            'accuracy': final_accuracy,
            'loss': final_loss
        }
    }
)
```

### Automated Pipelines

Set up automated ML pipelines using the API:

1. Upload dataset via API
2. Trigger training job
3. Monitor progress
4. Auto-register model on completion
5. Run validation
6. Deploy if metrics meet threshold

### Production Deployment

For production use:

1. Configure SSL/TLS
2. Set up proper authentication
3. Use environment variables for secrets
4. Configure CORS appropriately
5. Set up monitoring and logging
6. Use a production-grade database
7. Configure backup strategies

## Example: Complete Workflow

```python
from ml_client import MLToolsClient, ModelManager, PredictionRunner

# Initialize
client = MLToolsClient('http://mysite.localhost:3000')

# 1. Check what models are available
manager = ModelManager(client)
manager.list_models()

# 2. Get model details
manager.show_model_details('model-id-from-list')

# 3. Run predictions
runner = PredictionRunner(client)

# Single prediction
result = runner.run_prediction(
    model_id='model-id',
    input_data={'features': [1.2, 3.4, 5.6, 7.8]}
)

# Batch predictions
results = runner.run_batch_prediction(
    model_id='model-id',
    inputs=[
        {'features': [1.2, 3.4, 5.6, 7.8]},
        {'features': [2.3, 4.5, 6.7, 8.9]}
    ]
)

print("All done!")
```

Happy ML development! 🚀
