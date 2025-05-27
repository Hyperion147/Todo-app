import TodoItem from "./TodoItem"

const TodoList = ({todos = [], onComplete, onUndo, onDelete, onDeleteAll}) => {
  const savedTodos = Array.isArray(todos) ? todos : []
  return (
    <div>
      {savedTodos.length === 0 ? (
        <p className="text-gray-500 py-4">No todos found. Add one to get started!</p>
      ) : (
      <>
        {savedTodos.map(todo => (
          <div key={todo._id}>
            <TodoItem
                key={todo._id}
                todo={todo}
                onComplete={onComplete}
                onUndo={onUndo}
                onDelete={onDelete}
                />
          </div>
      ))}
      </>
      )
    } 
        {savedTodos.length > 1 && (
          <button onClick={onDeleteAll}>
            Delete All
          </button>
        )}
    </div>
  )
}

export default TodoList