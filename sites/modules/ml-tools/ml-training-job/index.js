export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Training Job',
    pluralLabel: 'Training Jobs',
    alias: 'mlTrainingJob',
    quickCreate: false,
    searchable: true,
    autopublish: true
  },
  fields: {
    add: {
      jobName: {
        type: 'string',
        label: 'Job Name',
        required: true
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
            label: 'Scikit-learn',
            value: 'sklearn'
          },
          {
            label: 'Custom',
            value: 'custom'
          }
        ]
      },
      trainingDataset: {
        type: 'relationship',
        label: 'Training Dataset',
        withType: 'ml-dataset',
        max: 1,
        required: true
      },
      validationDataset: {
        type: 'relationship',
        label: 'Validation Dataset',
        withType: 'ml-dataset',
        max: 1
      },
      status: {
        type: 'select',
        label: 'Status',
        def: 'pending',
        choices: [
          {
            label: 'Pending',
            value: 'pending'
          },
          {
            label: 'Running',
            value: 'running'
          },
          {
            label: 'Completed',
            value: 'completed'
          },
          {
            label: 'Failed',
            value: 'failed'
          },
          {
            label: 'Cancelled',
            value: 'cancelled'
          }
        ]
      },
      hyperparameters: {
        type: 'string',
        label: 'Hyperparameters',
        textarea: true,
        help: 'Training hyperparameters in JSON format'
      },
      epochs: {
        type: 'integer',
        label: 'Epochs',
        def: 10
      },
      batchSize: {
        type: 'integer',
        label: 'Batch Size',
        def: 32
      },
      learningRate: {
        type: 'float',
        label: 'Learning Rate',
        def: 0.001
      },
      optimizer: {
        type: 'select',
        label: 'Optimizer',
        choices: [
          {
            label: 'Adam',
            value: 'adam'
          },
          {
            label: 'SGD',
            value: 'sgd'
          },
          {
            label: 'RMSprop',
            value: 'rmsprop'
          },
          {
            label: 'AdaGrad',
            value: 'adagrad'
          }
        ]
      },
      description: {
        type: 'string',
        label: 'Description',
        textarea: true
      },
      trainingScript: {
        type: 'attachment',
        label: 'Training Script',
        help: 'Upload training script (.py, .js, etc.)',
        fileGroup: 'office'
      },
      logFile: {
        type: 'attachment',
        label: 'Training Log',
        help: 'Training logs and metrics',
        fileGroup: 'office'
      },
      resultModel: {
        type: 'relationship',
        label: 'Result Model',
        withType: 'ml-model',
        max: 1,
        help: 'The trained model produced by this job'
      },
      startedAt: {
        type: 'date',
        label: 'Started At'
      },
      completedAt: {
        type: 'date',
        label: 'Completed At'
      },
      trainingMetrics: {
        type: 'object',
        label: 'Training Metrics',
        schema: [
          {
            name: 'finalLoss',
            type: 'float',
            label: 'Final Loss'
          },
          {
            name: 'finalAccuracy',
            type: 'float',
            label: 'Final Accuracy'
          },
          {
            name: 'bestEpoch',
            type: 'integer',
            label: 'Best Epoch'
          }
        ]
      },
      errorMessage: {
        type: 'string',
        label: 'Error Message',
        textarea: true
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [ 'jobName', 'modelType', 'description', 'status' ]
      },
      datasets: {
        label: 'Datasets',
        fields: [ 'trainingDataset', 'validationDataset' ]
      },
      configuration: {
        label: 'Configuration',
        fields: [ 'hyperparameters', 'epochs', 'batchSize', 'learningRate', 'optimizer' ]
      },
      execution: {
        label: 'Execution',
        fields: [ 'trainingScript', 'logFile', 'startedAt', 'completedAt' ]
      },
      results: {
        label: 'Results',
        fields: [ 'trainingMetrics', 'resultModel', 'errorMessage' ]
      }
    }
  }
};
