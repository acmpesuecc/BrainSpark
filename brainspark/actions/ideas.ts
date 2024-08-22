"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Idea, { IdeaDocument } from "@/models/Idea";

export async function getIdeas(): Promise<IdeaDocument[]> {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("You must be logged in to view ideas");
  }
  const ideas = await Idea.find({ user: session.user.email }).sort({
    createdAt: -1,
  });
  return JSON.parse(JSON.stringify(ideas));
}

export async function addIdea(formData: FormData) {
  await connectDB();
  const session = await getServerSession(authOptions);
  console.log("Session", session);
  if (!session?.user?.email) {
    throw new Error("You must be logged in to add an idea");
  }
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const newIdea = new Idea({
    user: session.user.email,
    title,
    description,
  });
  await newIdea.save();
  revalidatePath("/");
}

export async function updateIdeaStatus(formData: FormData) {
  await connectDB();
  const session = await getServerSession();
  if (!session?.user?.email) {
    throw new Error("You must be logged in to update an idea");
  }
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await Idea.findOneAndUpdate(
    { _id: id, user: session.user.email },
    { status }
  );
  revalidatePath("/");
}

export async function updateIdea(formData: FormData) {
  await connectDB();
  const session = await getServerSession();
  if (!session?.user?.email) {
    throw new Error("You must be logged in to update an idea");
  }
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  await Idea.findOneAndUpdate(
    { _id: id, user: session.user.email },
    { title, description }
  );
  revalidatePath("/");
}
