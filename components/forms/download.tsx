"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { toast } from "sonner";
import { useDownloadStore } from "@/stores/download-store";
import { useMapDataStore } from "@/stores/map-data-store";

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "The name must be at least 3 chars.",
  }),
});

export function DownloadForm() {
  const { name } = useDownloadStore();
  const { exportMapForSoLong, validateSoLongMap } = useMapDataStore();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: name,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const validation = validateSoLongMap();

    if (!validation.valid) {
      toast("Invalid Map", {
        description: validation.message,
      });
      return;
    }
    const mapData = exportMapForSoLong();

    const blob = new Blob([mapData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name + ".ber";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("map will be downloaded shortly.", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{data.name + ".ber"}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>A name for the map</FormLabel>
              <FormControl>
                <div className="flex items-center justify-between gap-1">
                  <Input
                    placeholder="map name."
                    type="string"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <span>.ber</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Download</Button>
      </form>
    </Form>
  );
}
