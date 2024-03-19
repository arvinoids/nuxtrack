<template>
  <div class="border p-4">
    <label class="label font-bold">Reorder groups</label>
    <draggable
      v-model="items"
      handle=".handle"
      itemKey="handle"
      class="flex flex-col gap-2 mb-2"
    >
      <template #item="{ element: item }">
        <div class="px-3 py-2 border hover:bg-accent hover:bg-opacity-10">
          <div class="flex items-between w-auto">
            <div class="handle">
              <Icon
                name="ic:twotone-drag-handle"
                size="1.6rem"
                class="mr-2 text-lex-neutral-4 cursor-move"
              />
            </div>
            <div class="title">{{ item.description }}</div>
          </div>
        </div>
      </template>
    </draggable>
    <button
      class="btn btn-secondary"
      @click="setOrder()"
      :class="[hasChanged() ? 'btn-outline' : 'btn-disabled']"
    >
      Apply order
    </button>
  </div>
</template>

<script setup>
const pb = useNuxtApp().$pb;

const initial = await pb
  .collection("groups")
  .getFullList({ sort: "order", fields: "id,description,order" });
let items = ref(initial);

pb.collection("groups").subscribe("*", async () => {
  items.value = await pb
    .collection("groups")
    .getFullList({ sort: "order", fields: "id,description,order" });
});

async function setOrder() {
  const order = items.value.map((item) => item.id);
  let count = 1;
  try {
    for (const groupId of order) {
      await pb.collection("groups").update(groupId, { order: count });
      count++;
    }
    useShowToast("Group order has been updated", "success");
  } catch (e) {
    useShowToast(e.message, "failed");
  }
}

function hasChanged() {
  const initialArray = JSON.stringify(initial.map((item) => item.id));
  const itemsArray = JSON.stringify(items.value.map((item) => item.id));
  return initialArray !== itemsArray;
}
</script>
