export let rpcApiKey: string;

export function init(apiKey: string) {
  // Log the received environment variables
  console.log('Received environment variables:');
  console.log('API Key:', apiKey);
  rpcApiKey = apiKey;
}
