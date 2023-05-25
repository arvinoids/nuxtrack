import PocketBase, { ListResult } from "pocketbase";
import { userEntry, userStatus, statuschoice } from "custom-types";
import { expandedUsers } from "pocketbase-types";
const pb = new PocketBase("https://solutionsteam.lrdc.lexmark.com/pb/");
pb.autoCancellation(false);

export function useCurrentUser() {
    return pb.authStore.model
}

export async function useDeleteUser(id: string) {
    const result = { message: "", status: "success" };

    try {
        const userRecord = await pb.collection("users").getOne(id);
        const username = userRecord.username;
        await pb.collection("users").delete(id);
        result.message = `${username} is deleted`;
        useRefreshAll();
        return result;
    } catch (e: any) {
        result.status = "failed";
        result.message = e.message;
        return result;
    }
}

export async function useCreateUser(userData: userEntry) {
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
    let users: ListResult;
    if (group === null) {
        users = await pb.collection("users").getList();
    } else
        users = await pb
            .collection("users")
            .getList(1, 1000, { filter: `memberOf~"${group}"` });
    return users;
}

export async function useGetUserGroups(id: string) {
    const res = await pb.collection("users").getOne(id);
    return res.memberOf;
}

export async function useGetUsernameFromId(id: string) {
    const res = await pb.collection("users").getOne(id);
    return res.username;
}

export async function useGetUserStatus(id: string) {
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

export async function useChangeUserStatus(id: string, newStatus: statuschoice, newMessage: string | null) {
    try {
        const record = await pb.collection('users').update(id, { 'status': newStatus, 'statusmessage': newMessage })
    } catch (e) {
        console.log(e)
    }
}

export async function useGetAllUsers() {
    let users: ListResult;
    users = await pb.collection("users").getList(1, 1000, { expand: 'memberOf', sort: 'fullname' })
    return users
}
/** Get users of a group sorted by count ascending */
export async function useGetSortedUsers(group: string) {
    const users = await pb
        .collection("counter")
        .getList(1, 1000, { filter: `group="${group}"`, sort: "+count", expand: "user" });
    return (users as unknown) as expandedUsers;
}

async function userGoesOnLeave(user: string, group: string) {
    // if user is top of list, then just get top count upon return and assign as the count of the user
    // if user is not on top, get difference from top, store in db, then add difference to user's count upon return
    const sortedUsers = await useGetSortedUsers(group).then((res) => res.items);
    const userPosition = sortedUsers.findIndex((item) => user === item.expand.user.id);
    await storeUserCount(user, group, userPosition);
}

async function userIsBackFromLeave(userId: string, group: string) {
    const userLeave = await pb.collection("leaves").getFirstListItem(`user="${userId}"&&group="${group}"`);
    const sortedUsers = await useGetSortedUsers(group);
    const lowest = await useGetGroupStats(group).then((res) => res.lowestCount);
    let difference: number;
    const currentUserCount = await pb
        .collection("counter")
        .getFirstListItem(`user="${userId}"&&group="${group}"`)
        .then((res) => res.count);
    if (userLeave.position === 0) {
        difference = currentUserCount - lowest;
    } else {
        const copiedUserCount = sortedUsers.items[userLeave.position].count;
        difference = copiedUserCount - currentUserCount;
    }
    if (difference !== 0) await useAddDummyCases(difference, userId, group, "Leave")
    await pb.collection('leaves').delete(userLeave.id);
}

async function storeUserCount(user: string, group: string, position: number) {
    const count: number = await pb
        .collection("counter")
        .getFirstListItem(`user="${user}"&&group="${group}"`)
        .then((res) => res.count);
    await pb.collection("leaves").create({
        user,
        difference: count,
        group,
        position,
    });
}

export async function useUserOnLeave(id: string) {
    const groups = await useGetUserGroups(id);
    groups.forEach(async (group: string) => {
        await userGoesOnLeave(id, group);
    });
}

export async function useUserIsBackFromLeave(id: string) {
    const groups = await useGetUserGroups(id);
    groups.forEach(async (group: string) => {
        await userIsBackFromLeave(id, group);
    });
}