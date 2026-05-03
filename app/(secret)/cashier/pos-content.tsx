"use client";

import { useState, useMemo, useTransition } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Image as ImageIcon,
  CheckCircle2,
  Coffee,
  Wallet,
  CreditCard,
  QrCode,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitOrderAction } from "./actions";

/* ─────────────────────── Types ─────────────────────── */
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  categoryId: number;
  isActive: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

/* ─────────────────────── Helpers ─────────────────────── */
function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const PAYMENT_METHODS = [
  { id: "CASH", label: "Tunai", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" },
  { id: "QRIS", label: "QRIS", icon: QrCode, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
  { id: "CARD", label: "Kartu", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-200" },
];

export function PosContent({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | "ALL">("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [isPending, startTransition] = useTransition();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Filter out inactive products and apply search/category filters
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeCategory === "ALL" || p.categoryId === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [products, search, activeCategory]);

  // Cart calculations
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  /* ─────────────────────── Actions ─────────────────────── */
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error("Stok habis!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error("Stok tidak mencukupi!");
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setPaymentMethod("CASH");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Keranjang kosong!");
      return;
    }

    startTransition(async () => {
      const payload = {
        totalAmount,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity,
        })),
      };

      const result = await submitOrderAction(payload);
      if (result.success) {
        toast.success(result.message);
        clearCart();
        setShowSuccessDialog(true);
        setTimeout(() => setShowSuccessDialog(false), 3000);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-4 md:-m-6 overflow-hidden bg-muted/30">
      {/* ─────────────────────── Left Side: Products ─────────────────────── */}
      <div className="flex-1 flex flex-col h-full border-r bg-background/50 backdrop-blur-sm">
        {/* Header / Filters */}
        <div className="p-4 md:p-6 border-b bg-background z-10 sticky top-0 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Coffee className="h-6 w-6 text-amber-500" />
                Menu Kasir
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Pilih produk untuk ditambahkan ke pesanan
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border bg-muted/50 pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border",
                activeCategory === "ALL"
                  ? "bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              Semua Menu
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border",
                  activeCategory === cat.id
                    ? "bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20"
                    : "bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {filteredProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Coffee className="mb-4 h-12 w-12 opacity-20" />
              <p className="text-lg font-medium">Menu tidak ditemukan</p>
              <p className="text-sm opacity-70">
                Coba cari dengan kata kunci lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product) => {
                const cartQty =
                  cart.find((item) => item.product.id === product.id)
                    ?.quantity || 0;
                const outOfStock = product.stock <= 0;

                return (
                  <button
                    key={product.id}
                    disabled={outOfStock}
                    onClick={() => addToCart(product)}
                    className={cn(
                      "group relative flex flex-col overflow-hidden rounded-2xl border bg-card text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                      outOfStock && "opacity-60 cursor-not-allowed grayscale",
                      cartQty > 0 && "ring-2 ring-amber-500 border-transparent shadow-md"
                    )}
                  >
                    {/* Badge */}
                    {cartQty > 0 && (
                      <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white shadow-sm animate-in zoom-in-50">
                        {cartQty}
                      </div>
                    )}
                    {outOfStock && (
                      <div className="absolute left-2 top-2 z-10 rounded-md bg-red-500/90 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm uppercase">
                        Habis
                      </div>
                    )}

                    {/* Image Placeholder */}
                    <div className="aspect-square w-full bg-muted/40 flex items-center justify-center relative overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground/30 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6" />
                      )}
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <span className="font-bold text-amber-600 text-sm">
                          {formatRupiah(product.price)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Stok: {product.stock}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────── Right Side: Cart ─────────────────────── */}
      <div className="flex w-[350px] shrink-0 flex-col border-l bg-background xl:w-[400px] shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-20">
        {/* Cart Header */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold">Detail Pesanan</h2>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
            >
              Kosongkan
            </button>
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
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col gap-2 rounded-xl border bg-card p-3 shadow-sm animate-in slide-in-from-right-2"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm leading-tight pr-4">
                      {item.product.name}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-amber-600 text-sm">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center rounded-lg border bg-background shadow-sm">
                      <button
                        onClick={() => decreaseQuantity(item.product.id)}
                        className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-l-lg transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-7 w-8 items-center justify-center text-sm font-semibold border-x">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item.product)}
                        disabled={item.quantity >= item.product.stock}
                        className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-r-lg transition-colors disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all duration-200",
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
                  </button>
                );
              })}
            </div>
          </div>

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
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isPending}
            className={cn(
              "relative flex w-full items-center justify-center rounded-xl bg-amber-500 p-4 font-bold text-white shadow-lg transition-all duration-200",
              "hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-xl",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            )}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="text-lg">Proses Pembayaran</span>
            )}
          </button>
        </div>
      </div>

      {/* Success Dialog Overlay */}
      {showSuccessDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex flex-col items-center rounded-3xl bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-14 w-14 text-emerald-600" />
            </div>
            <h2 className="mb-1 text-2xl font-bold text-gray-900">Pembayaran Berhasil!</h2>
            <p className="text-gray-500">Order telah tersimpan ke sistem.</p>
          </div>
        </div>
      )}
    </div>
  );
}
