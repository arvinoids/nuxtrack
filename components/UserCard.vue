<template>
  <div class="p-3 shadow-lg border w-[300px] justify-center flex flex-col">
    <div class="flex flex-row w-full justify-center p-5" v-if="avatar">
      <NuxtLink to="/ChangeAvatar" v-if="user.id === currentUser?.id"
        ><img :src="avatar" alt="" class="" title="Change Avatar"
      /></NuxtLink>
      <img v-else :src="avatar" alt="" class="" />
    </div>
    <div v-else class="flex flex-row w-full justify-center p-5">
      <NuxtLink to="/ChangeAvatar" v-if="user.id === currentUser?.id"
        ><Icon name="ic:twotone-account-circle" size="3rem"
      /></NuxtLink>
      <Icon v-else name="ic:twotone-account-circle" size="8rem" class="text-accent" />
    </div>
    <h5 class="">
      User: <span class="text-accent">{{ user.fullname }}</span>
    </h5>
    <h5>
      Shortname: <span class="text-accent">{{ user.username }}</span>
    </h5>
    <h5>
      Status: <span :class="`text-${getColor(user.status)}`">{{ user.status }}</span>
    </h5>
    <h5>
      Role: <span class="text-accent">{{ user.role }}</span>
    </h5>
    <h5>
      Email: <span class="text-accent">{{ user.email }}</span>
    </h5>

    <div class="flex justify-center mt-1">
      <nuxt-link
        :to="`/User/${user.username}`"
        class="link-secondary"
        v-if="allCasesButton()"
        >All Cases</nuxt-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { user } from "pocketbase-types";
const route = useRoute();
const currentUser = useCurrentUser();

const props = defineProps<{
  user: user;
}>();
const avatar = await useGetAvatarUrl(props.user);

function allCasesButton() {
  if (route.params.groupname !== undefined) return true;
  else return false;
}
</script>

<style></style>
