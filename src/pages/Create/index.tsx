import React from 'react'
import CreateForm from './CreateForm'

const Create: React.FC<{}> = () => {
  return (
    <div className="create_collection">
      <div className="mx pad">
        <CreateForm />
      </div>
    </div>
  )
}

export default Create
