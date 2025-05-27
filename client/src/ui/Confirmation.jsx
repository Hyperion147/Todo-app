import React from 'react'
import toast from 'react-hot-toast';

const Confirmation = ({ resolve, reject, id }) => {
    return (
        <div><div>
            <p>Are you sure you want to delete?</p>
            <button onClick={() => {
                resolve();
                toast.success('Deleted!', { id });
            }}
            className='border-black px-3 py-2'
            >
                Yes
            </button>
            <button onClick={() => {
                reject();
                toast.error('Cancelled', { id });
            }}>
                No
            </button>
        </div></div>
    )
}

export default Confirmation