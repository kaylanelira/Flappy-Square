// update app with the item on screen
function renderToDo(todo) {
    // first element of html class 'js-todo-list'
    const list = document.querySelector('.js-todo-list');
    // selecting current todo item
    const item = document.querySelector(`[data-key='${todo.id}']`);
    // if deleted is true deleting
    if (todo.deleted) {
        item.remove();
        return;
    }
    // check if 'todo.checked' is true -> assign isChecked
    const isChecked = todo.checked ? 'done' : '';
    // creating element and assigning to node
    const node = document.createElement("li");
    // set class and data-key attribute
    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', todo.id);
    // setting contents of the li list item
    node.innerHTML = `
        <input id="${todo.id}" type="checkbox"/>
        <label for="${todo.id}" class="tick js-tick"></label>
        <span>${todo.text}  </span>
        <button class="delete-todo js-delete-todo">✗</button>
    `;
    
    // if item exist replace with toggle, else add item
    if (item) list.replaceChild(node, item);
    else list.append(node);
}

// creating new to do object with input and push it into 'todoItems'
function addToDo(text) {
    const todo = {
        text,
        checked: false,
        id: Date.now(),     // makes id unique
    };

    todoItems.push(todo);
    renderToDo(todo);
};

// marking to do item as completed
function  markCompletedToDo(key) {
    const index = todoItems.findIndex(item => item.id === Number(key));
    todoItems[index].checked = !todoItems[index].checked;   // if checked, uncheck; else, check
    renderToDo(todoItems[index]);
}

// marking to do item as deleted
function deleteToDo(key) {
    const index = todoItems.findIndex(item => item.id === Number(key));
    // creating new object with deleted property
    const todo = {
        deleted: true,
        ...todoItems[index]
    };
    todoItems = todoItems.filter(item => item.id !== Number(key));
    renderToDo(todo);
}

// seting up array that will hold list items
let todoItems = [];

// selecting form element with specified CSS selectors
const form = document.querySelector('.js-form');
form.addEventListener('submit', event => {
    // preventing page refresh when form is submmited
    event.preventDefault();
    // selecting input
    const input = document.querySelector('.js-todo-input');
    // get input value
    const text = input.value.trim();
    if (text !== '') {
        addToDo(text);
        input.value = '';
        input.focus();
    }
});

const list = document.querySelector('.js-todo-list');
list.addEventListener('click', event => {
    const itemKey = event.target.parentElement.dataset.key;
    // Mark completed task
    if (event.target.classList.contains('js-tick')) {
        markCompletedToDo(itemKey);
    }
    // Delete task
    if (event.target.classList.contains('js-delete-todo')) {
        deleteToDo(itemKey);
    }
});

