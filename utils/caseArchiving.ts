// archive algorithm for cases. first, decide up to what date to archive, then export cases to csv and save file to database, then delete them from database, and add archived count to counter.

import type { notification } from "custom-types";
import type { CounterResponse,  ArchiveResponse,  CasesResponse } from "~/pocketbase-types";

export async function archiveGroupCases(groupId: string, toDate: Date): Promise<notification> {
    const pb = useNuxtApp().$pb;
    const res: notification = { status: 'failed', message: '' };
    const users = await pb.collection('users').getFullList({
        filter: `group="${groupId}"`,
    });
    if (users.length === 0) {
        res.status = 'success';
        res.message = 'No users to archive';
        return res;
    }
    for (const user of users) {
        const archiveRes = await archiveUserCasesInGroup(user.id, groupId, toDate);
        if (archiveRes.status === 'failed') {
            res.status = 'failed';
            res.message = archiveRes.message;
            return res;
        }
    }
    res.status = 'success';
    res.message = `Archived cases for group ${groupId} up to ${toDate.toISOString()}`;
    return res;
}

async function archiveUserCasesInGroup(userId: string, groupId: string, toDate: Date): Promise<notification> {
    const pb = useNuxtApp().$pb;
    const res: notification = { status: 'failed', message: '' };

    const cases = await pb.collection('cases').getFullList({
        filter: `group="${groupId}" && created <= "${toDate}" && user="${userId}"`,
    });
    if (cases.length === 0) {
        res.status = 'success';
        res.message = 'No cases to archive';
        return res;
    } else try {
    const csv = useNuxtApp().$csv as (data: any[], options?: any) => string;
    const csvData = csv(cases, {
        headers: ['id', 'created', 'updated', 'user', 'group', 'title', 'description', 'status', 'priority', 'dueDate', 'assignee', 'tags'],
    });
    const fileName = `${userId}-${groupId}-${toDate}.csv`;
    const file = new File([csvData], fileName, { type: 'text/csv' });
    
    // Create archive entry
    await pb.collection('archive').create<ArchiveResponse>({
        file,
        name: fileName,
        description: `Archived cases for user ${userId} in group ${groupId} up to ${toDate.toISOString()}`,
    });
    
    // Delete cases and get count
    const deleteResult = await deleteCasesForUserInGroup(userId, groupId, toDate);
    
    // Update archive counter
    await addToArchiveCounter(userId, groupId, deleteResult.data?.deletedCount);
    
    res.status = 'success';
    res.message = `Archived ${cases.length} cases for user ${userId} in group ${groupId} up to ${toDate.toISOString()}`;
} catch (e: any) {
    res.status = 'failed';
    res.message = e.message;
}
    return res
}

async function deleteCasesForUserInGroup(userId: string, groupId: string, toDate: Date) {
    const pb = useNuxtApp().$pb;
    const res: notification = { status: 'failed', message: '', data: { deletedCount: 0}};
    let count = 0
    let deletedCount = 0;
    try {
        const cases = await pb.collection('cases').getList<CasesResponse>(1, 10000, {
            filter: `group="${groupId}" && created <= "${toDate}" && user="${userId}"`,
        });
        if (cases.items.length === 0) {
            res.status = 'success';
            res.message = 'No cases to delete';
            return res;
        }
        count = cases.items.length;
        for (let caseItem of cases.items) {
            await pb.collection('cases').delete(caseItem.id).then(() => deletedCount++);
        }
        res.status = 'success';
        res.message = `Deleted ${deletedCount} cases for user ${userId} in group ${groupId} up to ${toDate.toISOString()}`;
        res.data = { deletedCount };
    } catch (e: any) {
        res.status = 'failed';
        res.message = e.message;
    }
    return res;
}

async function addToArchiveCounter(userId: string, groupId: string, archived: number) {
    const pb = useNuxtApp().$pb;
    try {
        const counter = await pb.collection('counter').getFirstListItem<CounterResponse>(`group="${groupId}" && user="${userId}"`);
        await pb.collection('counter').update(counter.id, { archived });

    } catch (e: any) {
        console.error('Failed to update archive counter:', e.message);
    }
}
