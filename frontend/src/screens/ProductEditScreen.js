import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import  axios  from 'axios';
function ProductEditScreen() {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.userLogin);
    const productDetails = useSelector(state => state.productDetails);
    const { error, loading, product } = productDetails;

    const productUpdate = useSelector(state => state.productUpdate);
    const { 
        error: errorUpdate, 
        loading: loadingUpdate, 
        success: successUpdate 
    } = productUpdate;

    useEffect(() => {
      if (successUpdate) {
          dispatch({ type: PRODUCT_UPDATE_RESET }); 
          navigate('/admin/productlist');
      } else {

      if (!product.name || product._id !== Number(productId)) {
          dispatch(listProductDetails(productId))
      } else {
          setName(product.name)
          setPrice(product.price)
          setImage(product.image)
          setBrand(product.brand)
          setCategory(product.category)
          setCountInStock(product.countInStock)
          setDescription(product.description)

      }
    }

  }, [dispatch, product,productId,successUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }));
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('product_id', productId);

        setUploading(true);

        try {
            const config = {
                headers: {
                    
                    Authorization:   `Bearer ${userInfo.token}`
                }
            };

            const { data } = await axios.post('/api/products/upload/', formData, config);
            setImage(data.image);
            setUploading(false);
        } catch (error) {
            setUploading(false);
        }
    };

    return (
        <div>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='my-3'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='price' className='my-3'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='image' className='my-3'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter image URL'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                            <Form.Control type="file"  onChange={uploadFileHandler} />

                            {uploading && <Loader />}
                        </Form.Group>

                        <Form.Group controlId='brand' className='my-3'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter brand'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='countInStock' className='my-3'>
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter stock quantity'
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='category' className='my-3'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter category'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='description' className='my-3'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        <Button 
                            type='submit' 
                            variant='primary' 
                            className='my-3'
                        >
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </div>
    );
}

export default ProductEditScreen;