'use strict';

class Todo {
	constructor(form, input, todoList, todoContainer, todoCompleted){
		this.form = document.querySelector(form);
		this.input = document.querySelector(input);
		this.todoList = document.querySelector(todoList);
		this.todoContainer = document.querySelector(todoContainer);
		this.todoCompleted = document.querySelector(todoCompleted);
		this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
	}

	addToStorage(){
		localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
	}

	render(){
		this.todoList.textContent = '';
		this.todoCompleted.textContent = '';
		this.todoData.forEach(this.createItem, this);
		this.addToStorage();
	}

	createItem(todo){
		const li = document.createElement('li');
		li.classList.add('todo-item');
		li.key = todo.key;
		li.insertAdjacentHTML('beforeend', `
			<span class="text-todo">${todo.value}</span>
			<div class="todo-buttons">
				<button class="todo-edit"></button>
				<button class="todo-remove"></button>
				<button class="todo-complete"></button>
			</div>	
		`);

		if(todo.completed){
			this.todoCompleted.append(li);
		} else {
			this.todoList.append(li);
		}
	}

	addTodo(e){
		e.preventDefault();
		if(this.input.value.trim() !== ''){
			const newTodo = {
				value: this.input.value,
				completed: false,
				key: this.generateKey(),
			};
			this.todoData.set(newTodo.key, newTodo);

			this.render();
		} else {
			alert('Пустое поле!');
		}
		this.input.value = '';
	}

	generateKey(){
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	deleteItem(index){
		this.todoData.delete(index);
		this.addToStorage();
	}

	completedItem(item){
		item.completed = !item.completed;
		this.render();
	}
	
	handler(){
		this.todoContainer.addEventListener('click', (event) => {
			let target = event.target;

			if(target.matches('.todo-complete')){
				target = target.closest('.todo-item');//пришлось оставить так, а то иначе не работало
				this.todoData.forEach(item => {
					if(item.key === target.key){
						this.completedItem(item);
					}
				});
			} else if(target.matches('.todo-remove')){
				target = target.closest('.todo-item');//пришлось оставить так, а то иначе не работало
				this.todoData.forEach((item, index) => {
					if(item.key === target.key){
						this.deleteItem(index);
						target.remove();
					}
				});
			}
		});
	}

	init(){
		this.form.addEventListener('submit', this.addTodo.bind(this));
		this.render();
	}
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-container', '.todo-completed');

todo.init();
todo.handler();