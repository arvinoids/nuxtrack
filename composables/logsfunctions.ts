import type { LogsResponse, LogsTypeOptions } from "~/pocketbase-types";


type interval = {
    timeStart: string,
    timeEnd: string,
}

export async function useGetLogsData(
    pageNumber: number,
    items: number,
    interval?: interval,
    user?: string,
    type?: LogsTypeOptions,
) {
    const pb = useNuxtApp().$pb;
    const filters = [];
    if (interval) {
        if (interval.timeStart) {
            const startDate = new Date(interval.timeStart);
            if (!Number.isNaN(startDate.getTime())) {
                filters.push(`created >= "${startDate.toISOString()}"`);
            }
        }
        if (interval.timeEnd) {
            const endDate = new Date(interval.timeEnd);
            if (!Number.isNaN(endDate.getTime())) {
                filters.push(`created <= "${endDate.toISOString()}"`);
            }
        }
    }
    if (user) {
        filters.push(`user="${user}"`);
    }
    console.log("type", type);
    if (type) {
        filters.push(`type="${type}"`);
    }

    const data = await pb.collection("logs").getList<LogsResponse>(pageNumber, items, {
        filter: filters.join("&&"),
        sort: "-created"
    })
    return data;
}
