// archive algorithm for cases. first, decide up to what date to archive, then export cases to csv and save file to database, then delete them from database, and add archived count to counter.

import type { notification } from "custom-types";
import type { CounterResponse,  ArchiveResponse,  CasesResponse, CasesRecord, ArchiveRecord, CounterRecord } from "~/pocketbase-types";

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
        const archiveRes = await archiveUserCases(user.id, groupId, toDate);
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

async function archiveUserCases(userId: string, groupId: string, toDate: Date): Promise<notification> {
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
        // store in pocketbase archive collection
        const status = await pb.collection('archive').create<ArchiveResponse>({
            file,
            name: fileName,
            description: `Archived cases for user ${userId} in group ${groupId} up to ${toDate.toISOString()}`,
        }).then(() => {
            // deleteCasesForUserInGroup(userId, groupId, toDate).then(() => {
            //     addToArchiveCounter(userId, groupId, cases.length);
            //     res.status = 'success';
            //     res.message = `Archived ${cases.length} cases for user ${userId} in group ${groupId} up to ${toDate.toISOString()}`;
            // });
        });
    }
    catch (e: any) {
        res.status = 'failed';
        res.message = e.message;
    }
    return res
}

// async function deleteCasesForUserInGroup(userId: string, groupId: string, toDate: Date) {
//     const pb = useNuxtApp().$pb;
//     const res: notification = { status: 'failed', message: '' };
//     let count = 0
//     let deletedCount = 0;
//     try {
//         const cases = await pb.collection('cases').getList<CasesResponse>(1, 10000, {
//             filter: `group="${groupId}" && created <= "${toDate}" && user="${userId}"`,
//         });
//         if (cases.items.length === 0) {
//             res.status = 'success';
//             res.message = 'No cases to delete';
//             return res;
//         }
//         count = cases.items.length;
//         for (let caseItem of cases.items) {
//             await pb.collection('cases').delete(caseItem.id).then(() => deletedCount++);
//         }
//         res.status = 'success';
//         res.message = `Deleted ${deletedCount} cases for user ${userId} in group ${groupId} up to ${toDate.toISOString()}`;
//     } catch (e: any) {
//         res.status = 'failed';
//         res.message = e.message;
//     }
//     return res;
// }

// async function addToArchiveCounter(userId: string, groupId: string, archived: number) {
//     const pb = useNuxtApp().$pb;
//     try {
//         const counter = await pb.collection('counter').getFirstListItem<CounterResponse>(`group="${groupId}" && user="${userId}"`);
//         await pb.collection('counter').update(counter.id, { archived });

//     } catch (e: any) {
//         console.error('Failed to update archive counter:', e.message);
//     }
// }

async function compressToGzip(data: string): Promise<Blob> {
  const pako = await import('pako')
  const compressed = pako.gzip(data)
  return new Blob([compressed], { type: 'application/gzip' })
}

async function convertCasesToCSV(cases: CasesRecord[]): Promise<string> {
  if (!Array.isArray(cases) || cases.length === 0) {
    return '';
  } else {
    const csvHeader = Object.keys(cases[0]).join(',');
    const csvRows = cases.map(row => {
      return Object.values(row).map(value =>
        `"${value.toString().replace(/"/g, '""')}"`
      ).join(',');
    });
    return [csvHeader, ...csvRows].join('\n');
  }
}

function getCurrentTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

async function saveCasesToArchiveFile(cases: CasesRecord[], userName: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const csvData = await convertCasesToCSV(cases)
  const compressed = await compressToGzip(csvData)
  const formData = new FormData()
  const filename = 'archived_cases_' + userName + '_' + getCurrentTimestamp() + '.csv.gz'
  const now = new Date()
  const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`
  formData.append('file', compressed, filename)
  formData.append('name', filename)
  formData.append('description', `${userName} archived cases ${dateStr}`)
  try {
    const upload: ArchiveRecord = await pb.collection('archive').create(formData)
    return {
      status: 'success', message: 'File archived',
      filename: filename,
      data: { url: pb.files.getUrl(upload, filename) }
    } as notification & { filename: string; data: { url: string } }
  } catch (e: any) {
    console.log('Error uploading file')
    return { status: 'failed', message: e.message } as notification
  }
}

async function updateArchivedCasesCount(userId: string, groupId: string, casesToArchive: number) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false)
  const result: notification = { message: '', status: 'failed' }
  try {
    const record = await pb.collection("counter").getFirstListItem<CounterRecord>(`user="${userId}" && group="${groupId}"`);
    const currentArchivedCases = record.archived || 0
    const newCount = (record.count ?? 0) - casesToArchive
    const newArchivedCount = currentArchivedCases + casesToArchive
    await pb.collection("counter").update(record.id, { archived: newArchivedCount, count: newCount < 0 ? 0 : newCount });
    result.message = `Counter updated to ${newCount}`;
    result.status = 'success'
    return result
  } catch (e: any) {
    result.message = e.message;
    return result
  }
}

async function archiveCasesForUserInGroup(userId: string, groupId: string, toKeep: number): Promise<notification&{data?: {count: number}}> {
    const pb = useNuxtApp().$pb;
    const res: notification&{data?: {count: number}} = { status: 'failed', message: '' };
    try {
      const cases = await pb.collection('cases').getFullList<CasesRecord>({ filter: `user="${userId}"&&group="${groupId}"`, sort: '+created' })
    const numberOfCasesToArchive = cases.length - toKeep
    const casesToArchive = cases.slice(0, numberOfCasesToArchive)
    const user = await useGetUserById(userId)
    await saveCasesToArchiveFile(casesToArchive, user.username)  
    res.status = 'success'
    res.message = `Archived ${casesToArchive.length} cases for user ${user.fullname}`
    res.data = { count: casesToArchive.length }
    } catch (e: any) {
      res.status = 'failed'
      res.message = e.message
    }
    return res
}

async function deleteCasesForUserInGroup(userId: string, groupId: string, toKeep: number): Promise<notification> { 
    const pb = useNuxtApp().$pb;
    const res: notification = { status: 'failed', message: '' };
    try {
      const cases = await pb.collection('cases').getFullList<CasesRecord>({ filter: `user="${userId}"&&group="${groupId}"`, sort: '+created' })
    const numberOfCasesToArchive = cases.length - toKeep
    const casesToArchive = cases.slice(0, numberOfCasesToArchive)
    const user = await useGetUserById(userId)
    for (const caseItem of casesToArchive) {
      await pb.collection('cases').delete(caseItem.id)
    }
    res.status = 'success'
    res.message = `Deleted ${casesToArchive.length} cases for user ${user.fullname}`
    } catch (e: any) {
      res.status = 'failed'
      res.message = e.message
    }
    return res
}

export async function useArchiveAndDeleteCasesForUserInGroup(userId: string, groupId: string, toKeep: number) { 
    const archiveRes = await archiveCasesForUserInGroup(userId, groupId, toKeep)
    if (archiveRes.status === 'failed') {
      return archiveRes
    }
    const deleteRes = await deleteCasesForUserInGroup(userId, groupId, toKeep)
    if (deleteRes.status === 'failed') {
      return deleteRes
    }
    const updateCounterRes = await updateArchivedCasesCount(userId, groupId, archiveRes.data?.count || 0)
    return updateCounterRes
}