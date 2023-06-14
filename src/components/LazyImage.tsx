import React, { Fragment, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

// import { ReactComponent as GalleryIcon } from 'assets/icons/gallery.svg'

interface ILazyImage {
  src: string
  alt?: string
}

const LazyImage: React.FC<ILazyImage> = ({ alt, src }) => {
  const [isError, setIsError] = useState(false)
  console.log(isError)
  return (
    <Fragment>
      <LazyLoadImage
        src={src}
        alt={alt ?? ''}
        onError={() => setIsError(true)}
        effect="blur"
        className="lazy_load_nft_image"
      />
    </Fragment>
  )
}

export default React.memo(LazyImage)
