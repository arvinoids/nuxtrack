import type { ListResult } from "pocketbase";
import type { userEntry, userStatus, statuschoice, notification, LogData } from "custom-types";
import type { user, expandedUsers } from "pocketbase-types";


export async function useDeleteUser(userId: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const result = { message: "", status: "success" };
    try {
        const userRecord = await pb.collection("users").getOne(userId, { fields: 'username' });
        const username = userRecord.username;
        await pb.collection("users").delete(userId);
        result.message = `${username} has been deleted`;
        useRefreshAll();

    } catch (e: any) {
        result.status = "failed";
        result.message = e.message;

    }
    return result
}

export async function useCreateUser(userData: userEntry) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const result = { status: "failed", message: "" };
    try {
        const res = await pb.collection("users").create(userData);
        result.status = "success";
        result.message = `User ${userData.fullname.toUpperCase()} has been created.`;
    } catch (e: any) {
        result.message = e.message;
        result.status = "failed";
        console.log(e);
    }
    return result;
}

export async function useUpdateUser(id: string, userData: {
    email?: string,
    password?: string,
    passwordConfirm?: string,
    fullname?: string,
    memberOf?: string[],
    role?: "user" | "admin" | "lead",
}) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const result = { status: "failed", message: "" };
    try {
        await pb.collection("users").update(id, userData);
        result.status = "success";
        result.message = `User ${userData.fullname!.toUpperCase()} has been updated.`;
    } catch (e: any) {
        result.message = e.message;
        result.status = "failed";
        console.log(e);
    }
    return result;
}

export async function useGetUsers(group?: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    let users: ListResult<user>;
    if (group === null) {
        users = await pb.collection("users").getList();
    } else
        users = await pb
            .collection("users")
            .getList(1, 1000, { filter: `memberOf~"${group}"` });
    return users;
}

export async function useGetUserGroups(userId: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const res = await pb.collection("users").getOne(userId);
    return res.memberOf;
}

export async function useGetUsernameFromId(id: string): Promise<string> {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const res = await pb.collection("users").getOne(id, { fields: 'username' });
    return res.username as string;
}

export async function useGetUserStatus(id: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const status: userStatus = {
        status: 'Unknown',
        message: ''
    }
    try {
        const res = await pb.collection('users').getOne(id)
        status.status = res.status
        status.message = res.statusmessage
    } catch (e: any) {
        console.log(e)
    }
    return status
}

export async function useChangeUserStatus(id: string, newStatus: statuschoice, newMessage?: string | null) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    try {
        const record = await pb.collection('users').update(id, { 'status': newStatus, 'statusmessage': newMessage })
    } catch (e) {
        console.log(e)
    }
}

export async function useGetAllUsers() {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    let users: ListResult<user>;
    users = await pb.collection("users").getList(1, 1000, { expand: 'memberOf', sort: 'fullname' })
    return users
}

/** Get users of a group sorted by count ascending */
export async function useGetSortedUsers(group: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    // first check if user list is still the same
    await cleanUpCounter(group);
    const users = await pb
        .collection("counter")
        .getList(1, 50, { filter: `group="${group}"`, sort: "+count", expand: "user" });
    return (users as unknown) as expandedUsers;
}

// async function userGoesOnLeave(user: string, group: string) {
//     // if user is top of list, then just get top count upon return and assign as the count of the user
//     // if user is not on top, get difference from top, store in db, then add difference to user's count upon return
//     const pb = useNuxtApp().$pb
//     pb.autoCancellation(false);
//     const sortedUsers = await useGetSortedUsers(group).then((res) => res.items);
//     const userPosition = sortedUsers.findIndex((item) => user === item.user);
//     const difference = await savedDifference(user, group)
//     await storeUserCount(user, group, userPosition, difference);
// }

// async function userIsBackFromLeave(userId: string, groupId: string) {
//     const pb = useNuxtApp().$pb
//     pb.autoCancellation(false);
//     await useRefreshGroupCounter(groupId);
//     let userLeaveRecord
//     try{
//         userLeaveRecord = await pb.collection("leaves").getFirstListItem(`user="${userId}"&&group="${groupId}"&&active=true`);
//     } catch (e: any) {
//         console.log(e)
//         return
//     }
//     console.log('update for leave record id: ', userLeaveRecord.id)
//     const sortedUsers = await useGetSortedUsers(groupId);
//     let casesToAdd: number
//     if (sortedUsers.items.length === 2) {
//         console.log("two users")
//         if (userLeaveRecord.position === 0) {
//             console.log("user is first")
//             casesToAdd = sortedUsers.items[1].count - sortedUsers.items[0].count - userLeaveRecord.difference
//         } else {
//             casesToAdd = userLeaveRecord.difference - sortedUsers.items[1].count + sortedUsers.items[0].count
//         }
//     }
//     else {
//         console.log("more than two users")
//         casesToAdd = userLeaveRecord.difference - ((sortedUsers.items[userLeaveRecord.position].count) - sortedUsers.items[0].count)
//     }
//     console.log(`cases to add in ${groupId}: `, casesToAdd)
//     await useAddDummyCases(casesToAdd, userId, groupId, "Leave")
//     await pb.collection('leaves').update(userLeaveRecord.id, { active: false })
//     await useRefreshGroupCounter(groupId);
// }

// async function savedDifference(user: string, group: string) {
//     const pb = useNuxtApp().$pb
//     pb.autoCancellation(false);
//     const sortedUsers = await useGetSortedUsers(group).then((res) => res.items);
//     const users = sortedUsers.length
//     const userPosition = sortedUsers.findIndex((item) => user === item.user);
//     let difference: number
//     if (users === 2) difference = Math.abs(sortedUsers[0].count - sortedUsers[1].count)
//     else {
//         difference = sortedUsers[userPosition].count - sortedUsers[0].count
//     }
//     return difference
// }

// async function restoreDifference(user: string, group: string, sortedUsers: expandedUsers) {
//     const pb = useNuxtApp().$pb
//     pb.autoCancellation(false);
//     const users = sortedUsers.items.length
//     const userLeaveRecord = await pb.collection("leaves").getFirstListItem(`user="${user}"&&group="${group}"`);
//     let toAdd: number
//     if (users === 2) {
//         if (userLeaveRecord.position === 0) {
//             toAdd = sortedUsers.items[1].count + userLeaveRecord.difference
//         } else {
//             toAdd = sortedUsers.items[0].count + userLeaveRecord.difference
//         }
//     } else {
//         const lowest = sortedUsers.items[0].count
//         toAdd = userLeaveRecord.difference + lowest
//     }
//     return toAdd
// }

// async function storeUserCount(user: string, group: string, position: number, difference: number) {
//     const pb = useNuxtApp().$pb
//     pb.autoCancellation(false);
//     await pb.collection("leaves").create({
//         user,
//         difference,
//         group,
//         position,
//         active: true
//     });
// }

export async function useUserIsBackFromLeave(id: string): Promise<{ status: 'success' | 'failed' | 'warning', message: string }> {
    const groups = await useGetUserGroups(id);
    console.log('user groups: ', groups)
    try {
        groups.forEach(async (group: string) => {
            console.log('user is back from leave on group', group)
            await userIsBackFromLeave(id, group);
        });
        return { status: 'success', message: 'updated user case count after leave' }
    } catch (e: any) {
        return {
            status: 'failed',
            message: e.message
        }
    }
}

export async function useUserOnLeave(id: string) {
    const groups = await useGetUserGroups(id);
    console.log('user groups: ')
    for (let group of groups) {
        await userGoesOnLeave(id, group);
    }
}

export async function useGetUserById(id: string) {
    const pb = useNuxtApp().$pb
    const user = await pb.collection("users").getOne(id);
    return user
}

export async function useGetUserByUsername(username: string) {
    const pb = useNuxtApp().$pb
    const user = await pb.collection("users").getFirstListItem(`username="${username}"`);
    return user
}

/** Cleans up the counter so that users who are no longer in the group are deleted. */
async function cleanUpCounter(group: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const groupUsers = await pb.collection("users").getList(1, 100, { filter: `memberOf~"${group}"` }).then((res) => res.items)
    const users = groupUsers.map((user) => user.id)
    const groupCounterUsers = await pb.collection("counter").getList(1, 1000, { filter: `group="${group}"` });

    // use for each user of groupCounterUsers to check if user is in counter, if not, delete from counter
    for (let user of groupCounterUsers.items) {
        if (!users.includes(user.user)) {
            const counter = await pb.collection('counter').getFirstListItem(`user="${user.user}"&&group="${group}"`)
            await pb.collection("counter").delete(counter.id);
        }
    }
}

/** Save the current case count for the group and store in leave record */
async function useSaveLeaveRecord(userId: string, groupId: string, position: number) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    let total_cases = await useGetGroupCaseCount(groupId)
    await pb.collection("leaves").create({
        user: userId,
        group: groupId,
        position,
        total_cases,
        active: true,
    });
}

export async function userGoesOnLeave(userId: string, groupId: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const position = await getUserPositionInGroup(userId, groupId)
    await useSaveLeaveRecord(userId, groupId, position);
}

async function getUserPositionInGroup(userId: string, groupId: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const sortedUsers = await useGetSortedUsers(groupId);
    console.log('sorted users: ', sortedUsers)
    const userPosition = sortedUsers.items.findIndex((item) => userId === item.user);
    console.log('user position in group', groupId, userPosition)
    return userPosition
}

/** Computes the number of cases to add when a user comes bock from leave
 * @param userId the user id
 * @param groupId the group id
 * @returns the number of cases to add
 */
async function getCasesToAdd(userId: string, groupId: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const newCount = await useGetGroupCaseCount(groupId)
    const leaveRecord = await pb.collection('leaves').getFirstListItem(`user="${userId}"&&group="${groupId}"&&active=true`)
    const groupMemberCount = await useGetGroupMemberCount(groupId)
    const oldCount = leaveRecord.total_cases
    const userPosition = leaveRecord.position
    let casesToAdd: number
    const countDiff = (newCount - oldCount)
    console.log('computing cases to add...', "oldCount: ", oldCount, 'newCount: ', newCount, 'diff: ', countDiff)
    casesToAdd = Math.floor(countDiff / groupMemberCount)
    console.log('cases to add before remainder: ', casesToAdd)
    let remainder = countDiff % groupMemberCount
    if (remainder > userPosition) casesToAdd++
    console.log('cases to add after remainder: ', casesToAdd)
    return casesToAdd
}

async function userIsBackFromLeave(userId: string, groupId: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const userLeaveRecord = await pb.collection("leaves").getFirstListItem(`user="${userId}"&&group="${groupId}"&&active=true`);
    let casesToAdd: number = await getCasesToAdd(userId, groupId)
    await useAddDummyCases(casesToAdd, userId, groupId, "Leave")
    await pb.collection('leaves').update(userLeaveRecord.id, { active: false })
    await useRefreshGroupCounter(groupId);
}

export async function useRemoveLeaveRecords(userId: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const result = { message: "Leave records have been removed", status: "success" };
    const leaveRecords = await pb.collection("leaves").getList(1, 1000, { filter: `user="${userId}` });
    try {
        leaveRecords.items.forEach(async (record) => await pb.collection('leaves').delete(record.id))
    } catch (e: any) {
        result.message = 'Failed deleting leave records'
        result.status = 'failed'
    }
    return result
}