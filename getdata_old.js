//syntax: $.getJSON(url, [data], [callback]);
//AJAX library
// const b1 = document.getElementById("b1");
// b1.addEventListener("click", getFromServer);

// console.log("Hello");

let a = 10;
let b = 5;

let c = a + b;
// c will be 15

let first = "Dixant";
let last = "Mittal";

let name = first + last; // DixantMittal

$(".mypanel").html("<br>");
$(".mypanel").append("Hello " + name + "<br>" + c);
$(".mypanel").append("<br>");

let age = 17;
while (age < 19) {
    if (age >= 18) {
        $(".mypanel").append("sup");
        $(".mypanel").append("<br>");
    } else {
        $(".mypanel").append("nop");
        $(".mypanel").append("<br>");
    }
    age++;
}


let names = ["a", "b", "c"];
$(".mypanel").append(names[1]);
$(".mypanel").append("<br>");

let details = {
    first: "first",
    last: "last"
};
$(".mypanel").append(details.first + "." + details.last);
$(".mypanel").append("<br>");

let users = [
    {
        first: "asdf",
        last: "tr"
    },
    {
        fist: "oij",
        last: "poj"
    }
]
$(".mypanel").append(users[0].first + "." + users[0].last);
$(".mypanel").append("<br>");
$(".mypanel").append(users[1].first + "." + users[1].last);
$(".mypanel").append("<br>");


let all = "";
names.forEach((data) => {
    all += " " + data;
});
$(".mypanel").append(all);
$(".mypanel").append("<br>");   

let code = "<ul>";
names.forEach((name) => {
    code += "<li>" + name + "</li>";
});
code += "</ul>";
$(".mypanel").append(code);
$(".mypanel").append("<br>");   