import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
import Gym from "../models/gym.js";
import cloudinary from "../cloudinary/index.js";

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

export const index = async (req, res) => {
  console.log("Wdo i hit that route");
  const gyms = await Gym.find({});
  res.send({ gyms });
};

export const createGym = async (req, res, next) => {
  const geoData = await geoCoder
    .forwardGeocode({
      query: req.body.gym.location,
      limit: 1
    })
    .send();
  console.log("creating the gym");
  const gym = new Gym(req.body.gym);
  gym.geometry = geoData.body.features[0].geometry;
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
  const newImgs = req.body.gym.images;
  const { deletedImages } = req.body;
  deletedImages.forEach((element) => {
    console.log(element);
    cloudinary.uploader.destroy(element);
  });
  const oldGym = await Gym.findById(id);
  const foundimgs = oldGym.images.filter((img) => !deletedImages.includes(img.filename));
  const imgs = [...newImgs, ...foundimgs];
  const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym, images: imgs });
  return res.status(200).send(id);
};

export const deleteGym = async (req, res) => {
  const gym = await Gym.deleteOne({ _id: req.params.id });
  if (!gym) {
    res.status(404).send("gym does not exist");
  }
  res.status(200).send("gym deleted successfully");
};
