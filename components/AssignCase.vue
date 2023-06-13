<template>
    <div>
        <label for="assignCase" class="btn btn-warning">
            <Icon name="ic:baseline-playlist-add" size="1.2rem" class="mx-1" />Assign Case
        </label>
        <input type="checkbox" id="assignCase" class="modal-toggle" />
        <div class="modal">
            <div class="modal-box text-center">
                <h3 class="text-lg font">
                    Assign case to
                    <span class="text-accent">{{ user.fullname }}</span>
                </h3>
                <p class="text-sm">Status: <span class="font-semibold"
                        :class="{ [`text-${getColor(user.status)}`]: true }">{{ user.status }}</span></p>
                <p class="py-4">
                    <input type="text" placeholder="CAS-XXXXXXXXXXX" class="input input-bordered my-2 w-[300px]"
                        v-model="caseId" />
                <div class="flex flex-row justify-center items-center" v-if="user.status !== 'Available'"></div>
                <div class="text-xs text-error pt-2">{{ message }}</div>
                </p>
                <div class="modal-action justify-center">
                    <label for="assignCase" class="btn btn-primary" :class="{ hidden: (caseExists || caseId === '') }"
                        @click="submitCase(caseId, user.id, group)">Assign</label>
                    <label for="assignCase" class="btn btn-warning btn-primary" :class="{ hidden: (!caseExists || disableEscalate) }"
                        @click="escalateCase(caseId, user.id, group)">Escalate</label>
                    <label for="assignCase" class="btn btn-accent">Cancel</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { LogData } from 'custom-types';
import { Record } from 'pocketbase';
const pb = useNuxtApp().$pb
const props = defineProps<{
    user: Record,
    group: string
}>()

const caseExists = ref(false);
const caseIsEscalated = ref(false);
const disableEscalate = ref(false);
const caseIsBlank = ref(false)

const groupName = await useGetGroupName(props.group)
let caseId = ref('')
let message = ref('')
const currentUser = useCurrentUser()

async function submitCase(caseId: string, userId: string, group: string) {
    const res = await useSubmitCase(caseId, userId, group);
    const currentTime = useFormatDate(new Date(Date.now()));
    useShowToast(res.message, res.status);
    useDataUpdated().value++;
    if (res.status === 'success') {
        const user = (await pb.collection('users').getOne(userId))
        const email = {
            to: user.email,
            subject: "New case assigned to you",
            body: `Hi ${user.fullname}, \n\n${caseId} in ${groupName} has been assigned to you by ${currentUser!.fullname} on ${currentTime}.\n\nRotation Tracker`
        }
        const emailres = (await useSendEmail(email))
        useShowToast(emailres.message, emailres.status)
    }
    const logData: LogData = {
        user: currentUser!.username,
        type: "assigned case",
        details: `assigned ${caseId} to ` + (await useGetUsernameFromId(userId)),
    };
    logActivity(logData);
}

async function escalateCase(caseId: string, id: string, group: string) {
    const res = await useEscalateCase(caseId, id, group);
    useShowToast(res.message, res.status);
    const currentTime = useFormatDate(new Date(Date.now()));
    useDataUpdated().value++;
    if (res.status === 'success') {
        const user = (await pb.collection('users').getOne(id))
        const email = {
            to: user.email,
            subject: "New case assigned to you",
            body: `Hi ${user.fullname}, \n\n${caseId} in ${groupName} has been assigned to you by ${currentUser} on ${currentTime}.\n\nRotation Tracker`
        }
        const emailres = (await useSendEmail(email))
        useShowToast(emailres.message, emailres.status)
    }
    const logData: LogData = {
        user: currentUser!.username,
        type: "assigned case",
        details: `assigned ${caseId} to ` + (await useGetUsernameFromId(id)),
    };
    logActivity(logData);
}

watch(caseId, async (caseId) => {
    caseExists.value = await useCaseExists(caseId.trim());
    caseIsEscalated.value = await useCaseIsEscalated(caseId.trim());
    if (caseId.trim().includes("escalated")) {
        message.value = "Remove -escalated operator.";
    } else {
        message.value = errorMessage(caseExists.value, caseIsEscalated.value, caseId);
    }
    if (caseId.trim() === '') { message.value = 'Please enter a value.'; caseIsBlank.value = true }
});

function errorMessage(caseExists: boolean, caseIsEscalated: boolean, caseId: string) {
    if (caseExists && caseIsEscalated) {
        disableEscalate.value = true;
        return "Already escalated. Please check case number.";
    }
    if (caseExists && !caseIsEscalated)
        return "This case is in the database. Escalate to continue.";
    if (!caseExists) return "Assign case to proceed.";
    else return "";
}



</script>

<style></style>
