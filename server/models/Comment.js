import mangoose from "mongoose";

const commentSchema = new mangoose.Schema(
  {
    blog: {
      type: mangoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    name: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mangoose.model("Comment", commentSchema);

export default Comment;
