let res = confirm("欢迎来到我的页面，要进来看看吗？");
if(!res)
{
    alert("好吧，再见");
    open(location, '_self').close();
}

console.log("Welcome to console!");

let people = {
    name: "Jason",
    age: 18,
    gender: "boy",
    hobby: "swimming"
};

console.log(people);
console.log(people.name + " is a " + people.age.toString() + " years old " + people.gender + " who's hobby is " + people.hobby + ".");