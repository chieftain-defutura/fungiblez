import * as Yup from 'yup'

export const validateSingleCollectionSchema = Yup.object({
  name: Yup.string()
    .max(50, 'maximum 50 characters only')
    .required('This field is required'),
  description: Yup.string()
    .max(250, 'maximum 250 characters only')
    .required('This field is required'),
})

export const validateMultiCollectionSchema = Yup.object({
  name: Yup.string()
    .max(50, 'maximum 50 characters only')
    .required('This field is required'),
  description: Yup.string()
    .max(250, 'maximum 250 characters only')
    .required('This field is required'),
})
