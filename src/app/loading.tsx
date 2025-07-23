export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col p-4 animate-pulse">
      <header className="flex flex-col gap-4 mb-6">
        <div className="h-8 w-48 bg-gray-300 rounded"></div>

        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-20 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-20 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-20 bg-gray-300 rounded-full"></div>
        </div>

        <div className="h-10 w-60 bg-gray-300 rounded"></div>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-200 rounded shadow animate-pulse"
          ></div>
        ))}
      </main>
    </div>
  );
}
