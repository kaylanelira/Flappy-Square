// seting up array that will hold list items
let todoItems = [];

// creating new to do object with input and push it into 'todoItems'
function addToDo(txt) {
    const todo = {
        txt,
        checked: false,
        id: Date.now(),
    };

    todoItems.push(todo);
    console.log(todoItems);
}

// selecting form element with specified CSS selectors
const form = document.querySelector('.js-form');
//
form.addEventListener('submit', event => {
    // preventing page refresh when form is submmited
    event.preventDefault();
    // selecting input
    const input = document.querySelector('.js-todo-input');
    // get input value
    const txt = input.value.trim();
    if (txt == '') {
        addToDo(txt);
        input.value = '';
        input.focus();
    }
});