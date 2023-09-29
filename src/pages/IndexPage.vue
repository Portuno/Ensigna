<template>
  <div class="q-pa-md">
    <!-- Navigation bar -->
    <q-toolbar class="bg-purple text-white shadow-2 rounded-borders">
      <q-btn flat label="Ensigna"/>

      <!-- Tabs -->
      <div class="tabs-container">
        <div class="justify-center">
          <q-tabs v-model="tab" shrink>
            <q-tab name="Pools" label="Pools" class="tab-hover-effect"/>
            <q-tab name="Staking" label="Staking" class="tab-hover-effect"/>
            <q-tab name="Prizes" label="Prizes" class="tab-hover-effect"/>
          </q-tabs>
        </div>
      </div>

      <!-- Connect button -->
      <div class="rounded-button-container">
        <q-btn
          rounded
          color="primary"
          label="Connect"
          @click="connectToMetaMask"
        />
      </div>
    </q-toolbar>

    <!-- Conditional rendering of the pool card -->
    <div v-if="tab === 'Pools'" class="q-mb-md">
      <!-- Grey background container for the card -->
      <div class="card-container">
        <q-card>
          <q-card-section>
            <!-- Logo -->
            <div class="logo-container">
              <img src="/path-to-your-logo.png" alt="Logo" class="logo"/>
            </div>
            <!-- Line 1 -->
            <div class="text-h6">Pool 1</div>
            <!-- Line 2 -->
            <div class="q-mt-sm">Description: Lorem ipsum dolor sit amet.</div>
            <!-- Line 3 -->
            <div class="q-mt-sm">Total Liquidity: ${{ totalMinted }}</div>
            <!-- Line 4 -->
            <div class="q-mt-sm">APY: 5%</div>
            <!-- Line 5 -->
            <div class="q-mt-sm">Stake Tokens: ETH, DAI</div>
            <!-- Button to Access -->
            <div class="q-mt-md">
              <!-- If the new card is not open, show the "To Access" button -->
              <q-btn
                v-if="!showNewCard"
                rounded
                color="warning"
                label="To Access"
                @click="openNewCard"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Conditional rendering of the new card -->
    <div v-if="showNewCard && tab === 'Pools'" class="q-mb-md">
      <q-card>
        <q-card-section>
          <!-- Close button (x) -->
          <q-btn
            flat
            dense
            round
            icon="close"
            class="close-button"
            @click="closeNewCard"
          />

          <!-- Name -->
          <div class="text-h6">Ticket</div>

          <!-- Input -->
          <div class="q-mt-md">
            <q-input
              outlined
              v-model="quantity"
              type="number"
              :min="0"
              :step="1"
            >
              <!-- Buttons for +1, -1, and max -->
              <template v-slot:append>
                <q-btn dense round @click="incrementInput">+1</q-btn>
                <q-btn dense round @click="decrementInput">-1</q-btn>
                <q-btn dense round @click="setMaxInput">Max</q-btn>
              </template>
            </q-input>
          </div>

          <!-- Buy button -->
          <div class="q-mt-md">
            <q-btn rounded color="primary" label="Buy" @click="buyTokens"/>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Conditional rendering of the staking content -->
    <div v-if="tab === 'Staking'" class="q-mb-md">
      <!-- Placeholder content for the "Staking" page -->
      <div class="coming-soon">
        <div class="text-h6">Staking (Coming Soon)</div>
        <div class="q-mt-sm">Staking allows you to earn rewar</div>
      </div>
    </div>

    <!-- Conditional rendering of the "PRIZES" page -->
    <div v-if="tab === 'Prizes'" class="q-mb-md prizes-container">
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
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import lottoTickets from '../contractsTokens/LottoTickets.json';
import {ethers,parseEther} from 'ethers';
import {useQuasar} from 'quasar';
import collectionConf from '../collectionConfig.json';


export default {
  setup() {
    const tab = ref("Pools"); // Set the default tab to "Pools"
    const showNewCard = ref(false); // Initially hide the new card
    const quantity = ref(1); // Initialize input value
    const totalMinted = ref('0');
    const accounts = ref([]);
    const $q = useQuasar();

    const registerUser = async () => {
      if (accounts.value[0].match(/^0x[a-fA-f0-9]{40}$/)) {
        const datas = {
          id: uuidv4(),
          adress: accounts.value[0],
        };
        ApiHelper.addToCollection('users', datas).then(async () => {
          $q.notify({
            message: 'You are now registered',
            color: 'positive',
          });
          await checkIfUserIsRegistered();
        }).catch(() => {
          $q.notify({
            message: 'errror',
            color: 'negative',
          });
        });
      }
    };
    const buyTokens = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(collectionConf.adress, lottoTickets.abi, signer);
      accounts.value = await window.ethereum.request({method: 'eth_requestAccounts'});
      // const overrides = {
      //   from: accounts.value[0],
      //  value: 10,
      // };
      try {
        const transaction = await contract.mint(accounts.value[0], quantity.value, {value: parseEther(String(0.1 * quantity.value))});
        const res = await transaction.wait();
        console.log('res   ', res);
        $q.notify({
          message: 'Mint done',
          color: 'positive',
        });
        await fetchData();
      } catch (err) {
        console.log('err  ', err);
        $q.notify({
          message: err.message,
          color: 'negative',
        });
      }
    };
    const getAccounts = async () => {
      if (typeof window.ethereum !== 'undefined') {
        accounts.value = await window.ethereum.request({method: 'eth_requestAccounts'});
      }
    };
    const fetchData = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      // eslint-disable-next-line no-unused-vars
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(collectionConf.adress, lottoTickets.abi, signer);
      totalMinted.value = String(await contract.getTotalMinted());
      console.log('totalMinted.value   ', totalMinted.value);
    };
    const connectToMetaMask = async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== "undefined") {
          // Specify the Rootstock Network's RPC URL
          const rpcUrl = "https://public-node.testnet.rsk.co/";

          // Request access to the user's MetaMask account on the Rootstock Network
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: '0x1f',
                chainName: 'Rootstock Testnet',
                rpcUrls: [rpcUrl],
                nativeCurrency: {
                  name: "tRBTC",
                  symbol: "tRBTC",
                  decimals: 18,
                },
              },
            ],
          });

          // Connect to the Rootstock Network
          await window.ethereum.request({method: "eth_requestAccounts"});

          // You are now connected to the Rootstock Network
          console.log("Connected to Rootstock Network!");
        } else {
          // MetaMask is not installed
          console.error("MetaMask is not installed.");
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    };

    const openNewCard = () => {
      showNewCard.value = true; // Show the new card when "To Access" is clicked
    };

    const closeNewCard = () => {
      showNewCard.value = false; // Close the new card
    };

    const incrementInput = () => {
      quantity.value += 1; // Increment the input value by 1
    };

    const decrementInput = () => {
      quantity.value -= 1; // Decrement the input value by 1
    };

    const setMaxInput = () => {
      quantity.value = 100; // Set the input value to the maximum value (adjust as needed)
    };


    onMounted(async () => {
      await getAccounts();
      await fetchData();
    });

    return {
      tab,
      showNewCard,
      quantity,
      totalMinted,
      openNewCard,
      closeNewCard,
      incrementInput,
      decrementInput,
      setMaxInput,
      buyTokens,
      connectToMetaMask, // Expose the connectToMetaMask function to the template
    };
  },
};
</script>

<style>
/* Define a CSS class for the hover effect */
.tab-hover-effect:hover {
  color: yellow;
}

/* Style for the container of the tabs on the left */
.tabs-container {
  display: flex;
  align-items: center;
}

/* Style for the rounded button container on the right */
.rounded-button-container {
  display: flex;
  align-items: center;
  margin-left: auto; /* Pushes the container to the right */
}

/* Style for the grey background card container */
.card-container {
  background-color: #f0f0f0; /* Set your desired grey background color */
  padding: 20px; /* Adjust padding as needed */
  border-radius: 8px; /* Add rounded corners */
}

/* Style for the logo */
.logo-container {
  text-align: center;
  margin-bottom: 10px;
}

.logo {
  max-width: 100px; /* Adjust the size of your logo as needed */
}

/* Style for the "Coming Soon" content */
.coming-soon {
  text-align: center;
  padding: 20px;
  background-color: #5d2525;
  border-radius: 8px;
  margin: 0 auto;
  max-width: 400px;
}

/* Style for the new card (initially hidden) */
.new-card {
  display: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 300px; /* Set the desired width of the new card */
  z-index: 999; /* Ensure it's above other content */
  background-color: #ffffff; /* Set the background color of the new card */
  border: 1px solid #ccc; /* Add a border to the new card */
  border-radius: 8px; /* Add rounded corners to the new card */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
}

/* Style for the close button (x) in the new card */
.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

/* Style for the "PRIZES" card container */
.prizes-container {
  display: flex;
  justify-content: space-between;
}

/* Style for the "PRIZES" card */
.prizes-card {
  width: 30%; /* Adjust the width as needed */
  margin-right: 10px; /* Add spacing between cards */
}

/* Style for the "Tickets" card */
.tickets-card {
  width: 30%; /* Adjust the width as needed */
}

/* Style for the "Claim" button (same size as Redeem) */
.tickets-card .q-btn {
  width: 100%;
  margin-top: 10px;
}
</style>
