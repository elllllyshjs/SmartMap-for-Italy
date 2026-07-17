import type { ReactNode } from "react";

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "确认",
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
        <div className="mb-4 text-sm text-gray-600">{children}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            取消
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="rounded-lg bg-italy-red px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
