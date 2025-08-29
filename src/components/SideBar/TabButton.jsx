export default function TabButton({ id, label, icon, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
        isActive
          ? "bg-white shadow-lg text-blue-600 border-2 border-blue-200"
          : "text-slate-600 hover:bg-white/50 hover:text-slate-800"
      }`}>
      {icon}
      <span className='text-sm'>{label}</span>
    </button>
  )
}
