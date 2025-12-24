export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'ML Model',
    pluralLabel: 'ML Models',
    alias: 'mlModel',
    quickCreate: false,
    searchable: true,
    autopublish: true
  },
  // Add indexes for performance
  indexes: [
    {
      // Index for active models query
      key: { active: 1 }
    },
    {
      // Compound index for model type and active status
      key: { modelType: 1, active: 1 }
    }
  ],
  fields: {
    add: {
      modelName: {
        type: 'string',
        label: 'Model Name',
        required: true
      },
      modelVersion: {
        type: 'string',
        label: 'Model Version',
        required: true,
        help: 'Semantic version (e.g., 1.0.0)'
      },
      modelType: {
        type: 'select',
        label: 'Model Type',
        required: true,
        choices: [
          {
            label: 'TensorFlow',
            value: 'tensorflow'
          },
          {
            label: 'PyTorch',
            value: 'pytorch'
          },
          {
            label: 'ONNX',
            value: 'onnx'
          },
          {
            label: 'Scikit-learn',
            value: 'sklearn'
          },
          {
            label: 'Custom',
            value: 'custom'
          }
        ]
      },
      framework: {
        type: 'string',
        label: 'Framework',
        help: 'Framework used to create the model'
      },
      modelFile: {
        type: 'attachment',
        label: 'Model File',
        help: 'Upload the trained model file (.h5, .pb, .onnx, .pkl, etc.)',
        fileGroup: 'office'
      },
      configFile: {
        type: 'attachment',
        label: 'Configuration File',
        help: 'Optional model configuration JSON file',
        fileGroup: 'office'
      },
      description: {
        type: 'string',
        label: 'Description',
        textarea: true
      },
      inputShape: {
        type: 'string',
        label: 'Input Shape',
        help: 'Expected input shape (e.g., [224, 224, 3])'
      },
      outputShape: {
        type: 'string',
        label: 'Output Shape',
        help: 'Model output shape'
      },
      metrics: {
        type: 'object',
        label: 'Model Metrics',
        schema: [
          {
            name: 'accuracy',
            type: 'float',
            label: 'Accuracy'
          },
          {
            name: 'precision',
            type: 'float',
            label: 'Precision'
          },
          {
            name: 'recall',
            type: 'float',
            label: 'Recall'
          },
          {
            name: 'f1Score',
            type: 'float',
            label: 'F1 Score'
          }
        ]
      },
      trainingDataset: {
        type: 'relationship',
        label: 'Training Dataset',
        withType: 'ml-dataset',
        max: 1
      },
      tags: {
        type: 'array',
        label: 'Tags',
        titleField: 'tag',
        schema: [
          {
            name: 'tag',
            type: 'string',
            label: 'Tag'
          }
        ]
      },
      active: {
        type: 'boolean',
        label: 'Active for Inference',
        def: false,
        help: 'Mark this model as active for inference API'
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [ 'modelName', 'modelVersion', 'modelType', 'framework', 'description' ]
      },
      files: {
        label: 'Files',
        fields: [ 'modelFile', 'configFile' ]
      },
      specification: {
        label: 'Specification',
        fields: [ 'inputShape', 'outputShape', 'metrics', 'trainingDataset' ]
      },
      metadata: {
        label: 'Metadata',
        fields: [ 'tags', 'active' ]
      }
    }
  }
};
