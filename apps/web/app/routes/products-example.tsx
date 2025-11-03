import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useApi } from "~/hooks";
import { productService, type Product } from "~/services/product.service";

export default function ProductsExample() {
  const {
    data: productsData,
    error,
    isLoading,
    execute: fetchProducts,
  } = useApi(productService.list);

  useEffect(() => {
    fetchProducts(1, 10);
  }, [fetchProducts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive">Erro: {error.message}</p>
        <Button onClick={() => fetchProducts(1, 10)}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Produtos</h1>

      <div className="grid gap-4">
        {productsData?.data.map((product: Product) => (
          <div
            key={product.id}
            className="border border-border rounded-lg p-4 bg-card"
          >
            <h3 className="font-semibold text-lg">{product.name}</h3>
            {product.description && (
              <p className="text-muted-foreground text-sm mt-1">
                {product.description}
              </p>
            )}
            <p className="text-primary font-bold mt-2">
              R$ {product.price.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Status: {product.status}
            </p>
          </div>
        ))}
      </div>

      {productsData?.meta && (
        <div className="mt-6 text-sm text-muted-foreground">
          Página {productsData.meta.page} de {productsData.meta.totalPages} •{" "}
          {productsData.meta.total} produtos no total
        </div>
      )}
    </div>
  );
}
