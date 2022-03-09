// const deposiitbalance = document.getElementById("deposit");
const account_balance = document.getElementById("account_balance");
const investment = document.getElementById("investment");
const deposit_btn = document.getElementById("deposit_btn");
const history_btn = document.getElementById("history_btn");
// const url = "https://fintech-group4.herokuapp.com";  // live site
const url = "http://localhost:3000"; // for testing purpose only

let init_investment_balance = 5000.0; //hardcoded for now

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function init() {
  $.getJSON(`${url}/transactions/history`, (data) => {
    console.log(data);
    let code = "<ul>";
    let balance = data[0].balance;
    account_balance.innerText = "$" + balance.toFixed(2);

    if (data[0].amount != null) {
      data.forEach((datapoint) => {
        let date = datapoint.transaction_date.substring(0, 10);
        code += `<li>Date: ${date} | Amount Transacted: $${datapoint.amount}</li>`;
      });
    } else {
      code += `<li> No transaction made yet...</li>`;
    }
    code += "</ul>";
    $(".mypanel").html(code);
  });

  // $("#btn").submit(function (e) {
  //   e.preventDefault();
  // });

  drawChart();
  //investment.innerText = `$${init_investment_balance}`;
}

// transaction history button control
/*history_btn.addEventListener("click", () => {
  $.getJSON(`${url}/transactions/history`, (data) => {
    console.log(data);
    let code = "<ul>";
    if (data[0].amount != null) {
      data.forEach((datapoint) => {
        let date = datapoint.transaction_date.substring(0, 10);
        code += `<li>Date: ${date} | Amount Transacted: $${datapoint.amount}</li>`;
      });
    } else {
      code += `<li> No transaction made yet...</li>`;
    }
    code += "</ul>";
    $(".mypanel").html(code);
  });

  init();
});*/

// top up button control
deposit_btn.addEventListener("click", () => {
  let amount = document.getElementById("deposit_amount").value;
  $.getJSON(`${url}/transactions/deposit?amount=${amount}`);
  alert(`You have successfully deposited $${amount}.`);
  console.log("deposit successful");
  init();
});

// buy button control
const buy_btn = document.getElementById("buy_btn");
buy_btn.addEventListener("click", () => {
  console.log("buying");
  // let user_id = 922;
  let amount = document.getElementById("investment_amount").value;
  let balance = 0;
  $.getJSON(`${url}/transactions/balance`, (data) => {
    balance = data[0].balance;
    if (balance >= amount) {
      $.getJSON(`${url}/transactions/buy?amount=${amount}`);
      alert(`You have made an investment of $${amount}`);
    } else {
      alert(`Insufficient funds!`);
    }
  });

  init();
});

// sell button control
const sell_btn = document.getElementById("sell_btn");
sell_btn.addEventListener("click", () => {
  console.log("selling");
  // let user_id = 922;
  let amount = document.getElementById("investment_amount").value;
  $.getJSON(`${url}/transactions/sell?amount=${amount}`);
  alert(`You have sold $${amount} worth of assets`);

  init();
});

function drawChart() {
  //console.log(parseInt(deposiitbalance.innerText.value));
  var data = google.visualization.arrayToDataTable([
    ["Item", "$"],
    ["Deposit", parseInt(account_balance)],
    ["Investment", parseInt(init_investment_balance)], // change later
  ]);
  var options = {
    title: "",
  };
  var chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );
  chart.draw(data, options);
}

init();
