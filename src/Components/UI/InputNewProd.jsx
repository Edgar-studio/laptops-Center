import React from 'react';

const InputNewProd  = ({name, register, validation, error, ...props}) => {
    return (
        <div>
            <input
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...props}
                {...register(name, validation)}
            />
            {error && <p className='text-red-700'>{error}</p>}
        </div>
    );
};

export default InputNewProd;