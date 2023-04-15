const student = [
  {
    name: "Magan",
    age: 23,
    gender: "Male",
  },
  {
    name: "Rajesh",
    age: 25,
    gender: "Male",
  },
];

const user = [];

for (var i = 0; i < student.length; i++) {
  user.push(student[i].name);
}
console.log(user);
