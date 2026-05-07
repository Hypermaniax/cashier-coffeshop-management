import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { Product } from "@/types";

interface PosProductCardProps {
  product: Product;
  cartQty: number;
  onClick: () => void;
}

export function PosProductCard({ product, cartQty, onClick }: PosProductCardProps) {
  const outOfStock = product.stock <= 0;

  return (
    <Card
      onClick={() => !outOfStock && onClick()}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        outOfStock && "opacity-60 cursor-not-allowed grayscale",
        cartQty > 0 && "ring-2 ring-amber-500 border-transparent shadow-md",
      )}
    >
      {/* Badge */}
      {cartQty > 0 && (
        <Badge className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-500 text-xs font-bold text-white shadow-sm p-0 animate-in zoom-in-50">
          {cartQty}
        </Badge>
      )}
      {outOfStock && (
        <Badge variant="destructive" className="absolute left-2 top-2 z-10 uppercase text-[10px] px-2 py-0.5">
          Habis
        </Badge>
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
      <CardContent className="flex flex-1 flex-col p-3">
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
      </CardContent>
    </Card>
  );
}
