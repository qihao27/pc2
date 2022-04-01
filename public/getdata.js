const url = "https://fintech-group4.herokuapp.com";  // live site
// const url = "http://localhost:3000"; // for testing purpose only
const profile_btn = document.getElementById("profile_btn");
const logout_btn = document.getElementById("logout_btn");
const account_balance = document.getElementById("account_balance");
const investment = document.getElementById("investment");
const deposit_btn = document.getElementById("deposit_btn");
const buy_btn = document.getElementById("buy_btn");
const sell_btn = document.getElementById("sell_btn");
const list = document.getElementById("list");
const btn_eth = document.getElementById("eth_btn");
const btn_ecr = document.getElementById("token_btn");
const qh_address = "0x96f9842De6E591C17d6e544Ff3419Bee5A4f26a3";
const abi = [{
  constant: true,
  inputs: [{ name: "_owner", type: "address" }],
  name: "balanceOf",
  outputs: [{ name: "balance", type: "uint256" }],
  type: "function",
}];
const ecr = [
  { address: "0x96f9842De6E591C17d6e544Ff3419Bee5A4f26a3", symbol: "WQH" },
  { address: "0x6b756F2199D9c8825d2C9526a298F73C621d8EBf", symbol: "FCW" }];

let current_balance = 0.00;
let current_invest = 0.00;
let aid = 0;

// google.charts.load("current", { packages: ["corechart"]});

function init() {
  $.getJSON(`${url}/transactions/history`, (data, callback) => {
    console.log(data);
    let code = "<ul>";
    aid = data[0][0].account_id;
    current_balance = data[0][0].balance;
    account_balance.innerText = "$" + current_balance.toFixed(2);

    if (data[1].length != 0) {
      if (typeof data[1][1] != 'undefined') {
        current_invest = data[1][0].invest - data[1][1].invest;
      } else {
        current_invest = data[1][0].invest;
      }
    }
    investment.innerText = "$" + current_invest.toFixed(2);

    if (data[0][0].amount != null) {
      data[0].forEach((datapoint) => {
        addTransactionHistory(datapoint)
      });
    } else {
      code += `<li> No transaction made yet...</li>`;
    }
  });
}

profile_btn.addEventListener("click", () => { window.location.href = `${url}/profile`; });
logout_btn.addEventListener("click", () => { window.location.href = `${url}/logout`; });

btn_eth.addEventListener("click", () => {
  if (window.ethereum) {
    console.log("MetaMask is installed!");
    web3 = new Web3(window.ethereum);
    ethereum.request({ method: "eth_requestAccounts" });
    var account = web3.currentProvider.selectedAddress;
    console.log(account);
    web3.eth.getBalance(account)
      .then((wei) => {
        var eth = web3.utils.fromWei(wei, 'ether');
        $("#token-amount").html("ETH: " + parseFloat(eth).toFixed(4));
      });
  }
});

btn_ecr.addEventListener("click", () => {
  if (window.ethereum) {
    console.log("MetaMask is installed!");
    var web3 = new Web3(window.ethereum);
    ethereum.request({ method: "eth_requestAccounts" });
    var account = web3.currentProvider.selectedAddress;
    console.log(account);
    var tokenContract = new web3.eth.Contract(abi, qh_address);
    tokenContract.methods.balanceOf(account).call()
      .then((wei) => {
        var qh = web3.utils.fromWei(wei);
        $("#qh-amount").html("WQH: " + parseFloat(qh).toFixed(4));
      });
  }
});

// top up button control
deposit_btn.addEventListener("click", () => {
  let amount = document.getElementById("deposit_amount").value;
  if (!amount) {
    alert(`Please input amount to be deposited into account.`);
  } else {
    $.getJSON(`${url}/transactions/deposit?amount=${amount}&aid=${aid}`);
    alert(`You have successfully deposited $${amount}.`);
  }

  init();
});

// buy button control
buy_btn.addEventListener("click", () => {
  let amount = document.getElementById("investment_amount").value;
  if (!amount) { alert(`Please input amount to make an investment.`); }
  else if (current_balance < amount) { alert(`Insufficient funds!`); }
  else {
    $.getJSON(`${url}/transactions/buy?amount=${amount}&aid=${aid}`);
    alert(`You have made an investment of $${amount}`);
  }

  init();
});

// sell button control
sell_btn.addEventListener("click", () => {
  let amount = document.getElementById("investment_amount").value;
  if (!amount) { alert(`Please input amount to sell assets.`); }
  else if (current_invest < amount) { alert(`Insufficient assets!`); }
  else {
    $.getJSON(`${url}/transactions/sell?amount=${amount}&aid=${aid}`);
      alert(`You have sold $${amount} worth of assets`);
  }

  init();
});

function addTransactionHistory(transaction) {
  const transaction_item = document.createElement('li');

  transaction_item.innerHTML = `${transaction.transaction_date.substring(0, 10)} || `;
  if (transaction.type == 80) {
    transaction_item.classList.add('plus');
    transaction_item.innerHTML += `Top Up <span> $ ${Math.abs(transaction.amount)}</span>`;
  } else if (transaction.type == 20) {
    transaction_item.classList.add('plus');
    transaction_item.innerHTML += `Sold <span> $ ${Math.abs(transaction.amount)}</span>`;
  } else if (transaction.type == 10) {
    transaction_item.classList.add('minus');
    transaction_item.innerHTML += `Bought <span> -$ ${Math.abs(transaction.amount)}</span>`;
  }

  list.appendChild(transaction_item);
}

// function drawChart() {
//   var data = google.visualization.arrayToDataTable([
//     ["Item", "$"],
//     ["Deposit", parseInt(current_balance)],
//     ["Investment", parseInt(current_invest)],
//   ]);
//   var options = {};
//   var chart = new google.visualization.PieChart(document.getElementById('piechart'));
//   chart.draw(data, options);
// }

init();
// google.charts.setOnLoadCallback(drawChart);
