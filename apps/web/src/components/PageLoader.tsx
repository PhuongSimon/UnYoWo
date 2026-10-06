import DotsLoader from './ui/DotsLoader'

/** Shown while the first page's code is downloading. */
function PageLoader() {
  return (
    <div role="status" className="flex min-h-dvh items-center justify-center bg-surface text-accent">
      <DotsLoader />
    </div>
  )
}

export default PageLoader
