import { IExecuteFunctions } from 'n8n-workflow';
import { INodeType, INodeTypeDescription, IDataObject, INodeExecutionData } from 'n8n-workflow';

import {
	straicoResourceOperations,
	modelsOperations,
	promptCompletionOperations,
	promptCompletionFields,
	ragOperations,
	ragFields,
	agentsOperations,
} from './StraicoDescription';

export class Straico implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Straico',
		name: 'straico',
		icon: 'file:straico.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Straico API',
		defaults: {
			name: 'Straico',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'straicoApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.straico.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			...straicoResourceOperations,
			...modelsOperations,
			...promptCompletionOperations,
			...promptCompletionFields,
			...ragOperations,
			...ragFields,
			...agentsOperations,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		let responseData;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				// Handle different resources
				if (resource === 'models') {
					// GET /v0/models
					responseData = await this.helpers.requestWithAuthentication.call(this, 'straicoApi', {});
				} else if (resource === 'promptCompletion') {
					if (operation === 'execute') {
						// POST /v0/prompt/completion
						const model = this.getNodeParameter('model', i) as string;
						const message = this.getNodeParameter('message', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body = {
							model,
							message,
							...additionalFields,
						};

						responseData = await this.helpers.requestWithAuthentication.call(this, 'straicoApi', {
							method: 'POST',
							body,
						});
					}
				} else if (resource === 'rag') {
					const ragId = this.getNodeParameter('ragId', i) as string;

					if (operation === 'get') {
						// GET /v0/rag/{ragId}
						responseData = await this.helpers.requestWithAuthentication.call(this, 'straicoApi', {
							url: `/v0/rag/${ragId}`,
						});
					} else if (operation === 'delete') {
						// DELETE /v0/rag/{ragId}
						responseData = await this.helpers.requestWithAuthentication.call(this, 'straicoApi', {
							method: 'DELETE',
							url: `/v0/rag/${ragId}`,
						});
					} else if (operation === 'update') {
						// PUT /v0/rag/{ragId}
						const fileBinaryData = this.getNodeParameter('fileBinaryData', i) as boolean;

						if (fileBinaryData) {
							// Handle file upload with form-data
							const fileDataField = this.getNodeParameter('fileDataField', i) as string;
							const item = items[i];
							const headers: IDataObject = {
								'Content-Type': 'multipart/form-data',
							};

							// Prepare for file upload
							const options: IDataObject = {
								method: 'PUT',
								url: `/v0/rag/${ragId}`,
								headers,
							};

							// Handle binary data
							if (item.binary && item.binary[fileDataField]) {
								const binaryData = item.binary[fileDataField];
								const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(i, fileDataField);

								const formData: IDataObject = {};
								formData['file'] = {
									value: binaryDataBuffer,
									options: {
										filename: binaryData.fileName || 'file',
									},
								};

								options.formData = formData;
							}

							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'straicoApi',
								options,
							);
						} else {
							// Handle update without file
							responseData = await this.helpers.requestWithAuthentication.call(this, 'straicoApi', {
								method: 'PUT',
								url: `/v0/rag/${ragId}`,
							});
						}
					} else if (operation === 'prompt') {
						// POST /v0/rag/{ragId}/prompt
						const prompt = this.getNodeParameter('prompt', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						// Create form-data for the prompt
						const formData: IDataObject = {};
						formData['prompt'] = prompt;

						// Add additional fields to form data
						if (additionalFields.temperature) {
							formData['temperature'] = additionalFields.temperature;
						}

						if (additionalFields.max_tokens) {
							formData['max_tokens'] = additionalFields.max_tokens;
						}

						responseData = await this.helpers.requestWithAuthentication.call(this, 'straicoApi', {
							method: 'POST',
							url: `/v0/rag/${ragId}/prompt`,
							headers: {
								'Content-Type': 'multipart/form-data',
							},
							formData,
						});
					}
				} else if (resource === 'agents') {
					if (operation === 'get') {
						// GET /v0/agents
						responseData = await this.helpers.requestWithAuthentication.call(this, 'straicoApi', {
							url: '/v0/agents',
						});
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData);
				} else {
					returnData.push(responseData as IDataObject);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
