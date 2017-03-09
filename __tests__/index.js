let tasks;

const runTask = jest.fn((taskName, context = []) => {
    const task = tasks[taskName];
    task.context = [taskName, ...context];
    return task.task();
});

class Task {
    constructor(name, task) {
        this.name = name;
        this.task = task.bind(this);
        this.context = [];
    }

    run(taskName) {
        return runTask(taskName, this.context);
    }
}

const userTasks = {
    a() {
        this.run('b');
    },
    b() {
        this.run('c');
        this.run('d');
    },
    c() {},
    d() {},
};

tasks = Object.keys(userTasks).reduce((ohTasks, taskName) =>
    Object.assign(ohTasks, {
        [taskName]: new Task(taskName, userTasks[taskName]),
    }), {});

test('run is called', () => {
    runTask('a');
    expect(runTask).toBeCalledWith('a');
    expect(runTask).toBeCalledWith('b', ['a']);
    expect(runTask).toBeCalledWith('c', ['b', 'a']);

    runTask('b');
    expect(runTask).toBeCalledWith('b');
    expect(runTask).toBeCalledWith('c', ['b']);
    expect(runTask).toBeCalledWith('d', ['b']);
});
