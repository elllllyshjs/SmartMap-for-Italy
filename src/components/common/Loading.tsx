interface Props {
  label?: string;
}

export default function Loading({ label = "加载中..." }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-600 shadow">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-italy-green border-t-transparent" />
      {label}
    </div>
  );
}
