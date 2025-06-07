import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/loader";
import Message from "../components/Message";

function SearchScreen() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/products/products_search/?search=${keyword}`
        );
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  return (
    <div>
      <h1>Search Results for "{keyword}"</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products.length === 0 ? (
        <Message>No products found</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default SearchScreen;
