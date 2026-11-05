"use client";

import { catchError } from "next/error";

function Fallback(
    { title }: { title: string },
    { retry }: { retry: () => void },
) {
    return (
        <div role="alert" className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="font-bold">{title}</h2>
            <p className="mt-2 text-red-600">Gagal memuat data ini.</p>
            <button onClick={() => retry()} className="mt-2 font-semibold text-brand underline">
                Coba lagi
            </button>
        </div>
    );
}

export default catchError(Fallback);