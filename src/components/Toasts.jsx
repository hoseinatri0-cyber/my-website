import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icon.jsx'

export default function Toasts() {
  const { toasts, dismissToast } = useStore()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] px-4 sm:bottom-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-sm flex-col items-stretch gap-2 sm:ml-auto sm:mr-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-lift animate-toast-in"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
                t.tone === 'error' ? 'bg-discount' : t.tone === 'neutral' ? 'bg-navy-700' : 'bg-success'
              }`}
            >
              <Icon name={t.tone === 'error' ? 'alert' : 'check'} className="h-3 w-3" strokeWidth={2.6} />
            </span>
            <p className="flex-1 text-[13px] font-medium leading-snug text-ink">{t.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="text-muted transition-colors hover:text-ink"
            >
              <Icon name="close" className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
