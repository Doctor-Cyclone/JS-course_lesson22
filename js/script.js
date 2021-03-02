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
		li.contentEditable = 'false';
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

	animationRemoveItem(todoItem){
		todoItem.style.transition = 'all .3s linear';
		todoItem.style.transform = 'scale(0)';
	}

	animationCompletedItem(todoItem){
		todoItem.style.transition = 'all .2s linear';
		todoItem.style.opacity = '0';
	}

	editItem(todoItem, spanItem, item){
		if(todoItem.contentEditable === 'false'){
			todoItem.contentEditable = 'true';
			todoItem.focus();
			todoItem.style.border = '2px solid black';
		} else {
			todoItem.contentEditable = 'false';
			todoItem.style.border = 'none';
			if(spanItem === null){
				alert('Пустая строка!');
				console.log(spanItem);
				spanItem.innerHTML = item.value;
			} else {
				item.value = spanItem.innerHTML;
				this.addToStorage();	
			}
		}
	}
	
	handler(){
		this.todoContainer.addEventListener('click', (event) => {
			const target = event.target,
				todoItem = target.closest('.todo-item');


			if(target.matches('.todo-complete')){
				this.todoData.forEach(item => {
					if(item.key === todoItem.key){
						this.animationCompletedItem(todoItem);
						setTimeout(() => {
							this.completedItem(item);
						}, 500);
					}
				});
			} else if(target.matches('.todo-remove')){	
				this.todoData.forEach((item, index) => {
					if(item.key === todoItem.key){
						this.animationRemoveItem(todoItem);
						this.deleteItem(index);
						setTimeout(() => {	
							todoItem.remove();
						}, 500);
					}
				});
			} else if(target.matches('.todo-edit')){	
				this.todoData.forEach((item) => {
					if(item.key === todoItem.key){
						const spanItem = todoItem.querySelector('.text-todo');
						this.editItem(todoItem, spanItem, item);
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