const babel = require('@babel/core');
const fs = require('fs');

const code = `
import { View } from 'react-native';
export default function App() {
  return <View className="flex-1 bg-black" />;
}
`;

const output = babel.transformSync(code, {
  filename: 'test.tsx',
  presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
});

console.log(output.code);
