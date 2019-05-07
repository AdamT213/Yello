const { ObjectId } = require("mongodb");

const first_id = ObjectId();
const second_id = ObjectId();
const third_id = ObjectId();
const fourth_id = ObjectId();

exports.boards = [
  {
    _id: "91191",
    title: "Eat Dinner and go to bed",
    deadline: new Date("May 8 , 2019 03:24:00")
  },
  {
    _id: second_id,
    title: "Get life figured out",
    deadline: new Date("May 20 , 2020 03:28:00")
  }
];

exports.lists = [
  {
    _id: third_id,
    title: "Things to do"
  },
  {
    _id: fourth_id,
    title: "Doing"
  }
];

exports.cards = [
  {
    title: "Eat Potatoes",
    List_id: third_id,
    checklist: [
      {
        description: "make potatoes",
        status: false
      },
      {
        description: "acquire utensils",
        status: false
      }
    ]
  },
  {
    title: "Eat Meat",
    List_id: third_id,
    checklist: [
      {
        description: "prepare meat",
        status: true
      },
      {
        description: "consume meat",
        status: false
      }
    ]
  },
  {
    title: "Go to bed",
    List_id: third_id,
    checklist: [
      {
        description: "brush teeth",
        status: true
      },
      {
        description: "remove clothing",
        status: false
      }
    ]
  }
];
