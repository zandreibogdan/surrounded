export function Icon({ name, size = 20 }: { name: 'restart' | 'pause' | 'play' | 'sound' | 'mute' | 'help' | 'arrow' | 'check' | 'lock' | 'close'; size?: number }) {
  const paths = {
    restart: <path d="M3 10a9 9 0 1 1 1.7 8M3 4v6h6" />,
    pause: <path d="M8 5v14M16 5v14" strokeWidth="2.5" />,
    play: <path d="m9 5 10 7-10 7Z" />,
    sound: <path d="m11 4-5 4H3v8h3l5 4ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" />,
    mute: <path d="m11 4-5 4H3v8h3l5 4ZM16 9l6 6m0-6-6 6" />,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.2 9a2.8 2.8 0 1 1 4.7 2.1c-1.4.9-1.9 1.1-1.9 2.4M12 17h.01" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    lock: <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
