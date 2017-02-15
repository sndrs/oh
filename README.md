# Oh

POC of a tiny task runner.

## Development

- `yarn install`
- `yarn link` to add the local binary to your path (you need `yarn@~0.19.0` for `link` to work)

## Structure
- `index.js` the task runner
- `bin.js` the binary that points at `index.js`
- `ohfile.js` task manifest – this is the file you'd expect to see in a project root

## Todo
- [ ] accept task names as input `oh x` etc
- [ ] add quiet mode (no task logging except errors)