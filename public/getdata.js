const deposiitbalance = document.getElementById("deposit");
const investmentbalance = document.getElementById("investment");

let init_deposit_balance = 500;
let init_investment_balance = 200;
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

const b4 = document.getElementById("b4");
b4.addEventListener("click", () => {
  let user_id = 922;

  $.getJSON(
    `${url}/transactions/by-account-id?account_id=${user_id}`,
    (data) => {
      console.log(data);

      let code = "<ul>";
      // 6 March: need to change format for transactions history
      //
      data.forEach((datapoint) => {
        code += `<li> Date: ${datapoint.transaction_date} 
                    | Amount: $${datapoint.amount}
                    </li>`;
      });
      code += "</ul>";
      $(".mypanel").html(code);
    }
  );
});

const b1 = document.getElementById("b1");
b1.addEventListener("click", () => {
  let user_id = 922;
  let amount = document.getElementById("deposit_amount").value;
  $.getJSON(`${url}/transactions/by-deposit-amt?amount=${amount}`, () => {
    // console.log(data);

    let code = "<ul>";
    code += "Funds deposited.";
    code += "</ul>";

    $(".mypanel").html(code);
  });
});

function init() {
  deposiitbalance.innerText = `$${init_deposit_balance}`;
  investment.innerText = `$${init_investment_balance}`;
}

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

// init();
