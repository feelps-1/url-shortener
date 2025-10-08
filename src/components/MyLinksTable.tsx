"use client"

import { Link as LinkUrl } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { Button } from "./ui/button";
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteLink } from "@/app/dashboard/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Toggle } from "./ui/toggle";
import { Switch } from "./ui/switch";
import LinkStatusToggle from "./LinkStatusToggle";
import { Input } from "./ui/input";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export const columns: ColumnDef<LinkUrl>[] = [
    {
        accessorKey: "description",
        header: "Descrição",
        cell: ({ row }) => {
            const description = row.original.description;
            return <div className="max-w-[200px] truncate" title={description || ""}>{description || "-"}</div>;
        },
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => {
            return (
                <Button variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Disponível
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const isActive = row.original
            return (
                <LinkStatusToggle link={isActive}></LinkStatusToggle>
            )
        }
    },
    {
        accessorKey: "originalUrl",
        header: "Link Original",
        cell: ({ row }) => {
            const link = row.original
            return (
                <a href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline">
                    {link.originalUrl}
                </a>
            )
        }
    },
    {
        id: "shortLink",
        header: "Link Curto",
        cell: ({ row }) => {
            const link = row.original;
            const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${link.slug}`;

            const copyToClipboard = () => {
                navigator.clipboard.writeText(shortUrl);
            };

            return (
                <div className="flex items-center gap-2 justify-between">
                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        {shortUrl.replace(/^https?:\/\//, '')}
                    </a>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
    {
        accessorKey: "clicks",
        header: ({ column }) => {
            return (
                <Button variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Cliques
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Criado em",
        cell: ({ row }) => {
            const createdAt = row.original.createdAt;
            if (!createdAt) {
                return <div className="text-center">-</div>;
            }
            return format(new Date(createdAt), "dd 'de' MMM. 'de' yyyy", { locale: ptBR });
        },
    },
    {
        accessorKey: "expiresAt",
        header: "Expira em",
        cell: ({ row }) => {
            const expiresAt = row.original.expiresAt;
            if (!expiresAt) {
                return <div className="text-center">-</div>;
            }
            return format(new Date(expiresAt), "dd 'de' MMM. 'de' yyyy", { locale: ptBR });
        },
    },
    {
        id: "actions",
        header: () => null,
        cell: ({ row }) => {
            const link = row.original;
            const [isPending, startTransition] = useTransition();

            const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${link.slug}`;

            const handleDelete = () => {
                startTransition(() => {
                    deleteLink(link.id).then((response) => {
                        // Adicione feedback (toast) aqui, se desejar
                        if (response.error) console.error(response.error)
                        if (response.success) console.log(response.success)
                    });
                });
            };

            return (
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/links/${link.id}/editar`}>Editar</Link>
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600">
                                    Excluir
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o seu
                                link dos nossos servidores.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                                {isPending ? "Excluindo..." : "Continuar"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        }
    }
]

export default function MyLinksTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters
        }
    })
    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filtrar por link original..."
                    value={(table.getColumn("originalUrl")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("originalUrl")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null :
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"} >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllLeafColumns().length} className="h-24 text-center">
                                    Sem resultados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                    Anterior
                </Button>
                <Button variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
                    Próxima
                </Button>
            </div>
        </div>
    )

}