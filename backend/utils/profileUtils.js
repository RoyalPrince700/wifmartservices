// utils/profileUtils.js
export const calculateProfileCompletion = (user) => {
  const fields = [
    user.name,
    user.phone,
    user.whatsapp,
    user.skills?.length > 0,
    user.profile_image,
    user.location_state,
    user.portfolio_link,
    user.cac_number,
    user.physical_address,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};