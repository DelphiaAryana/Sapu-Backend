import fs from 'fs';
import Item from "../models/ItemModel.js";
import path from "path";
import { Op } from 'sequelize';


export const getItems = async(req, res)=>{
    try{
        const response = await Item.findAll();
        res.json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const searchItem = async (req, res) => {
    try {
      const searchQuery = req.query.search;
  
      if (!searchQuery) {
        return res.status(400).json({ msg: 'Search query is required' });
      }
  
      const items = await Item.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${searchQuery}%` } },
          ],
        },
      });
  
      res.json(items);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: 'Internal server error' });
    }
  };
  
export const getItemById = async (req, res)=>{
    try{
        const response = await Item.findOne({
            where:{
                id : req.params.id
            }
        });
        res.json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const saveItem = (req, res)=>{
    if(req.files === null) return res.status(400).json({msg: "No file Uploaded"});
    const name = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const description = req.body.description;
    const price = req.body.price;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: 
        "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Item.create({name: name, image: fileName, url: url, description: description, price: price});
            res.status(201).json({msg: "Item Created Successfuly"});
        } catch(error) {
            console.log(error.message);
        }
    })
}

export const updateItem = async(req, res)=>{
    const item = await Item.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!item) return res.status(404).json({msg: "No Data Found"});
    let fileName = "";
    if (req.files === null){
        fileName = item.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: 
            "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/${item.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, async(err)=>{
            if(err) return res.status(500).json({msg: err.message});
            
        })
    }
    const name = req.body.title;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const description = req.body.description;
    const price = req.body.price;

    try {
        await Item.update({name: name, image: fileName, url: url, description: description, price: price},{
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Item Uploaded Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteItem = async(req, res)=>{
    const item = await Item.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!item) return res.status(404).json({msg: "No Data Found"});
    try {
        const filepath = `./public/images/${item.image}`;
        fs.unlinkSync(filepath);
        await Item.destroy({
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Item Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}