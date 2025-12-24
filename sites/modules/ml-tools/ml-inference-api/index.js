export default {
  options: {
    alias: 'mlInferenceApi',
    // Cache configuration
    cache: {
      maxSize: 10, // Maximum number of models to cache
      ttl: 3600000 // Time to live in milliseconds (1 hour)
    }
  },
  
  async init(self) {
    // Initialize model cache with size limit
    self.modelCache = new Map();
    self.cacheTimestamps = new Map();
  },

  apiRoutes(self) {
    return {
      post: {
        // Predict endpoint
        async '/api/v1/ml/predict'(req) {
          try {
            const { modelId, input } = req.body;

            if (!modelId || !input) {
              throw self.apos.error('invalid', 'Model ID and input are required');
            }

            // Get the model
            const model = await self.apos.mlModel.find(req, { _id: modelId }).toOne();
            
            if (!model) {
              throw self.apos.error('notfound', 'Model not found');
            }

            if (!model.active) {
              throw self.apos.error('invalid', 'Model is not active for inference');
            }

            // Log the prediction request
            await self.logPrediction(req, {
              modelId,
              timestamp: new Date(),
              inputShape: JSON.stringify(input).length
            });

            // Return mock prediction for now
            // In production, this would load and run the actual model
            return {
              modelId,
              modelName: model.modelName,
              modelVersion: model.modelVersion,
              prediction: {
                result: 'Mock prediction result',
                confidence: 0.95,
                processingTime: 0.123
              },
              timestamp: new Date().toISOString()
            };
          } catch (error) {
            throw self.apos.error('error', error.message);
          }
        },

        // Batch predict endpoint
        async '/api/v1/ml/predict-batch'(req) {
          try {
            const { modelId, inputs } = req.body;

            if (!modelId || !inputs || !Array.isArray(inputs)) {
              throw self.apos.error('invalid', 'Model ID and inputs array are required');
            }

            // Get the model
            const model = await self.apos.mlModel.find(req, { _id: modelId }).toOne();
            
            if (!model) {
              throw self.apos.error('notfound', 'Model not found');
            }

            if (!model.active) {
              throw self.apos.error('invalid', 'Model is not active for inference');
            }

            // Process batch predictions
            const predictions = inputs.map((input, index) => ({
              index,
              result: 'Mock prediction result',
              confidence: 0.9 + Math.random() * 0.1
            }));

            // Log the batch prediction
            await self.logPrediction(req, {
              modelId,
              timestamp: new Date(),
              batchSize: inputs.length
            });

            return {
              modelId,
              modelName: model.modelName,
              modelVersion: model.modelVersion,
              predictions,
              batchSize: inputs.length,
              timestamp: new Date().toISOString()
            };
          } catch (error) {
            throw self.apos.error('error', error.message);
          }
        }
      },

      get: {
        // Get active models
        async '/api/v1/ml/models/active'(req) {
          try {
            // Support pagination to handle large numbers of models
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 50;
            
            const query = self.apos.mlModel.find(req, { active: true }).for('public');
            
            // Get total count
            const count = await query.toCount();
            
            // Get paginated results
            const models = await query
              .page(page)
              .perPage(perPage)
              .toArray();
            
            return {
              models: models.map(model => ({
                id: model._id,
                name: model.modelName,
                version: model.modelVersion,
                type: model.modelType,
                inputShape: model.inputShape,
                outputShape: model.outputShape
              })),
              count,
              page,
              perPage,
              totalPages: Math.ceil(count / perPage)
            };
          } catch (error) {
            throw self.apos.error('error', error.message);
          }
        },

        // Get model info
        async '/api/v1/ml/models/:modelId'(req) {
          try {
            const { modelId } = req.params;
            
            const model = await self.apos.mlModel.find(req, { _id: modelId }).toOne();
            
            if (!model) {
              throw self.apos.error('notfound', 'Model not found');
            }

            return {
              id: model._id,
              name: model.modelName,
              version: model.modelVersion,
              type: model.modelType,
              framework: model.framework,
              description: model.description,
              inputShape: model.inputShape,
              outputShape: model.outputShape,
              metrics: model.metrics,
              active: model.active,
              createdAt: model.createdAt,
              updatedAt: model.updatedAt
            };
          } catch (error) {
            throw self.apos.error('error', error.message);
          }
        },

        // Health check
        async '/api/v1/ml/health'(req) {
          return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
          };
        }
      }
    };
  },

  methods(self) {
    return {
      // Log prediction for analytics
      async logPrediction(req, data) {
        // Use Apostrophe's logging system instead of console.log
        self.apos.util.log('info', 'Prediction logged:', data);
        
        // In production, also store in database or external logging service
        // Example: await self.apos.db.collection('ml-predictions').insertOne(data);
      },

      // Load model into memory with cache management
      async loadModel(modelId) {
        // Check if model is in cache and not expired
        if (self.modelCache.has(modelId)) {
          const timestamp = self.cacheTimestamps.get(modelId);
          const age = Date.now() - timestamp;
          
          if (age < self.options.cache.ttl) {
            // Update timestamp for LRU on cache hit
            self.cacheTimestamps.set(modelId, Date.now());
            return self.modelCache.get(modelId);
          } else {
            // Cache expired, remove it
            self.modelCache.delete(modelId);
            self.cacheTimestamps.delete(modelId);
          }
        }

        // Check cache size limit before adding new model
        if (self.modelCache.size >= self.options.cache.maxSize) {
          // Implement true LRU eviction: find and remove least recently used entry
          let oldestKey = null;
          let oldestTime = Date.now();
          
          for (const [key, timestamp] of self.cacheTimestamps.entries()) {
            if (timestamp < oldestTime) {
              oldestTime = timestamp;
              oldestKey = key;
            }
          }
          
          if (oldestKey) {
            self.modelCache.delete(oldestKey);
            self.cacheTimestamps.delete(oldestKey);
          }
        }

        // In production, load the actual model file here
        // Example:
        // const modelDoc = await self.apos.mlModel.find(req, { _id: modelId }).toOne();
        // const modelPath = self.apos.attachment.url(modelDoc.modelFile);
        // const model = await loadActualModel(modelPath);
        
        const mockModel = {
          id: modelId,
          loaded: true,
          timestamp: Date.now()
        };

        self.modelCache.set(modelId, mockModel);
        self.cacheTimestamps.set(modelId, Date.now());
        
        return mockModel;
      },

      // Unload model from memory
      async unloadModel(modelId) {
        if (self.modelCache.has(modelId)) {
          self.modelCache.delete(modelId);
          return true;
        }
        return false;
      }
    };
  }
};
