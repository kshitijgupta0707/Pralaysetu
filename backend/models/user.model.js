  import mongoose from "mongoose";

  const userSchema = mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
      password: { type: String, required: true, minLength: 6 },
      registerAs: {
        type: String,
        enum: ["Admin", "NGO" , "Government", "None"],
        default: "User",
        
      },
      registrationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: function () {
          return this.registerAs === "NGO" || this.registerAs === "Government" ? "pending" : "approved";
        }
      },
      isVerified: {
        type: Boolean,
        default: function () {
          return this.registerAs === "NGO" || this.registerAs === "Government" ? false : true;
        }
      },
      //only for Government and ngo verification
      governmentDocument: {
        type: String,
        default: ""
      },
      workAsResponder: {
        type: Boolean,
        default: false
      },
      resetPasswordToken: String,
      resetPasswordExpires: Date,
      ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NGO",
      },
    },
    { timestamps: true }
  );

  const User = mongoose.model("User", userSchema);
  export { User };
    