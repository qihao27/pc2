const deposiitbalance = document.getElementById("deposit");
const investmentbalance = document.getElementById("investment");

const accountBalance = document.getElementById("account_balance");

let init_deposit_balance = 0.0;
let init_investment_balance = 5000.0; //hardcoded for now

let user_id = 922;

//const b1 = document.getElementById("b1");
// const url = "https://fintech-group4.herokuapp.com";
const url = "http://localhost:3000";
//b1.addEventListener("click", () => {
//let user_id = document.getElementById("inputbox").value;
//$.getJSON(`${url}/users/by-uid?uid=${user_id}`, (data) => {
//console.log(data);
// data passed in as an object of a list
//data = data[0];
//let code = `First Name: ${data.first_name} <br>
//          Last Name:  ${data.last_name} <br>
//         Email:      ${data.email}`;
//$(".mypanel").html(code);
//});
//});

// b1 = deposit | b2 = buy | b3 = sell | b4 = transaction hist
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

// transaction history
const b4 = document.getElementById("b4");
b4.addEventListener("click", () => {
  $.getJSON(
    `${url}/transactions/by-account-id?account_id=${user_id}`,
    (data) => {
      console.log(data);

      let code = "<ul>";
      // 6 March: need to change format for transactions history
      //
      data.forEach((datapoint) => {
        let date = datapoint.transaction_date.substring(0, 10);
        code += `<li> Date: ${date} 
                    | Amount: $${datapoint.amount}
                    </li>`;
      });
      code += "</ul>";
      $(".mypanel").html(code);
    }
  );

  init();
});

const b1 = document.getElementById("b1");
b1.addEventListener("click", () => {
  let user_id = 922;
  let amount = document.getElementById("deposit_amount").value;
  $.getJSON(`${url}/transactions/by-deposit-amt?amount=${amount}`, () => {
    // console.log(data);
    // let code = "<ul>";
    // code += "Funds deposited.";
    // code += "</ul>";
    // $(".mypanel").html(code);
    // alert(`You have successfully deposited $${amount}.`);
  });

  init();
});

//b2 = buying
const b2 = document.getElementById("b2");
b2.addEventListener("click", () => {
  console.log("clicked");
  let user_id = 922;
  let amount = document.getElementById("investment_amount").value;
  $.getJSON(`${url}/transactions/buy?amount=${amount}`, () => {
    // console.log(data);

    let code = "<ul>";
    code += "Investment made.";
    code += "</ul>";

    $(".mypanel").html(code);
  });
  alert(`Hello, you have made an investment of ${amount}`);
  init();
});

//b3 = selling
const b3 = document.getElementById("b3");
b3.addEventListener("click", () => {
  console.log("selling");
  let user_id = 922;
  let amount = document.getElementById("investment_amount").value;
  $.getJSON(`${url}/transactions/sell?amount=${amount}`, () => {
    // console.log(data);

    let code = "<ul>";
    code += "Sold.";
    code += "</ul>";

    $(".mypanel").html(code);
  });
  alert(`Hello, you have sold ${amount} worth of assets`);
  init();
});

// const b1 = document.getElementById("b1"); // deposit
// b1.addEventListener("click", () => {
//   //console.log("test");
//   let new_deposit = document.getElementById("deposit_amount").value; //HC
//   // //$.getJSON(`${url}/transactions/by-uid?uid=${user_id}`, (data) => {
//   // // console.log(data);
//   // // let code = "<ul>";
//   // // 6 March: need to change format for transactions history
//   // //
//   // //data.forEach((datapoint) => {
//   // //  code += `<li> First Name: ${datapoint.first_name}
//   // //                | Last Name: ${datapoint.last_name}
//   // //               | Email: ${datapoint.email} </li>`;
//   // //});
//   // //code += "</ul>";
//   // // $(".mypanel").html(code);
//   // // //});
//   // // let testingcode = "<ul><li>";
//   // // testingcode += new_deposit;
//   // // testingcode += "</li></ul>";
//   // // $(".mypanel").html(testingcode);
//   // // init_deposit_balance += new_deposit;
//   // console.log(new_deposit);

//   init();
// });

function init() {
  let temp_amount = 0.0;
  let balance = 0;
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

  $("#btn").submit(function (e) {
    e.preventDefault();
  });

  drawChart();

  //console.log("temp_amount= " + temp_amount);

  //investment.innerText = `$${init_investment_balance}`;
}

init();
