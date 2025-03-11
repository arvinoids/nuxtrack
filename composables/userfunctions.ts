import type { AuthModel, ListResult } from "pocketbase";
import type { userEntry, userStatus, statuschoice, notification, LogData, result } from "custom-types";
import type { user, expandedUsers } from "pocketbase-types";
import type { UsersResponse } from "~/pocketbase-types";
import { useCreateCounter } from "./casefunctions";


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
        const res = await pb.collection<UsersResponse>("users").create(userData);
        for (const teamId of res.memberOf) await useCreateCounter(res.id, teamId)        
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

/** Runs the back from leave function and returns cases added to user in group
 * @param userId 
 * @param groupId 
 * @returns cases added to user in this group
 */
async function userIsBackFromLeave(userId: string, groupId: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const userLeaveRecord = await pb.collection("leaves").getFirstListItem(`user="${userId}"&&group="${groupId}"&&active=true`);
    let casesToAdd: number = await getCasesToAdd(userId, groupId)
    await pb.collection('leaves').update(userLeaveRecord.id, { active: false })
    await useAddDummyCases(casesToAdd, userId, groupId, "Leave")
    await useRefreshGroupCounter(groupId);
    return casesToAdd
}

export async function useUserIsBackFromLeave(userId: string): Promise<{ status: 'success' | 'failed' | 'warning', message: string }> {
    const groups = await useGetUserGroups(userId);
    console.log('user groups: ', groups)
    try {
        groups.forEach(async (group: string) => {
            console.log('user is back from leave on group', group)
            const casesToAdd = await userIsBackFromLeave(userId, group);
            const groupName = await useGetGroupName(group)
            const userName = await useGetUsernameFromId(userId)
            const logData: LogData = {
                user: 'system',
                type: 'assigned case',
                details: `${casesToAdd} cases skipped in ${groupName} for ${userName} from leave`
            }
            await logActivity(logData)
        });
        return { status: 'success', message: 'updated user case count after leave' }
    } catch (e: any) {
        await logActivity({ user:'system',type:'changed status',details:`Error in updating cases - ${e.message}`})
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


export async function useRemoveLeaveRecords(userId: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const result = { message: "Leave records have been removed", status: "success" };
    const leaveRecords = await pb.collection("leaves").getList(1, 1000, { filter: `user="${userId}"` });
    try {
        leaveRecords.items.forEach(async (record) => await pb.collection('leaves').delete(record.id))
    } catch (e: any) {
        result.message = 'Failed deleting leave records'
        result.status = 'failed'
    }
    return result
}

export async function useGetAvatarUrl(user: AuthModel) {
    const pb = useNuxtApp().$pb;
    const url = pb.files.getUrl(user!, user!.avatar, { thumb: "100x100" });
    return url;
}

export async function useUpdateAvatar(userId:string, formData: FormData) {
    const pb = useNuxtApp().$pb
    const result:result = { status: 'failed', message: 'Failed updating avatar' }
    try {
        const res = await pb.collection('users').update(userId, formData)
        result.status = 'success'
        result.message = 'Avatar updated'
    } catch (e: any) {
        result.message = e.message
    }
    return result
}