const P = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-3.3 3.1-5.6 7-5.6s7 2.3 7 5.6" /></>,
  heart: <path d="M12 20s-7.2-4.4-7.2-9.3A4.2 4.2 0 0 1 12 7.9a4.2 4.2 0 0 1 7.2 2.8C19.2 15.6 12 20 12 20Z" />,
  bag: <><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9.2 8V6.6a2.8 2.8 0 0 1 5.6 0V8" /></>,
  compare: <><path d="M4 8h9m0 0-3-3m3 3-3 3" /><path d="M20 16h-9m0 0 3-3m-3 3 3 3" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  arrowRight: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
  truck: <><path d="M2 7h10v9H2z" /><path d="M12 10h4l3 3v3h-7z" /><circle cx="6" cy="18" r="1.6" /><circle cx="16.5" cy="18" r="1.6" /></>,
  shield: <><path d="M12 3.5 19 6v6c0 4.2-3 7-7 8.5C8 19 5 16.2 5 12V6l7-2.5Z" /><path d="m9.2 12.2 2 2 3.6-3.9" /></>,
  returns: <><path d="M4 10a8 8 0 1 1 2 6" /><path d="M4 5v5h5" /></>,
  lock: <><rect x="4.5" y="10" width="15" height="10" rx="2" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" /></>,
  support: <><path d="M5 13v-1a7 7 0 0 1 14 0v1" /><rect x="3" y="13" width="4" height="6" rx="1.6" /><rect x="17" y="13" width="4" height="6" rx="1.6" /><path d="M19 19v.5a2.5 2.5 0 0 1-2.5 2.5H13" /></>,
  award: <><circle cx="12" cy="9" r="5" /><path d="m8.5 13.5-1 7 4.5-2.4 4.5 2.4-1-7" /></>,
  star: <path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.8l5.9-.9L12 3.6Z" />,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  trash: <><path d="M4 7h16" /><path d="M9 7V5h6v2" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v5M14 11v5" /></>,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  pin: <><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  package: <><path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z" /><path d="m4 7.2 8 4.3 8-4.3M12 21v-9.5" /></>,
  filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
  trending: <><path d="M3 17l6-6 4 4 7-7" /><path d="M14 8h6v6" /></>,
  sparkles: <><path d="m12 3 1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" /><path d="M18.5 15.5l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9.9-2.3Z" /></>,
  zoom: <><circle cx="11" cy="11" r="6.5" /><path d="M11 8.5v5M8.5 11h5" /><path d="m16 16 4 4" /></>,
  sliders: <><path d="M4 8h10M18 8h2M4 16h4M12 16h8" /><circle cx="16" cy="8" r="2" /><circle cx="10" cy="16" r="2" /></>,
  logout: <><path d="M15 5H6v14h9" /><path d="M14 12h7m0 0-3-3m3 3-3 3" /></>,
  edit: <><path d="M4 20h4l10-10-4-4L4 16v4Z" /><path d="m14 6 4 4" /></>,
  card: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3 10h18" /><path d="M7 14h4" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5" /><path d="M12 8h.01" /></>,
  facebook: <path d="M14.5 8.5h2V5.4h-2.4c-2.3 0-3.6 1.4-3.6 3.8v1.9H8v3.1h2.5V21h3.3v-6.8h2.4l.4-3.1h-2.8V9.6c0-.8.2-1.1 1.2-1.1Z" />,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><path d="M16.8 7.4h.01" /></>,
  twitter: <path d="M19 6.4a6 6 0 0 1-1.9.6 3.2 3.2 0 0 0 1.4-1.8 6.3 6.3 0 0 1-2 .8 3.1 3.1 0 0 0-5.4 2.2c0 .3 0 .5.1.7A9 9 0 0 1 4.4 5.4a3.1 3.1 0 0 0 1 4.2 3 3 0 0 1-1.4-.4 3.1 3.1 0 0 0 2.5 3.1 3 3 0 0 1-1.4.1 3.1 3.1 0 0 0 2.9 2.1A9 9 0 0 1 3 16.2 8.9 8.9 0 0 0 7.8 17c5.7 0 8.8-4.7 8.8-8.8v-.4A6.3 6.3 0 0 0 19 6.4Z" />,
  youtube: <><rect x="3" y="6" width="18" height="12" rx="3.5" /><path d="m10.5 9.5 4.5 2.5-4.5 2.5v-5Z" /></>,
  wifi: <><path d="M5 12.5a10 10 0 0 1 14 0" /><path d="M8 15.5a6 6 0 0 1 8 0" /><path d="M12 19h.01" /></>,
  battery: <><rect x="3" y="8" width="16" height="8" rx="2" /><path d="M21 11v2" /><path d="M6 11v2" /></>,
  cpu: <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M10 3v2M14 3v2M10 19v2M14 19v2M3 10h2M3 14h2M19 10h2M19 14h2" /></>,
  memory: <><rect x="3" y="8" width="18" height="8" rx="2" /><path d="M7 16v2M12 16v2M17 16v2" /></>,
  monitor: <><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M9 20h6M12 16.5V20" /></>,
  keyboard: <><rect x="2.5" y="7" width="19" height="10" rx="2" /><path d="M7 11h.01M10 11h.01M13 11h.01M16 11h.01M8 14h8" /></>,
  gpu: <><rect x="3" y="7" width="15" height="9" rx="2" /><circle cx="8.5" cy="11.5" r="2.4" /><path d="M18 10h3v4h-3" /></>,
  alert: <><circle cx="12" cy="12" r="8.5" /><path d="M12 8v5M12 16.5h.01" /></>,
}

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.7, filled = false }) {
  const path = P[name]
  if (!path) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  )
}
