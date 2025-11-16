import React from 'react';

const Input = ({name, register, validation, error, ...props}) => {
    return (
        <div>
            <input
                className='border border-black rounded-xl px-2'
                {...props}
                {...register(name, validation)}
            />
            {error && <p className='text-red-700'>{error}</p>}
        </div>
    );
};

export default Input;