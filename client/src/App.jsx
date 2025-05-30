import TodoForm from "./Components/TodoForm"
import TodoList from "./Components/TodoList"
import { useState, useEffect, useCallback } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "./Components/sections/Navbar";
import { cn } from "./Components/ui/utils";
import api from "./api/api"; 
import './App.css'

gsap.registerPlugin(useGSAP);

function App() {
  const [todos, setTodos] = useState([])

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from(".todo-form", {
        y: 20,
        scale: 0.95,
        autoAlpha: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)"
      });
    });
    return () => ctx.revert();
  })

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
      toast.success("Task added successfully!", { id: toastId, duration: 1000 });
      fetchTodos()
    } catch (error) {
      console.error("Error adding Task:", error)
      toast.error("Failed to add task", { id: toastId, duration: 2000 })
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
        duration: 2000,
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #ef4444'
        }
      })
    } catch (error) {
      console.error("Error deleting all Tasks:", error)
      toast.error("Failed to delete all tasks", { id: toastId, duration: 2000 })
    } finally { setTimeout(() => toast.dismiss(toastId), 2000); }
  }

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <div className='min-h-screen bg-background text-text overflow-hidden relative z-10'>
      <div
        className="fixed inset-0 bgImg bg-cover bg-center opacity-30 -z-10"
        aria-hidden="true"
      ></div>
      <div
        className={cn(
          "absolute inset-0 opacity-30 -z-10",
          "[background-size:50px_50px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      <Navbar />

      <main className='mx-auto px-4 pt-2 max-w-4xl w-full todo-form z-10'>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 1000,
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

        <div className='flex flex-col items-center'>
          <TodoForm onAdd={addTodo} className="w-full max-w-[650px] opacity-100" />

          <div className="relative border-primary border-2 rounded-lg overflow-hidden overflow-y-auto scrollbar min-h-[78vh] md:min-h-140 max-h-135 w-full max-w-[650px] mt-2 z-10">
            <TodoList
              todos={todos}
              onComplete={completeTodo}
              onUndo={undoTodo}
              onDelete={deleteTask}
              onDeleteAll={deleteAllTasks}
              className="relative opacity-100"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App