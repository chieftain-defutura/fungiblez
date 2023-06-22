import React from 'react'
import { Formik, Form as FormikForm } from 'formik'
import { Button, TextField } from 'components'
import { validateSingleCollectionSchema } from '../../../helpers/ValidationSchema'

interface IForm {
  initialState: any
  handleSubmit: (values: any, actions: any) => Promise<void>
}

const Form: React.FC<IForm> = ({ initialState, handleSubmit }) => {
  return (
    <Formik
      initialValues={initialState}
      validationSchema={validateSingleCollectionSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <FormikForm>
          <div className="form_fields">
            <TextField name="name" label="Name" placeholder="Item Name" />

            <TextField
              name="description"
              label="Description"
              as="textarea"
              rows="5"
              placeholder="Provide a detailed discription of your item."
            />
          </div>
          <div className="flex-center">
            <Button disabled={isSubmitting} type="submit" variant="secondary">
              Create
            </Button>
            {/* <div className="formcard_container">
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => handleMint(NFT1Address)}
              >
                mint nft 1
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => handleMint(NFT2Address)}
              >
                mint nft 2
              </Button>
            </div> */}
          </div>
        </FormikForm>
      )}
    </Formik>
  )
}

export default Form
