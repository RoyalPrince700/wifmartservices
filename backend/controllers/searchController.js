import User from '../models/User.js';

export const searchProviders = async (req, res, next) => {
  try {
    console.log('Search query received:', req.query); // Debug log
    const { q } = req.query;
    const query = q
      ? {
          $or: [
            { skills: { $in: [new RegExp(q, 'i')] } },
            { name: { $regex: q, $options: 'i' } },
          ],
        }
      : {};
    const providers = await User.find(query).select(
      'name profile_image skills location_state isVerifiedBadge verification_status'
    );
    console.log('Found providers:', providers); // Debug log (show full provider objects)
    res.json(providers);
  } catch (error) {
    console.error('Search error:', error); // Debug log
    next(error);
  }
};