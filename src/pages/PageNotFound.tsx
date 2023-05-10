import React from 'react'

const PageNotFound: React.FC<{}> = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        height: 'calc(100vh - 95px)',
      }}
    >
      <h1>Oops..! Page Not Found</h1>
      <p>
        We are sorry that you had to find our 404 error page but it is just a
        little mistake. Try going to the Marketplace.
      </p>
    </div>
  )
}

export default PageNotFound
