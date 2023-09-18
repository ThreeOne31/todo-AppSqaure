import axios from 'axios';
import React, { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import AddTodo from './AddTodo';
import { baseUrl, getAppSquareHeaders } from '../Auth';
import { DataTable } from './DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

type Todo = {
  id: number,
  title?: string,
  completed?: boolean
}

export type Columns = ColumnDef<Todo>[]

function Home() {
  const queryClient = useQueryClient()
  const { data } = useQuery('todos', () => 
    axios.get(`${baseUrl}/todos`, getAppSquareHeaders()).then(
      res => res.data
    )
  )

  const deleteTodo = useMutation({
    mutationFn: (id: number) => {
    return axios.delete(
      `${baseUrl}/todos/${id}`,
      getAppSquareHeaders()
    )},
    onSuccess: () => {
      queryClient.invalidateQueries('todos')
    }
  })

  const patchTodo = useMutation({
    mutationFn: (todo: {id: number, completed: boolean}) => {
    return axios.patch(
      `${baseUrl}/todos/${todo.id}`,
      todo,
      getAppSquareHeaders()
    )},
    onSuccess: () => {
      queryClient.invalidateQueries('todos')
    }
  })


  const columnHelper = createColumnHelper<Todo>()

  const columns:  Columns = useMemo(
    () => [
      columnHelper.display({
        id: 'checkbox',
        maxSize: 10,
        cell: props =>
          <input
            type='checkbox'
            className='
              w-4
              h-4
              border-2
              rounded-sm
              mx-auto
            checked:accent-gray-800
            '
            checked={props.row.original.completed}
            onChange={() => patchTodo.mutate(({
              id: props.row.original.id,
              completed: !props.row.original.completed
            }))}
          />
      }),
      {
        header: () => 'Task',
        accessorKey: 'task',
        id: 'id',
      },
      {
        header: () => 'Title',
        accessorKey: 'title',
        id: 'title',
        cell: props => 
          <span className={`${props.row.original.completed ? 'line-through' : ''}`}>
            {props.row.original.title}
          </span>
      },
      columnHelper.display({
        id: 'actions',
        cell: props =>
          <FontAwesomeIcon
            className='
              hover:cursor-pointer
              w-4
              h-6
            '
            icon={faTrashCan}
            onClick={() => deleteTodo.mutate(props.row.original.id)}
          ></FontAwesomeIcon>
      }),
    ],
    []
  );
  let todosData = []

  if( data ){
    todosData = data.todos.map((entry: Todo)=>{
      return {
        ...entry,
        task: `Task - ${entry.id}`
      }
    })
  }
  
  return (
    <div className='container mt-4 mx-auto max-w-3xl min-w-fit'>
      <h1 className='mx-2 text-3xl text-gray-800'>Welcome back!</h1>
      <p className='mx-2 mb-4 text-gray-400'>Here's a list of your tasks for today.</p>
      <div>
        { data &&
          <DataTable rows={todosData} columns={columns} />
        }
      </div>
      <AddTodo />
    </div>
  );
}

export default Home;
