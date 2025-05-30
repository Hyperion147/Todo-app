import { useState } from "react"

const TodoForm = ({ onAdd }) => {
    const [task, setTask] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (task.trim()) {
            onAdd(task)
            setTask('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-80 md:w-full">
            <div className="flex justify-center mb-2">
                <div className="relative w-full max-w-md">
                    <input 
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Add a new task..."
                        className="w-full px-6 py-3 pr-20 rounded-full border border-border bg-white text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                    />
                    <button 
                        type="submit" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-primary text-text rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors duration-200 font-medium cursor-pointer"
                    >
                        Add
                    </button>
                </div>
            </div>
        </form>
    )
}

export default TodoForm