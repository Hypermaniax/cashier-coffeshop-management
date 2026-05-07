"use client";

import { useState, useMemo, useTransition } from "react";
import {
  Search,
  Coffee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitOrderAction } from "./actions";
import { Category, Product, CartItem, CartItemModifier } from "@/types";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { PosModifierDialog } from "./pos-modifier-dialog";
import { PosProductCard } from "./pos-product-card";
import { PosCart } from "./pos-cart";

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

  // Modifier Dialog State
  const [selectedProductForModifier, setSelectedProductForModifier] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeCategory === "ALL" || p.categoryId === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [products, search, activeCategory]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const handleProductClick = (product: Product) => {
    if (product.stock <= 0) {
      toast.error("Stok habis!");
      return;
    }

    if (product.modifierGroups && product.modifierGroups.length > 0) {
      setSelectedProductForModifier(product);
    } else {
      handleAddProductToCart(product, [], 1);
    }
  };

  const generateCartItemId = (productId: string, modifiers: CartItemModifier[]) => {
    if (modifiers.length === 0) return productId;
    const modifierString = modifiers
      .map((m) => m.optionId)
      .sort()
      .join("-");
    return `${productId}-${modifierString}`;
  };

  const handleAddProductToCart = (
    product: Product,
    selectedModifiers: CartItemModifier[],
    quantity: number
  ) => {
    const cartItemId = generateCartItemId(product.id, selectedModifiers);
    const modifiersTotal = selectedModifiers.reduce((sum, mod) => sum + mod.additionalPrice, 0);
    const itemPrice = product.price + modifiersTotal;

    setCart((prev) => {
      const totalProductQty = prev
        .filter((item) => item.product.id === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);

      if (totalProductQty + quantity > product.stock) {
        toast.error("Stok keseluruhan produk ini tidak mencukupi!");
        return prev;
      }

      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity, subtotal: itemPrice * (item.quantity + quantity) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          quantity,
          selectedModifiers,
          subtotal: itemPrice * quantity,
        },
      ];
    });
  };

  const increaseQuantity = (cartItemId: string) => {
    setCart((prev) => {
      const targetItem = prev.find((item) => item.id === cartItemId);
      if (!targetItem) return prev;

      const totalProductQty = prev
        .filter((item) => item.product.id === targetItem.product.id)
        .reduce((sum, item) => sum + item.quantity, 0);

      if (totalProductQty + 1 > targetItem.product.stock) {
        toast.error("Stok keseluruhan produk ini tidak mencukupi!");
        return prev;
      }

      return prev.map((item) => {
        if (item.id === cartItemId) {
          const itemPrice = item.subtotal / item.quantity;
          return { ...item, quantity: item.quantity + 1, subtotal: itemPrice * (item.quantity + 1) };
        }
        return item;
      });
    });
  };

  const decreaseQuantity = (cartItemId: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const itemPrice = item.subtotal / item.quantity;
            return { ...item, quantity: item.quantity - 1, subtotal: itemPrice * (item.quantity - 1) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
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
          subtotal: item.subtotal,
          modifiers: item.selectedModifiers, // Pass modifiers to action
        })),
      };

      const result = await submitOrderAction(payload);
      if (result.success) {
        toast.success(result.message);
        clearCart();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:-m-6 overflow-hidden bg-muted/30">
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
            <div className="w-full sm:max-w-xs">
              <InputGroup className="h-10 rounded-full bg-muted/50 transition-all has-[[data-slot=input-group-control]:focus-visible]:border-amber-400 has-[[data-slot=input-group-control]:focus-visible]:ring-amber-500/30">
                <InputGroupAddon align="inline-start">
                  <Search className="h-4 w-4 text-muted-foreground ml-1" />
                </InputGroupAddon>
                <InputGroupInput
                  type="text"
                  placeholder="Cari menu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={activeCategory === "ALL" ? "default" : "outline"}
              onClick={() => setActiveCategory("ALL")}
              className={cn(
                "whitespace-nowrap rounded-full px-5 transition-all duration-200",
                activeCategory === "ALL"
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 border-transparent"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              Semua Menu
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-5 transition-all duration-200",
                  activeCategory === cat.id
                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 border-transparent"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

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
                const cartQty = cart
                  .filter((item) => item.product.id === product.id)
                  .reduce((sum, item) => sum + item.quantity, 0);
                // const outOfStock = product.stock <= 0;

                return (
                  <PosProductCard
                    key={product.id}
                    product={product}
                    cartQty={cartQty}
                    onClick={() => handleProductClick(product)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────── Right Side: Cart ─────────────────────── */}
      <PosCart
        cart={cart}
        totalItems={totalItems}
        totalAmount={totalAmount}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        clearCart={clearCart}
        removeFromCart={removeFromCart}
        decreaseQuantity={decreaseQuantity}
        increaseQuantity={increaseQuantity}
        handleCheckout={handleCheckout}
        isPending={isPending}
      />

      <PosModifierDialog
        product={selectedProductForModifier}
        open={!!selectedProductForModifier}
        onClose={() => setSelectedProductForModifier(null)}
        onConfirm={handleAddProductToCart}
      />
    </div>
  );
}
