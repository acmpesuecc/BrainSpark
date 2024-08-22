import mongoose, { Schema, model } from "mongoose";

export interface IdeaDocument {
  _id: string;
  user: string;
  title: string;
  description: string;
  status: "new" | "inProgress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const ideaSchema = new Schema<IdeaDocument>({
  user: {
    type: String,
    required: true,
  },
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

const Idea = mongoose.models?.Idea || model<IdeaDocument>("Idea", ideaSchema);

export default Idea;
