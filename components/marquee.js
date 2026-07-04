export default function Marquee({ items, reverse = false, speed = 36, className = "" }) {
  const row = (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="display px-6 text-4xl uppercase sm:px-10 sm:text-6xl">{item}</span>
          <span className="text-2xl text-accent sm:text-3xl" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div
      className={`marquee py-6 ${className}`}
      data-reverse={reverse ? "true" : undefined}
      style={{ "--marquee-speed": `${speed}s` }}
      aria-hidden="true"
    >
      <div className="marquee-track">{row}</div>
      <div className="marquee-track">{row}</div>
    </div>
  );
}
