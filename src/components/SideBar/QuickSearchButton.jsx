import { Clock } from "lucide-react"

export default function QuickSearchButton({ query, coords, onClick }) {
  return (
    <button
      onClick={() => onClick(coords)}
      className='flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 
                 text-slate-600 text-xs rounded-lg transition-colors duration-200'>
      <Clock
        size={14}
        className='text-slate-500'
      />
      {query}
    </button>
  )
}
