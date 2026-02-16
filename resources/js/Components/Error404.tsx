const Error404 = ({ error }: { error: Error } ) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Error | </h1>
      <p className="text-lg"> {error.message}</p>
    </div>
  )
}

export default Error404
