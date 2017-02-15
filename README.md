# Oh

POC of a tiny task-runner.

## Development

- `yarn install`
- `yarn link` to add the local binary to your path (you need `yarn@~0.19.0` for `link` to work)
- only tried with Node 6 so far

## Structure
- `index.js` the task runner
- `bin.js` the binary that points at `index.js`
- `ohfile.js` task manifest – this is the file you'd expect to see in a project root

## Todo
- [ ] accept task names as input `oh x` etc
- [ ] add quiet mode (no task logging except errors)
- [ ] show that tasks are subtasks in the terminal
- [ ] settle on a better name that `ohfile.js`