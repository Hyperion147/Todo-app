import gsap from "gsap"
import { forwardRef, useRef } from "react"
import { useGSAP } from "@gsap/react"


const TodoItem = forwardRef(({todo, onUndo, onComplete, onDelete, isNew }, ref) => {
  const itemRef = useRef();

  useGSAP(() => {
  if (isNew) {
    const tl = gsap.timeline({
      defaults: { 
        ease: "power3.out",
        transformOrigin: "top center" 
      }
    });
    
    tl.fromTo(itemRef.current,
      { 
        scaleY: 0, 
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0
      },
      { 
        scaleY: 1,
        opacity: 1,
        height: "auto",
        paddingTop: "original",
        paddingBottom: "original",
        marginTop: "original",
        marginBottom: "original",
        duration: 0.75,
        ease: "back.out(0.5)"
      }
    );
  }
}, { dependencies: [isNew], scope: itemRef });

  const handleDelete = () => {
    gsap.to(itemRef.current, {
      x: 200,
      opacity: 0,
      duration: 0.4,
      onComplete: () => onDelete(todo._id)
    })
  }

  return (
    <div ref={itemRef} className='flex items-center justify-center w-full py-1 mx-2'>
      <div className='flex items-center justify-between w-full max-w-md border-primary border-2 bg-gradient-to-t from-primary to-bg-surface rounded-lg shadow px-6 py-3 transition-all duration-300 hover:shadow-md hover:shadow-border'>
        <div className='flex items-center space-x-4 flex-grow'>
          <input 
            type="checkbox"
            checked={todo.status}
            onChange={() => todo.status ? onUndo(todo._id) : onComplete(todo._id)}
            className='h-5 w-5 text-gray-600 rounded focus:ring-gray-500 cursor-pointer transition-colors duration-200'
          />
          <span
            className={`text-lg ${todo.status ? 'line-through text-accent' : 'text-text'} transition-all duration-300`}
          >
            {todo.task}
          </span>
        </div>
        <button 
          onClick={handleDelete} 
          className='ml-4 px-3 py-1.5 text-red-600 rounded-full transition-colors hover:scale-110 duration-200 font-medium'
        >
          <img src="../delete.png" alt="" className="w-6 cursor-pointer" />
        </button>
      </div>
    </div>
  );
});

export default TodoItem