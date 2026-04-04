import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const Pagination = ({ page, totalPages, from, to, total, onPageChange }) => {
  if (totalPages <= 1 && total <= 8) return null;
  return (
    <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
      <span>{total === 0 ? '0 itens' : `${from}–${to} de ${total}`}</span>
      <div className="flex items-center gap-1">
        <Button
          size="icon" variant="outline" className="h-8 w-8"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="px-2 font-medium text-foreground">{page} / {totalPages}</span>
        <Button
          size="icon" variant="outline" className="h-8 w-8"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
