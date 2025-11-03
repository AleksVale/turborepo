import { ChevronLeft, ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const mockProducts = [
  {
    id: "1",
    name: "E-book: Mestre do Lançamento",
    category: "E-book",
    price: "R$ 97,00",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Curso: Fórmula Digital Express",
    category: "Curso Online",
    price: "R$ 497,00",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Mentoria: Acelera Vendas",
    category: "Mentoria",
    price: "R$ 1.997,00",
    status: "draft" as const,
  },
  {
    id: "4",
    name: "Template: Pack de Design",
    category: "Template",
    price: "R$ 47,00",
    status: "archived" as const,
  },
];

const statusMap = {
  active: { label: "Ativo", variant: "default" as const },
  draft: { label: "Rascunho", variant: "secondary" as const },
  archived: { label: "Arquivado", variant: "destructive" as const },
};

const filterTabs = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Ativos" },
  { id: "draft", label: "Rascunhos" },
  { id: "archived", label: "Arquivados" },
];

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const totalPages = 10;

  const filteredProducts =
    activeFilter === "all"
      ? mockProducts
      : mockProducts.filter((product) => product.status === activeFilter);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gerenciamento de Produtos
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize, adicione, edite e remova produtos da sua esteira.
          </p>
        </div>
        <Button className="gap-2 sm:w-auto">
          <Plus className="h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {filterTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeFilter === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter(tab.id)}
            className={
              activeFilter === tab.id
                ? ""
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader className="px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Produtos</CardTitle>
              <CardDescription className="mt-1">
                Lista de todos os seus produtos cadastrados
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[40%] min-w-[200px]">
                    Nome do Produto
                  </TableHead>
                  <TableHead className="min-w-[120px]">Categoria</TableHead>
                  <TableHead className="min-w-[100px]">Preço</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="w-[50px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-primary">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.price}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusMap[product.status].variant}>
                          {statusMap[product.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Visualizar</DropdownMenuItem>
                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredProducts.length} de {mockProducts.length}{" "}
              produtos
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-1">
                {renderPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(page as number)}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
