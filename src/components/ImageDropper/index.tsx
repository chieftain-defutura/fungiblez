import React, { ReactNode, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import './ImageDropper.scss'
import { ReactComponent as Gallery } from 'assets/icons/gallery.svg'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import { IImageFileProps } from 'constants/types'

interface ImageDropperProps {
  image: IImageFileProps | null
  setImage: React.Dispatch<React.SetStateAction<IImageFileProps | null>>
  content?: ReactNode
  className?: string
}

const ImageDropper: React.FC<ImageDropperProps> = ({
  setImage,
  image,
  content,
  className,
}) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader()
      reader.onload = () => {
        setImage({
          file,
          url: reader.result as string,
        })
      }
      reader.readAsDataURL(file)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div className={className ? `image_wrapper ${className}` : 'image_wrapper'}>
      {!image ? (
        <div className="image_wrapper-dropzone" {...getRootProps()}>
          <label htmlFor="image">
            <span>
              <Gallery />
            </span>
          </label>
          <input
            id="image"
            type="file"
            {...getInputProps()}
            accept=".png,.jpeg,.jpg,.webp,.gif,.mp4,.svg"
          />
        </div>
      ) : (
        <div className="image_wrapper-dropzone">
          <div className="close" onClick={() => setImage(null as any)}>
            <CloseIcon />
          </div>
          <img className="selected_image" src={image.url} alt="url" />
        </div>
      )}
      <div className="image_wrapper-content">
        {content ? (
          content
        ) : (
          <>
            <div className="flex mb-16"></div>
            <p className="mb-8">
              File types supported{' '}
              <span className="font-regular">
                JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF.
              </span>
            </p>
            <p>
              Max size: <span className="font-regular">100MB</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default ImageDropper
