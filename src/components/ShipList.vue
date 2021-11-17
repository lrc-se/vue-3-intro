<template>
  <div class="ship-list">
    <div v-if="isLoading" class="loading">
      <AppSpinner :size="4" />
    </div>
    <template v-else>
      <EditShip v-if="selectedShip" :ship="selectedShip" @close="closeShip" />
      <template v-else class="ships">
        <div v-if="$slots.header" class="header">
          <slot name="header" :ships="ships" />
        </div>
        <AppButton :disabled="isReadonly" @click="createShip">Create</AppButton>
        <table>
          <tr>
            <th>Registry</th>
            <th>Name</th>
            <th>Commissioned</th>
            <th>Decommissioned</th>
            <th>Destroyed</th>
            <th v-if="!isReadonly">Action</th>
          </tr>
          <tr v-for="ship in ships" :key="ship.id">
            <td>{{ ship.registry }}</td>
            <td>{{ ship.name }}</td>
            <td>{{ ship.commissioned }}</td>
            <td>{{ ship.decommissioned }}</td>
            <td>{{ renderBoolean(ship.destroyed) }}</td>
            <td v-if="!isReadonly" class="actions">
              <AppButton @click="selectShip(ship)">Edit</AppButton>
              <AppButton @click="removeShip(ship)">Remove</AppButton>
            </td>
          </tr>
        </table>
        <div class="destroyed">Destroyed ships: <strong>{{ destroyedCount }}</strong></div>
      </template>
    </template>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
import EditShip from "./EditShip.vue";
import AppButton from "./AppButton.vue";
import AppSpinner from "./AppSpinner.vue";

function renderBoolean(value) {
  return (value ? "Yes" : "No");
}

export default {
  components: {
    EditShip,
    AppButton,
    AppSpinner
  },

  setup() {
    const state = reactive({
      ships: [],
      isLoading: false,
      selectedShip: null
    });

    const isReadonly = inject("isReadonly");
    const notify = inject("notify");

    const destroyedCount = computed(() => state.ships.filter(ship => ship.destroyed).length);

    async function loadShips() {
      state.isLoading = true;
      const response = await fetch("http://localhost:1337/ships");
      const ships = await response.json();
      state.ships = ships;
      state.isLoading = false;
    }

    function createShip() {
      state.selectedShip = {};
    }

    function selectShip(ship) {
      state.selectedShip = ship;
    }

    async function removeShip(ship) {
      await fetch(`http://localhost:1337/ships/${ship.id}`, { method: "DELETE" });
      notify("Ship removed!");
      loadShips();
    }

    function closeShip() {
      state.selectedShip = null;
      loadShips();
    }

    loadShips();

    return {
      ...toRefs(state),
      isReadonly,
      destroyedCount,
      renderBoolean,
      createShip,
      selectShip,
      removeShip,
      closeShip
    };
  }
};
</script>

<style scoped>
.ship-list {
  max-width: 1024px;
  margin: 0 auto;
  padding: 1.5em;
  color: #333;
  background-color: rgba(255, 255, 255, .75);
}

.loading {
  text-align: center;
}

.header {
  margin-bottom: 1rem;
  font-size: 1.25em;
}

table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
}

th {
  padding: .333em .5em;
  color: #fff;
  background-color: #000;
  border: 2px solid #000;
  text-align: left;
}

th:not(:last-child) {
  border-right-color: rgba(255, 255, 255, .5);
}

td {
  padding: .5em;
  border: 2px solid #000;
}

.actions {
  white-space: nowrap;
}

.actions button {
  margin: 0 .5em 0 0;
  padding: .375em .75em;
  font-size: .875em;
}

.actions button:last-child {
  margin-right: 0;
}

.destroyed {
  margin-top: .5em;
  text-align: right;
}
</style>
