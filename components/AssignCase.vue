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
                    <label for="assignCase" class="btn btn-accent">Cancel</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { LogData } from 'custom-types';
import type { user } from 'pocketbase-types';
const pb = useNuxtApp().$pb
const props = defineProps<{
    user: user,
    group: string
}>()

const caseExists = ref(false);
const disableEscalate = ref(false);

const invalidFormat = computed(() => {
  const pattern = /CAS-\d{7}-[A-Z]\d[A-Z]\d[A-Z]\d/;
  return !pattern.test(caseId.value.trim());
});

const caseIsBlank = computed(() => {
  return caseId.value === "";
});

const groupName = await useGetGroupName(props.group)
const caseId = ref('')
const message = ref('')
const currentUser = useCurrentUser()

async function submitCase(caseId: string, userId: string, groupId: string) {
    const res = await useSubmitCase(caseId, userId, groupId);
    await useUpdateUserLastAssigned(userId)
    const currentTime = useFormatDate(new Date(Date.now()));
    miniToast(res.status, res.message);
    useDataUpdated().value++;
    if (res.status === 'success') {
        const user = (await pb.collection('users').getOne(userId, { fields: 'fullname,email'}))
        const email = {
            to: user.email,
            subject: "New case directly assigned to you",
            body: `Hi ${user.fullname}, \n\n${caseId} in ${groupName} has been directly assigned to you by ${currentUser!.fullname} on ${currentTime}.\n\nRotation Tracker`
        }
        const emailres = (await useSendEmail(email))
        miniToast(emailres.status, emailres.message)
    }
    const logData: LogData = {
        user: currentUser!.username,
        type: "directly assigned",
        details: `${caseId} to ` + (await useGetUsernameFromId(userId)).toUpperCase(),
    };
    logActivity(logData);
}

watch(caseId, async (caseId) => {
    caseExists.value = await useCaseExists(caseId.trim());
    disableEscalate.value = false
    message.value = 'Assign case to proceed.'
    if(caseIsBlank.value) {
        disableEscalate.value = true
        message.value = "Please enter a case ID."
    } else if(invalidFormat.value) {
        disableEscalate.value = true
        message.value = "Incorrect case ID format. Please recheck."
    } else if(caseExists.value) {
        disableEscalate.value = true
        message.value = "The case is already assigned. Please use search."
    }
});

</script>

<style></style>
