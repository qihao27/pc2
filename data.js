let users = [
  {
    first_name: "Dena",
    last_name: "Charle",
    email: "dcharle0@indiegogo.com",
    user_id: 1,
    phone: "98765433",
    plan_id: 1,
    signup_date: "2021-01-01T00:00:00.000Z",
  },
  {
    first_name: "Dynah",
    last_name: "Waiting",
    email: "dwaiting1@google.com.br",
    user_id: 2,
    phone: "98765434",
    plan_id: 1,
    signup_date: "2021-01-01T00:00:00.000Z",
  },
  {
    first_name: "Marc",
    last_name: "Conibeer",
    email: "mconibeer2@desdev.cn",
    user_id: 3,
    phone: "98765555",
    plan_id: 1,
    signup_date: "2021-01-01T00:00:00.000Z",
  },
];

function get_all_users() {
  return users;
}
function get_user_by_user_id(user_id) {
  for (i = 0; i < users.length; i++) {
    if (users[i].user_id == user_id) {
      return users[i];
    }
  }
}

function add_user(user) {
  users.push(user);
}

// -------- ACCOUNTS --------

let accounts = [
  {
    type: "saving",
    balance: 100,
    max_limit: 500,
    create_date: "2022-02-26",
    holder: "qwe",
    account_no: "1234567890",
  },
  {
    type: "saving",
    balance: 100000,
    max_limit: 1000000,
    create_date: "2022-02-27",
    holder: "qsdf sdfg",
    account_no: "1234567891",
  },
  {
    type: "business",
    balance: 1000093784,
    max_limit: 100000000000,
    create_date: "2022-02-28",
    holder: "hdg jvh",
    account_no: "1234567892",
  },
];

function get_all_accounts() {
  return accounts;
}

// when input account holder, return all accounts that this holder has (each AccHolder can have > 1 accounts )
function get_accs_by_holder(accHolder) {
  let accountArray = [];

  for (i = 0; i < accounts.length; i++) {
    if (accounts[i].holder == accHolder) {
      accountArray.push(accounts[i]);
    }
  }
  return accountArray;
}
function get_acc_by_accNo(accountNo) {
  for (i = 0; i < accounts.length; i++) {
    if (accounts[i].account_no.toString() == accountNo.toString()) {
      let account = accounts[i];
      return account;
    }
  }
}

function del_acc_by_accNo(accountNo) {
  for (i = 0; i < accounts.length; i++) {
    if (accounts[i].account_no == accountNo) {
      accounts.splice(i, 1); // splice(index, howMany) see w3schools documentation
    }
  }
}
// console.log(get_acc_by_accNum("1234567892"));

// add new account
function add_acc(account) {
  accounts.push(account);
}

// -------- TRANSACTIONS --------

let transactions = [
  {
    date: "2022-01-28",
    type: "account management",
    account_no: "1234567890",
    amount: 200,
  },
  {
    date: "2022-01-28",
    type: "investment",
    account_no: "1234567891",
    amount: 5000,
  },
  {
    date: "2022-01-28",
    type: "investment",
    account_no: "1234567892",
    amount: 150000,
  },
];

module.exports = {
  add_user,
  get_all_users,
  get_user_by_user_id,
  get_all_accounts,
  get_accs_by_holder,
  add_acc,
  // get_acc_by_accNum,
  del_acc_by_accNo,
};
