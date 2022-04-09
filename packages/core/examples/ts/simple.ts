import mongoose from "mongoose";
mongoose.Promise = global.Promise;
interface TaskField {
  _id: string,
  title: string,
  content: string
}

type TaskDocument = mongoose.Document<mongoose.Types.ObjectId> & TaskField

interface TaskModel extends mongoose.Model<TaskDocument> {}

const TaskSchema = new mongoose.Schema<TaskDocument, TaskModel>({
  title: String,
  content: String,
});

const Task = mongoose.model("Task", TaskSchema);

// comment
const insertTasks = async () => {
  await Promise.all(
    // @ts-expect-error
    [...Array(10)].map<any[]>((_, index) => {
      return Task.create([
        {
          title: `title_${index}` as string,
          content: `content_${index}` as string,
        },
      ]);
    })
  );
};

mongoose
  .connect("mongodb://localhost:27017/ts")
  .catch((err) => console.error(err));
const db = mongoose.connection;

Promise.resolve(() => db.once("open", () => {}))
  .then(() => console.log("connection opened"))
  .then(() => insertTasks())
  .then(() => db.close())
  .then(() => console.log("connection closed"));
