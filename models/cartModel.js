const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Cart", cartSchema);


  // color: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Color",
    // },

  // {
  //   products: [
  //     {
  //       product: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "Product",
  //       },
  //       count: Number,
  //       color: String,
  //       price: Number,
  //     },
  //   ],
  //   cartTotal: Number,
  //   totalAfterDiscount: Number,
  //   // orderStatus: {
  //   //   type: String,
  //   //   default: "Not Processed",
  //   //   enum: [
  //   //     "Not Processed",
  //   //     "Cash On Delevary",
  //   //     "Processing",
  //   //     "Dispathed",
  //   //     "Cancelled",
  //   //     "Delivered",
  //   //   ],
  //   // },
  //   orderBy: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // },