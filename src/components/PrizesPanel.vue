<template>
  <!-- Left card for "IN VAULT" -->
  <q-card class="prizes-card">
    <q-card-section>
      <div class="text-h6">IN VAULT</div>
      <!-- Display the amount from your data -->
      <div class="q-mt-sm">{{ inVaultAmount }}</div>
    </q-card-section>
  </q-card>
  <!-- Left card for "24 HOURS VOLUME" -->
  <q-card class="prizes-card">
    <q-card-section>
      <div class="text-h6">24 HOURS VOLUME</div>
      <!-- Display the volume from your data -->
      <div class="q-mt-sm">{{ volume24Hours }}</div>
    </q-card-section>
  </q-card>

  <!-- Right card for "Tickets" -->
  <q-card class="prizes-card">
    <q-card-section>
      <!-- Display the number of tickets from your data -->
      <div class="text-h6">Tickets</div>
      <div class="q-mt-sm">{{ userTickets }}</div>

      <!-- Redeem button (disabled and gray) -->
      <q-btn rounded color="grey" label="Redeem" :disable="true"/>

      <!-- Claim button (yellow circle) -->
      <q-btn rounded color="warning" label="Claim" class="yellow-circle"/>
    </q-card-section>
  </q-card>
</template>
<script>

</script>

<style scoped>

</style>
