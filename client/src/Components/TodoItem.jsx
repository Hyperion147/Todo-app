import React from 'react'

const TodoItem = ({todo, onUndo, onComplete, onDelete}) => {
  return (
    <div>
        <div>
            <input type="checkbox"
            checked={todo.status}
            onChange={() => todo.status ? onUndo(todo._id) : onComplete(todo._id)}
            />
            <span
            className={`${todo.status}`}
            >
                {todo.task}
            </span>
        </div>
        <button onClick={() => onDelete(todo._id)}>
            Delete
        </button>
    </div>
  )
}

export default TodoItem