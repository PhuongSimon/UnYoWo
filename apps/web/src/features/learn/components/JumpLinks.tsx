interface JumpLinksProps {
  label: string
  links: { id: string; label: string }[]
}

/** In-page shortcuts to the sections below; scrolls sideways on small screens. */
function JumpLinks({ label, links }: JumpLinksProps) {
  if (links.length < 2) return null

  return (
    <nav aria-label={label} className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
      <ul className="flex gap-2 sm:flex-wrap">
        {links.map((link) => (
          <li key={link.id} className="shrink-0">
            <a
              href={`#${link.id}`}
              className="inline-flex rounded-full border border-line-soft bg-surface-raised px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-primary-400 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default JumpLinks
