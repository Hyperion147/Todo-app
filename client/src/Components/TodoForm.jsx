import { useState } from "react"

const TodoForm = ({onAdd}) => {
    const [task, setTask] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if(task.trim()){
            onAdd(task)
            setTask('')
        }
    }

  return (
    <form onSubmit={handleSubmit} >
        <div>
            <input type="text"
            value={task}
            onChange={(e) => setTask(e.target.value) }
            placeholder='Add a new Task'
            />
            <button type='submit' className="">
                Add
            </button>
        </div>
    </form>
  )
}

export default TodoForm