const CategoryModel = require('./category.model');

module.exports.getCategory=(req, res) => {
   
    const categoryId = req.query.categoryId
    CategoryModel.find({ categoryId: categoryId })
        .then(result => {
            res.status(200).send({ message: "Success", data: result })
        }).catch(err => {
            res.status(400).send({ message: "Something went wrong", error: err })
        })
}


// **********************************Add Category*******************************************

module.exports.addCategory =  (req, res) => {
    const { productId } = req.body;
    const categoryId = uuidv4(); 
    WishListModel.create({ sellerId,categoryId, productId})
        .then(result => {
            res.status(201).send({ message: "Category added Successfully", result: "result" })
        })
        .catch(err => {
            res.status(400).send({ message: "Failed", error: err })
        })
}

//************************************Delete Category*************************************** */


module.exports.removeCategory = (req, res) => {
    const { categoryId } = req.body;

    WishListModel.findOneAndDelete({ categoryId : categoryId })
        .then(result => {
            res.status(200).send({ message: "Category removed Successfully" })
        })
        .catch(err => {
            res.status(400).send({ message: "Failed", error: err })
        })
}