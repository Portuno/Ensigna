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
              <img src="/logo.jpg" alt="Logo" class="logo"/>
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
            <div class="q-mt-sm">Stake Tokens: Doc</div>
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

          <!-- Input -->
          <div class="q-mt-md">
            <q-input
              outlined
              v-model="amountOfRbtcToConvertInDoc"
              type="number"
              :min="0"
              :step="1"
              label="rbtc amont to convert in doc"
            >
            </q-input>
          </div>

          <!-- Buy button -->
          <div class="q-mt-md">
              <span> 5% of fees </span> <br>
              <q-btn rounded color="primary" label="Mint Doc" @click="mintDoCToken"/>
          </div>

            <!-- Input -->
            <div class="q-mt-md">
                <q-input
                        outlined
                        v-model="amountOfdocToRedeam"
                        type="number"
                        :min="0"
                        :step="1"
                        label="doc to redeam"
                >
                </q-input>
            </div>

            <!-- Buy button -->
            <div class="q-mt-md">
                <span> 5% of fees </span> <br>
                <q-btn rounded color="primary" label="redeam Doc" @click="reclaimDoCToken"/>
            </div>

        </q-card-section>
      </q-card>
    </div>

    <!-- Conditional rendering of the staking content -->
    <div v-if="tab === 'Staking'" class="q-mb-md">
      <StakingPanel/>
    </div>

    <!-- Conditional rendering of the "PRIZES" page -->
    <div v-if="tab === 'Prizes'" class="q-mb-md prizes-container">
      <PrizesPanel/>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { ethers, parseEther } from 'ethers';
import { useQuasar } from 'quasar';
import Utils from 'src/Utils';
import collectionConf from '../collectionConfig.json';
import lottoTickets from '../contractsTokens/LottoTickets.json';
import PrizesPanel from '../components/PrizesPanel.vue';
import StakingPanel from '../components/StakingPanel.vue';

export default {
  components: {
    PrizesPanel,
    StakingPanel,
  },
  setup() {
    const tab = ref('Pools'); // Set the default tab to "Pools"
    const showNewCard = ref(false); // Initially hide the new card
    const quantity = ref(1); // Initialize input value
    const amountOfRbtcToConvertInDoc = ref(0.01);
    const amountOfdocToRedeam = ref(1);
    const totalMinted = ref(0);
    const accounts = ref([]);
    const $q = useQuasar();

    const connectToMetaMask = async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
          // Specify the Rootstock Network's RPC URL
          const rpcUrl = 'https://public-node.testnet.rsk.co/';
          // Request access to the user's MetaMask account on the Rootstock Network
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x1f',
                chainName: 'Rsk Testnet',
                rpcUrls: [rpcUrl],
                //  nativeCurrency: {
                //   name: "tRBTC",
                //   symbol: "tRBTC",
                //   decimals: 18,
                // },
              },
            ],
          });

          // Connect to the Rootstock Network
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else {
          // MetaMask is not installed
          Utils.showNotify('MetaMask is not installed.');
        }
      } catch (error) {
        Utils.showNotify(`Error connecting to MetaMask:${error}`);
      }
    };

    const initializeEthers = () => {
      window.ethereum.on('chainChanged', async () => {
        console.log('chainChanged');
      });
    };

    const mintDoCToken = async () => {
      Utils.showLoader();
      const temPprovider = new ethers.BrowserProvider(window.ethereum);
      const signer = await temPprovider.getSigner();
      // The ABI of the DocToken contract (simplified for this example)
      const docTokenAbi = [
        'function mintDocVendors(uint256 btcToMint, address vendorAccount) public payable',
      ];
      // Create a contract instance
      const mocContract = new ethers.Contract(collectionConf.mocContract, docTokenAbi, signer);
      // The amount of tokens to mint
      const amount = parseEther(amountOfRbtcToConvertInDoc.value.toString());
      const amountToSend = amountOfRbtcToConvertInDoc.value * 1.05;
      const overrides = {
        value: parseEther(amountToSend.toFixed(10)),
      };
      // eslint-disable-next-line max-len
      const tx = await mocContract.mintDocVendors(amount, collectionConf.vendorDocContract, overrides);
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction mined:', receipt);
      Utils.closeLoader();
    };

    const reclaimDoCToken = async () => {
      Utils.showLoader();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const mocAbi = [
        'function docAmountToRedeem(address redeemer) public view returns(uint256)',
        'function redeemDocRequest(uint256 docAmount) public nonpayable whenNotPaused whenSettlementReady',
        'function redeemFreeDoc(uint256 docAmount) public nonpayable',
      ];
      const mocContract = new ethers.Contract(collectionConf.mocContract, mocAbi, signer);
      // eslint-disable-next-line max-len
      // const approve = await mocContract.redeemDocRequest(parseEther(amountOfdocToRedeam.value.toString()));
      // console.log('approve   ', approve);
      const tx = await mocContract.redeemFreeDoc(parseEther(amountOfdocToRedeam.value.toString()));
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction mined:', receipt);
      Utils.closeLoader();
    };
    const fetchData = async () => {
      Utils.showLoader();
      // eslint-disable-next-line no-unused-vars
      const temPprovider = new ethers.BrowserProvider(window.ethereum);
      const signer = await temPprovider.getSigner();
      const contract = new ethers.Contract(collectionConf.adress, lottoTickets.abi, signer);
      try {
        totalMinted.value = String(await contract.getCapital());
      } catch (error) {
        console.error('Error fetching capital:', error);
      }
      Utils.closeLoader();
    };
    const buyTokens = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(collectionConf.adress, lottoTickets.abi, signer);
      const docTokenContract = new ethers.Contract('0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0', [
        'function approve(address spender, uint256 amount) external returns (bool)',
      ], signer);
      accounts.value = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
        Utils.showLoader();
        const aprovement = await docTokenContract.approve(
          collectionConf.adress,
          parseEther(String(1 * quantity.value)),
        );
        const approvalReceipt = await aprovement.wait();
        console.log('Approval Receipt:', approvalReceipt);

        const transaction = await contract.mintWithDOC(accounts.value[0], quantity.value);
        const res = await transaction.wait();
        console.log('res   ', res);
        $q.notify({
          message: 'Mint done',
          color: 'positive',
        });
        await fetchData();
        Utils.closeLoader();
      } catch (err) {
        console.log('err  ', err);
        Utils.closeLoader();
        $q.notify({
          message: err.message,
          color: 'negative',
        });
      }
    };
    const getAccounts = async () => {
      if (typeof window.ethereum !== 'undefined') {
        accounts.value = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
      initializeEthers();
      await getAccounts();
      await fetchData();
    });

    return {
      tab,
      showNewCard,
      quantity,
      totalMinted,
      amountOfRbtcToConvertInDoc,
      amountOfdocToRedeam,
      openNewCard,
      closeNewCard,
      incrementInput,
      decrementInput,
      setMaxInput,
      buyTokens,
      connectToMetaMask, // Expose the connectToMetaMask function to the template
      mintDoCToken,
      reclaimDoCToken,
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
