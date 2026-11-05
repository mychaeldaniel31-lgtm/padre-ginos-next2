import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/orders";
import StatusActions from "@/app/admin/StatusActions";

export default async function OrderDetailPage({
                                                  params,
                                              }: PageProps<"/admin/orders/[id]">) {
    const { id } = await params;
    if (!/^\d+$/.test(id)) notFound();
    const order = await getOrder(Number(id));
    if (!order) notFound();

    return (
        <section className="max-w-3xl">
            <Link href="/admin/orders" className="text-sm text-brand hover:underline">
                ← Semua order
            </Link>
            <h1 className="mt-4 text-3xl font-black">Order #{order.id}</h1>
            <p className="text-ink/60">
                {order.date} {order.time} · {STATUS_LABELS[order.status]}
            </p>

            <ul className="mt-6 divide-y divide-black/5 rounded-xl bg-white shadow-sm">
                {order.lines.map((l) => (
                    <li key={`${l.pizzaId}-${l.size}`} className="flex justify-between px-4 py-3">
            <span>
              {l.quantity}×{" "}
                <Link href={`/admin/products/${l.pizzaId}`} className="text-brand hover:underline">
                {l.name}
              </Link>{" "}
                ({l.size})
            </span>
                        <span>{formatPrice(l.quantity * l.price)}</span>
                    </li>
                ))}
            </ul>

            <p className="mt-4 text-right text-xl font-black">
                Total {formatPrice(order.total)}
            </p>

            <StatusActions orderId={order.id} status={order.status} />
        </section>
    );
}