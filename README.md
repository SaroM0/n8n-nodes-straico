# n8n-nodes-straico

This is an n8n community node for Straico API integration. It provides access to Straico's AI capabilities including model information, prompt completion, RAG (Retrieval Augmented Generation), and agent functionality.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Resources](#resources)  
[Example Usage](#example-usage)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```bash
npm install n8n-nodes-straico
```

## Operations

### Models

- **Get**: Fetch a list of available AI models from Straico.

### Prompt Completion

- **Execute**: Send a prompt to the Straico API for AI-powered text completion.

### RAG (Retrieval Augmented Generation)

- **Get**: Retrieve information about a specific RAG instance.
- **Delete**: Remove a RAG instance.
- **Update**: Update a RAG instance, optionally uploading new files for context.
- **Prompt**: Execute a prompt against a RAG instance for context-aware responses.

### Agents

- **Get**: Fetch a list of available agents.

## Credentials

This node uses the Straico API credentials, which require an API key from your Straico account.

The API key is used to authenticate all requests to the Straico API through a Bearer token header.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Straico API documentation](https://docs.straico.com)

## Example Usage

### Using the Model Resource

1. Create a new workflow
2. Add a Straico node
3. Select "Model" as the resource
4. Select "Get" as the operation
5. Add your Straico API credentials
6. Run the node to see a list of available models

### Executing a Prompt

1. Create a new workflow
2. Add a Straico node
3. Select "Prompt Completion" as the resource
4. Select "Execute" as the operation
5. Enter a model ID (e.g., "gpt-4o-mini")
6. Enter your message/prompt
7. Optionally set temperature and max_tokens in the additional fields
8. Run the node to get AI-generated completions

### Using RAG for Enhanced Responses

1. Create a new workflow
2. Add a Straico node
3. Select "RAG" as the resource
4. Select "Get", "Delete", "Update", or "Prompt" as the operation
5. Enter your RAG ID
6. For "Update" operations, you can optionally upload files
7. For "Prompt" operations, enter your query to receive context-aware responses
8. Run the node to interact with your RAG instance

## License

[MIT](LICENSE.md)
