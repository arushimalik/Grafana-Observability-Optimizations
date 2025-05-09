// This file is a wrapper around the TypeScript webpack configuration
const path = require('path');
const tsNode = require('ts-node');

// Register ts-node to handle TypeScript files
tsNode.register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
  },
});

// Import the TypeScript configuration
const config = require('./.config/webpack/webpack.config.ts');

// Export the configuration
module.exports = config; 
