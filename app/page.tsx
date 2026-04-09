import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="subtitle">Project Assessment Platform</h1>
          <Button variant="default">Create Online Test</Button>
          <RichTextEditor />
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  );
}
