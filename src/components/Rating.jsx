import Icon from './Icon.jsx'

export default function Rating({ value = 0, count, size = 'sm', showValue = true, className = '' }) {
  const starSize = size === 'lg' ? 'h-4.5 w-4.5' : size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const rounded = Math.round(value * 2) / 2
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="relative inline-block">
            <Icon name="star" filled className={`${starSize} text-line`} />
            {rounded >= i ? (
              <Icon name="star" filled className={`${starSize} absolute inset-0 text-amber-400`} />
            ) : rounded >= i - 0.5 ? (
              <span className="absolute inset-0 w-1/2 overflow-hidden">
                <Icon name="star" filled className={`${starSize} text-amber-400`} />
              </span>
            ) : null}
          </span>
        ))}
      </div>
      {showValue && <span className="text-xs font-semibold text-ink">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-muted">({count})</span>}
      <span className="sr-only">{value.toFixed(1)} out of 5 stars</span>
    </div>
  )
}
