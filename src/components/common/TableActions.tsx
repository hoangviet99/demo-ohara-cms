import type { MouseEventHandler } from "react";
import { DetailIcon, PencilIcon, TrashIcon } from "../icons";

interface TableActionsProps {
  onDetail?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showDetail?: boolean;
  className?: string;
}

export const TableActions = ({
  onDetail,
  onEdit,
  onDelete,
  showDetail = true,
  className = "",
}: TableActionsProps) => {
  const baseBtn: MouseEventHandler<HTMLButtonElement> = (e) => e.stopPropagation();

  return (
    <div className={`flex items-center justify-end gap-1 ${className}`}>
      {showDetail && onDetail && (
        <button
          onClick={(e) => { baseBtn(e); onDetail(); }}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
          title="View Detail"
        >
          <DetailIcon size={16} />
        </button>
      )}
      <button
        onClick={(e) => { baseBtn(e); onEdit(); }}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        title="Edit"
      >
        <PencilIcon size={16} />
      </button>
      <button
        onClick={(e) => { baseBtn(e); onDelete(); }}
        className="rounded-lg p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600"
        title="Delete"
      >
        <TrashIcon size={16} />
      </button>
    </div>
  );
};
