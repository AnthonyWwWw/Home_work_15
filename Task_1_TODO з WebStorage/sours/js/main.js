function TaskManager(data) {
    const { input, addButton, taskList } = data;
    const LOCAL_STORAGE = 'tasks';

    this.init = function () {
        this.loadTasks();
        addButton.addEventListener('click', () => {
            const inputContent = input.value;
            let newTaskContent = this.checkForCorrectness(inputContent);
            if (newTaskContent) {
                const task = { 
                    id: Math.floor(Math.random() * 100),
                    content: newTaskContent,
                    saveIllumination: 'dontSave',
                }
                this.addTask(task);
                this.renderTask(task);
                this.clearInput();
            }
        });
    };

    this.checkForCorrectness = function (input) {
        if (input.trim() !== '') {
            return input;
        } else {
            alert('Поле має бути заповненим');
            return null;
        }
    };

    this.clearInput = function () {
        input.value = "";
    };

    this.createTaskElement = function (content, id, saveIllumination) {
        const newElement = document.createElement('li');
        newElement.setAttribute('id', id);
        newElement.setAttribute('saveIlluminationMarkDone', saveIllumination);
        newElement.classList.add("taskList_item");
        newElement.textContent = content;

        const removeButton = this.createRemoveButton();
        newElement.appendChild(removeButton);

        const markDoneButton = this.createMarkDoneButton(saveIllumination);
        newElement.appendChild(markDoneButton);

        return newElement;
    };

    this.createMarkDoneButton = function (saveIllumination) {
        const markDoneButton = document.createElement("button");
        markDoneButton.textContent = 'Виконане';
        markDoneButton.classList.add("markDoneButton");
        let bottomClick = saveIllumination === 'dontSave' 
            ? false
            : true;
            
        markDoneButton.addEventListener('mousemove', function (event) {
            const target = event.target;
            if (target.classList.contains('markDoneButton')) {
                target.parentElement.classList.add('illuminationMarkDone');
            }
        });

        markDoneButton.addEventListener('click', function (event) {
            const target = event.target;
            if (target.classList.contains('markDoneButton')) {
                target.parentElement.classList.add('illuminationMarkDone');
                bottomClick = !bottomClick;
                const id = target.parentElement.id;
                const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE));
                const updateMarkDone = tasks.map(task => {
                    if (task.id === Number(id)){
                        task.saveIllumination = task.saveIllumination === 'dontSave'
                        ? 'save'
                        : 'dontSave';
                        return task;
                    }

                    return task;
                });
                localStorage.setItem(LOCAL_STORAGE, JSON.stringify(updateMarkDone));
            }
        });

        markDoneButton.addEventListener('mouseout', function (event) {
            const target = event.target;
            if (target.classList.contains('markDoneButton') && !bottomClick) {
                target.parentElement.classList.remove('illuminationMarkDone');
            }
        });

        return markDoneButton;
    };

    this.createRemoveButton = function () {
        const removeButton = document.createElement('button');
        removeButton.classList.add("buttonRemoveTask");
        removeButton.textContent = "Видалити";
        
        removeButton.addEventListener('click', function (event) {
            const target = event.target;
            if (target.classList.contains("buttonRemoveTask")) {
                const id = target.parentElement.id;
                const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE));
                const updatedTasks = tasks.filter(task => task.id !== Number(id));
                localStorage.setItem(LOCAL_STORAGE, JSON.stringify(updatedTasks));
                target.parentElement.remove();
            }
        });
        
        removeButton.addEventListener('mouseout', function (event) {
            const target = event.target;
            if (target.classList.contains("buttonRemoveTask")) {
                target.parentElement.classList.remove("illuminationRemove");
            }
        });

        removeButton.addEventListener('mouseover', function (event) {
            const target = event.target;
            if (target.classList.contains("buttonRemoveTask")) {
                target.parentElement.classList.add("illuminationRemove");
            }
        });

        return removeButton;
    };

    this.addTask = function (task) {
        const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE)) || [];
        const isExist = tasks.some(item => item.id === task.id);
        if (isExist) {
            let newId;
            do {
                newId = Math.floor(Math.random() * 1000);
            } while (tasks.some(item => item.id === newId));
            task.id = newId;
        }
        
        tasks.push(task);
        localStorage.setItem(LOCAL_STORAGE, JSON.stringify(tasks));
    };

    this.renderTask = function (task) {
        const newElement = this.createTaskElement(task.content, task.id, task.saveIllumination);
        if (newElement.getAttribute('saveIlluminationMarkDone') !== 'dontSave'){
            newElement.classList.add('illuminationMarkDone');
        }
        taskList.appendChild(newElement);
    };

    this.loadTasks = function () {
        const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE)) || [];
        tasks.forEach(task => this.renderTask(task));
    };
}

(new TaskManager({
    input: document.querySelector('#input'),
    addButton: document.querySelector('#buttonAddLink'),
    taskList: document.querySelector('#taskList'),
})).init();
