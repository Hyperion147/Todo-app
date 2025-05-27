import TodoForm from "./Components/TodoForm"
import TodoList from "./Components/TodoList"
import axios from 'axios'
import { useState, useEffect, useCallback } from "react"
import toast, { Toaster } from 'react-hot-toast';
import Confirmation from "./ui/Confirmation";
import './App.css'

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

  const fetchTodos = useCallback(() => {
    (async () => {
      try {
        const response = await api.get("/task");
        setTodos(response.data)
      } catch (error) {
        console.error("Error fetching todos API:", error)
      }
    })();
  }, [])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const addTodo = async (task) => {
    const toastId = toast.loading("Adding task...");
    try {
      const newTodo = { task, status: false }
      const { data } = await api.post("/task", newTodo)
      setTodos(prev => prev, data)
      toast.success("Task added successfully!", { id: toastId });
      fetchTodos()
    } catch (error) {
      console.error("Error adding Task:", error)
    }
  }

  const completeTodo = async (id) => {
    try {
      await api.put(`/task/${id}`)
      setTodos(prev => prev.map(todo =>
        todo._id === id ? { ...todo, status: true } : todo
      ))
    } catch (error) {
      console.error("Error completing Task:", error)
    }
  }

  const undoTodo = async (id) => {
    try {
      await api.put(`/undoTask/${id}`)
      setTodos(prev => prev.map(todo =>
        todo._id === id ? { ...todo, status: false } : todo
      ));
    } catch (error) {
      console.error("Error undoing Task:", error)
    }
  }

  const deleteTask = async (id) => {
    try {
      await api.delete(`/deleteTask/${id}`)
      setTodos(prev => prev.filter(todo => todo._id !== id));
      toast.error('Deleted Task.', {
        style: {
          border: '1px solid #713200',
          padding: '12px',
          color: '#c3ffa7',
        },
      });
    } catch (error) {
      toast.error("Error Deleting Task")
    }
  }

  const deleteAllTasks = async () => {
    if (!window.confirm("Are you sure you want to delete ALL TASKS?")) return

    try {
      await api.delete("/deleteAllTasks")
      setTodos([])
      toast.error('Deleted All Task.', {
        style: {
          border: '2px solid #ff3200',
          padding: '12px',
          color: '#ff3200',
        },
      });
    } catch (error) {
      console.error("Error deleting all Tasks:", error)
    }
  }

  return (
    <div className='bg-slate-200'>

      <div className='bg-green-300 to-slate-200 text-black bg-gradient-to-b flex justify-around'>
        <h2 className="text-center text-3xl font-bold  py-5 tech">TODO</h2>
        <p className='flex items-center font-bold'>Go + React</p>
        <ul className='flex items-center gap-4 text-[20px] font-bold'>
          <li>Login</li>
          <li>Signup</li>
        </ul>
      </div>
      <div>
        <Toaster
          position="bottom-left"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            error: {
              duration: 3000,
            },
          }}
        />
        <TodoForm onAdd={addTodo} />
        <TodoList
          todos={todos}
          onComplete={completeTodo}
          onUndo={undoTodo}
          onDelete={deleteTask}
          onDeleteAll={deleteAllTasks}
        />
      </div>
    </div>
  )
}

export default App
