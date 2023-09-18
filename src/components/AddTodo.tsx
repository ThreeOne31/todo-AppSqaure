import axios from 'axios';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { baseUrl, getAppSquareHeaders } from '../Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';


type InsertTodo = {
  completed?: boolean;
  title?: string;
}

function AddTodo() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const addTodo = useMutation({
    mutationFn: (todo: InsertTodo) => {
      return axios.post(
        `${baseUrl}/todos`,
        todo,
        getAppSquareHeaders()
      )
    },
    onSuccess: () => {
      setTitle('')
      queryClient.invalidateQueries('todos')
    }
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target.value)
  }

  const handleSubmit = () => {
    if (title !== '') {
      addTodo.mutate({ completed: false, title })
    }
  }

  return (
    <div className='flex flex-row p-2'>
      <input
        type='text'
        placeholder='Add to list'
        value={title}
        onChange={ handleChange }
        className='
          m-2
          border
          rounded 
          border-gray-300
          p-2
          w-full
          text-xl
          focus:border-gray-600
          focus:outline-none
        '
      />
      <button
        onClick={handleSubmit}
        className='m-2 text-3xl text-gray-700'
      >
        <FontAwesomeIcon icon={faCirclePlus} />
      </button>
    </div>
  );
}

export default AddTodo;
