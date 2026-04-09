"use client";

import type { Editor } from "@tiptap/core";
import TextAlign from "@tiptap/extension-text-align";
import {
  EditorProvider,
  useCurrentEditor,
  useEditorState,
} from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  type LucideIcon,
  Redo2,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectItemText,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const richTextExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];

type BlockValue = "paragraph" | "h1" | "h2" | "h3";
type AlignValue = "left" | "center" | "right" | "justify";

const blockLabels: Record<BlockValue, string> = {
  paragraph: "Normal text",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
};

function getBlockType(editor: Editor): BlockValue {
  if (editor.isActive("heading", { level: 1 })) return "h1";
  if (editor.isActive("heading", { level: 2 })) return "h2";
  if (editor.isActive("heading", { level: 3 })) return "h3";
  return "paragraph";
}

function getTextAlign(editor: Editor): AlignValue {
  const order: AlignValue[] = ["left", "center", "right", "justify"];
  for (const a of order) {
    if (editor.isActive({ textAlign: a })) return a;
  }
  return "left";
}

const ALIGN_ICONS: Record<AlignValue, LucideIcon> = {
  center: AlignCenter,
  justify: AlignJustify,
  left: AlignLeft,
  right: AlignRight,
};

function RichTextToolbar({ disabled }: { readonly disabled?: boolean }) {
  const { editor } = useCurrentEditor();
  const toolState = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e) {
        return {
          canRedo: false,
          canUndo: false,
          isBold: false,
          isItalic: false,
          blockType: "paragraph" as BlockValue,
          textAlign: "left" as AlignValue,
        };
      }
      return {
        canRedo: e.can().redo(),
        canUndo: e.can().undo(),
        isBold: e.isActive("bold"),
        isItalic: e.isActive("italic"),
        blockType: getBlockType(e),
        textAlign: getTextAlign(e),
      };
    },
  });

  if (!editor || !toolState) {
    return null;
  }

  const { blockType, canRedo, canUndo, isBold, isItalic, textAlign } =
    toolState;

  const setBlock = (value: BlockValue) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
      return;
    }
    const level = Number(value.slice(1)) as 1 | 2 | 3;
    editor.chain().focus().setHeading({ level }).run();
  };

  const setAlign = (value: AlignValue) => {
    editor.chain().focus().setTextAlign(value).run();
  };

  const AlignIcon = ALIGN_ICONS[textAlign];

  return (
    <div
      aria-label="Text formatting"
      className="flex w-full min-w-0 flex-wrap items-center gap-1 border-b border-border bg-muted px-2 py-1.5 text-foreground"
      role="toolbar"
    >
      <Button
        aria-label="Undo"
        className="text-foreground hover:bg-background/60 dark:hover:bg-background/25"
        disabled={disabled || !canUndo}
        onClick={() => editor.chain().focus().undo().run()}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Undo2 aria-hidden className="size-4" />
      </Button>
      <Button
        aria-label="Redo"
        className="text-foreground hover:bg-background/60 dark:hover:bg-background/25"
        disabled={disabled || !canRedo}
        onClick={() => editor.chain().focus().redo().run()}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Redo2 aria-hidden className="size-4" />
      </Button>

      <Select
        disabled={disabled}
        onValueChange={(v) => setBlock(v as BlockValue)}
        value={blockType}
      >
        <SelectTrigger
          className={cn(
            "h-8 min-h-0 w-max max-w-full shrink-0 justify-start gap-1 border-0 bg-transparent px-2 py-1 text-sm font-normal text-foreground shadow-none",
            "hover:bg-background/60 focus-visible:ring-2 focus-visible:ring-ring/50 data-placeholder:text-muted-foreground dark:hover:bg-background/25",
            "[&_svg]:text-foreground"
          )}
        >
          <SelectValue placeholder="Normal text" />
        </SelectTrigger>
        <SelectPortal>
          <SelectPositioner>
            <SelectPopup>
              <SelectList>
                {(Object.keys(blockLabels) as BlockValue[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    <SelectItemText>{blockLabels[key]}</SelectItemText>
                  </SelectItem>
                ))}
              </SelectList>
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </Select>

      <Select
        disabled={disabled}
        onValueChange={(v) => setAlign(v as AlignValue)}
        value={textAlign}
      >
        <SelectTrigger
          className={cn(
            "h-8 min-h-0 w-max shrink-0 justify-start gap-1 border-0 bg-transparent px-2 py-1 text-foreground shadow-none",
            "hover:bg-background/60 focus-visible:ring-2 focus-visible:ring-ring/50 dark:hover:bg-background/25",
            "[&_svg]:text-foreground"
          )}
        >
          <AlignIcon aria-hidden className="size-4 shrink-0" />
          <span className="sr-only">Text alignment</span>
        </SelectTrigger>
        <SelectPortal>
          <SelectPositioner>
            <SelectPopup>
              <SelectList>
                <SelectItem value="left">
                  <SelectItemText>
                    <span className="flex items-center gap-2">
                      <AlignLeft aria-hidden className="size-4" />
                      Align left
                    </span>
                  </SelectItemText>
                </SelectItem>
                <SelectItem value="center">
                  <SelectItemText>
                    <span className="flex items-center gap-2">
                      <AlignCenter aria-hidden className="size-4" />
                      Align center
                    </span>
                  </SelectItemText>
                </SelectItem>
                <SelectItem value="right">
                  <SelectItemText>
                    <span className="flex items-center gap-2">
                      <AlignRight aria-hidden className="size-4" />
                      Align right
                    </span>
                  </SelectItemText>
                </SelectItem>
                <SelectItem value="justify">
                  <SelectItemText>
                    <span className="flex items-center gap-2">
                      <AlignJustify aria-hidden className="size-4" />
                      Justify
                    </span>
                  </SelectItemText>
                </SelectItem>
              </SelectList>
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </Select>

      <Button
        aria-label="Bold"
        aria-pressed={isBold}
        className={cn(
          "text-foreground hover:bg-background/60 dark:hover:bg-background/25",
          isBold && "bg-background/75 dark:bg-background/35"
        )}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Bold aria-hidden className="size-4" />
      </Button>
      <Button
        aria-label="Italic"
        aria-pressed={isItalic}
        className={cn(
          "text-foreground hover:bg-background/60 dark:hover:bg-background/25",
          isItalic && "bg-background/75 dark:bg-background/35"
        )}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Italic aria-hidden className="size-4" />
      </Button>
    </div>
  );
}

export type RichTextEditorProps = {
  readonly className?: string;
  readonly content?: string;
  readonly disabled?: boolean;
  readonly onChange?: (html: string) => void;
};

export function RichTextEditor({
  className,
  content = "<p></p>",
  disabled,
  onChange,
}: RichTextEditorProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-lg border border-border bg-background",
        className
      )}
    >
      <EditorProvider
        content={content}
        editable={!disabled}
        editorContainerProps={{
          className: cn(
            "min-h-[140px] w-full bg-background px-4 py-3 text-sm text-foreground",
            "[&_.tiptap]:min-h-[140px] [&_.tiptap]:outline-none",
            "[&_.ProseMirror]:min-h-[140px] [&_.ProseMirror]:outline-none",
            "[&_.ProseMirror_h1]:mt-2 [&_.ProseMirror_h1]:mb-1 [&_.ProseMirror_h1]:text-xl [&_.ProseMirror_h1]:font-semibold [&_.ProseMirror_p]:my-1",
            "[&_.ProseMirror_h2]:mt-2 [&_.ProseMirror_h2]:mb-1 [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold",
            "[&_.ProseMirror_h3]:mt-2 [&_.ProseMirror_h3]:mb-1 [&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-semibold",
            disabled && "pointer-events-none opacity-60"
          ),
        }}
        extensions={richTextExtensions}
        immediatelyRender={false}
        onUpdate={({ editor }) => onChange?.(editor.getHTML())}
        slotBefore={<RichTextToolbar disabled={disabled} />}
      />
    </div>
  );
}
