const messages = [
  "Book affordable E-rickshaw rides near you",
  "Fast last-mile travel for daily commuters",
  "Eco-friendly electric mobility",
  "Transparent fares and trusted drivers",
  "Available across popular local routes",
];

export function MarqueeBanner() {
  return (
    <div className="fixed left-0 right-0 top-0 z-[60] w-full overflow-hidden bg-primary py-1.5 shadow-glow-primary">
      <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
        {[...messages, ...messages].map((message, index) => (
          <span
            key={`${message}-${index}`}
            className="mx-10 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground md:text-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}
