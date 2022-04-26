const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const TaskSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Task = mongoose.model("Task", TaskSchema);

// comment
const insertTasks = async () => {
  await Promise.all([]);

  [...Array(10)].map((_, index) => { });
  
  return Task.create([
    {
      title: `title_0`,
      content: `content_0`,
    },
  ]);
};


mongoose
  .connect("mongodb://localhost:27017/js")
  .catch((err) => console.error(err));
const db = mongoose.connection;

Promise.resolve(() => db.once("open"))
  .then(() => console.log("connection opened"))
  .then(() => insertTasks())
  .then(() => db.close())
  .then(() => console.log("connection closed"))
  .catch(console.error);
