var message = "asd"; // we can do this or
var isComplete = false; // this cuz the compiler is gonna know the type by the initialiaztion andd u cant change it
message = 1;
var todos = [];
function addTodo(title) {
    var newTodo = {
        id: todos.length + 1,
        title: title,
        completed: false
    };
    todos.push(newTodo);
    return newTodo;
}
function toggleTodo(id) {
    var todo = todos.find(function (todo) { return todo.id === id; });
    if (todo) {
        todo.completed = !todo.completed;
    }
}
addTodo("build API");
addTodo("Publish it");
toggleTodo(1);
console.log(todos);
