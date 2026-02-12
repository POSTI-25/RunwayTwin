export default function Header() {
  return (
    <header className="border-b border-slate-700 backdrop-blur-sm bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent">
              RunwayTwin
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Most tools calculate runway. RunwayTwin simulates survival.
          </p>
        </div>
      </div>
    </header>
  );
}
