import Form from "next/form";
import Link from "next/link";
import { getOrders } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/orders";

function parsePage(value: string | string[] | undefined): number {
    const n = typeof value === "string" ? Number(value) : NaN;
    return Number.isInteger(n) && n >= 1 ? n : 1;
}

function parseDate(value: string | string[] | undefined): string | null {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? value
        : null;
}

export default async function OrdersPage({
                                             searchParams,
                                         }: PageProps<"/admin/orders">) {
    const params = await searchParams;
    const page = parsePage(params.page);
    const date = parseDate(params.date);
    const { orders, totalPages } = await getOrders({ page, date });

    const href = (n: number) =>
        `/admin/orders?${new URLSearchParams({
            page: String(n),
            ...(date ? { date } : {}),
        })}`;

    return (
        <section>
            <h1 className="text-3xl font-black">Order</h1>

            <Form action="/admin/orders" className="mt-4 flex gap-2">
                <input
                    type="date"
                    name="date"
                    defaultValue={date ?? ""}
                    className="rounded-lg border border-black/10 bg-white px-3 py-2"
                />
                <button className="rounded-lg bg-ink px-4 py-2 font-semibold text-white">
                    Filter
                </button>
            </Form>

            <table className="mt-6 w-full overflow-hidden rounded-xl bg-white text-left shadow-sm">
                <thead className="bg-stone-50 text-xs uppercase text-ink/60">
                <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Total</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((o) => (
                    <tr key={o.id} className="border-t border-black/5">
                        <td className="px-4 py-3 font-semibold">
                            <Link href={`/admin/orders/${o.id}`} className="text-brand hover:underline">
                                #{o.id}
                            </Link>
                        </td>
                        <td className="px-4 py-3">{o.date} {o.time}</td>
                        <td className="px-4 py-3">{STATUS_LABELS[o.status]}</td>
                        <td className="px-4 py-3">{o.items}</td>
                        <td className="px-4 py-3">{formatPrice(o.total)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-4 flex items-center gap-4">
                {page > 1 && <Link href={href(page - 1)}>← Sebelumnya</Link>}
                <span className="text-sm text-ink/60">
          Halaman {page} dari {totalPages}
        </span>
                {page < totalPages && <Link href={href(page + 1)}>Berikutnya →</Link>}
            </div>
        </section>
    );
}