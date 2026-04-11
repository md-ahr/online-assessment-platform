import { Button } from "@/components/ui/button";

type QuestionEditorFooterProps = Readonly<{
  onSave: () => void;
  onSaveAndAddMore: () => void;
}>;

export function QuestionEditorFooter({
  onSave,
  onSaveAndAddMore,
}: QuestionEditorFooterProps) {
  return (
    <div className="mt-1 flex items-center justify-end gap-4 border-t border-border pt-4">
      <Button
        className="h-12 min-w-[180px] rounded-xl border border-primary bg-transparent text-base font-semibold text-primary hover:bg-primary/8"
        type="button"
        variant="outline"
        onClick={onSave}
      >
        Save
      </Button>
      <Button
        className="h-12 min-w-[180px] rounded-xl text-base font-semibold text-white"
        type="button"
        onClick={onSaveAndAddMore}
      >
        Save &amp; Add More
      </Button>
    </div>
  );
}
