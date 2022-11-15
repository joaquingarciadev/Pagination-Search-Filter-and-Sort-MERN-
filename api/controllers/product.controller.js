const Product = require("../models/product.model");

const addProduct = async (req, res) => {
    // add a set of products
    const products = req.body;
    const productsSaved = await Product.insertMany(products);
    res.json(productsSaved);
};
const getProducts = async (req, res) => {
    const categories = [
        "Red",
        "Blue",
        "Green",
        "Yellow",
        "Purple",
        "Orange",
        "Black",
        "White",
    ];
    const orderings = [
        "Newest",
        "Oldest",
        "A - Z",
        "Z - A",
        "Price Low to High",
        "Price High to Low",
    ];
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Search
    const search = req.query.search || "";
    // Filter
    let category = req.query.category.length > 0 ? req.query.category.split(",") : categories;
    let price = req.query.price.length > 0 ? req.query.price.split(",") : [0, 100000];
    let minPrice = parseInt(price[0]) || 0;
    let maxPrice = parseInt(price[1]) || 100000;
    // Sort
    const sort = req.query.sort || "";
    const sortObject = {};
    if (sort === "Newest") {
        sortObject.createdAt = -1;
    } else if (sort === "Oldest") {
        sortObject.createdAt = 1;
    } else if (sort === "A - Z") {
        sortObject.name = 1;
    } else if (sort === "Z - A") {
        sortObject.name = -1;
    } else if (sort === "Price Low to High") {
        sortObject.price = 1;
    } else if (sort === "Price High to Low") {
        sortObject.price = -1;
    }

    const products = await Product.find({
        name: { $regex: search, $options: "i" },
    })
        .where("category")
        .in([...category])
        .where("price")
        .gte(minPrice)
        .lte(maxPrice)
        .sort(sortObject)
        .skip(skip)
        .limit(limit);

    const total = await Product.countDocuments({
        name: { $regex: search, $options: "i" },
    })
        .where("category")
        .in([...category])
        .where("price")
        .gte(minPrice)
        .lte(maxPrice);

    const pages = Math.ceil(total / limit);

    res.json({ products, page, pages });
};

module.exports = {
    addProduct,
    getProducts,
};
