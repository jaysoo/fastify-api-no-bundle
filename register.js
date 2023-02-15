/**
 * IMPORTANT: Do not modify this file.
 * This file allows the app to run without bundling in workspace libraries.
 * Must be contained in the ".nx" folder inside the output path.
 */
const Module = require('module');
const path = require('path');
const fs = require('fs');
const originalResolveFilename = Module._resolveFilename;
const manifest = require('./manifest.json');
const distPath = path.join(__dirname, '..');


Module._resolveFilename = function(request, parent) {
  const entry = manifest.find(x => request === x.module || request.startsWith(`${x.module}/`));

  if (entry) {
    if (request === entry.module) {
      const candidate = path.join(distPath, entry.main);
      if (fs.statSync(candidate).isFile()) {
        const modifiedArguments = [candidate, ...[].slice.call(arguments, 1)];
        return originalResolveFilename.apply(this, modifiedArguments);
      }
    } else {
      if (/\.[cm]?\.js$/.test(request)) {
        const candidate = path.join(distPath, entry.root, request.replace(entry.module, ''));
        if (fs.statSync(candidate).isFile()) {
          const modifiedArguments = [candidate, ...[].slice.call(arguments, 1)];
          return originalResolveFilename.apply(this, modifiedArguments);
        }
      } else {
        const candidates = [
          path.join(distPath, entry.root, `${request.replace(entry.module, '')}.js`),
          path.join(distPath, entry.root, `${request.replace(entry.module, '')}.mjs`),
          path.join(distPath, entry.root, `${request.replace(entry.module, '')}.cjs`)
        ];
        const candidate = candidates.find(f => fs.statSync(f).isFile());
        if (candidate) {
          const modifiedArguments = [candidate, ...[].slice.call(arguments, 1)];
          return originalResolveFilename.apply(this, modifiedArguments);
        }
      }

    }
  }

  return originalResolveFilename.apply(this, arguments);
};
