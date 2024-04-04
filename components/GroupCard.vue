<template>
  <div class="flex flex-col text-center m-1 w-[250px] shadow-lg border bg-base-100">
    <div class="bg-secondary">
      <div class="flex items-center justify-between">
        <h2
          class="ml-3 my-2 text-secondary max-w-[200px] overflow-hidden whitespace-nowrap"
        >
          <NuxtLink :to="`/${group.name}`" class="text-white">{{
            group.description
          }}</NuxtLink>
        </h2>
        <div class="flex items-center">
          <!-- <button class="btn btn-sm btn-ghost btn-circle" @click="updateCounter()">
            <Icon name="ic:twotone-refresh" size="1.2rem" class="text-slate-50" />
          </button> -->
          <div
            class="tooltip tooltip-bottom tooltip-accent"
            data-tip="Click this if you checked for new cases."
          >
            <!-- <button
              class="btn btn-ghost btn-circle btn-sm mr-1"
              @click="updatedCase(group.id)"
            >
              <Icon name="mdi:alarm-check" size="1.2rem" class="text-neutral-100" />
            </button> -->
          </div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="m-10"><Spinner /></div>

    <div v-else>
      <div v-if="displayUsers.length > 0" :key="updateCard">
        <div v-for="(user, id) in displayUsers" :key="user.id" class="my-[0.1rem]">
          <nuxt-link
            :to="`/${group.name}/${user.username}`"
            class="tooltip tooltip-top"
            :data-tip="user.username.toUpperCase() + ' is ' + user.status + ' - '"
          >
            <Icon
              name="ic:sharp-circle"
              :class="`text-${getColor(user.status)}`"
              class="mx-1"
              size="0.5rem"
            />
            <span class="hover:font-semibold hover:text-accent">
              {{ user.fullname }}
            </span>
          </nuxt-link>
        </div>
        <div class="my-3">
          <p class="text-xs">Last updated</p>
          <!-- <p class="text-xs text-warning">
            {{ lastUpdated }}
          </p> -->
        </div>
      </div>
      <div v-else class="text-xs mt-3">
        <p>No users in this group.</p>
      </div>
    </div>
    <div class="flex flex-col flex-grow mt-3" :key="dataUpdated">
      <div class="flex justify-center mt-auto gap-2">
        <a :href="anchor"
          ><button v-if="true" class="btn w-24 self-center mb-3">Select</button></a
        >
      </div>
      <!-- <div v-if="orderedUsers.length">
        <NewSelectGroup
          :group="group.id"
          :users="orderedUsers"
          @skip="nextUser"
          @reset="resetSelection"
        />
      </div> -->
    </div>
    <div class="bg-gray-100 pt-[7px]"></div>
  </div>
</template>

<script setup lang="ts">
import type { group, user, userSequence } from "pocketbase-types";
const props = defineProps<{
  group: group;
  users: user[];
  usersequence: userSequence | undefined;
}>();

const pb = useNuxtApp().$pb;
const loading = ref(true);
const orderedUsers = ref();
const groupUsers = ref(props.users);
const displayUsers: user[] = [];
const anchor: string = "#" + props.group.id + "select";
let updateCard = ref(0);
let dataUpdated = ref(0);

console.log(groupUsers.value);

onMounted(async () => {
  try {
    console.log("looking for group sequence...");
    const res = await pb
      .collection("usersequence")
      .getFirstListItem(`group="${props.group.id}"`);
    orderedUsers.value = res.user_order;
  } catch {
    const usersequence = groupUsers.value.map((item) => item.id);
    const res = await pb
      .collection("usersequence")
      .create({ group: props.group.id, user_order: usersequence });
    orderedUsers.value = res.user_order;
  }
  console.log("ORDERED USERS:", orderedUsers.value);

  for (let user of orderedUsers.value) {
    let userInfo = props.users.find((item) => item.id === user);
    displayUsers.push(userInfo!);
  }
  console.log("Display users: ", displayUsers);
  loading.value = false;
});
</script>
