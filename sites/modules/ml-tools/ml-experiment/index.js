export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'ML Experiment',
    pluralLabel: 'ML Experiments',
    alias: 'mlExperiment',
    quickCreate: false,
    searchable: true,
    autopublish: true
  },
  fields: {
    add: {
      experimentName: {
        type: 'string',
        label: 'Experiment Name',
        required: true
      },
      experimentId: {
        type: 'string',
        label: 'Experiment ID',
        help: 'Unique identifier for this experiment'
      },
      hypothesis: {
        type: 'string',
        label: 'Hypothesis',
        textarea: true,
        help: 'What are you trying to prove or test?'
      },
      objective: {
        type: 'select',
        label: 'Objective',
        choices: [
          {
            label: 'Maximize Accuracy',
            value: 'max_accuracy'
          },
          {
            label: 'Minimize Loss',
            value: 'min_loss'
          },
          {
            label: 'Maximize F1 Score',
            value: 'max_f1'
          },
          {
            label: 'Minimize Inference Time',
            value: 'min_time'
          },
          {
            label: 'Custom',
            value: 'custom'
          }
        ]
      },
      baselineModel: {
        type: 'relationship',
        label: 'Baseline Model',
        withType: 'ml-model',
        max: 1,
        help: 'Model to compare against'
      },
      trainingJobs: {
        type: 'relationship',
        label: 'Training Jobs',
        withType: 'ml-training-job',
        help: 'All training runs in this experiment'
      },
      bestModel: {
        type: 'relationship',
        label: 'Best Model',
        withType: 'ml-model',
        max: 1,
        help: 'Best performing model from this experiment'
      },
      status: {
        type: 'select',
        label: 'Status',
        def: 'active',
        choices: [
          {
            label: 'Active',
            value: 'active'
          },
          {
            label: 'Completed',
            value: 'completed'
          },
          {
            label: 'Paused',
            value: 'paused'
          },
          {
            label: 'Archived',
            value: 'archived'
          }
        ]
      },
      startDate: {
        type: 'date',
        label: 'Start Date'
      },
      endDate: {
        type: 'date',
        label: 'End Date'
      },
      parameters: {
        type: 'array',
        label: 'Parameters to Tune',
        titleField: 'name',
        schema: [
          {
            name: 'name',
            type: 'string',
            label: 'Parameter Name'
          },
          {
            name: 'type',
            type: 'select',
            label: 'Type',
            choices: [
              { label: 'Float', value: 'float' },
              { label: 'Integer', value: 'integer' },
              { label: 'Categorical', value: 'categorical' }
            ]
          },
          {
            name: 'range',
            type: 'string',
            label: 'Range/Options',
            help: 'e.g., [0.001, 0.1] or [adam, sgd, rmsprop]'
          }
        ]
      },
      results: {
        type: 'object',
        label: 'Experiment Results',
        schema: [
          {
            name: 'totalRuns',
            type: 'integer',
            label: 'Total Runs'
          },
          {
            name: 'bestMetric',
            type: 'float',
            label: 'Best Metric Value'
          },
          {
            name: 'averageMetric',
            type: 'float',
            label: 'Average Metric Value'
          },
          {
            name: 'improvementOverBaseline',
            type: 'float',
            label: 'Improvement Over Baseline (%)'
          }
        ]
      },
      notes: {
        type: 'string',
        label: 'Notes',
        textarea: true
      },
      conclusions: {
        type: 'string',
        label: 'Conclusions',
        textarea: true,
        help: 'Key findings and learnings from this experiment'
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
        fields: [ 'experimentName', 'experimentId', 'hypothesis', 'objective', 'status' ]
      },
      models: {
        label: 'Models',
        fields: [ 'baselineModel', 'bestModel', 'trainingJobs' ]
      },
      configuration: {
        label: 'Configuration',
        fields: [ 'parameters', 'startDate', 'endDate' ]
      },
      results: {
        label: 'Results',
        fields: [ 'results', 'notes', 'conclusions' ]
      },
      metadata: {
        label: 'Metadata',
        fields: [ 'tags' ]
      }
    }
  }
};
