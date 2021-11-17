<template>
  <div class="ship" :class="{ 'is-vertical': breakpoints.isMobile }">
    <h2>Edit ship</h2>

    <div class="form-field">
      <label>Registry</label>
      <input ref="registryInput" class="text" v-model.trim="model.registry" @keyup.enter="save">
    </div>
    <div class="form-field">
      <label>Name</label>
      <input class="text" v-model.trim="model.name">
    </div>
    <div class="form-field">
      <label>Commissioned</label>
      <NumberInput class="number" v-model="model.commissioned" />
    </div>
    <div class="form-field">
      <label>Decommissioned</label>
      <NumberInput class="number" :model-value="model.decommissioned" @update:model-value="model.decommissioned = $event" />
    </div>
    <div class="form-field">
      <label>Destroyed</label>
      <input v-model="model.destroyed" type="checkbox">
    </div>

    <div v-if="errors.length" class="errors">
      <h3>Errors</h3>
      <ul>
        <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
      </ul>
    </div>

    <div class="actions">
      <AppButton :disabled="isReadonly || isSaving" @click="save">
        <template v-if="isSaving" #before><AppSpinner :size=".75" /></template>
        <template #default>{{ isSaving ? "Saving..." : "Save" }}</template>
      </AppButton>
      <app-button :disabled="isSaving" @click="close">Cancel</app-button>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { inject, onMounted, watch } from "@vue/runtime-core";
import NumberInput from "./NumberInput.vue";
import AppButton from "./AppButton.vue";
import AppSpinner from "./AppSpinner.vue";
import { useBreakpoints } from "../functions/breakpoints";

export default {
  components: {
    NumberInput,
    AppButton,
    AppSpinner
  },

  props: {
    ship: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ["close"],

  setup(props, context) {
    const model = reactive({
      id: props.ship.id,
      registry: props.ship.registry,
      name: props.ship.name,
      commissioned: props.ship.commissioned,
      decommissioned: props.ship.decommissioned,
      destroyed: props.ship.destroyed
    });
    const isSaving = ref(false);
    const errors = ref([]);

    const registryInput = ref(null);

    const isReadonly = inject("isReadonly");
    const notify = inject("notify");

    const breakpoints = useBreakpoints();

    watch(model, () => {
      if (errors.value.length) {
        errors.value = [];
      }
    });

    async function save() {
      errors.value = [];
      isSaving.value = true;
      const options = { body: JSON.stringify(model), headers: { "Content-Type": "application/json" } };
      try {
        let response;
        if (model.id) {
          response = await fetch(`http://localhost:1337/ships/${model.id}`, { ...options, method: "PUT" });
        } else {
          response = await fetch("http://localhost:1337/ships", { ...options, method: "POST" });
        }

        if (response.ok) {
          notify("Ship saved!");
          close();
        } else {
          const text = await response.text();
          if (text) {
            errors.value = JSON.parse(text).errors;
          } else {
            errors.value = ["An unknown error occurred."];
          }
        }
      } catch (err) {
        errors.value = [err.message];
      } finally {
        isSaving.value = false;
      }
    }

    function close() {
      context.emit("close");
    }

    onMounted(() => {
      const input = registryInput.value;
      input.focus();
      input.setSelectionRange(0, 0);
    });

    return {
      model,
      isSaving,
      errors,
      registryInput,
      isReadonly,
      breakpoints,
      save,
      close
    };
  }
};
</script>

<style scoped>
h2 {
  color: #000;
}

.form-field {
  margin-bottom: 1em;
  display: flex;
  align-items: center;
}

.form-field label {
  width: 150px;
  margin-right: 1em;
  font-weight: 700;
}

.form-field .text {
  width: 300px;
}

.form-field .number {
  width: 100px;
}

.is-vertical .form-field {
  display: block;
}

.is-vertical .form-field label,
.is-vertical .form-field .text {
  width: 100%;
  display: block;
}

.is-vertical .form-field .number {
  width: 50%;
  display: block;
}

.errors {
  padding: 1em;
  color: #fff;
  background-color: #a12;
  border-radius: 10px;
}

.errors ul {
  margin: 0;
  padding-left: 1.25em;
}

.actions {
  margin-top: 1.5em;
}
</style>
