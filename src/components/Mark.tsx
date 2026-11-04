type MarkProps = { className?: string }

export default function Mark({ className = '' }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <circle cx="26" cy="26" r="20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M26 2v13M26 37v13M2 26h13m22 0h13" stroke="currentColor" strokeWidth="2" />
      <path d="M11 26c4-5.5 9-8.25 15-8.25S37 20.5 41 26c-4 5.5-9 8.25-15 8.25S15 31.5 11 26Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="26" cy="26" r="3.5" fill="currentColor" />
    </svg>
  )
}
