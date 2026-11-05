"use client";

import { useActionState } from "react";
import {
    updateOrderStatusAction,
    type StatusFormState,
} from "@/app/admin/actions";
import { nextStatuses, STATUS_LABELS, type OrderStatus } from "@/lib/orders";

export default function StatusActions({
                                          orderId,
                                          status,
                                      }: {
    orderId: number;   // ← ganti dari string
    status: OrderStatus;
}) {
    const [state, action, pending] = useActionState<StatusFormState, FormData>(
        updateOrderStatusAction,
        null,
    );

    const options = nextStatuses(status);

    if (options.length === 0) {
        return (
            <p className="mt-4 text-ink/60">Status final, tidak bisa diubah lagi.</p>
        );
    }

    return (
        <form action={action} className="mt-4">
            <input type="hidden" name="orderId" value={orderId} />
            <div className="flex gap-3">
                {options.map((next) => (
                    <button
                        key={next}
                        type="submit"
                        name="status"
                        value={next}
                        disabled={pending}
                        className="rounded-xl bg-brand px-4 py-2 font-semibold text-white disabled:opacity-50"
                    >
                        {pending ? "Menyimpan…" : `Ubah ke ${STATUS_LABELS[next]}`}
                    </button>
                ))}
            </div>
            {state?.error && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                    {state.error}
                </p>
            )}
        </form>
    );
}