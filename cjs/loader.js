'use strict';
// imagine the Web platform is broken so that we can't use import(...) in workers ...
// https://stackoverflow.com/questions/44118600/web-workers-how-to-import-modules/45578811#45578811
module.exports = path => new Promise(resolve => {
  const onImport = () => {
    const module = self.module.exports;
    delete self.exports;
    // CANNOT DELETE DUE sql.js
    self.module = void 0;
    resolve(module);
  };
  self.exports = {};
  self.module = {exports};
  try {
    import(path).then(onImport);
  }
  catch (o_O) {
    importScripts(path);
    onImport();
  }
});
