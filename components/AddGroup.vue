<template>
  <div class="p-4 border my-4 bg-neutral-300 bg-opacity-50">
    <p class="font-semibold">Add a Group</p>
    <div class="flex flex-col gap-2 py-2">
      <div class="flex flex-col">
        <label for="name" class="label"
          >Name (This should be the short name, e.g. na_l3_software)</label
        ><input
          type="text"
          id="name"
          class="input input-sm input-bordered"
          v-model="groupData.name"
          required
        />
      </div>
      <div class="flex flex-col">
        <label for="description" class="label"
          >Description (This is the user-friendly name, e.g. NA L3 Software )</label
        ><input
          type="text"
          id="description"
          class="input input-sm input-bordered"
          v-model="groupData.description"
          required
        />
      </div>
    </div>
    <button
      class="btn btn-secondary"
      :class="[!disabled() ? 'btn-disabled' : '']"
      @click="submit()"
    >
      Add
    </button>
  </div>
</template>

<script setup lang="ts">
const groupData = ref({
  name: "",
  description: "",
  order: 100,
});

const pb = useNuxtApp().$pb;
const currentLast = (await pb.collection("groups").getFullList()).length;

function disabled() {
  return groupData.value.name && groupData.value.description ? true : false;
}

async function addGroup() {
  const data = {
    name: groupData.value.name,
    description: groupData.value.description,
    order: currentLast + 1,
  };
  console.log(data);
  try {
    await pb.collection("groups").create(data);
    useShowToast(`Group '${groupData.value.description}' has been created`, "success");
    return true;
  } catch (e: any) {
    useShowToast(e.message, "failed");
    return false;
  }
}

async function submit() {
  const success = await addGroup();
  if (success) groupData.value.name = groupData.value.description = "";
}
</script>

<style></style>
