# ML Tools Architecture

## System Overview

The ML Tools platform is built on top of Apostrophe CMS and provides a comprehensive solution for managing the complete machine learning lifecycle.

```
┌─────────────────────────────────────────────────────────────────┐
│                        ML Tools Platform                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Datasets   │  │   Models     │  │   Training Jobs      │   │
│  │             │  │              │  │                      │   │
│  │  - Upload   │  │  - Upload    │  │  - Configure         │   │
│  │  - Version  │  │  - Version   │  │  - Track Status      │   │
│  │  - Metadata │  │  - Activate  │  │  - Store Metrics     │   │
│  └─────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Experiments │  │ Inference    │  │   API Clients        │   │
│  │             │  │     API      │  │                      │   │
│  │  - Track    │  │  - Predict   │  │  - Python            │   │
│  │  - Compare  │  │  - Batch     │  │  - JavaScript        │   │
│  │  - Results  │  │  - Health    │  │  - Examples          │   │
│  └─────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
            ┌──────────────────────────────────┐
            │     Apostrophe CMS Base          │
            │  - Authentication                │
            │  - Authorization                 │
            │  - Storage                       │
            │  - Admin UI                      │
            └──────────────────────────────────┘
```

## Module Architecture

### Core Modules

#### 1. ML Model (`ml-model`)
**Purpose:** Manage trained machine learning models

**Key Features:**
- Model upload and storage
- Version control
- Metadata management (input/output shapes, metrics)
- Activation for inference
- Relationship to datasets

**Database Schema:**
```javascript
{
  modelName: String,
  modelVersion: String,
  modelType: Enum['tensorflow', 'pytorch', 'onnx', 'sklearn', 'custom'],
  framework: String,
  modelFile: Attachment,
  configFile: Attachment,
  description: Text,
  inputShape: String,
  outputShape: String,
  metrics: {
    accuracy: Float,
    precision: Float,
    recall: Float,
    f1Score: Float
  },
  trainingDataset: Relationship,
  tags: Array,
  active: Boolean
}
```

#### 2. ML Dataset (`ml-dataset`)
**Purpose:** Organize and track datasets

**Key Features:**
- Dataset upload and storage
- Version tracking
- Task type classification
- Statistical information
- Preprocessing documentation

**Database Schema:**
```javascript
{
  datasetName: String,
  datasetVersion: String,
  datasetType: Enum['training', 'validation', 'test', 'production'],
  taskType: Enum['classification', 'regression', 'object_detection', ...],
  dataFile: Attachment,
  labelsFile: Attachment,
  description: Text,
  numSamples: Integer,
  numClasses: Integer,
  features: String,
  dataShape: String,
  statistics: {
    mean: String,
    std: String,
    min: String,
    max: String
  },
  preprocessingSteps: Array,
  tags: Array
}
```

#### 3. Training Job (`ml-training-job`)
**Purpose:** Track training runs and configurations

**Key Features:**
- Hyperparameter management
- Status tracking
- Training metrics storage
- Script management
- Result linking

**Database Schema:**
```javascript
{
  jobName: String,
  modelType: Enum['tensorflow', 'pytorch', 'sklearn', 'custom'],
  trainingDataset: Relationship,
  validationDataset: Relationship,
  status: Enum['pending', 'running', 'completed', 'failed', 'cancelled'],
  hyperparameters: Text,
  epochs: Integer,
  batchSize: Integer,
  learningRate: Float,
  optimizer: Enum['adam', 'sgd', 'rmsprop', 'adagrad'],
  description: Text,
  trainingScript: Attachment,
  logFile: Attachment,
  resultModel: Relationship,
  startedAt: Date,
  completedAt: Date,
  trainingMetrics: {
    finalLoss: Float,
    finalAccuracy: Float,
    bestEpoch: Integer
  },
  errorMessage: Text
}
```

#### 4. ML Experiment (`ml-experiment`)
**Purpose:** Track and compare multiple training runs

**Key Features:**
- Hypothesis tracking
- Objective definition
- Parameter tuning
- Result aggregation
- Comparison with baseline

**Database Schema:**
```javascript
{
  experimentName: String,
  experimentId: String,
  hypothesis: Text,
  objective: Enum['max_accuracy', 'min_loss', 'max_f1', 'min_time', 'custom'],
  baselineModel: Relationship,
  trainingJobs: Relationship[],
  bestModel: Relationship,
  status: Enum['active', 'completed', 'paused', 'archived'],
  startDate: Date,
  endDate: Date,
  parameters: Array[{
    name: String,
    type: Enum['float', 'integer', 'categorical'],
    range: String
  }],
  results: {
    totalRuns: Integer,
    bestMetric: Float,
    averageMetric: Float,
    improvementOverBaseline: Float
  },
  notes: Text,
  conclusions: Text,
  tags: Array
}
```

#### 5. Inference API (`ml-inference-api`)
**Purpose:** Provide REST API for model predictions

**API Endpoints:**
- `POST /api/v1/ml/predict` - Single prediction
- `POST /api/v1/ml/predict-batch` - Batch predictions
- `GET /api/v1/ml/models/active` - List active models
- `GET /api/v1/ml/models/:modelId` - Get model details
- `GET /api/v1/ml/health` - Health check

**Key Features:**
- Model caching
- Batch processing
- Prediction logging
- Error handling
- Performance metrics

## Data Flow

### Training Workflow
```
1. Upload Dataset
   └─> ml-dataset created
       
2. Create Experiment
   └─> ml-experiment created
   
3. Configure Training Job
   └─> ml-training-job created
   └─> Links to dataset and experiment
   
4. Execute Training (External)
   └─> Update job status
   └─> Store metrics
   
5. Register Model
   └─> ml-model created
   └─> Upload model file
   └─> Link to training job
   └─> Add metrics
   
6. Update Experiment
   └─> Link training job
   └─> Update results
   └─> Mark best model
```

### Inference Workflow
```
1. Mark Model as Active
   └─> Model becomes available for inference
   
2. API Request
   └─> POST /api/v1/ml/predict
   └─> Include model ID and input data
   
3. Process Request
   └─> Validate model is active
   └─> Load model (from cache if available)
   └─> Run prediction
   └─> Log request
   
4. Return Response
   └─> Prediction result
   └─> Confidence score
   └─> Processing time
```

## Technology Stack

### Backend
- **Base Framework:** Apostrophe CMS (Node.js)
- **Database:** MongoDB
- **API:** REST (Express.js routes)
- **File Storage:** UploadFS (supports S3, local, etc.)

### Frontend
- **Admin UI:** Apostrophe Admin UI
- **Forms:** Apostrophe Schema Fields
- **File Upload:** Apostrophe Attachments

### ML Integration Points
- **TensorFlow.js** - For JavaScript-based model inference
- **ONNX Runtime** - For cross-platform model deployment
- **Python Integration** - Via external scripts and API calls

## Client Libraries

### Python Client (`ml_client.py`)
- Full API access
- Helper classes for common operations
- Batch processing support
- Error handling

### JavaScript Client (`ml-client.js`)
- Browser and Node.js compatible
- Promise-based API
- Fetch API implementation
- Type-safe operations

## Security Considerations

### Authentication
- Apostrophe's built-in authentication
- Optional API key support
- Role-based access control

### Data Protection
- File upload validation
- Size limits
- Secure storage
- Access control per piece

### API Security
- Input validation
- Rate limiting (can be added)
- CORS configuration
- HTTPS in production

## Scalability

### Horizontal Scaling
- Stateless API design
- Model caching per instance
- Load balancer compatible

### Storage Scaling
- S3-compatible storage
- CDN for model files
- Database sharding support

### Performance Optimization
- Batch prediction support
- Model caching
- Lazy loading
- Connection pooling

## Extension Points

### Custom Model Types
Add new model types by extending choices in `ml-model`:
```javascript
modelType: {
  choices: [
    // Add new types here
    { label: 'XGBoost', value: 'xgboost' }
  ]
}
```

### Custom Metrics
Extend metrics schema in `ml-model`:
```javascript
metrics: {
  schema: [
    // Add custom metrics
    { name: 'customMetric', type: 'float', label: 'Custom Metric' }
  ]
}
```

### Additional API Endpoints
Add new routes in `ml-inference-api`:
```javascript
apiRoutes(self) {
  return {
    post: {
      async '/api/v1/ml/custom-endpoint'(req) {
        // Implementation
      }
    }
  };
}
```

### Custom Preprocessing
Add preprocessing modules:
```javascript
modules: {
  'ml-preprocessing': {
    // Preprocessing logic
  }
}
```

## Deployment Considerations

### Development
- Local MongoDB
- Local file storage
- Hot reload with nodemon

### Staging
- Hosted MongoDB (Atlas)
- S3 storage
- SSL certificates
- CI/CD integration

### Production
- Clustered MongoDB
- CDN for static assets
- Load balancer
- Monitoring and logging
- Backup strategies
- Disaster recovery

## Monitoring and Observability

### Metrics to Track
- Prediction latency
- Model usage statistics
- Error rates
- Storage usage
- API response times

### Logging
- Prediction requests
- Model uploads
- Training job status
- Errors and exceptions

### Alerting
- Model inference failures
- Storage capacity
- Database connectivity
- API downtime

## Future Enhancements

### Potential Features
1. **AutoML Integration** - Automated model selection and tuning
2. **Model Serving** - Dedicated inference servers
3. **Streaming Predictions** - Real-time prediction streams
4. **Model Monitoring** - Drift detection and performance tracking
5. **A/B Testing** - Compare model versions in production
6. **Feature Store** - Centralized feature management
7. **Pipeline Orchestration** - Automated ML pipelines
8. **Notebook Integration** - Jupyter notebook support
9. **Visualization Dashboard** - Metrics and analytics
10. **Model Marketplace** - Share and discover models

## Resources

- **Documentation:** `ML-TOOLS-GUIDE.md`
- **Quick Start:** `QUICKSTART.md`
- **API Clients:** `scripts/ml-utils/README.md`
- **Apostrophe Docs:** https://docs.apostrophecms.org/

## Support

For issues or questions:
1. Check the documentation
2. Review example scripts
3. Test with the workflow example
4. Consult Apostrophe CMS documentation
