import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useOrders } from "~/hooks/use-orders";
import type { CreateOrderData } from "~/services/order.service";

export default function OrdersPage() {
  const {
    orders,
    meta,
    error,
    isLoading,
    fetchOrders,
    createOrder,
    isCreating,
    deleteOrder,
    isDeleting,
  } = useOrders();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateOrderData>({
    productId: "",
    amount: 0,
  });

  useEffect(() => {
    fetchOrders(1, 10);
  }, [fetchOrders]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createOrder(formData);
      setShowCreateForm(false);
      setFormData({ productId: "", amount: 0 });
      fetchOrders(1, 10);
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;

    try {
      await deleteOrder(id);
      fetchOrders(1, 10);
    } catch (err) {
      console.error("Erro ao excluir pedido:", err);
    }
  };

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
        <Button onClick={() => fetchOrders(1, 10)}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {showCreateForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Criar Novo Pedido</h2>
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div>
              <Label htmlFor="productId">ID do Produto</Label>
              <Input
                id="productId"
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Pedido"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {orders?.map((order) => (
          <div
            key={order.id}
            className="border border-border rounded-lg p-4 bg-card flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">Pedido #{order.id}</h3>
              <p className="text-sm text-muted-foreground">
                Produto: {order.productId}
              </p>
              <p className="text-primary font-bold mt-2">
                R$ {order.amount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Status: {order.status}
              </p>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDeleteOrder(order.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        ))}
      </div>

      {meta && (
        <div className="mt-6 text-sm text-muted-foreground">
          Página {meta.page} de {meta.totalPages} • {meta.total} pedidos no
          total
        </div>
      )}
    </div>
  );
}
