import { INodeProperties } from 'n8n-workflow';

// Resource Operations definitions
export const straicoResourceOperations: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Model',
				value: 'models',
			},
			{
				name: 'Prompt Completion',
				value: 'promptCompletion',
			},
			{
				name: 'RAG',
				value: 'rag',
			},
			{
				name: 'Agent',
				value: 'agents',
			},
		],
		default: 'models',
		description: 'Resource to use',
	},
];

// Models Resource Operations and Fields
export const modelsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['models'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a list of available models',
				action: 'Get a list of available models',
				routing: {
					request: {
						method: 'GET',
						url: '/v0/models',
					},
				},
			},
		],
		default: 'get',
		noDataExpression: true,
	},
];

// Prompt Completion Resource Operations and Fields
export const promptCompletionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['promptCompletion'],
			},
		},
		options: [
			{
				name: 'Execute',
				value: 'execute',
				description: 'Execute a prompt completion',
				action: 'Execute a prompt completion',
				routing: {
					request: {
						method: 'POST',
						url: '/v0/prompt/completion',
					},
				},
			},
		],
		default: 'execute',
		noDataExpression: true,
	},
];

export const promptCompletionFields: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['promptCompletion'],
				operation: ['execute'],
			},
		},
		default: '',
		description: 'The ID of the model to use for completion',
		placeholder: 'gpt-4o-mini',
		routing: {
			send: {
				type: 'body',
				property: 'model',
			},
		},
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['promptCompletion'],
				operation: ['execute'],
			},
		},
		default: '',
		description: 'The message to complete',
		typeOptions: {
			rows: 4,
		},
		routing: {
			send: {
				type: 'body',
				property: 'message',
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['promptCompletion'],
				operation: ['execute'],
			},
		},
		options: [
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				default: 0.7,
				description:
					'Controls randomness. Lower values are more deterministic, higher values more creative.',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
				},
				routing: {
					send: {
						type: 'body',
						property: 'temperature',
					},
				},
			},
			{
				displayName: 'Max Tokens',
				name: 'max_tokens',
				type: 'number',
				default: 1000,
				description: 'The maximum number of tokens to generate',
				routing: {
					send: {
						type: 'body',
						property: 'max_tokens',
					},
				},
			},
		],
	},
];

// RAG Resource Operations and Fields
export const ragOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['rag'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get details about a RAG',
				action: 'Get details about a RAG',
				routing: {
					request: {
						method: 'GET',
						url: '/v0/rag/={{$parameter["ragId"]}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a RAG',
				action: 'Delete a RAG',
				routing: {
					request: {
						method: 'DELETE',
						url: '/v0/rag/={{$parameter["ragId"]}}',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a RAG',
				action: 'Update a RAG',
				routing: {
					request: {
						method: 'PUT',
						url: '/v0/rag/={{$parameter["ragId"]}}',
					},
				},
			},
			{
				name: 'Prompt',
				value: 'prompt',
				description: 'Execute a RAG prompt',
				action: 'Execute a RAG prompt',
				routing: {
					request: {
						method: 'POST',
						url: '/v0/rag/={{$parameter["ragId"]}}/prompt',
					},
				},
			},
		],
		default: 'get',
		noDataExpression: true,
	},
];

export const ragFields: INodeProperties[] = [
	{
		displayName: 'RAG ID',
		name: 'ragId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['get', 'delete', 'update', 'prompt'],
			},
		},
		default: '',
		description: 'The ID of the RAG',
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['prompt'],
			},
		},
		default: '',
		description: 'The prompt to execute with RAG',
		typeOptions: {
			rows: 4,
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['prompt'],
			},
		},
		options: [
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				default: 0.7,
				description:
					'Controls randomness. Lower values are more deterministic, higher values more creative.',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
				},
			},
			{
				displayName: 'Max Tokens',
				name: 'max_tokens',
				type: 'number',
				default: 1000,
				description: 'The maximum number of tokens to generate',
			},
		],
	},
	{
		displayName: 'File Binary Data',
		name: 'fileBinaryData',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['update'],
			},
		},
		description: 'Whether the request will include file binary data',
	},
	{
		displayName: 'File Data Field',
		name: 'fileDataField',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['update'],
				fileBinaryData: [true],
			},
		},
		description: 'The name of the binary field containing file data to upload',
	},
];

// Agents Resource Operations and Fields
export const agentsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['agents'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a list of agents',
				action: 'Get a list of agents',
				routing: {
					request: {
						method: 'GET',
						url: '/v0/agents',
					},
				},
			},
		],
		default: 'get',
		noDataExpression: true,
	},
];
