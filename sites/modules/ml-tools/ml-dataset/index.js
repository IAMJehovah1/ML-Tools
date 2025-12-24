export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'ML Dataset',
    pluralLabel: 'ML Datasets',
    alias: 'mlDataset',
    quickCreate: false,
    searchable: true,
    autopublish: true
  },
  fields: {
    add: {
      datasetName: {
        type: 'string',
        label: 'Dataset Name',
        required: true
      },
      datasetVersion: {
        type: 'string',
        label: 'Version',
        required: true,
        help: 'Dataset version (e.g., 1.0.0)'
      },
      datasetType: {
        type: 'select',
        label: 'Dataset Type',
        required: true,
        choices: [
          {
            label: 'Training',
            value: 'training'
          },
          {
            label: 'Validation',
            value: 'validation'
          },
          {
            label: 'Test',
            value: 'test'
          },
          {
            label: 'Production',
            value: 'production'
          }
        ]
      },
      taskType: {
        type: 'select',
        label: 'Task Type',
        required: true,
        choices: [
          {
            label: 'Classification',
            value: 'classification'
          },
          {
            label: 'Regression',
            value: 'regression'
          },
          {
            label: 'Object Detection',
            value: 'object_detection'
          },
          {
            label: 'Segmentation',
            value: 'segmentation'
          },
          {
            label: 'NLP',
            value: 'nlp'
          },
          {
            label: 'Time Series',
            value: 'time_series'
          },
          {
            label: 'Other',
            value: 'other'
          }
        ]
      },
      dataFile: {
        type: 'attachment',
        label: 'Dataset File',
        help: 'Upload dataset file (.csv, .json, .zip, etc.)',
        fileGroup: 'office'
      },
      labelsFile: {
        type: 'attachment',
        label: 'Labels File',
        help: 'Optional labels or annotations file',
        fileGroup: 'office'
      },
      description: {
        type: 'string',
        label: 'Description',
        textarea: true
      },
      numSamples: {
        type: 'integer',
        label: 'Number of Samples',
        help: 'Total number of samples in the dataset'
      },
      numClasses: {
        type: 'integer',
        label: 'Number of Classes',
        help: 'For classification tasks'
      },
      features: {
        type: 'string',
        label: 'Features',
        textarea: true,
        help: 'List of features/columns (JSON format)'
      },
      dataShape: {
        type: 'string',
        label: 'Data Shape',
        help: 'Shape of individual samples (e.g., [224, 224, 3])'
      },
      statistics: {
        type: 'object',
        label: 'Dataset Statistics',
        schema: [
          {
            name: 'mean',
            type: 'string',
            label: 'Mean'
          },
          {
            name: 'std',
            type: 'string',
            label: 'Standard Deviation'
          },
          {
            name: 'min',
            type: 'string',
            label: 'Minimum'
          },
          {
            name: 'max',
            type: 'string',
            label: 'Maximum'
          }
        ]
      },
      preprocessingSteps: {
        type: 'array',
        label: 'Preprocessing Steps',
        titleField: 'step',
        schema: [
          {
            name: 'step',
            type: 'string',
            label: 'Preprocessing Step'
          }
        ]
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
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [ 'datasetName', 'datasetVersion', 'datasetType', 'taskType', 'description' ]
      },
      files: {
        label: 'Files',
        fields: [ 'dataFile', 'labelsFile' ]
      },
      specification: {
        label: 'Specification',
        fields: [ 'numSamples', 'numClasses', 'features', 'dataShape', 'statistics' ]
      },
      processing: {
        label: 'Processing',
        fields: [ 'preprocessingSteps', 'tags' ]
      }
    }
  }
};
