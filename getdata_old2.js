// let users = [
//   {
//     first_name: "Dixant",
//     last_name: "Mittal",
//   },
//   {
//     first_name: "Jon",
//     last_name: "Scheele",
//   },
// ];

function getData() {
  $.getJSON("http://nusbackendstub.herokuapp.com/user/by-uid?user_id=1", (data) => {
    let code = "<ul>";
    data.forEach((datapoint) => {
      code += `<li> First Name: ${datapoint.first_name}
                    Last Name: ${datapoint.last_name}
                    Email: ${datapoint.email} </li>`;
    });
    code += "</ul>";
    $(".mypanel").html(code);
  });
}

const b1 = document.getElementById("b1");
// b1.addEventListener("click", getData);
b1.addEventListener("click", () => {
  let user_id = document.getElementById("inputbox").value;
  $.getJSON(`http://nusbackendstub.herokuapp.com/user/by-uid?user_id=${user_id}`, (data) => {
    let code = "<ul>";
    data.forEach((datapoint) => {
      code += `<li> First Name: ${datapoint.first_name}
                    Last Name: ${datapoint.last_name}
                    Email: ${datapoint.email} </li>`;
    });
    code += "</ul>";
    $(".mypanel").html(code);
  });
});

// let code = "<ul>";
// users.forEach((user) => {
//   code += `<li> First Name: ${user.first_name} | Last Name: ${user.last_name} </li>`;
// });
// code += "</ul>";

// $(".mypanel").html(code);
