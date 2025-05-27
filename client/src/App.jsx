import TodoForm from "./Components/TodoForm"
import TodoList from "./Components/TodoList"
import axios from 'axios'
import { useState, useEffect, useCallback, useLayoutEffect } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import './App.css'

gsap.registerPlugin(useGSAP);

const api = axios.create({
  baseURL: "http://localhost:7900/api",
  withCredentials: true,
  headers: {
    'Content-Type': "application/json",
    'Accept': "application/json"
  }
})

function App() {
  const [todos, setTodos] = useState([])

  useGSAP(() => {
  gsap.from("header", {
    y: -80,
    duration: 0.8
  })

  gsap.from(".todo-form", {
    y: 20,
    scale: 0.95,
    autoAlpha: 0,
    duration: 1,
    ease: "elastic.out(1, 0.5)"
  }, "+=0.2");
}, { dependencies: [] })

  const fetchTodos = useCallback(async () => {
    try {
      const response = await api.get("/task");
      setTodos(response.data)
    } catch (error) {
      console.error("Error fetching todos API:", error)
      toast.error("Failed to load tasks")
    }
  }, [])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const addTodo = async (task) => {
    const toastId = toast.loading("Adding task...");
    try {
      const newTodo = { task, status: false }
      await api.post("/task", newTodo)
      toast.success("Task added successfully!", { id: toastId });
      fetchTodos()
    } catch (error) {
      console.error("Error adding Task:", error)
      toast.error("Failed to add task", { id: toastId })
    }
  }

  const completeTodo = async (id) => {
    try {
      await api.put(`/task/${id}`)
      setTodos(prev => prev.map(todo =>
        todo._id === id ? { ...todo, status: true } : todo
      ))
      toast.success("Task completed!")
    } catch (error) {
      console.error("Error completing Task:", error)
      toast.error("Failed to complete task")
    }
  }

  const undoTodo = async (id) => {
    try {
      await api.put(`/undoTask/${id}`)
      setTodos(prev => prev.map(todo =>
        todo._id === id ? { ...todo, status: false } : todo
      ))
      toast.error("Task marked incomplete")
    } catch (error) {
      console.error("Error undoing Task:", error)
      toast.error("Failed to undo task")
    }
  }

  const deleteTask = async (id) => {
    try {
      await api.delete(`/deleteTask/${id}`)
      setTodos(prev => prev.filter(todo => todo._id !== id))
      toast('Task deleted', {
        icon: '🗑️',
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
      })
    } catch (error) {
      console.error("Error deleting Task:", error)
      toast.error("Failed to delete task")
    }
  }

  const deleteAllTasks = async () => {
    const toastId = toast.loading("Deleting all tasks...")
    try {
      await api.delete("/deleteAllTasks")
      setTodos([])
      toast.error('All tasks deleted!', {
        id: toastId,
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #ef4444'
        }
      })
    } catch (error) {
      console.error("Error deleting all Tasks:", error)
      toast.error("Failed to delete all tasks", { id: toastId })
    }
  }

  return (
    <div className='min-h-screen bg-gray-800 text-white'>
      <header className='bg-gray-900 border-b border-gray-700 shadow-md'>
        <div className='container mx-auto px-4 py-5 flex justify-around items-center'>
          <h1 className="text-3xl font-bold text-white tech">TODO</h1>
          <p className='text-gray-300 font-medium'>Go + React</p>
          <nav>
            <ul className='flex items-center gap-6'>
              <li className='hover:text-gray-400 transition-colors cursor-pointer'>Login</li>
              <li className='hover:text-gray-400 transition-colors cursor-pointer'>Signup</li>
            </ul>
          </nav>
        </div>
      </header>

      <main className='mx-auto px-4 py-6 max-w-4xl w-full todo-form'>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '16px'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <div className='flex flex-col items-center '>
          <TodoForm onAdd={addTodo} className="w-full max-w-[650px]" />

          <div className="border border-gray-700 rounded-lg overflow-hidden min-h-135 max-h-135 overflow-y-auto scrollbar w-full max-w-[650px] mt-2">
            <TodoList
              todos={todos}
              onComplete={completeTodo}
              onUndo={undoTodo}
              onDelete={deleteTask}
              onDeleteAll={deleteAllTasks}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App