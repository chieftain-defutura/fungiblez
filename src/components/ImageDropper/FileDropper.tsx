import React, { ReactNode, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import './ImageDropper.scss'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import { isArray } from 'lodash'
import { IImageFileProps } from 'constants/types'

interface FileDropperProps {
  image: IImageFileProps | null
  setImage: React.Dispatch<React.SetStateAction<any>>
  content?: ReactNode
  className?: string
}

const FileDropper: React.FC<FileDropperProps> = ({
  setImage,
  image,
  className,
}) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach(async (file: File) => {
      const res: any = new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = (event: any) =>
          resolve(JSON.parse(event.target.result as string))
        fileReader.onerror = (error) => reject(error)
        fileReader.readAsText(file)
      })

      const abi = await res

      setImage({
        file,
        url: isArray(abi) ? abi : [abi],
      })
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div>
      <label className="font-regular" style={{ fontSize: '1.6rem' }}>
        ABI
      </label>
      <div
        className={className ? `image_wrapper ${className}` : 'image_wrapper'}
      >
        {!image ? (
          <div className="image_wrapper-dropzone" {...getRootProps()}>
            <label htmlFor="image">
              <span>UPLOAD ABI FILE</span>
            </label>
            <input id="image" type="file" {...getInputProps()} accept=".json" />
          </div>
        ) : (
          <div className="image_wrapper-dropzone">
            <div className="close" onClick={() => setImage(null)}>
              <CloseIcon />
            </div>
            <p>{image.file.name}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileDropper
