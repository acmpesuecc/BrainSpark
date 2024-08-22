import mongoose from "mongoose";

export interface IdeaDocument {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["new", "inProgress", "completed"],
    default: "new",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Idea =
  mongoose.models.Idea || mongoose.model<IdeaDocument>("Idea", ideaSchema);

export default Idea;
