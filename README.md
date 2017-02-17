# `oh`

In-development PoC of a tiny, development and CI-friendly task-runner.

- verbose by default
- fails visibly then kills itself
- small, simple API

# To do
- [ ] accept task names as input `oh x` etc and make all flags available to tasks
- [ ] add quiet mode (no task logging except errors)
- [ ] show that tasks are subtasks in the terminal
- [ ] autocomplete task names
- [ ] tests!
- [x] parallel tasks

## Why?

- **make** really just wants to make things, and can be too restrictive e.g. it's hard to pass args or use modules from npm
- **npm scripts** can be too terse
- **gulp**/**grunt** et al are hefty and often rely on 3rd party plugins

## Usage
`oh` will look for a task manifest called `oh.js`, for example this one:

```javascript
// oh.js

before(() => {
    log('this happens before all the tasks start');
});

after(() => {
    log('this happens after all the tasks end');
});

// these are your tasks
module.exports = { 
    default() {
        log("I'm going to run the `runABandCinParallel` task");
        run('runABandCinParallel');
    },

    runABandCinParallel() {
        run(['a', 'b', 'c']);
    },

    a: () => exec('ls -l'),
    b: () => exec('ls -a'),
    c: () => exec('ls -G')
};

```
Now you can run `oh` (run the default task, if defined), or `oh runABandCinParallel`, `oh a` etc.

## API
Any function that you `export` from `oh.js` becomes a task.

`oh` provides some helpers for use in `oh.js`.

### log(String)
Tell yourself something about whats going on.

### run(String|Array)
Run another task defined in `oh.js`. 

If you pass an Array of task names, they will run in parallel and return a promise once they have all finished.

If you pass a single task name, it will return whatever that task returns.

### exec(String)
Executes a string as a terminal command, using local binaries if they're available (like `npm` scripts).

## Built-in tasks

You can also define some setup/teardown-style tasks, which you do not need to export:

### before(function)
*optional* – do something before the tasks start e.g. check the version of node your running in, `npm i` etc.

### after(function)
*optional* – do something after the tasks end e.g. clean up artefacts, restore previous state etc.


## Development
- `yarn install`
- `yarn link` to add the local binary to your path (you need `yarn@^0.19.0` for `link` to work)
- only tried with Node 6 so far

### Files
- `index.js` the task runner
- `oh` the binary that points at `index.js`
- `oh.js` task manifest – this is the file you'd expect to see in a project root

