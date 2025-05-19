import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'
import Loader from '../components/loader'
import Message from '../components/Message'
import { listProductDetails } from '../actions/productActions'
import { createProductReview } from '../actions/reviewActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ReviewScreen = () => {
    const { id: productId } = useParams()
    const dispatch = useDispatch()

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const productDetails = useSelector((state) => state.productDetails)
    const { loading, error, product } = productDetails

    const productReviewCreate = useSelector((state) => state.productReviewCreate)
    const { success: successReview, error: errorReview } = productReviewCreate

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (successReview) {
            alert('Review submitted!')
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }

        dispatch(listProductDetails(productId))
    }, [dispatch, productId, successReview])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(productId, { rating, comment }))
    }

    return (
        <>
            <h2>Review Product</h2>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
                    <h4>{product.name}</h4>
                    {errorReview && <Alert variant='danger'>{errorReview}</Alert>}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='rating'>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                as='select'
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                required
                            >
                                <option value=''>Select...</option>
                                <option value='1'>1 - Poor</option>
                                <option value='2'>2 - Fair</option>
                                <option value='3'>3 - Good</option>
                                <option value='4'>4 - Very Good</option>
                                <option value='5'>5 - Excellent</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='comment' className='mt-3'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as='textarea'
                                row='5'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></Form.Control>
                        </Form.Group>

                        <Button type='submit' variant='primary' className='mt-3'>
                            Submit
                        </Button>
                    </Form>
                </>
            )}
        </>
    )
}

export default ReviewScreen
