import { PluginSignatureStatus } from './plugin.js';

function isUnsignedPluginSignature(signature) {
  return signature && signature !== PluginSignatureStatus.valid && signature !== PluginSignatureStatus.internal;
}

export { isUnsignedPluginSignature };
//# sourceMappingURL=pluginSignature.js.map
