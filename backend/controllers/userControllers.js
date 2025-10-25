export const getUserProfile = async (req, res) => {
  res.json(req.user);
};
