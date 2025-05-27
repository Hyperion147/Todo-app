import { useEffect, useState, useRef } from "react"
import TodoItem from "./TodoItem"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import toast, { Toaster } from "react-hot-toast"

const TodoList = ({ todos = [], onComplete, onUndo, onDelete, onDeleteAll }) => {
  const listRef = useRef()

  const handleDeleteAll = () => {
    if (todos.length === 0) return;

    toast.custom((t) => (
      <div className={`bg-gray-900 border-red-700 border py-4 px-20 shadow-xl flex flex-col gap-3 rounded-xl text-center ${t.visible ? "animate-in" : "animate-out"}`}>
        <p className="text-xl">Delete All {todos.length} Items?</p>
        <div className="text-white gap-4 flex">
          <button onClick={() => {
            toast.dismiss(t.id)
            animateDeleteAll()
          }}
            className="px-3 py-1 bg-red-500 text-white hover:bg-red-700 transition-colors rounded-full"
          >
            Confirm
          </button>
          <button onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors rounded-full"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity, position: "bottom-right"
    })

  }
  const animateDeleteAll = () => {
    const items = gsap.utils.toArray(".todo-item")
    const tl = gsap.timeline({
      onComplete: () => onDeleteAll()
    });

    tl.to(items, {
      x: 300,
      opacity: 0,
      duration: 0.4,
    })
  }

  useGSAP(() => {
    gsap.from(".todo-item", {
      x: 50,
      opacity: 0,
      duration: 0.6
    })
  }, { scope: listRef })

  const savedTodos = Array.isArray(todos) ? todos : []
  const [newItem, setNewItem] = useState(new Set())

  useEffect(() => {
    const newIds = savedTodos.map(t => t._id)
    setNewItem(prev => {
      const updated = new Set(prev)
      newIds.forEach(id => updated.add(id))
      return updated
    })
  }, [todos])

  return (
    <div className="space-y-4 mx-auto mt-4">
      {savedTodos.length === 0 ? (
        <p className="text-center text-gray-500 py-8 text-lg">
          No todos found. Add one to get started!
        </p>
      ) : (
        <>
          <div className="space-y-3 todo-item">
            {savedTodos.map(todo => (
              <div key={todo._id}>
                <TodoItem
                  todo={todo}
                  onComplete={onComplete}
                  onUndo={onUndo}
                  onDelete={onDelete}
                  isNew={newItem.has(todo._id)}
                />
              </div>
            ))}
          </div>

          {savedTodos.length > 1 && (
            <div className="flex justify-center">
              <button
                onClick={handleDeleteAll}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-400 transition-colors duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mb-3"
              >
                Delete All Tasks
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TodoList