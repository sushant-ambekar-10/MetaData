export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(e) => {
        e.preventDefault();
        const main = document.getElementById('main');
        main?.focus({ preventScroll: true });
        main?.scrollIntoView();
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-pill focus:bg-a3 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-on-accent"
    >
      Skip to content
    </a>
  );
}