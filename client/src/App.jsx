import { useEffect } from "react";
import { useState } from "react";

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
  const [products, setProducts] = useState([]);
  // Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [limit, setLimit] = useState(10);
  // Search
  const [search, setSearch] = useState("");
  // Filter
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState({ min: 0, max: 0 });
  // Sort
  const [sort, setSort] = useState("");

  const getProducts = async () => {
    const response = await fetch(
      "http://localhost:3001/api/products/all"
      + "?page=" + page
      + "&limit=" + limit
      + "&search=" + search
      + "&category=" + category.toString()
      + "&price=" + price.min + "," + price.max
      + "&sort=" + sort
    );

    const data = await response.json();
    setProducts(data.products);
    setPages(data.pages);
  };

  useEffect(() => {
    getProducts();
  }, [page, category, price, sort]);

  useEffect(() => {
    setPage(1);
  }, [category, price]);

  return (
    <div className="App">
      {/* SIDEBAR */}
      <div className="sidebar">
        {/* SEARCH */}
        <div className="search">
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
            <button onClick={() => { getProducts(); setPage(1); }}>Search</button>
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
                <input type="checkbox" name={c} value={c} onChange={(e) => {
                  if (e.target.checked) {
                    setCategory([...category, e.target.value]);
                  } else {
                    setCategory(category.filter((c) => c !== e.target.value));
                  }
                }} />
                <label htmlFor={c}> {c}</label>
              </div>
            ))}
          </div>
          {/* PRICE */}
          <div className="filter-price">
            <span>Price</span>
            <br />
            <input type="number" placeholder="Min" onChange={(e) => setPrice({ ...price, min: e.target.value })} />
            <input type="number" placeholder="Max" onChange={(e) => setPrice({ ...price, max: e.target.value })} />
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
            <select onChange={(e) => setSort(e.target.value)}>
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
            <div className="product">
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
                  if (page != 1) setPage(page - 1);
                }}
              >
                Previous
              </a>
            </li>
            <li className={"page-item" + (page == 1 ? " active" : "")}>
              <a onClick={() => setPage(1)}>1</a>
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
                  <a onClick={() => setPage(pages)}>{pages}</a>
                </li>
              </>
            )}
            <li className="page-item">
              <a
                onClick={() => {
                  if (page != pages) setPage(page + 1);
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
