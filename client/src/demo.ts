let message : string | number = "asd";// we can do this or
let isComplete = false ; // this cuz the compiler is gonna know the type by the initialiaztion andd u cant change it
message = 1;

type Todo ={
  id:number;
  title: string;
  completed:boolean;
}
let todos : Todo[]=[];

function addTodo(title : string):Todo{
  const newTodo : Todo = {
    id : todos.length + 1,
    title,
    completed : false
  };
  todos.push(newTodo)
  return newTodo;
}

function toggleTodo(id : number) : void{
  const todo = todos.find(todo => todo.id === id);
  if(todo){
    todo.completed = !todo.completed;
  }
}

addTodo("build API")
addTodo("Publish it")
toggleTodo(1);

console.log(todos)
