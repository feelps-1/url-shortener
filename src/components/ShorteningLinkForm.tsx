"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useState, useTransition } from "react";
import { createShortLink } from "@/app/dashboard/actions";
import { Link as PrismaLink } from "@prisma/client";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Textarea } from "./ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { PopoverContent, Popover, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    longLink: z.string().min(1, { message: "O link não pode estar vazio." }).url({ message: "Por favor, insira uma URL válida." }),
    description: z.string().max(100, { message: "A descrição não pode ter mais de 100 caracteres" }).optional(),
    expiresAt: z.date().optional()
});

export default function ShorteningLinkForm() {
    const [isPending, startTransition] = useTransition();
    const [newLink, setNewLink] = useState<PrismaLink | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            longLink: "",
            description: "",
            expiresAt: undefined
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setNewLink(null)
        startTransition(() => {
            createShortLink(values).then((response) => {
                if (!response) return;

                if (response.error) {
                    console.error(response.error);
                }
                if (response.link && response.success) {
                    setNewLink(response.link)
                    form.reset();
                }
            });
        });
    }

    return (
        <div>


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

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Ex: Link para meu portfólio" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>

                    </FormField>

                    <FormField control={form.control}
                        name="expiresAt" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Expira em(Opcional)</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}>
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: ptBR })
                                                ) : (
                                                    <span>Escolha uma data</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}>
                    </FormField>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Encurtando..." : "Encurtar"}
                    </Button>
                </form>
            </Form>

            {newLink && (
                <Alert className="mt-4">
                    <AlertTitle>
                        Link criado com sucesso!
                    </AlertTitle>
                    <AlertDescription>
                        Seu link curto é:
                        <a href={`/${newLink?.slug}`}
                            target="_blank"
                            className="font-mono text-blue-600 hover:underline ml-2">
                            {`${process.env.NEXT_PUBLIC_APP_URL}/${newLink?.slug}`}
                        </a>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
