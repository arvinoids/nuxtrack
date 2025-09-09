import type { emailContent, LogData } from "custom-types";
import type { ListResult } from "pocketbase";
import type { CasesRecord, LogsRecord, LogsResponse, SettingsResponse } from "~/pocketbase-types";

//const 

export function useGetBooleanFromLocalStorage(value: string | null) {
  let result: boolean;
  if (value === 'true') result = true
  else result = false
  return result
}

export async function useSendEmail(email: emailContent) {
  const pb = useNuxtApp().$pb
  const enabled = await pb
    .collection("settings")
    .getFirstListItem(`field="emailnotification"`);
  if (enabled.value === "false") {
    return {
      message: "Email notifications are currently disabled.",
      status: "warning",
    };
  }
  const emailurl = (
    await pb.collection("settings").getFirstListItem(`field="emailservice"`)
  ).value;
  const token = (
    await pb.collection("settings").getFirstListItem(`field="emailtoken"`)
  ).value;
  const res = await $fetch(emailurl, {
    method: "POST",
    body: {...email,from_name: APP_NAME},
    headers: {
      Authorization: token,
    },
  });
  return res;
}

export async function useSendAssignNotification(caseRecord:CasesRecord){
  const currentUser = useCurrentUser()
  const groupName = useGetGroupName(caseRecord.group!)
  const currentTime = useFormatDate(new Date(Date.now()));
  const pb = useNuxtApp().$pb
  const user = await pb.collection("users").getOne(caseRecord.user);
  const email = {
    to: user.email,
    subject: "New case assigned to you",
    body: `Hi ${user.fullname}, \n\n${caseRecord.case} in ${groupName} has been assigned to you by ${currentUser.value!.username} on ${currentTime}.\n\nRotation Tracker`,
  };
  const emailres = await useSendEmail(email);
  miniToast(emailres.status, emailres.message);
}

export async function useSendUnassignNotification(caseRecord:CasesRecord){
    const owner  = await useGetUserById(caseRecord.user)
    const email: emailContent = {
    to: owner.email,
    subject: "Case has been unassigned",
    body: `Hello ${owner.fullname}, \n\nThe case ${caseRecord.case} has been removed from your assignment.\n\nThanks,\nRotation Tracker`,
  };
  const emailres = await useSendEmail(email);
  miniToast(emailres.status, emailres.message);
}

export async function logActivity(data: LogData) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  try {
    pb.collection("logs").create(data);
  } catch (e: any) {
    console.log(e.message);
  }
}

function jsonCasesToCsv(cases: CasesRecord[]) {
  let csv = '';
  // Get the headers
  let headers = Object.keys(cases[0]) as (keyof CasesRecord)[];
  csv += headers.join(',') + '\n';
  // Add the data
  cases.forEach(function (row) {
    let data = headers.map(header => JSON.stringify(row[header])).join(','); // Add JSON.stringify statement
    csv += data + '\n';
  });
  return csv;
}

function timestamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

/** converts JSON to CSV to save in a file
 * @param records - array of JSON objects
 * @returns CSV as string.
 */
export function jsonToCSV(records: LogsRecord[]): string {
  let csv = '';
  let headers = Object.keys(records[0]) as (keyof LogsRecord)[];
  let headersReversed = headers.reverse();
  csv += headersReversed.join(', ') + '\n';

  records.forEach(function(row) {
    let data = headersReversed.map(header => {
      let value = row[header];
      if (typeof value === 'string') {
        // Escape double quotes by doubling them
        value = value.replace(/"/g, '""');
        // Wrap the value in double quotes if it contains a comma or newline
        if (value.includes(',') || value.includes('\n')) {
          value = `"${value}"`;
        }
      }
      return value;
    }).join(', ');
    csv += data + '\n';
  });

  return csv;
}


export async function useCountLogs(){
  const pb = useNuxtApp().$pb
  const count = await pb.collection('logs').getList(1,0)
  return count.totalItems
}

export async function useGetOldestLogs(quantity:number){
  const pb = useNuxtApp().$pb
  const list:ListResult<LogsResponse> = await pb.collection('logs').getList(1,quantity,{sort:'+created',fields:'id,user,type,details,created'})
  return list
}

export async function useDeleteOldestLogs(quantity:number){
  const pb = useNuxtApp().$pb
  const list:ListResult<LogsResponse> = await pb.collection('logs').getList(1, quantity, {sort:'+created'})
  list.items.forEach(async (item) => {
    await pb.collection('logs').delete(item.id)
  })
}

export async function useDeleteLogsRecords(record:LogsResponse[]){
  const pb = useNuxtApp().$pb
  record.forEach(async (item) => {
    await pb.collection('logs').delete(item.id)
  })
  console.log('Records deleted')
}

export async function useUploadCsvLogsToPocketBase(csv:string, quantity:number) {
  const pb = useNuxtApp().$pb
  const blob = new Blob([csv], { type: 'text/csv' });
  const formData = new FormData();
  const filename = `logs_${timestamp(new Date())}.csv`;
  formData.append('file', blob, filename);
  formData.append('name', `logs_${timestamp(new Date())}`);
  formData.append('description',`Archived ${quantity} logs`);

  try {
      const createdRecord = await pb.collection('archive').create(formData);
      // console.log('File uploaded successfully:', createdRecord);
  } catch (error) {
      console.error('Error uploading file:', error);
  }
}

export async function useGetL1Groups() {
  const pb = useNuxtApp().$pb;
  const groups = await pb.collection("settings").getFirstListItem<SettingsResponse>(`field="l1groups"`);
  if (!groups) {
    throw new Error("L1 groups not found in settings");
  }
  return JSON.parse(groups.value) as string[];
}