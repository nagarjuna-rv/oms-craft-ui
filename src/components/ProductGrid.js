
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Table, TableHead, TableContainer, TableRow, TableCell, Paper, TableBody } from '@mui/material';
import { getPrice, getProducts, submitOrder } from '../api/api';

function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [cartProducts, setCartProducts] = useState([]);
    const [showSubmit, setShowSubmit] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const productList = await getProducts();
                setProducts(productList);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
        fetchProducts();
    }, []);
    const submitCart = async () => {
        await submitOrder(cartProducts);
    }
    const handleGetPrice = async (productId, quantity) => {
        const price = await getPrice(productId, quantity);
        setCartProducts((prevProducts) => {
            const prodIndex = prevProducts.findIndex((prod) => prod.productId === productId);
            const updatedItems = [...prevProducts];
            updatedItems[prodIndex] = { ...updatedItems[prodIndex], price: price.totalPrice };
            return updatedItems;
        });
        console.log(`Get Price for product ID: ${productId}`);
    };
    const handleAddToCart = (productId) => {
        setCartProducts((prevProducts) => {
            const prodIndex = prevProducts.findIndex((prod) => prod.productId === productId);

            if (prodIndex === -1) {
                return [...prevProducts, { productId: productId, quantity: 1 }];
            } else {
                const updatedItems = [...prevProducts];
                updatedItems[prodIndex] = { ...updatedItems[prodIndex], quantity: updatedItems[prodIndex].quantity + 1 };
                return updatedItems;
            }
        });
        !showSubmit && setShowSubmit(true);
        console.log(cartProducts);
    };

    const renderCart = () => {
        return <Grid container direction={'column'}>
            {showSubmit && <Button variant='contained' onClick={submitCart}>Submit Order</Button>}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product Id</TableCell>
                            <TableCell align="right">Total Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartProducts.map((cart) => (
                            <TableRow
                                key={cart.productId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right">{cart.productId}</TableCell>
                                <TableCell align="right">{cart.quantity}</TableCell>
                                <TableCell align="right">
                                    {cart.price && <Typography variant="h5">Total Price ₹:{cart.price}</Typography>}
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleGetPrice(cart.productId, cart.quantity)}
                                    >
                                        Get Price
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>;
    }
    return (
        <div>
            <h2>Product Grid</h2>
            <Grid width={'100%'} container direction={'row'}>
                <Grid item minWidth={'35%'}>
                    <Grid container flexDirection={'column'}>
                        {products.map((product) => (
                            <Grid item key={product.productId} >
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">{product.name}</Typography>
                                        <Typography variant="body2">{product.description}</Typography>
                                        <Typography variant="body2">Price per Unit: {product.price}</Typography>
                                        <Button
                                            color="primary"
                                            onClick={() => handleAddToCart(product.productId)}
                                        >
                                            + Add to Cart
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item marginLeft={'15%'}>
                    {renderCart()}
                </Grid>
            </Grid>

        </div>
    );
}

export default ProductGrid;
