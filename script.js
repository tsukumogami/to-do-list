"use strict";

let inputTask = document.getElementById('new-task');
let addButton = document.getElementById('add');
let unfinishedTasks = document.getElementById('unfinished-tasks');
let finishedTasks = document.getElementById('finished-tasks');

// create li
function createNewElement(task, isFinished) {
    // li
    let listItem = document.createElement('li');
    // checkbox
    let checkbox = document.createElement('button');
    if (isFinished) {
        checkbox.className = 'material-icons checkbox';
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    } else {
        checkbox.className = 'material-icons checkbox';
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    }
    // label
    let label = document.createElement('label');
    label.innerHTML = task;
    // input
    let input = document.createElement('input');
    input.type = 'text';
    // deleteButton
    let deleteButton = document.createElement('button');
    deleteButton.className = "material-icons delete";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";
    // editButton
    let editButton = document.createElement('button');
    editButton.className = "material-icons edit";
    editButton.innerHTML = "<i class='material-icons'>edit</i>";

    // append
    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);

    return listItem;
}

function addTask() {
    if (inputTask.value) {
        let listItem = createNewElement(inputTask.value, false);
        unfinishedTasks.appendChild(listItem);
        bindTaskEvents(listItem, finishTask);
        inputTask.value = "";
    }
    save();
}

function deleteTask() {
    let listItem = this.parentNode;
    let ul = listItem.parentNode;
    ul.removeChild(listItem);

    save();
}

function editTask() {
    let editButton = this;
    let listItem = this.parentNode;
    let label = listItem.querySelector('label');
    let input = listItem.querySelector('input[type=text]');

    let containsClass = listItem.classList.contains('editMode');
    if (containsClass) {
        label.innerText = input.value;
        editButton.className = 'material-icons edit';
        editButton.innerHTML = "<i class='material-icons'>edit</i>";

        save();
    } else {
        input.value = label.innerText;
        editButton.className = 'material-icons save';
        editButton.innerHTML = "<i class='material-icons'>save</i>";
    }
    listItem.classList.toggle('editMode');
}

function finishTask() {
    let listItem = this.parentNode;
    let checkbox = listItem.querySelector("button.checkbox");
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box</i>";

    finishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, unfinishTask);

    save();
}

function unfinishTask() {
    let listItem = this.parentNode;
    let checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = 'material-icons checkbox';
    checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";

    unfinishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, finishTask);

    save();
}

function bindTaskEvents(listItem, checkboxEvent) {
    let checkbox = listItem.querySelector('button.checkbox');
    let editButton = listItem.querySelector('button.edit');
    let deleteButton = listItem.querySelector('button.delete');

    checkbox.onclick = checkboxEvent;
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
}

function save() {
    let unfinishedTasksArr = [];
    for (let i = 0; i < unfinishedTasks.children.length; i++) {
        unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }

    let finishedTasksArr = [];
    for (let i = 0; i < finishedTasks.children.length; i++) {
        finishedTasksArr.push(finishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }

    localStorage.removeItem('todo');

    localStorage.setItem('todo', JSON.stringify({
        unfinishedTasks: unfinishedTasksArr,
        finishedTasks: finishedTasksArr
    }));
}

function load() {
    return JSON.parse(localStorage.getItem('todo'));
}

let data = load();

if (data) {
    for (let i = 0; i < data.unfinishedTasks.length; i++) {
        let listItem = createNewElement(data.unfinishedTasks[i], false);
        unfinishedTasks.appendChild(listItem);
        bindTaskEvents(listItem, finishTask);
    }

    for (let i = 0; i < data.finishedTasks.length; i++) {
        let listItem = createNewElement(data.finishedTasks[i], true);
        finishedTasks.appendChild(listItem);
        bindTaskEvents(listItem, unfinishTask);
    }
}

addButton.onclick = addTask;

(function () {
    document.querySelector('input[id=new-task]').addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            addTask();
        }
    });
})();

