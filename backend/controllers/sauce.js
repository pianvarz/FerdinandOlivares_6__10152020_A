const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => { // Creating the sauce
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      });
      sauce.save()
        .then(() => res.status(201).json({message: 'Sauce created !'}))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => { //Picking one specific sauce
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => { //See all the sauce
    Sauce.find()
    .then(sauces => res.status(201).json(sauces))
    .catch(error => res.status(400).json({error}))
};

exports.likeDislikeSauce = (req, res, next) => {  // Like and dislike sauce including removing liked/disliked tag
  Sauce.findOne({_id: req.params.id})
  .then(sauce => { 
    switch (req.body.like) { 
      case 1 : // When users likes the Sauce
      if (!sauce.usersLiked.includes(req.body.userId)) { 
         Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}, _id: req.params.id}) // Sends the userID to the usersLiked array
         .then(() => res.status(201).json({ message: 'Feedback received !' }))
         .catch(error => res.status(400).json({error})); 
       } 
     break;

     case -1 : // When users dislike sauce
     if (!sauce.usersDisliked.includes(req.body.userId)) {  // Similar logic above
      Sauce.updateOne({_id: req.params.id}, {$inc: {Dislikes: 1}, $push: {usersDisliked: req.body.userId}, _id: req.params.id})
       .then(() => res.status(201).json({message: 'Feedback received !'}))
       .catch(error => res.status(400).json({error}));
     }
     break;
     
     case 0 : 
     if (sauce.usersLiked.includes(req.body.userId)) {  // Function removing the like
      Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId},_id: req.params.id})
      // Removes the userId in the likedId array
      .then(()=> res.status(201).json({message: 'Feedback changed !'}))
      .catch(error => res.status(400).json({error}));
     } else if (sauce.usersDisliked.includes(req.body.userId)){ // Same function mentioned above 
      Sauce.updateOne({_id: req.params.id}, {$inc: {Dislikes: -1}, $pull: {usersDisliked: req.body.userId},_id: req.params.id})
               .then(()=> res.status(201).json({message: 'Feedback changed  !'}))
               .catch(error => res.status(400).json({error}));
     } 
    break;
 
   default:
     throw ("Error has occured, please try again later !") // Error is sent indicating unable to proceed
    }
           })
  .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => { // Modifying Sauce
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modified !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.deleteSauce = (req, res, next) => { // Deleting Sauce
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Sauce Removed !'}))
              .catch(error => res.status(400).json({ error }));
          });
        })
        .catch(error => res.status(500).json({ error }));
};
  