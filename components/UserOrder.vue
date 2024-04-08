<template>
  <div>
    <draggable
      v-model="items"
      handle=".handle"
      itemKey="handle"
      class="flex flex-col gap-2 mb-2"
    >
      <template #item="{ element: item }">
        <div class="px-3 py-2 border hover:bg-accent hover:bg-opacity-10">
          <div class="flex items-between w-auto">
            <div class="handle" v-if="userIsAdmin()">
              <Icon
                name="ic:twotone-drag-handle"
                size="1.6rem"
                class="mr-2 text-lex-neutral-4 cursor-move"
              />
            </div>
            <div>
              <NuxtLink :to="`/${groupName}/${item.username}`"
                ><div>{{ item.fullname }}</div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>
    </draggable>
    <button
      class="btn btn-secondary"
      @click="setOrder()"
      :class="[hasChanged() ? 'btn-outline' : 'btn-disabled']"
    >
      Reorder
    </button>
  </div>
</template>

<script setup lang="ts">
import type { user } from "pocketbase-types";
const props = defineProps<{
  groupId: string;
  users: user[];
}>();

const groupName = await useGetGroupName(props.groupId);

const pb = useNuxtApp().$pb;

const userIsAdmin = () => {
  return useCurrentUser()!.role === "admin";
};

const storedOrder = await pb
  .collection("usersequence")
  .getFirstListItem(`group="${props.groupId}"`);

const initial = ref(props.users.map((user) => user.id));
const items = ref(props.users);
const currentOrder = computed(() => {
  return items.value.map((item) => item.id);
});

async function setOrder() {
  try {
    await pb
      .collection("usersequence")
      .update(storedOrder.id, { user_order: currentOrder.value });
    initial.value = items.value.map((item) => item.id);
    useShowToast("User order has been updated.", "success");
  } catch (e: any) {
    useShowToast(e.message, "failed");
  }
}

function hasChanged() {
  const initialArray = JSON.stringify(initial.value);
  const itemsArray = JSON.stringify(items.value.map((item) => item.id));
  return initialArray !== itemsArray;
}
</script>
