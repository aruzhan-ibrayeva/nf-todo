'use client'
import TaskList from './components/TaskList';
import { useState, useEffect } from 'react';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all');

    // hard level implementation with useEffect:
    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
            setTasks(storedTasks);
        }
    }, []);


    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]); 


    const handleAddTask = () => {
        if (!inputValue) return;

        const newTask = {
            id: Date.now(),  //for unique ids
            text: inputValue,
            completed: false,
        };

        setTasks([...tasks, newTask]);
        setInputValue('');
    };

    const handleToggleTask = (id) => {
        const updatedTasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleDeleteTask = (id) => {
        const remainingTasks = tasks.filter((task) => task.id !== id);
        setTasks(remainingTasks);
    };

    const clearCompleted = () => {
        setTasks(tasks.filter(task => !task.completed));
    };

    const getFilteredTasks = () => {
        switch (filter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold">TODO</h1>
            </div>
            <div className="mb-4 flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="bg-gray-800 text-white border-none rounded p-4 flex-grow"
                    placeholder="What to do ?"
                />
                <button
                    onClick={handleAddTask}
                    className="bg-blue-500 text-white p-4 rounded ml-4"
                >
                    Add Task
                </button>
            </div>
            <TaskList
                tasks={getFilteredTasks()}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
            />
            <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                <span>{tasks.filter(task => !task.completed).length} items left</span>
                <div>
                    <button onClick={() => setFilter('all')} className={`mr-2 ${filter === 'all' ? 'text-white' : ''}`}>All</button>
                    <button onClick={() => setFilter('active')} className={`mr-2 ${filter === 'active' ? 'text-white' : ''}`}>Active</button>
                    <button onClick={() => setFilter('completed')} className={`${filter === 'completed' ? 'text-white' : ''}`}>Completed</button>
                </div>
                <button
                    onClick={clearCompleted}
                    className="text-gray-400 hover:text-white"
                >
                    Clear Completed
                </button>
            </div>
        </div>
    );
}
