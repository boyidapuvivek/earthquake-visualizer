export default function StatsSection({ earthquakes }) {
  const low = earthquakes.filter((eq) => eq.properties.mag < 3).length
  const medium = earthquakes.filter(
    (eq) => eq.properties.mag >= 3 && eq.properties.mag < 5
  ).length
  const high = earthquakes.filter((eq) => eq.properties.mag >= 5).length

  return (
    <div className='p-6 space-y-6'>
      {/* Summary */}
      <div className='bg-white/80 rounded-3xl p-6 border border-white/50 shadow-xl'>
        <h3 className='font-bold text-slate-800 mb-6'>Activity Summary</h3>
        <div className='grid grid-cols-3 gap-4'>
          <div className='bg-emerald-100 rounded-xl p-4 text-center'>
            <div className='text-xl font-bold'>{low}</div>
            <div className='text-xs'>Low</div>
          </div>
          <div className='bg-orange-100 rounded-xl p-4 text-center'>
            <div className='text-xl font-bold'>{medium}</div>
            <div className='text-xs'>Medium</div>
          </div>
          <div className='bg-red-100 rounded-xl p-4 text-center'>
            <div className='text-xl font-bold'>{high}</div>
            <div className='text-xs'>High</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='bg-white/80 rounded-3xl p-6 border border-white/50 shadow-xl'>
        <h4 className='font-bold text-slate-800 mb-4'>Recent High Magnitude</h4>
        <div className='space-y-3 max-h-48 overflow-y-auto'>
          {earthquakes
            .filter((eq) => eq.properties.mag >= 4)
            .slice(0, 5)
            .map((eq, i) => (
              <div
                key={i}
                className='flex items-center gap-3 p-3 bg-white/50 rounded-xl border'>
                <span
                  className={`w-3 h-3 rounded-full ${
                    eq.properties.mag >= 5 ? "bg-red-500" : "bg-orange-400"
                  }`}></span>
                <div>
                  <div className='font-semibold text-sm'>
                    {eq.properties.mag.toFixed(1)}
                  </div>
                  <div className='text-xs text-slate-600'>
                    {eq.properties.place}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
