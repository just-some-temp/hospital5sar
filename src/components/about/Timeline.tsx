interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative space-y-8 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-border md:before:left-1/2 md:before:-translate-x-1/2">
      {items.map((item, index) => (
        <div
          key={index}
          className={`relative flex flex-col md:flex-row ${
            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          {/* Year bubble */}
          <div className="absolute left-4 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground md:left-1/2">
            <span className="sr-only">{item.year}</span>
          </div>
          
          {/* Content */}
          <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
            <div className="rounded-lg bg-card p-4 shadow-sm border">
              <span className="inline-block rounded bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">
                {item.year}
              </span>
              <h4 className="mt-2 font-semibold text-foreground">{item.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
