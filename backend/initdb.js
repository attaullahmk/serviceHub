const mongoose = require("mongoose");
const Service = require("./models/service"); // Adjust the path to your Service model file
const connectDB = require("./config/db"); // Import the database connection function

// Connect to the database
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    seedServices()
      .then(() => {
        console.log("Seeding completed");
        mongoose.connection.close(); // Close the connection after seeding
      })
      .catch((err) => {
        console.error("Seeding failed:", err);
        mongoose.connection.close(); // Close the connection on error
      });
  })
  .catch((err) => console.error("Database connection error:", err));

// Seed function to insert fake data
async function seedServices() {
  const fakeServices = [
    {
      title: "House Cleaning",
      description: "Professional house cleaning services for your home.",
      category: "Cleaning",
      price: 100,
      provider: new mongoose.Types.ObjectId(), // Replace with a valid service provider ID
      ratings: 4.5,
      reviews: [
        {
          userId: new mongoose.Types.ObjectId(), // Replace with a valid user ID
          comment: "Amazing service!",
          rating: 5,
        },
      ],
      availability: "available",
      imageGallery: [
        "https://media.istockphoto.com/id/1088254968/photo/investment-in-it-start-ups.jpg?s=612x612&w=0&k=20&c=je8AXPnwwy8E5TVgrtdkH1S6lkJhkCM12h-047WNSjQ=",
        "https://media.istockphoto.com/id/1359416837/photo/theyre-all-about-directing-their-ideas-head-on-towards-success.jpg?s=612x612&w=0&k=20&c=oUXfBWNi2JZOzlOiaoAAQyVyTWPr2wlQ4dm53edluRM=",
      ],
    },
    {
      title: "Plumbing Services",
      description: "Expert plumbing solutions for all your needs.",
      category: "Plumbing",
      price: 200,
      provider: new mongoose.Types.ObjectId(),
      ratings: 4.0,
      reviews: [
        {
          userId: new mongoose.Types.ObjectId(),
          comment: "Quick and efficient.",
          rating: 4,
        },
      ],
      availability: "available",
      imageGallery: [
        "https://media.istockphoto.com/id/1088254968/photo/investment-in-it-start-ups.jpg?s=612x612&w=0&k=20&c=je8AXPnwwy8E5TVgrtdkH1S6lkJhkCM12h-047WNSjQ=",
        "https://media.istockphoto.com/id/1088254968/photo/investment-in-it-start-ups.jpg?s=612x612&w=0&k=20&c=je8AXPnwwy8E5TVgrtdkH1S6lkJhkCM12h-047WNSjQ=",
      ],
    },
    {
      title: "Electrical Repairs",
      description: "Skilled electricians to fix your electrical issues.",
      category: "Electrical",
      price: 150,
      provider: new mongoose.Types.ObjectId(),
      ratings: 4.8,
      reviews: [
        {
          userId: new mongoose.Types.ObjectId(),
          comment: "Very professional service.",
          rating: 5,
        },
      ],
      availability: "available",
      imageGallery: [
        "https://www.istockphoto.com/photo/business-team-working-on-a-computer-in-the-office-gm1851607395-551962664",
        "https://images.unsplash.com/photo-1520359319979-f360d010d777?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlua3xlbnwwfHwwfHx8MA%3D%3D",
      ],
    },
    // Add 7 more fake services similarly
  ];

  await Service.insertMany(fakeServices);
  console.log("Fake services have been added to the database.");
}
