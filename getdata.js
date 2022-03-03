const b1 = document.getElementById("b1");
// const url = "https://fintech-example-app.herokuapp.com";
const url = "http://localhost:3000";
b1.addEventListener("click", () => {
  let user_id = document.getElementById("inputbox").value;
  $.getJSON(`${url}/users/by-uid?uid=${user_id}`, (data) => {
    let code = `First Name: ${data.first_name} <br>
                Last Name:  ${data.last_name} <br>
                Email:      ${data.email}`;
    $(".mypanel").html(code);
  });
});

const b2 = document.getElementById("b2");
b2.addEventListener("click", () => {
  $.getJSON(`${url}/users/all`, (data) => {
    let code = "<ul>";
    data.forEach((datapoint) => {
      code += `<li> First Name: ${datapoint.first_name}
                    | Last Name: ${datapoint.last_name}
                    | Email: ${datapoint.email} </li>`;
    });
    code += "</ul>";
    $(".mypanel").html(code);
  });
});

const b3 = document.getElementById("b3");
b3.addEventListener("click", () => {
  $.getJSON(`${url}/accounts/all`, (data) => {
    let code = "<ul>";
    data.forEach((datapoint) => {
      code += `<li> Account Holder: ${datapoint.holder} | Account Number: ${datapoint.account_no} | Type: ${datapoint.type} <br> Balance: ${datapoint.balance} | Max Credit Limit: ${datapoint.max_limit}
      </li><br>`;
    });
    code += "</ul><br>";

    $(".mypanel").html(code);

    // console.log(code);
  });
});

const b4 = document.getElementById("b4");
b4.addEventListener("click", () => {
  let acc_no = document.getElementById("inputbox").value;
  $.getJSON(`${url}/accounts/by-acc-no?acc_no=${acc_no}`, (data) => {
    let code = "<ul>";
    code += `<li>Account Number: ${data.account_no} | Account Holder: ${data.holder} | Type: ${data.type} <br> Balance: ${data.balance} | Max Credit Limit: ${data.max_limit}
      </li><br>`;
    code += "</ul><br>";

    $(".mypanel").html(code);

    // console.log(code);
  });
});
