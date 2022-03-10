const account_balance = document.getElementById("account_balance");
const investment = document.getElementById("investment");
const deposit_btn = document.getElementById("deposit_btn");
const buy_btn = document.getElementById("buy_btn");
const sell_btn = document.getElementById("sell_btn");
const url = "https://fintech-group4.herokuapp.com";  // live site
// const url = "http://localhost:3000"; // for testing purpose only

// google.charts.load("current", { packages: ["corechart"] });
// google.charts.setOnLoadCallback(drawChart);

function init() {
  $.getJSON(`${url}/transactions/history`, (data) => {
    console.log(data[0]);
    console.log(data[1]);
    let code = "<ul>";
    let balance = data[0][0].balance;
    account_balance.innerText = "$" + balance.toFixed(2);

    let invest_amount = 0.00;
    if (data[1].length != 0) {
      if (typeof data[1][1] != 'undefined') {
        invest_amount = data[1][0].invest - data[1][1].invest;
      } else {
        invest_amount = data[1][0].invest;
      }
    }
    investment.innerText = "$" + invest_amount.toFixed(2);

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
  $.getJSON(`${url}/transactions/deposit?amount=${amount}`);
  !amount ? alert(`Please input amount to be deposited into account.`) : 
    alert(`You have successfully deposited $${amount}.`);

  init();
});

// buy button control
buy_btn.addEventListener("click", () => {
  let amount = document.getElementById("investment_amount").value;
  // $.getJSON(`${url}/balance`, (data) => {
  //   let balance = data[0].balance;
  //   if (balance >= amount) {
      $.getJSON(`${url}/transactions/buy?amount=${amount}`);
      alert(`You have made an investment of $${amount}`);
    // } else {
    //   alert(`Insufficient funds!`);
    // }
  // });

  init();
});

// sell button control
sell_btn.addEventListener("click", () => {
  let amount = document.getElementById("investment_amount").value;
  // $.getJSON(`${url}/investment`, (data) => {
  //   let invest = data[0].invest;
  //   if (invest >= amount) {
      $.getJSON(`${url}/transactions/sell?amount=${amount}`);
      alert(`You have sold $${amount} worth of assets`);
    // } else {
    //   alert(`Insufficient funds!`);
    // }
  // });

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
