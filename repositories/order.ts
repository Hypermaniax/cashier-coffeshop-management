import prisma from "@/lib/client";

export const orderRepository = {
  async getOrders() {
    return await prisma.order.findMany({
      include: {
        cashier: { select: { id: true, name: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, price: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getTodayStats() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [todayOrders, totalRevenue, productsSold, totalOrders] =
      await Promise.all([
        prisma.order.findMany({
          where: {
            createdAt: { gte: startOfDay, lte: endOfDay },
            status: "COMPLETED",
          },
          include: {
            items: {
              include: {
                product: { select: { name: true, price: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.order.aggregate({
          where: {
            createdAt: { gte: startOfDay, lte: endOfDay },
            status: "COMPLETED",
          },
          _sum: { totalAmount: true },
        }),
        prisma.orderItem.aggregate({
          where: {
            order: {
              createdAt: { gte: startOfDay, lte: endOfDay },
              status: "COMPLETED",
            },
          },
          _sum: { quantity: true },
        }),
        prisma.order.count({
          where: {
            createdAt: { gte: startOfDay, lte: endOfDay },
            status: "COMPLETED",
          },
        }),
      ]);

    return {
      todayOrders,
      todayRevenue: totalRevenue._sum.totalAmount ?? 0,
      productsSold: productsSold._sum.quantity ?? 0,
      totalOrders,
    };
  },

  async getWeeklyRevenue() {
    const result: { date: string; revenue: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const start = new Date(day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(day);
      end.setHours(23, 59, 59, 999);

      const agg = await prisma.order.aggregate({
        where: {
          createdAt: { gte: start, lte: end },
          status: "COMPLETED",
        },
        _sum: { totalAmount: true },
      });

      result.push({
        date: day.toLocaleDateString("id-ID", { weekday: "short" }),
        revenue: agg._sum.totalAmount ?? 0,
      });
    }

    return result;
  },

  async getTopProducts() {
    const items = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const withNames = await Promise.all(
      items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true },
        });
        return {
          name: product?.name ?? "Unknown",
          sold: item._sum.quantity ?? 0,
        };
      })
    );

    return withNames;
  },

  async createOrder(data: {
    cashierId: string;
    totalAmount: number;
    paymentMethod: string;
    items: { productId: string; quantity: number; subtotal: number }[];
  }) {
    return await prisma.order.create({
      data: {
        cashierId: data.cashierId,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        status: "COMPLETED",
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  },
};
