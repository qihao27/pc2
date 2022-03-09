// const deposiitbalance = document.getElementById("deposit");
// const investmentbalance = document.getElementById("investment");
const accountBalance = document.getElementById("account_balance");
const url = "https://fintech-group4.herokuapp.com";  // live site
// const url = "http://localhost:3000"; // for testing purpose only

let init_deposit_balance = 0.0;
let init_investment_balance = 5000.0; //hardcoded for now
// let user_id = 922;

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  //console.log(parseInt(deposiitbalance.innerText.value));
  var data = google.visualization.arrayToDataTable([
    ["Item", "$"],
    ["Deposit", parseInt(accountBalance)],
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

// deposite button control
const deposit_btn = document.getElementById("deposit_btn");
deposit_btn.addEventListener("click", () => {
  // let user_id = 922;
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

// transaction history
const history_btn = document.getElementById("history_btn");
history_btn.addEventListener("click", () => {
  let user_id = 922;
  $.getJSON(
    `${url}/transactions/by-account-id?account_id=${user_id}`,
    (data) => {
      console.log(data);
      let code = "<ul>";
      // TODO: 6 March - change format for transactions history
      data.forEach((datapoint) => {
        let date = datapoint.transaction_date.substring(0, 10);
        code += `<li> Date: ${date} 
                    | Amount Transacted: $${datapoint.amount}
                    </li>`;
      });
      code += "</ul>";
      $(".mypanel").html(code);
    }
  );
  // $(".form_invest").submit(function (e) {
  //   e.preventDefault();
  // });
  init();
});

function init() {
  let temp_amount = 0.0;
  let balance = 0;
  // $.getJSON(`${url}/uid`, (data) => {
  //   console.log("uid: " + data[0].id);
  // });
  $.getJSON(`${url}/transactions/balance`, (data) => {
    console.log(data[0].balance);
    balance = data[0].balance;
    accountBalance.innerText = "$" + balance.toFixed(2);
    // data.forEach((datapoint) => {
    // });
  });

  // $.getJSON(
  //   `${url}/transactions/by-account-id?account_id=${user_id}`,
  //   (data) => {
  //     console.log(data);
  //     // 6 March: need to change format for transactions history
  //     //
  //     data.forEach((datapoint) => {
  //       //console.log(`${datapoint.amount}`);
  //       //console.log(parseFloat(`${datapoint.amount}`));
  //       temp_amount += parseFloat(`${datapoint.amount}`);
  //       //console.log("temp_amount= " + temp_amount);

  //       // investment_amount += parseFloat(`${datapoint.investment}`)
  //     });
  //     init_deposit_balance = temp_amount.toFixed(2);
  //     deposiitbalance.innerText = "$" + temp_amount.toFixed(2);

  //     // init_investment_balance =
  //   }
  // );

  // $("#btn").submit(function (e) {
  //   e.preventDefault();
  // });

  drawChart();

  //console.log("temp_amount= " + temp_amount);

  //investment.innerText = `$${init_investment_balance}`;
}

init();
