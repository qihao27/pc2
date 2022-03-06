const b1 = document.getElementById("b1");
// const url = "https://fintech-group4.herokuapp.com";
const url = "http://localhost:3000";
b1.addEventListener("click", () => {
  let user_id = document.getElementById("inputbox").value;
  $.getJSON(`${url}/users/by-uid?uid=${user_id}`, (data) => {
    console.log(data);
    // data passed in as an object of a list
    data = data[0];
    let code = `First Name: ${data.first_name} <br>
                Last Name:  ${data.last_name} <br>
                Email:      ${data.email}`;
    $(".mypanel").html(code);
  });
});

const b2 = document.getElementById("b4");
b2.addEventListener("click", () => {
  $.getJSON(`${url}/users/all`, (data) => {
    console.log(data);
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