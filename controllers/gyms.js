import Gym from "../models/gym.js";

export const index = async (req, res) => {
  console.log("Wdo i hit that route");
  const gyms = await Gym.find({});
  res.send({ gyms });
};

export const createGym = async (req, res, next) => {
  const gym = new Gym(req.body.gym);
  gym.author = req.user._id;
  await gym.save();
  res.status(200).send(gym._id);
};

export const showGym = async (req, res) => {
  const gym = await Gym.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  res.send({ gym });
};

export const updateGym = async (req, res, next) => {
  const { id } = req.params;
  const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
  return res.status(200).send(id);
};

export const deleteGym = async (req, res) => {
  const gym = await Gym.deleteOne({ _id: req.params.id });
  if (!gym) {
    res.status(404).send("gym does not exist");
  }
  res.status(200).send("gym deleted successfully");
};
