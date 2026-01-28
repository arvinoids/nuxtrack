import type { notification } from "custom-types";
import type { ListResult, RecordModel } from "pocketbase";
import type { user } from "pocketbase-types";
import type { GroupsResponse, ArchiveRecord, BaseSystemFields, CasesRecord, LeavesRecord, CounterResponse, CasesResponse, UsersResponse } from "~/pocketbase-types";

// When the dashboard loads, the system looks for users under each group from the currentlist collection.
//If there are no users, the system creates the currentlist by running a query from the counter sorted by count.

//The counter collection contains the count of cases for each user under a group.

//We need a way to refresh the counter every time changes are made.

async function updateCounter(group: string, user: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  let newCount = await getCount(user, group);
  // console.log("new count: ", newCount);
  let data = {
    user: user,
    group: group,
    count: newCount,
  };
  let record;
  try {
    record = await pb
      .collection("counter")
      .getFirstListItem(`group="${group}"&&user="${user}"`);
  } catch {
    console.log("No record in counter yet");
  }

  // console.log("counter record ", record);
  if (record !== undefined) {
    let res = await pb.collection("counter").update(record.id, data);
    // console.log("result", res);
  }
}

async function getCount(user: string, group: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const res = await pb.collection("cases").getList(1, 10000, {
    filter: `group="${group}"&&user="${user}"`,
  });
  return res.totalItems;
}

export async function useAssignCase(
  caseId: string,
  user: string,
  group: string
): Promise<notification> {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const data = {
    user: user,
    group: group,
    case: caseId.trim(),
    assignedBy: pb.authStore.model!.username,
  };

  const result: notification = { message: "", status: "failed" };
  if (caseId === "")
    return { message: "Case ID cannot be blank", status: "failed" };
  if (await caseExists(caseId)) {
    result.message =
      "This case has already been assigned. Please double-check and try again.";
    result.status = "failed";
    return result;
  } else {
    await pb.collection("cases").create(data);
    await updateCounter(group, user);
    let owner = (await useGetUsernameFromId(user)).toUpperCase();
    result.message = `Case has been assigned. ${owner} should receive a notification shortly.`;
    result.status = "success";
    return result;
  }
}

//case checking if it exists
export async function caseExists(caseId: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const caseFilter = 'case="' + caseId + '"';
  try {
    const record = await pb.collection("cases").getFirstListItem(caseFilter);
    if (record) return true;
    else return false;
  } catch (e) {
    return false;
  }
}

export async function useSkipOut(userId: string, groupId: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const data = {
    user: userId,
    group: groupId,
    case: generateDummyCase('OutOfOffice-'),
    assignedBy: pb.authStore.model!.username,
  };
  const result = { message: "", status: "" };
  try {
    await pb.collection("cases").create(data);
    await updateCounter(groupId, userId);
    // await createCurrentList(groupId)
    const user = await pb.collection("users").getOne(userId);
    result.message = `${user.username.toLowerCase()} is out of the office and was skipped.`;
    result.status = "success";
  } catch (e: any) {
    result.message = e.message;
    result.status = "failed";
  }
  return result;
}

export async function getUserCases(userId?: string, group?: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  // console.log("getting cases for user ", userId);
  let cases;
  if (!userId) {
    cases = await pb
      .collection("cases")
      .getList(1, 1000, { expand: "user, group", sort: "-created" });
  } else {
    if (!group) {
      cases = await pb.collection("cases").getList(1, 1000, {
        filter: `user="${userId}"`,
        expand: "user, group",
        sort: "-created",
      });
    } else {
      cases = await pb.collection("cases").getList(1, 1000, {
        filter: `user="${userId}"&&group="${group}"`,
        expand: "user, group",
        sort: "-created",
      });
    }
  }
  return cases;
}

export async function useGetFilteredCases(
  user?: string,
  group?: string,
  pageNumber?: number,
  perPage?: number
) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const sorting = "-created";
  if (pageNumber === undefined) pageNumber = 1;
  if (perPage === undefined) perPage = 10;
  if (
    ((user === undefined || user === "") && group === undefined) ||
    group === ""
  )
    return await pb
      .collection("cases")
      .getList(pageNumber, perPage, { expand: "user, group", sort: sorting });
  else if (user === undefined || user === "")
    return await pb
      .collection("cases")
      .getList(pageNumber, perPage, {
        filter: `group="${group}"`,
        expand: "user, group",
        sort: sorting,
      });
  else if (group == undefined || group === "")
    return await pb
      .collection("cases")
      .getList(pageNumber, perPage, {
        filter: `user="${user}"`,
        expand: "user, group",
        sort: sorting,
      });
  else
    return await pb
      .collection("cases")
      .getList(pageNumber, perPage, {
        filter: `user="${user}"&&group="${group}"`,
        expand: "user, group",
        sort: sorting,
      });
}

export async function useGetFilteredLogs(
  type?: string,
  pageNumber?: number,
  perPage?: number
) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const sorting = "-created";
  if (pageNumber === undefined) pageNumber = 1;
  if (perPage === undefined) perPage = 10;
  try {
    if (type === undefined || type === "")
      return await pb
        .collection("logs")
        .getList(pageNumber, perPage, { sort: sorting });
    else
      return await pb
        .collection("logs")
        .getList(pageNumber, perPage, {
          filter: `type="${type}"`,
          sort: sorting,
        });
  } catch (e) {
    console.log(e);
  }
}

export async function useUpdateCase(
  recordId: string,
  user: string,
  group: string,
  caseId: string,
  assignedBy: string
) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const data = {
    user: user,
    group: group,
    case: caseId,
    assignedBy: assignedBy,
  };
  const result = {
    message: "",
    status: "success",
  };
  try {
    const res = await pb.collection("cases").update(recordId, data);
    result.message = `Case ${caseId} has been updated.`;
    return result;
  } catch (e: any) {
    result.message = "There is a problem with the update - " + e.message;
    return result;
  }
}

export async function useDeleteCase(id: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const result = { message: "", status: "success" };
  try {
    const caseRecord = await pb.collection("cases").getOne(id);
    const caseId = caseRecord.case;
    await pb.collection("cases").delete(id);
    result.message = caseId;
    useRefreshAll();
    return result;
  } catch (e: any) {
    result.status = "failed";
    result.message = e.message;
    return result;
  }
}

export async function useSubmitCase(
  caseId: string,
  userId: string,
  groupId: string
) {
  let res: notification = { status: 'failed', message: 'Error submitting case' }
  res = await useAssignCase(caseId, userId, groupId);
  if (res.status === "success") {
    await updateUserCaseCount(userId, groupId)
    await useUpdateGroup(groupId);
  }
  return res;
}

/**
 * Updates the counter of the user in this group. First gets the current record, then queries the cases and saves the new count.
 * @param userId the user Id
 * @param groupId the group Id
 */
async function updateUserCaseCount(userId: string, groupId: string) {
  const pb = useNuxtApp().$pb
  const oldCounter = await pb
    .collection("counter")
    .getFirstListItem(`user="${userId}" && group="${groupId}"`);
  let newCount = await countCases(userId, groupId);
  let data = {
    user: userId,
    group: groupId,
    count: newCount,
  };
  try {
    const res = await pb.collection("counter").update(oldCounter.id, data);
  } catch (e: any) { console.log(e.message) }
}


export async function useEmailUser(userId: string, caseId: string, groupName: string, currentUser: user) {
  const pb = useNuxtApp().$pb
  const user = (await pb.collection('users').getOne(userId, { fields: 'fullname,email' }))
  const email = {
    to: user.email,
    subject: "New case assigned to you",
    body: `Hi ${user.fullname}, \n\n${caseId} in ${groupName} has been assigned to you by ${currentUser!.fullname} on ${useFormatDate(new Date())}.\n\nRotation Tracker`
  }
  const emailres: notification = (await useSendEmail(email))
  return emailres
}

export async function useRefreshAll() {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  //get groups
  const rec = await pb.collection("groups").getList(1, 100);
  const groups = rec.items;

  groups.forEach(async (group) => {
    const userRec = await pb
      .collection("users")
      .getList(1, 100, { filter: `memberOf~"${group.id}"` });
    const users = userRec.items;
    users.forEach(async (user) => {
      await updateCounter(group.id, user.id);
    });
  });
}

export async function useGetGroupName(group: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  try {
    const res = await pb.collection("groups").getOne(group);
    return res.name;
  } catch (e) {
    console.log(e);
  }
}

export async function useRefreshGroupCounter(group: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const users = await pb.collection('users').getList(1, 100, { filter: `memberOf~"${group}"` }).then(res => res.items)
  users.forEach((user) => {
    updateCounter(group, user.id);
  });
}

export async function useSearchCase(id: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  id = id.trim();
  let result = { message: "", status: "failed" };
  let data: RecordModel | undefined;
  try {
    data = await pb
      .collection("cases")
      .getFirstListItem(`case="${id}"`, { expand: "user" });
    result = { message: `Case ${id} found.`, status: "success" };
  } catch (e: any) {
    result = { message: e.message, status: "failed" };
    data = undefined;
  }
  return { data, result };
}

export async function useCaseExists(id: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  try {
    let res = await pb.collection("cases").getFirstListItem(`case="${id}"`);
    return true;
  } catch (e) {
    return false;
  }
}

export async function useCaseIsEscalated(id: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  try {
    let res = await pb
      .collection("cases")
      .getFirstListItem(`case="${id}-escalated"`);
    return true;
  } catch (e) {
    return false;
  }
}

export async function useEscalateCase(
  caseId: string,
  userId: string,
  groupId: string
) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  let caseRec = await getCase(caseId.trim());
  await renameOldCase(caseRec);

  const data = {
    user: userId,
    group: groupId,
    case: caseId.trim(),
    assignedBy: pb.authStore.model!.username,
  };

  const result: notification = { message: "", status: "failed" };
  try {
    await pb.collection("cases").create(data);
    await updateCounter(groupId, userId);
    // await createCurrentList(group);
    let owner = (await useGetUsernameFromId(userId)).toUpperCase();
    result.message = `Case has been escalated. ${owner} should receive a notification shortly.`;
    result.status = "success";
    await updateUserCaseCount(userId, groupId)
    await useUpdateGroup(groupId)
  } catch (e) {
    console.log(e)
    result.message = "Failed to escalate.";
    result.status = "failed";
  }
  return result;
}

async function getCase(id: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const rec = await pb.collection("cases").getFirstListItem(`case="${id}"`);
  return rec;
}

async function renameOldCase(rec: RecordModel) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  let newCaseId = rec.case + "-escalated";
  rec.case = newCaseId;
  const newData = {
    ...rec,
  };
  try {
    await pb.collection("cases").update(rec.id, newData);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Reassigns cases before deleting the user.
 */
export async function useReassignCases(oldUserId: string, newUserId: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const res = { message: "Reassign failed", status: "failed" };
  const userCases = await pb
    .collection("cases")
    .getList(1, 10000, { filter: `user="${oldUserId}"` });
  const newUserName = await useGetUsernameFromId(newUserId);
  if (userCases.totalItems > 0) {
    userCases.items.forEach(async (item) => {
      try {
        await pb.collection("cases").update(item.id, { user: newUserId });
        res.message = `Cases assigned to user ${newUserName}.`;
        res.status = "success";
      } catch (e) {
        console.log(e);
      }
    });
  } else {
    res.message = "No cases to reassign.";
    res.status = "success";
  }
  return res;
}

async function removeCounters(userId: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  // remove items with matching user id
  const res = { message: "Unable to remove counters", status: " failed" };
  const countersData = await pb
    .collection("counter")
    .getList(1, 100, { filter: `user="${userId}"` });
  try {
    countersData.items.forEach(async (item) => {
      await pb.collection("counter").delete(item.id);
    });
  } catch (e: any) {
    res.message = e.message;
    res.status = "success";
  }
  return res;
}

async function removeLists(userId: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const res = { message: "Unable to remove from lists", status: " failed" };
  const listsData = await pb
    .collection("currentlist")
    .getList(1, 100, { filter: `user="${userId}"` });
  try {
    listsData.items.forEach(async (item) => {
      await pb.collection("currentlist").delete(item.id);
    });
  } catch (e: any) {
    res.message = e.message;
    res.status = "success";
  }
  return res;
}

export async function useRemoveUserFromGroups(id: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const res = { message: "Remove failed", status: "failed" };
  // const user = await pb.collection('users').getOne(id)
  try {
    await removeCounters(id);
    await removeLists(id);
    await pb.collection("users").update(id, { memberOf: [""] });
    res.message = "User has been removed from all groups";
    res.status = "success";
  } catch (e: any) {
    res.message = e.message;
  }
  return res;
}



export async function useMakeCounter(group: string, users: ListResult<user>) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);

  users.items.forEach(async (user) => {
    const count = (
      await pb
        .collection("cases")
        .getList(1, 10000, { filter: `user="${user.id}"&&group="${group}"` })
    ).totalItems;
    let data = {
      user: user.id,
      group,
      count,
    };

    // look for old entry if it exists
    const oldCounter = await pb
      .collection("counter")
      .getList(1, 1, { filter: `user="${user.id}"&&group="${group}"` });
    if (oldCounter.totalItems === 1) {
      await pb.collection("counter").delete(oldCounter.items[0].id);
    } else {
      oldCounter.items.forEach(async (item) => {
        await pb.collection("counter").delete(item.id);
      })
    }
    // create new counter
    const res = await pb.collection("counter").create(data);
  });
}

/** Revised make counter function. */
export async function useNewMakeCounter(group: string, users: user[]) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  users.forEach(async (user) => {
    const count = (
      await pb
        .collection("cases")
        .getList(1, 10000, { filter: `user="${user.id}"&&group="${group}"`, fields: '' })
    ).totalItems;
    let data = {
      user: user.id,
      group: group,
      count,
    };
    // get old counter entry
    const oldCounter = await pb
      .collection("counter")
      .getList(1, 1, { filter: `user="${user.id}"&&group="${group}"`, fields: '' });
    if (oldCounter.totalItems === 1) {
      // update old counter
      await pb.collection("counter").update(oldCounter.items[0].id, data);
    } else if (oldCounter.totalItems > 0) {
      // delete old counters then create new counter
      oldCounter.items.forEach(async (item) => {
        await pb.collection("counter").delete(item.id);
      })
      await pb.collection("counter").create(data);
    } else await pb.collection("counter").create(data);
  });
}

export async function useUpdateCounter(group: string, users: ListResult<user>) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  users.items.forEach(async (user) => {
    const oldCounter = await pb
      .collection("counter")
      .getFirstListItem(`user="${user.id}" && group="${group}"`);
    let newCount = await countCases(user.id, group);
    let data = {
      user: user.id,
      group,
      count: newCount,
    };
    try {
      const res = await pb.collection("counter").update(oldCounter.id, data);
    } catch (e: any) { console.log(e.message) }
  });
}

export async function useNewUpdateCounter(group: string, users: user[]) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  users.forEach(async (user) => {
    const oldCounter = await pb
      .collection("counter")
      .getFirstListItem(`user="${user.id}" && group="${group}"`, { fields: '' });
    let newCount = await countCases(user.id, group);
    let data = {
      user: user.id,
      group: group,
      count: newCount,
    };
    try {
      const res = await pb.collection("counter").update(oldCounter.id, data);
    } catch (e: any) { console.log(e.message) }
  });
}

/** Counts the number of cases for a user in a group. Queries the cases and filter by userId and groupId
 * @params user - the id of the user
 * @params group - the id of the group
 * @returns the number of cases for the user in the group.
 */
async function countCases(userId: string, groupId: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const res = await pb
    .collection("cases")
    .getList(1, 10000, { filter: `user="${userId}"&&group="${groupId}"`, fields: '' });
  return res.totalItems;
}

// export async function useUpdateCurrentList(group: string) {
//   const counter = await pb.collection('counter').getList(1, 1000, { filter: `group="${group}"`, sort: "+count" })
// }

/**
 * Finds a case in the database and returns the case details.
 * @param id 
 * @returns status, message, and data if available
 */
export async function useFindCase(id: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const res = {
    message: "",
    status: "",
  };
  let data: RecordModel | null;

  try {
    data = await pb
      .collection("cases")
      .getFirstListItem(`case="${id.trim()}"`, { expand: "user,group" });
    res.message = "Case found";
    res.status = "success";
  } catch (e: any) {
    res.message = "The case does not exist in the database";
    data = null
    res.status = 'failed'
  }
  return { res, data };
}

export async function useFindCases(caseId: string) {
  type Texpand = {
  user:UsersResponse,
  group:GroupsResponse
};
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const res = await pb.collection('cases').getList<CasesResponse<Texpand>>(1, 100, { filter: `case~"${caseId}"`, expand: 'user,group', sort: '-created' })
  return res
}

/**Generates a dummy case Id for use as fillers in Leaves or for other purposes
 * @param prefix - the prefix for the case id to be generated
 * @returns a string of the case Id
 */
function generateDummyCase(prefix: string) {
  const random = Math.random().toString(36).substring(3, 9);
  const caseId: string = prefix + random
  return caseId
}

/**Mass-creates dummy cases
 * 
 * @param quantity 
 * @param prefix 
 * @returns an array of strings(cases)
 */
function createDummyCases(quantity: number, prefix: string) {
  let cases: string[] = []
  while (quantity > 0) {
    cases.push(generateDummyCase(prefix))
    quantity--
  }
  return cases
}

/** Adds dummy cases to the database
 * 
 * @param quantity 
 * @param userId 
 * @param groupId 
 * @param prefix of the case ID to generate, e.g. DummyXxXxx or LeaveXxxxx, etc 
 * @returns a success or fail status, and a message. Used for notifications.
 */
export async function useAddDummyCases(quantity: number, userId: string, groupId: string, prefix: string) {
  const percent = usePercentComplete('dummy')
  percent.value = 0
  let createdCasesCount = ref(0)
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const cases = createDummyCases(quantity, prefix)
  for (let caseId of cases) {
    let data = {
      user: userId,
      group: groupId,
      case: caseId,
      assignedBy: useCurrentUser().value?.username,
    };
    try {
      await pb.collection("cases").create(data)
      .then(() => { 
        createdCasesCount.value++; 
        percent.value = Math.floor((createdCasesCount.value / quantity) * 100) 
      });
    } catch (e) {
      console.log(e);
    }
  }
  
  await addToTotalCases(quantity, groupId) // this adds to the total case count on all active leaves to account for dummy case computation after leave
  console.log('created =', createdCasesCount.value, 'quantity=', quantity)
  if (createdCasesCount.value === quantity) return { status: 'success', message: `${quantity} Cases created` }
  return { status: 'failed', message: 'Some errors were encountered creating the cases' }
}

/** Adds to case count in active leave record
 * 
 * @param quantity the amount to add
 * @param groupId the group to add to
 */
async function addToTotalCases(quantity: number, groupId: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const leaveRecords = await pb.collection('leaves').getList<LeavesRecord & BaseSystemFields>(1, 1000, { filter: `group="${groupId}" && active=true` })
  for (const record of leaveRecords.items) {
    const oldRecord = await pb.collection('leaves').getOne<LeavesRecord>(record.id)
    const reason = oldRecord.reason || "On leave"
    const total_cases = record.total_cases + quantity
    const data = { total_cases, reason }
    await pb.collection('leaves').update(record.id, data)
  }
}

/** Returns a pocketbase ListResult that contains the list of groups */
export async function useGetAllGroups() {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const res = await pb.collection<GroupsResponse>('groups').getList(1,100,{sort:'+order'})
  return res
}

/** Deletes all cases in selected group
 * @param group - the group Id
 */
export async function useDeleteGroupCases(group: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const result = { message: '', status: 'failed' }
  try {
    const res = await pb.collection('cases').getList(1, 10000, { filter: `group="${group}"` })
    res.items.forEach(async (item) => {
      await pb.collection('cases').delete(item.id)
    })
    result.message = 'Cases deleted'
    result.status = 'success'
  } catch (e: any) {
    result.message = e.message
    console.log(e)
  }
  return result
}

/** 
 * Find the total cases, highest count and lowest count in the group
 * @param group - group id  
 * @param description - the description is passed so we don't need to query again */
export async function useGetGroupStats(group: string, description?: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);

  const res = await pb.collection('counter').getList<CounterResponse>(1, 10000, { filter: `group="${group}"`, order: '+order' })
  // totalCases = sum of all 'count' in items
  const totalCases = res.items.reduce((acc, item) => {
    return acc + item.count
  }
    , 0)
  const highestCount = res.items.reduce((acc, item) => {
    return item.count > acc ? item.count : acc
  }, 0)
  // get lowest count
  const lowestCount = res.items.reduce((acc, item) => {
    return item.count < acc ? item.count : acc
  }, 100000)
  return {
    group,
    description,
    totalCases,
    highestCount,
    lowestCount
  }
}

/**Updates the group timestamp to the current time
 * @param group - the group Id
 * @returns a promise that resolves when the timestamp has been updated
 * @description this function updates the timestamp for the group.
 * It first gets the group entry, then updates the timestamp.
 * The function returns a promise that resolves when the timestamp has been updated.
 * @example
 * useUpdateGroup('group-id').then(() => {
 *   // timestamp has been updated
 * }
 */
export async function useUpdateGroup(group: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  const res: notification = { message: '', status: 'failed' }
  let currentTime = new Date().toISOString();
  try {
    await pb.collection('groups').update(group, { updated: currentTime })
    res.message = 'Group timestamp updated'
    res.status = 'success'
  } catch (e: any) {
    res.message = e.message
    console.log(e)
  }
  return res
}

//**Force-update the counters for all users in a group
/**
 * @param groupId - the group id
 * @returns a promise that resolves when the counters have been updated
 * @description this function updates the counters for all users in a group.
 * It first gets the list of users in that group, then for each user, it counts the number of cases in that group.
 * It then generates the data for the counter entry, and updates the counter entry if it already exists, or creates a new counter entry if it doesn't exist.
 * The function returns a promise that resolves when the counters have been updated.
 * @example
 * useForceUpdateCounters('group-id').then(() => {
 *   // counters have been updated
 * } */
export async function useForceUpdateCounters(groupId: string) {
  const pb = useNuxtApp().$pb
  pb.autoCancellation(false);
  // get the list of users in that group
  const users = await pb.collection('users').getList(1, 10000, { filter: `memberOf~"${groupId}"`, fields: 'id' })
  for (let user of users.items) {
    // count the number of cases for that user in this group
    const cases = await pb.collection('cases').getList(1, 10000, { filter: `user="${user.id}" && group="${groupId}"`, fields: '' })
    const data = {
      user: user.id,
      group: groupId,
      count: cases.totalItems,
    }
    // update old counter for this user in this group if it exists, otherwise create it
    try {
      const oldCounter = await pb.collection('counter').getFirstListItem(`user="${user.id}"&&group="${groupId}"`, { fields: '' })
      await pb.collection('counter').update(oldCounter.id, data)
    } catch {
      await useCreateCounter(data.user, data.group)
    }
  }
}

/** beta phase - deletes old cases
 * 
 * @param groupId 
 * @param days how old is the case
 */
export async function useDeleteGroupCasesOlderThan(groupId: string, days: number) {
  const pb = useNuxtApp().$pb
  const cases = await useGroupCasesOlderThan(groupId, days)
  for (let caseItem of cases.items) {
    await pb.collection('cases').delete(caseItem.id)
  }
}

export async function useGroupCasesOlderThan(groupId: string, days: number) {
  const pb = useNuxtApp().$pb
  const daysAgo = new Date()
  daysAgo.setDate(daysAgo.getDate() - days)
  const res = await pb.collection('cases').getList(1, 10000, { filter: `group="${groupId}" && created <${daysAgo}`, fields: '' })
  return res
}

export async function useGetAllCases() {
  const pb = useNuxtApp().$pb
  const res = await pb.collection('cases').getFullList<CasesRecord>({ fields: 'created,group' })
  return res
}

export async function useGetFullCases() {
  const pb = useNuxtApp().$pb
  const res: (BaseSystemFields & CasesRecord)[] = await pb.collection('cases').getFullList()
  return res
}

// /** Converts the JSON cases to CSV
//  * @param cases - the JSON cases data
//  * @returns the CSV cases data

//  * The function returns the CSV cases data. */
// export function jsonToCSV(cases: CasesRecord[]): string {
//   // Check if jsonData is not an array or is an empty array
//   if (!Array.isArray(cases) || cases.length === 0) {
//     return '';
//   }

//   // Extract keys for CSV header
//   const csvHeader = Object.keys(cases[0]).join(',');

//   // Map JSON objects to CSV rows
//   const csvRows = cases.map(row => {
//     return Object.values(row).map(value =>
//       // Handle values that contain commas or newlines
//       `"${value.toString().replace(/"/g, '""')}"`
//     ).join(',');
//   });

//   // Combine header and rows with newline characters
//   return [csvHeader, ...csvRows].join('\\n');
// }

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

export async function useSaveFileToDb(csvData: string) {
  const pb = useNuxtApp().$pb
  const csvFile = new Blob([csvData], { type: 'text/csv' });
  const formData = new FormData()
  const filename = 'cases-' + getCurrentTimestamp()

  formData.append('file', csvFile, filename)
  try {
    const upload: ArchiveRecord = await pb.collection('archive').create(formData)
    return {
      status: 'success', message: 'File archived',
      filename: 'filename',
      data: { url: pb.files.getUrl(upload, filename) }
    } as notification & { filename: string; data: { url: string } }
  } catch (e: any) {
    console.log('Error uploading file')
    return { status: 'failed', message: e.message } as notification
  }
}

export async function useGetGroupCaseCount(groupId: string) {
  const pb = useNuxtApp().$pb
  const res = await pb.collection('cases').getList(1, 10000, { filter: `group="${groupId}"`, fields: '' })
  return res.totalItems
}

export async function useGetGroupMemberCount(groupId: string) {
  const pb = useNuxtApp().$pb
  const res = await pb.collection('users').getList(1, 10000, { filter: `memberOf~"${groupId}"`, fields: '' })
  const totalMembers = res.totalItems
  return totalMembers
}

export async function useGetCaseReport(userId: string, groupId: string, from: Date, to: Date) {
  const pb = useNuxtApp().$pb
  const res = await pb.collection('cases').getList(1, 10000, { filter: `user="${userId}"&&group="${groupId}"&&created >= "${from}"&&created<="${to}"`, expand: 'user,group' })
  return res
}

export async function useGetCaseRecordById(caseId: string) {
  const pb = useNuxtApp().$pb
  const res = await pb.collection('cases').getFirstListItem<CasesRecord>(`case="${caseId}"`)
  return res
}

export async function useCreateCounter(userId: string, groupId: string) {
  const res: notification = { message: '', status: 'failed' }
  const pb = useNuxtApp().$pb
  const oldRecordList = await pb.collection('counter').getList(1, 10, { filter: `user="${userId}"&&group="${groupId}"` })
  if (oldRecordList.totalItems === 0) {
    const res = await pb.collection('counter').create({ user: userId, group: groupId, count: 0 });
    res.message = 'Counter created'
    res.status = 'success'
  } else {
    res.message = 'User already exists in this group!'
  }
  return res
}

function isValidCaseId(caseId:string) {
  const regex = /^CAS-\d{7}-[A-Z0-9]{6}$/;
  return regex.test(caseId);
}
