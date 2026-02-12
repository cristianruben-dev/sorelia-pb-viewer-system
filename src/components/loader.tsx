export default function Loader() {
  return (
    <div className="flex space-x-2 justify-center items-center h-full w-full h-screen">
      <span className="sr-only">Cargando...</span>
      <div className="size-6 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"/>
      <div className="size-6 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"/>
      <div className="size-6 bg-primary rounded-full animate-bounce"/>
    </div>
  );
}