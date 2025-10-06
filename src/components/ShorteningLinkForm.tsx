"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { createShortLink } from "@/app/dashboard/actions";

const formSchema = z.object({
    longLink: z.string().min(1, { message: "O link não pode estar vazio." }).url({ message: "Por favor, insira uma URL válida." }),
});

export default function ShorteningLinkForm() {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            longLink: "",
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(() => {
            createShortLink(values).then((response) => {
                if (!response) return;

                if ("error" in response && response.error) {
                    console.error(response.error);
                }
                if ("success" in response && response.success) {
                    console.log(response.success);
                    form.reset();
                }
            });
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="longLink"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Encurtando..." : "Encurtar"}
                </Button>
            </form>
        </Form>
    )
}
