var Images = require("./DBmodels/images");
var User = require("./DBmodels/user");
var Comment = require("./DBmodels/comment");

require("dotenv").config();
var mongoose = require("mongoose");

module.exports = function seedDB(){ 
	initModel(Images,{name: 'images'},{name: "RyanDB"});
	initModel(User,{name: 'users'},{ username: 'RyanDB' });
	//initModel(Comment,{name: 'comments'},{text: 'RyanDB'});
	
	function initModel(dbModel,dbName, dummyData){
		//check if collection already exists
		const mongoURI = process.env.DB_URI;
		// notice the mongoose.createConnection instead of mongoose.connect
		const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true });
		conn.on('open', function () {
			conn.db.listCollections(dbName)
			  .next(function(err,collinfo){
				  if (collinfo) {
						//The collection exists
					console.log(dbModel.collection.collectionName + " collection already exists");
					return;
				  }
					createImagesCollection();
					conn.close();
			  });
		});

		function createImagesCollection(){
			//image:"https://cti.site.live/img/ZhCjU-3DL1I-cPkK9-q98hZ-VappW.jpeg"
			dbModel.create(
				dummyData, function(err, images){
					if(err){
						console.log(err);
					}else{
							console.log("NEWLY CREATED IMAGES COLLECTION: ");
							console.log(images);
							//delete init data
							Images.deleteOne(dummyData, function (err) {if (err) return handleError(err); console.log("removed init element in collection");});
					}
				});
		}
	}
};