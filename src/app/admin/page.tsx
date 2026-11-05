import Link from "next/link";
import { Suspense } from "react";
import WidgetErrorBoundary from "@/components/admin/WidgetErrorBoundary";
import { getLatestDay, getStatusCounts, getTopPizzas } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { STATUS_LABELS, type OrderStatus } from "@/lib/orders";


function Loading() {
    return <p className="animate-pulse text-ink/60">Memuat…</p>;
}

export default function AdminHome() {
    return (
        <section>
            <h1 className="text-3xl font-black">Overview</h1>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Suspense fallback={<Loading />}>
                    <LatestDayWidget />
                </Suspense>

                <WidgetErrorBoundary title="Status order hari ini">
                    <Suspense fallback={<Loading />}>
                        <StatusWidget />
                    </Suspense>
                </WidgetErrorBoundary>
            </div>

            <div className="mt-4">
                <Suspense fallback={<Loading />}>
                    <TopPizzasWidget />
                </Suspense>
            </div>

            <div className="mt-6 flex gap-4">
                <Link href="/admin/products" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
                    Kelola produk →
                </Link>
                <Link href="/admin/orders" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
                    Lihat order →
                </Link>
            </div>
        </section>
    );
}

async function LatestDayWidget() {
    const day = await getLatestDay();
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="font-bold">Hari terakhir ({day.date})</h2>
            <p className="mt-2">{day.orders.toLocaleString("en-US")} order</p>
            <p className="text-xl font-black">{formatPrice(day.revenue)}</p>
        </div>
    );
}

async function StatusWidget() {
    const counts = await getStatusCounts();
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="font-bold">Status order hari ini</h2>
            <ul className="mt-2 space-y-1">
                {(Object.keys(counts) as OrderStatus[]).map((s) => (
                    <li key={s}>
                        {STATUS_LABELS[s]}: <span className="font-semibold">{counts[s]}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

async function TopPizzasWidget() {
    const top = await getTopPizzas();
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="font-bold">Terlaris sepanjang masa</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
                {top.map((p) => (
                    <li key={p.id}>
                        {p.name}: {p.sold.toLocaleString("en-US")} terjual ({formatPrice(p.revenue)})
                    </li>
                ))}
            </ol>
        </div>
    );
}