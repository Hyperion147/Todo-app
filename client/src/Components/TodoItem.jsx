import gsap from "gsap"
import { forwardRef, useRef } from "react"
import {useGSAP} from "@gsap/react"


const TodoItem = forwardRef(({todo, onUndo, onComplete, onDelete, isNew }, ref) => {
  const itemRef = useRef();

  useGSAP(() => {
    if(isNew){
      gsap.from(itemRef.current, {
        scaleY: 0,
        transformOrigin: "top center"
      });
      gsap.fromTo(itemRef.current, 
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration:0.5}
      )
    }
  }, {dependencies: [isNew], scope: itemRef})

  const handleDelete = () => {
    gsap.to(itemRef.current, {
      x: 200,
      opacity: 0,
      duration: 0.4,
      onComplete: () => onDelete(todo._id)
    })
  }

  return (
    <div ref={itemRef} className='flex items-center justify-center w-full py-1'>
      <div className='flex items-center justify-between w-full max-w-md bg-gray-600 rounded-lg shadow px-6 py-3 transition-all duration-300 hover:shadow-md'>
        <div className='flex items-center space-x-4 flex-grow'>
          <input 
            type="checkbox"
            checked={todo.status}
            onChange={() => todo.status ? onUndo(todo._id) : onComplete(todo._id)}
            className='h-5 w-5 text-gray-600 rounded focus:ring-gray-500 cursor-pointer transition-colors duration-200'
          />
          <span
            className={`text-lg ${todo.status ? 'line-through text-gray-200' : 'text-white'} transition-all duration-300`}
          >
            {todo.task}
          </span>
        </div>
        <button 
          onClick={handleDelete} 
          className='ml-4 px-3 py-1.5 text-red-600 rounded-full transition-colors hover:scale-110 duration-200 font-medium'
        >
          <img src="../delete.png" alt="" className="w-5" />
        </button>
      </div>
    </div>
  );
});

export default TodoItem