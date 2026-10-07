const stroke = 1.5;

export function IconPlus() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconExport() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 1v7M3.5 5.5L6 8l2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 9.5v.5a1 1 0 001 1h8a1 1 0 001-1v-.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconDrag() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="4" cy="2.5" r="1" fill="currentColor" />
      <circle cx="8" cy="2.5" r="1" fill="currentColor" />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="8" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="9.5" r="1" fill="currentColor" />
      <circle cx="8" cy="9.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconClose({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path
        d="M1 1l10 10M11 1L1 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth={stroke} />
      <path d="M2 6.5h12M5.5 1.5v2.5M10.5 1.5v2.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

export function IconList() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 4.5h10M3 8h10M3 11.5h10" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

export function IconLayers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 2.5L14 5.5 8 8.5 2 5.5 8 2.5zM14 8.5 8 11.5 2 8.5M14 11.5 8 14.5 2 11.5"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 2.5v7M5.5 7.5 8 10l2.5-2.5"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 11.5v1a1 1 0 001 1h8a1 1 0 001-1v-1"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconUpload() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 11.5V4.5M5.5 7 8 4.5 10.5 7"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 11.5v1a1 1 0 001 1h8a1 1 0 001-1v-1"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconRain() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4.5 7.5a3 3 0 014.1-2.7A2.5 2.5 0 0112 7c1.4 0 2.5 1 2.5 2.2 0 .5-.1.9-.3 1.3H3.5c-.6 0-1-.5-1-1.1 0-1 .8-1.7 2-1.7z"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
      <path
        d="M6 12.5v2M8 11.5v2.5M10 12.5v2"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSaved() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 2.5h6l2.5 2.5V13a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5z"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
      <path d="M6 2.5V6h4V2.5" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" />
    </svg>
  );
}
