export default function IntensityFilters({ filters, setFilters, earthquakes }) {
  const intensityConfig = {
    low: {
      label: "Low Magnitude",
      range: "< 3.0",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      dotColor: "bg-emerald-400",
      count: earthquakes.filter((eq) => eq.properties.mag < 3).length,
    },
    medium: {
      label: "Medium Magnitude",
      range: "3.0 - 4.9",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      dotColor: "bg-orange-400",
      count: earthquakes.filter(
        (eq) => eq.properties.mag >= 3 && eq.properties.mag < 5
      ).length,
    },
    high: {
      label: "High Magnitude",
      range: "≥ 5.0",
      color: "bg-red-100 text-red-800 border-red-200",
      dotColor: "bg-red-500",
      count: earthquakes.filter((eq) => eq.properties.mag >= 5).length,
    },
  }

  return (
    <div className='p-6 space-y-4'>
      <h3 className='font-bold text-slate-800 flex items-center gap-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center'>
          <span className='text-white font-bold text-sm'>M</span>
        </div>
        Magnitude Filters
      </h3>

      <div className='space-y-3'>
        {Object.entries(intensityConfig).map(([level, config]) => (
          <label
            key={level}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer
                         transition-all duration-300 hover:shadow-md ${
                           filters.intensity.includes(level)
                             ? config.color + " shadow-lg"
                             : "bg-white/60 border-slate-200/50 hover:bg-white/80"
                         }`}>
            <div className='flex items-center gap-3'>
              <input
                type='checkbox'
                checked={filters.intensity.includes(level)}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    intensity: prev.intensity.includes(level)
                      ? prev.intensity.filter((i) => i !== level)
                      : [...prev.intensity, level],
                  }))
                }
                className='w-5 h-5 text-blue-600 border-gray-300 rounded-md'
              />
              <div>
                <span className='font-semibold text-sm'>{config.label}</span>
                <div className='text-xs opacity-70'>{config.range}</div>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <span className='px-3 py-1 text-xs rounded-full bg-white/70 font-bold'>
                {config.count}
              </span>
              <span
                className={`w-3 h-3 rounded-full ${config.dotColor}`}></span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
