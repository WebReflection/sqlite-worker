'use strict';
const {assign} = Object;
exports.assign = assign;

const isWorker = typeof importScripts === 'function';
const dist = isWorker ? '.' : ({url: __filename}).url.replace(/\/[^/]*$/, '');
exports.dist = dist;

// a dynamic import(...) would've been better but Web platform happens:
// https://stackoverflow.com/questions/44118600/web-workers-how-to-import-modules/45578811#45578811
const load = src => new Promise((resolve, onerror) => {
  const onload = () => {
    const module = self.module.exports;
    delete self.exports;
    // CANNOT DELETE DUE sql.js
    self.module = void 0;
    resolve(module);
  };
  self.exports = {};
  self.module = {exports};
  if (isWorker) {
    importScripts(src);
    onload();
  }
  else {
    const {head} = document;
    assign(
      head.appendChild(
        document.createElement('script')
      ),
      {
        onload() {
          head.removeChild(this);
          onload();
        },
        onerror,
        src
      }
    );
  }
});
exports.load = load;
