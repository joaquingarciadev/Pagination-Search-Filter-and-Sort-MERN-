import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const categories = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Purple",
    "Orange",
    "Black",
];

const orderings = [
    "Newest",
    "Oldest",
    "A - Z",
    "Z - A",
    "Price Low to High",
    "Price High to Low",
];

function App() {
    const [searchParams, setSearchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams);

    const [products, setProducts] = useState([]);
    // Pagination
    const page = parseInt(searchParams.get("page") || 1);
    const limit = parseInt(searchParams.get("limit") || 10);
    const [pages, setPages] = useState(0);
    // Search
    const [search, setSearch] = useState("");
    // Filter
    const [category, setCategory] = useState(
        (params.category && params.category.split(",")) || []
    );
    const [price, setPrice] = useState({
        min: (params.price && params.price.split(",")[0]) || undefined,
        max: (params.price && params.price.split(",")[1]) || undefined,
    });
    // Sort
    const [sort, setSort] = useState(params.sort || "");

    const getProducts = async () => {
        let url = "http://localhost:3001/api/products/all";

        // console.log(Object.keys(params), Object.entries(params));

        if (Object.keys(params).length > 0) {
            url += "?";
            for (const [key, value] of Object.entries(params)) {
                url += key + "=" + value + "&";
            }
        }

        // console.log(params, url);

        const response = await fetch(url);

        const data = await response.json();
        setProducts(data.products);
        setPages(data.pages);
    };

    useEffect(() => {
        handleCategory();
        handlePrice();
        handleSort();
        getProducts();
    }, [page, category, price, sort]);

    useEffect(() => {
        if (params.page && page > 1) {
            delete params.page;
            setSearchParams(params);
        }
    }, [category, price]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search) {
            location.href = "/?search=" + search;
        }
    };

    const handleCategory = (e) => {
        if (category.length > 0) {
            params.category = category.toString();
            setSearchParams(params);
        } else {
            delete params.category;
            setSearchParams(params);
        }
    };

    const handlePrice = (e) => {
        if (price.min || price.max) {
            params.price = price.min + "," + price.max;
            setSearchParams(params);
        } else {
            delete params.price;
            setSearchParams(params);
        }
    };

    const handleSort = (e) => {
        if (sort) {
            params.sort = sort;
            setSearchParams(params);
        } else {
            delete params.sort;
            setSearchParams(params);
        }
    };

    return (
        <div className="App">
            {/* SIDEBAR */}
            <div className="sidebar">
                {/* SEARCH */}
                <div className="search">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>
                {/* FILTER */}
                <div className="filter">
                    {/* CATEGORY */}
                    <div className="filter-category">
                        <span>Category</span>
                        <br />
                        {categories.map((c) => (
                            <div key={c}>
                                <input
                                    type="checkbox"
                                    name={c}
                                    value={c}
                                    defaultChecked={
                                        category.includes(c) ? true : false
                                    }
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCategory([...category, e.target.value]);
                                        } else {
                                            setCategory(category.filter((c) => c !== e.target.value));
                                        }
                                    }}
                                />
                                <label htmlFor={c}> {c}</label>
                            </div>
                        ))}
                    </div>
                    {/* PRICE */}
                    <div className="filter-price">
                        <span>Price</span>
                        <br />
                        <input
                            type="number"
                            placeholder="Min"
                            value={price.min}
                            onChange={(e) => setPrice({ ...price, min: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={price.max}
                            onChange={(e) => setPrice({ ...price, max: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* MAIN */}
            <div className="main">
                {/* NAVBAR */}
                <div className="navbar">
                    {/* SORT */}
                    <div className="sort">
                        <span>Sort By </span>
                        <select onChange={(e) => setSort(e.target.value)} value={sort}>
                            {orderings.map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* PRODUCTS */}
                <div className="products">
                    {products.map((product) => (
                        <div className="product" key={product._id}>
                            <img src={product.image} alt={product.name} />
                            <div className="product-info">
                                <p>{product.name}</p>
                                <p>${product.price}</p>
                                <p>{product.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* PAGINATION */}
                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <a
                                onClick={() => {
                                    if (page > 1) {
                                        setSearchParams({ ...params, page: page - 1 });
                                    }
                                }}
                            >
                                Previous
                            </a>
                        </li>
                        <li className={"page-item" + (page == 1 ? " active" : "")}>
                            <a onClick={() => setSearchParams({ ...params, page: 1 })}>1</a>
                        </li>
                        {page > 1 && page < pages && (
                            <>
                                {" ... "}
                                <li className="page-item active">{page}</li>
                            </>
                        )}
                        {pages > 1 && (
                            <>
                                {" ... "}
                                <li className={"page-item" + (page == pages ? " active" : "")}>
                                    <a
                                        onClick={() => setSearchParams({ ...params, page: pages })}
                                    >
                                        {pages}
                                    </a>
                                </li>
                            </>
                        )}
                        <li className="page-item">
                            <a
                                onClick={() => {
                                    if (page < pages) {
                                        setSearchParams({ ...params, page: page + 1 });
                                    }
                                }}
                            >
                                Next
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default App;
