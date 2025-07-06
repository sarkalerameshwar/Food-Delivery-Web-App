import foodModel from '../models/food.model.js';
import fs from 'fs';

const addFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image file is required' });
  }

  const image_filename = req.file.filename;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename
  });

  try { 
    await food.save();
    res.json({ success: true, message: 'Food Added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const listFood = async (req, res)=>{
    try{
      let food = await foodModel.find({});
      res.status(200).json({success:true, data: food})

    }catch(err){
      console.error(err);
      res.status(400).json({success:false, message:'Error'})
    }
}

const removeFood = async (req, res)=>{
  try{
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`,()=>{})

    await foodModel.findByIdAndDelete(req.body.id);
    res.status(200).json({success : true, message:"Food Deleted"})

  }catch(err){
    console.log(err);
    res.status(400).json({success:false, message:'Error'})
  }
}


export { addFood, listFood, removeFood };
