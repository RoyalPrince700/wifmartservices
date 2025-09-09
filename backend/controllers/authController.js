//backend/controllers/authController.js
export const googleCallback = (req, res) => {
  const { user, token } = req.user;
  res.json({ user, token });
};

export const getCurrentUser = (req, res) => {
  res.json({ user: req.user });
};