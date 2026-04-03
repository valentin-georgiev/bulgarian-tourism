import type { Category } from '@/types/place';

const STYLES: Record<Category, string> = {
  mountain: 'bg-slate-100 text-slate-700',
  lake:     'bg-blue-100 text-blue-700',
  cave:     'bg-amber-100 text-amber-700',
  city:     'bg-purple-100 text-purple-700',
  fishing:  'bg-cyan-100 text-cyan-700',
  trail:    'bg-green-100 text-green-700',
  beach:    'bg-yellow-100 text-yellow-700',
  museum:   'bg-rose-100 text-rose-700',
  hiking:   'bg-emerald-100 text-emerald-700',
};

type Props = {
  category: Category;
  label: string;
};

export default function Badge({ category, label }: Props) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STYLES[category]}`}>
      {label}
    </span>
  );
}
