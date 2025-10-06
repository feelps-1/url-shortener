"use client"

import { Link } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export const columns: ColumnDef<Link>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "originalUrl",
        header: "Link Original"
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
        header: "Cliques"
    },
    {
        accessorKey: "createdAt",
        header: "Criado em"
    }
]

export default function MyLinksTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })
    return (
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
    )

}