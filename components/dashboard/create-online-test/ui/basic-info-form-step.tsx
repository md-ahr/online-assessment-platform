import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { TimePicker } from "@/components/ui/time-picker";

import {
  QUESTION_SET_OPTIONS,
  QUESTION_TYPE_OPTIONS,
  SLOT_OPTIONS,
} from "../create-online-test-wizard.constants";
import type { OnlineTestFormValues } from "../create-online-test-wizard.types";

function RequiredLabel({ label }: Readonly<{ label: string }>) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{label}</span>
      <span className="text-[#EA5055]">*</span>
    </span>
  );
}

type BasicInfoFormStepProps = Readonly<{
  form: UseFormReturn<OnlineTestFormValues>;
  onCancel: () => void;
  onSubmit: (values: OnlineTestFormValues) => void;
}>;

export function BasicInfoFormStep({
  form,
  onCancel,
  onSubmit,
}: BasicInfoFormStepProps) {
  return (
    <div className="flex w-full max-w-[954px] flex-col gap-6">
      <div className="w-full rounded-2xl bg-card p-6">
        <Form {...form}>
          <form
            className="flex flex-col gap-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h2 className="text-[18px] leading-[140%] font-semibold text-secondary dark:text-foreground">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                      <RequiredLabel label="Online Test Title" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter online test title"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="totalCandidates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                        <RequiredLabel label="Total Candidates" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          placeholder="Enter total candidates"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalSlots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                        <RequiredLabel label="Total Slots" />
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger aria-label="Select total slots">
                            <SelectValue placeholder="Select total slots" />
                          </SelectTrigger>
                          <SelectPortal>
                            <SelectPositioner>
                              <SelectPopup>
                                <SelectList>
                                  {SLOT_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      <SelectItemText>{option}</SelectItemText>
                                    </SelectItem>
                                  ))}
                                </SelectList>
                              </SelectPopup>
                            </SelectPositioner>
                          </SelectPortal>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="totalQuestionSet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                        <RequiredLabel label="Total Question Set" />
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger aria-label="Select total question set">
                            <SelectValue placeholder="Select total question set" />
                          </SelectTrigger>
                          <SelectPortal>
                            <SelectPositioner>
                              <SelectPopup>
                                <SelectList>
                                  {QUESTION_SET_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      <SelectItemText>{option}</SelectItemText>
                                    </SelectItem>
                                  ))}
                                </SelectList>
                              </SelectPopup>
                            </SelectPositioner>
                          </SelectPortal>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="questionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                        <RequiredLabel label="Question Type" />
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger aria-label="Select question type">
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                          <SelectPortal>
                            <SelectPositioner>
                              <SelectPopup>
                                <SelectList>
                                  {QUESTION_TYPE_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      <SelectItemText>{option}</SelectItemText>
                                    </SelectItem>
                                  ))}
                                </SelectList>
                              </SelectPopup>
                            </SelectPositioner>
                          </SelectPortal>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_158px]">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                        <RequiredLabel label="Start Time" />
                      </FormLabel>
                      <FormControl>
                        <TimePicker
                          placeholder="Select start time"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                        <RequiredLabel label="End Time" />
                      </FormLabel>
                      <FormControl>
                        <TimePicker
                          placeholder="Select end time"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                        Duration
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Duration Time"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-1 flex w-full items-center justify-between gap-5 rounded-2xl bg-card py-2">
              <Button
                className="h-12 min-w-[180px] rounded-xl border border-border bg-transparent px-8 py-3 text-base leading-[150%] font-semibold text-secondary hover:bg-muted/40 dark:text-foreground"
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>

              <Button
                className="h-12 min-w-[180px] rounded-xl px-8 py-3 text-base leading-[150%] font-semibold text-white dark:text-white"
                type="submit"
              >
                Save &amp; Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
