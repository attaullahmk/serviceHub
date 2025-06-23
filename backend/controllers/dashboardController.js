const Service = require('../models/service');
const ServiceProvider = require('../models/service');
const Booking = require('../models/booking');
const Review = require('../models/review');
// Helper function to calculate metrics
const calculateMetrics = (services) => {
  let totalValue = 0;
  let totalBookings = 0;
  let totalReviews = 0;
  let totalViews = 0;
  let totalRating = 0;
  let serviceCount = services.length;
  let categories = new Set();
  
  services.forEach(service => {
    totalValue += service.price || 0;
    totalBookings += service.bookings?.length || 0;
    totalReviews += service.totalReviews || 0;
    totalViews += service.views || 0;
    totalRating += service.averageRating || 0;
    categories.add(service.category);
  });

  const averageRating = serviceCount > 0 ? totalRating / serviceCount : 0;
  
  // Calculate engagement score (custom formula)
  const engagementScore = (
    (averageRating * 2) + 
    (totalReviews * 0.5) + 
    (totalViews * 0.1) + 
    (totalBookings * 0.8)
  ).toFixed(1);

  return {
    totalValue,
    totalBookings,
    totalReviews,
    totalViews,
    averageRating,
    engagementScore,
    categoryCount: categories.size
  };
};

// Get dashboard data for service provider
module.exports.getProviderDashboard = async (req, res) => {
  try {
    const providerId = req.params.userId;
 console.log('Provider ID:', providerId);
    // Get provider details
    const provider = await ServiceProvider.findOne({ user: providerId })
      .populate('user', 'name email phone address');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Get all services for this provider with populated bookings
    const services = await Service.find({ provider: providerId })
      .populate({
        path: 'bookings',
        select: 'status'
      });

    // Calculate all metrics
    const metrics = calculateMetrics(services);


 // Get completed bookings count (using provider ID)
    const completedBookings = await Booking.countDocuments({
      provider: providerId,
      status: 'completed'
    });


    // Calculate potential earnings (25% more than current value)
    const potentialEarnings = metrics.totalValue * 1.25;
    const earningsPercentage = metrics.totalValue > 0 
      ? (metrics.totalValue / potentialEarnings) * 100 
      : 0;

    // Prepare response data
    const dashboardData = {
      providerDetails: {
        name: provider.user.name,
        email: provider.user.email,
        phone: provider.user.phone,
        address: provider.user.address,
        availability: provider.availability,
        services: provider.services
      },
      ...metrics,
      completedBookings,
      potentialEarnings,
      earningsPercentage
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};