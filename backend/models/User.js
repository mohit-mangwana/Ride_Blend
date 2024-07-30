import mongoose from 'mongoose';

const TravelPreferenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  option: { type: String, required: true },
  icon: { type: String, required: false },
});

const VehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    bio: { type: String, default: "" },
    travelPreferences: {
      type: [
        {
          type: TravelPreferenceSchema,
          validate: {
            validator: function(arr) {
              return arr.every(pref => pref.option !== undefined);
            },
            message: "Please select at least one option for each preference category",
          },
        },
      ],
      validate: {
        validator: function(arr) {
          return arr.length > 0;
        },
        message: "At least one travel preference category is required",
      },
    },
    vehicles: [VehicleSchema],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export { UserModel };
