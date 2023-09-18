import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const Loading = () => {
  return (
    <div className='mt-8 flex justify-center align-middle'>
      <FontAwesomeIcon className='w-6 h-6' icon={faSpinner}/>
    </div>
  )
}