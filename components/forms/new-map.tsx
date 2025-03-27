"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ChevronsDownUp, ChevronsRightLeft } from "lucide-react";
import { useMapStore } from "@/stores/map-store";

const FormSchema = z.object({
  width: z.coerce.number().min(3, {
    message: "The width must be at least 3.",
  }),
  height: z.coerce.number().min(5, {
    message: "The height must be at least 5.",
  }),
});

export function NewMapForm() {
  const { width, height, setWidth, setHeight } = useMapStore();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      width: width,
      height: height,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setWidth(data.width);
    setHeight(data.height);
    toast("map created", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>width</FormLabel>
              <FormControl>
                <div className="flex items-center justify-start">
                  <ChevronsRightLeft className="text-muted-foreground" />
                  <Input
                    placeholder=">2"
                    type="number"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>height</FormLabel>
              <FormControl>
                <div className="flex items-center justify-start">
                  <ChevronsDownUp className="text-muted-foreground" />
                  <Input
                    placeholder=">4"
                    type="number"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
