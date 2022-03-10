const account_balance = document.getElementById("account_balance");
const investment = document.getElementById("investment");
const deposit_btn = document.getElementById("deposit_btn");
const buy_btn = document.getElementById("buy_btn");
const sell_btn = document.getElementById("sell_btn");
const url = "https://fintech-group4.herokuapp.com";  // live site
// const url = "http://localhost:3000"; // for testing purpose only

// google.charts.load("current", { packages: ["corechart"] });
// google.charts.setOnLoadCallback(drawChart);

let current_balance = 0.00;
let current_invest = 0.00;
let aid = 0;

function init() {
  $.getJSON(`${url}/transactions/history`, (data) => {
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
        let date = datapoint.transaction_date.substring(0, 10);
        code += `<li>Date: ${date} | Amount Transacted: `;
        code += (datapoint.type == 10) ? `-` : ``;
        code += `$${datapoint.amount}</li>`;
      });
    } else {
      code += `<li> No transaction made yet...</li>`;
    }
    code += "</ul>";
    $(".mypanel").html(code);
  });

  // drawChart();
}

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

// function drawChart() {
//   //console.log(parseInt(deposiitbalance.innerText.value));
//   var data = google.visualization.arrayToDataTable([
//     ["Item", "$"],
//     ["Deposit", parseInt(account_balance)],
//     ["Investment", parseInt(investment)],
//   ]);
//   var options = {
//     title: "",
//   };
//   var chart = new google.visualization.PieChart(
//     document.getElementById("piechart")
//   );
//   chart.draw(data, options);
// }

init();
