<template>
  <header class="site-header" @click="headerClicked">
    <span class="title">Starships</span>
    <span class="toggles">
      <AppButton @click="toggleReadonly">{{ isReadonly ? "Edit mode" : "Readonly mode" }}</AppButton>
    </span>
  </header>
  <main>
    <h1>{{ isMobile ? "Starships" : "Federation Starships" }}</h1>
    <ShipList>
      <template #header="{ ships }">
        <strong>{{ ships.length }}</strong> {{ ships.length == 1 ? "ship" : "ships" }} found
      </template>
    </ShipList>
    <div v-if="notification" class="notification">
      <span>{{ notification }}</span>
    </div>
  </main>
</template>

<script>
import { ref } from "@vue/reactivity";
import { provide } from "@vue/runtime-core";
import AppButton from "./components/AppButton.vue";
import ShipList from "./components/ShipList.vue";
import { useBreakpoints } from "./functions/breakpoints";

export default {
  components: {
    AppButton,
    ShipList
  },

  setup() {
    const isReadonly = ref(false);
    const notification = ref("");
    let notificationTimeout = null;

    // spread on reactive object removes reactivity, so this doesn't work
    // use `toRefs()` before spreading to preserve reactivity
    const { isMobile } = useBreakpoints();

    function headerClicked() {
      console.log("Header clicked!");
    }

    function toggleReadonly() {
      isReadonly.value = !isReadonly.value;
    }

    function notify(text, ms = 3000) {
      clearTimeout(notificationTimeout);
      notification.value = text;
      setTimeout(() => {
        notification.value = "";
      }, ms);
    }

    provide("isReadonly", isReadonly);
    provide("notify", notify);

    return {
      isReadonly,
      notification,
      isMobile,
      headerClicked,
      toggleReadonly
    };
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  color: #fff;
  background: #000 url('/bg.jpg') center top/cover fixed;
  font-family: Iceland, sans-serif;
  font-size: 20px;
  line-height: 1.3;
  overflow-y: scroll;
}

h1 {
  margin: 0 0 .5em;
  font-size: 3em;
  line-height: 1;
  text-align: center;
  text-shadow: 2px 2px 2px #000;
}

h2 {
  margin: 0 0 .5em;
  font-size: 2em;
  line-height: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, .75);
}

h3 {
  margin: 0 0 .25em;
  font-size: 1.5em;
  line-height: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, .5);
}

input,
button {
  font-family: inherit;
  font-size: inherit;
}

input {
  padding: .25em .5em;
}

.site-header {
  padding: 1em;
  background-color: rgba(0, 0, 0, .75);
  display: flex;
  box-shadow: 0 5px 5px rgba(0, 0, 0, .5);
  align-items: center;
  justify-content: space-between;
}

.site-header .title {
  font-size: 2em;
  font-weight: 700;
  line-height: 1;
}

.site-header button {
  margin: 0;
}

main {
  padding: 1em;
}

.notification {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
}

.notification > span {
  margin: 1em;
  padding: .75em 1.5em;
  color: #fff;
  background-color: rgba(0, 0, 0, .8);
  border-radius: 10px;
  font-weight: 700;
  display: inline-block;
  box-shadow: 0 0 5px rgba(0, 0, 0, .5);
}
</style>
