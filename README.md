# Demo for `--bundle=false` builds

When building a Node app that is not bundled, we're not able to import workspace libs. 

This repo demonstrates one method of supporting workspace libs, which is to register a custom resolver when running the built app.

```bash
# Run the custom build that copies register.js and manifest.json files.
npx nx bbuild

# Run node with the register module to support workspace lib imports.
node -r ./dist/api/.nx/register.js dist/api/src/main.js
```

## TODO

- The manifest and register module should be in the output automatically.
- Maybe import the register module automatically in the main.js output file (so you don't need `node -r ...`).
- Update `package.json` to point to the right unbundled entry (e.g. `./src/index.js`).
