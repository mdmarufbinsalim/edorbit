export interface NavItem {
  id: string;
  label: string;
}

export function SectionNav({ items }: { items: readonly NavItem[] }) {
  return (
    <nav aria-label="Page sections" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} className="text-slate-400 hover:text-accent">
          {item.label}
        </a>
      ))}
    </nav>
  );
}
