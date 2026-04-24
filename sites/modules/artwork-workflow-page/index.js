/**
 * Artwork Workflow Page
 *
 * A page type that provides the user-facing interface for managing
 * the AI artwork creation workflow. Editors can define concept details,
 * track workflow progress, and record review notes.
 */

export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: 'Artwork Workflow Page'
  },
  fields: {
    add: {
      // Concept Development fields
      artworkTheme: {
        type: 'string',
        label: 'Artwork Theme',
        help: 'Define the central theme or subject for the AI-generated artwork.'
      },
      artworkStyle: {
        type: 'string',
        label: 'Artistic Style',
        help: 'Specify the artistic style (e.g., impressionist, abstract, photorealistic).'
      },
      references: {
        type: 'array',
        label: 'Reference Materials',
        help: 'Collect inspiration sources and reference links for the agents.',
        titleField: 'description',
        fields: {
          add: {
            description: {
              type: 'string',
              label: 'Description',
              required: true
            },
            url: {
              type: 'url',
              label: 'Source URL'
            }
          }
        }
      },
      // Workflow Status fields
      workflowStatus: {
        type: 'select',
        label: 'Workflow Status',
        help: 'Current stage of the artwork creation workflow.',
        choices: [
          { label: 'Draft', value: 'draft' },
          { label: 'In Progress', value: 'in-progress' },
          { label: 'Pending Review', value: 'pending-review' },
          { label: 'Finalized', value: 'finalized' }
        ],
        def: 'draft'
      },
      activeWorkflowId: {
        type: 'string',
        label: 'Active Workflow ID',
        help: 'The identifier of the currently running workflow.'
      },
      selectedVersion: {
        type: 'string',
        label: 'Selected Artwork Version',
        help: 'The version chosen for finalization.'
      },
      // Review & Notes fields
      reviewNotes: {
        type: 'area',
        label: 'Review Notes',
        help: 'Record observations, adjustments, and feedback from each iteration.',
        options: {
          widgets: {
            '@apostrophecms/rich-text': {}
          }
        }
      }
    },
    group: {
      concept: {
        label: 'Concept Development',
        fields: [ 'artworkTheme', 'artworkStyle', 'references' ]
      },
      workflow: {
        label: 'Workflow',
        fields: [ 'workflowStatus', 'activeWorkflowId', 'selectedVersion' ]
      },
      review: {
        label: 'Review & Notes',
        fields: [ 'reviewNotes' ]
      }
    }
  }
};
