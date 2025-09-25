"use client";

import dynamic from "next/dynamic";

export const ClientTimetable = dynamic(() => import("@/components/timetable-client"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-slate-600">加载课表中...</p>
            </div>
        </div>
    ),
});