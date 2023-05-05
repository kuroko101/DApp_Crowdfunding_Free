// Import the smart contract ABI and address
const contractABI = ...;
const contractAddress = ...;

// Initialize web3
let web3;
if (typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
  window.ethereum.enable().catch(error => {
    console.error('User denied account access');
  });
} else if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  console.error('No web3 provider detected');
}

// Load the smart contract
const crowdfundingContract = new web3.eth.Contract(contractABI, contractAddress);

// Get the project details and display them on the page
crowdfundingContract.methods.getProjectDetails().call().then((result) => {
  const title = result[0];
  const fundingGoal = web3.utils.fromWei(result[1], 'ether');
  const currentFunding = web3.utils.fromWei(result[2], 'ether');
  const numContributors = result[3];
  document.getElementById('title').textContent = title;
  document.getElementById('fundingGoal').textContent = `${fundingGoal} ETH`;
  document.getElementById('currentFunding').textContent = `${currentFunding} ETH`;
  document.getElementById('numContributors').textContent = numContributors;
});

// Handle the contribution button click event
const contributeButton = document.getElementById('contributeButton');
contributeButton.addEventListener('click', () => {
  const contributionAmount = document.getElementById('contributionAmount').value;
  if (!contributionAmount) {
    alert('Please enter a contribution amount');
    return;
  }
  const weiAmount = web3.utils.toWei(contributionAmount, 'ether');
  crowdfundingContract.methods.contribute().send({
    from: web3.eth.defaultAccount,
    value: weiAmount
  }).then(() => {
    location.reload();
  }).catch((error) => {
    alert(error.message);
  });
});