import { ShoppingCart, Trash2, Minus, Plus, Wallet, QrCode, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatRupiah } from "@/lib/utils";
import { CartItem } from "@/types";

const PAYMENT_METHODS = [
  {
    id: "CASH",
    label: "Tunai",
    icon: Wallet,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
  },
  {
    id: "QRIS",
    label: "QRIS",
    icon: QrCode,
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
  },
  {
    id: "CARD",
    label: "Kartu",
    icon: CreditCard,
    color: "text-purple-600",
    bg: "bg-purple-100",
    border: "border-purple-200",
  },
];

interface PosCartProps {
  cart: CartItem[];
  totalItems: number;
  totalAmount: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  clearCart: () => void;
  removeFromCart: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  increaseQuantity: (id: string) => void;
  handleCheckout: () => void;
  isPending: boolean;
}

export function PosCart({
  cart,
  totalItems,
  totalAmount,
  paymentMethod,
  setPaymentMethod,
  clearCart,
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
  handleCheckout,
  isPending,
}: PosCartProps) {
  return (
    <div className="flex w-[350px] shrink-0 flex-col border-l bg-background xl:w-[400px] shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-20">
      {/* Cart Header */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold">Detail Pesanan</h2>
        </div>
        {cart.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-3 text-xs"
          >
            Kosongkan
          </Button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground space-y-4">
            <div className="h-24 w-24 rounded-full bg-amber-50 flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-amber-300" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Keranjang masih kosong</p>
              <p className="text-sm mt-1">Pilih menu dari daftar di sebelah kiri</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => {
              const productTotalQtyInCart = cart
                .filter((c) => c.product.id === item.product.id)
                .reduce((sum, c) => sum + c.quantity, 0);
              
              const isStockDepleted = productTotalQtyInCart >= item.product.stock;

              return (
                <Card
                  key={item.id}
                  className="flex flex-col gap-2 rounded-xl shadow-sm animate-in slide-in-from-right-2"
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col pr-4">
                        <p className="font-semibold text-sm leading-tight">
                          {item.product.name}
                        </p>
                        {item.selectedModifiers.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.selectedModifiers.map((mod) => (
                              <Badge
                                key={mod.optionId}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground font-medium"
                              >
                                {mod.optionName}{" "}
                                {mod.additionalPrice > 0
                                  ? `(+${formatRupiah(mod.additionalPrice)})`
                                  : ""}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-red-500 shrink-0"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-amber-600 text-sm">
                        {formatRupiah(item.subtotal)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-lg border bg-background shadow-sm">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => decreaseQuantity(item.id)}
                          className="h-7 w-7 rounded-none rounded-l-lg hover:bg-muted"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="flex h-7 w-8 items-center justify-center text-sm font-semibold border-x">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => increaseQuantity(item.id)}
                          disabled={isStockDepleted}
                          className="h-7 w-7 rounded-none rounded-r-lg hover:bg-muted disabled:opacity-50"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Checkout Section */}
      <div className="border-t bg-muted/10 p-6 pt-5">
        {/* Payment Methods */}
        <div className="mb-5">
          <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Metode Pembayaran
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method.id;
              const Icon = method.icon;
              return (
                <Button
                  key={method.id}
                  variant="outline"
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "h-auto flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                    isSelected
                      ? cn("border-transparent shadow-sm ring-2 ring-amber-500", method.bg)
                      : "bg-background hover:bg-muted hover:border-amber-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "mb-1.5 h-5 w-5",
                      isSelected ? method.color : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-bold",
                      isSelected ? method.color : "text-muted-foreground"
                    )}
                  >
                    {method.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Totals */}
        <div className="space-y-2 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Item</span>
            <span className="font-medium">{totalItems}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatRupiah(totalAmount)}</span>
          </div>
          <div className="border-t border-dashed pt-2 mt-2 flex justify-between items-end">
            <span className="font-bold text-foreground">Total Bayar</span>
            <span className="text-2xl font-black text-amber-600">
              {formatRupiah(totalAmount)}
            </span>
          </div>
        </div>

        {/* Pay Button */}
        <Button
          size="lg"
          onClick={handleCheckout}
          disabled={cart.length === 0 || isPending}
          className="w-full h-14 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...
            </>
          ) : (
            "Proses Pembayaran"
          )}
        </Button>
      </div>
    </div>
  );
}
