/** 测试引导：sqljs 不支持 enum 列，先打补丁再加载测试（生产 MySQL 不受影响） */
require('reflect-metadata');
const columnModule = require('typeorm/decorator/columns/Column');

const originalColumn = columnModule.Column;
columnModule.Column = function patchedColumn(...args) {
  for (const arg of args) {
    if (arg && typeof arg === 'object') {
      if (arg.type === 'enum') {
        arg.type = 'varchar';
      }
      if ('enum' in arg) {
        delete arg.enum;
      }
    }
  }
  return originalColumn(...args);
};

require('../dist-test/test/designFlow.test.js');
