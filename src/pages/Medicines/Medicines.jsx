// src/pages/Medicines/Medicines.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  Badge,
  IconButton,
  Snackbar,
  Alert,
  Drawer,
  Tabs,
  Tab
} from '@mui/material';
import NavBar from '../../components/NavBar/NavBar';
import PageHeader from '../../components/PageHeader/PageHeader';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CloseIcon from '@mui/icons-material/Close';

import { useCart } from '../../context/CartContext';
import { medicines, categories } from '../../data/medicineData';

// Use a placeholder image URL for the header
const medicineHeaderImage = "https://placehold.co/1200x500?text=Online+Medicines";

const MedicineProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock));
  };

  const handleDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {product.bestSeller && (
          <Chip
            label="Best Seller"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 1
            }}
          />
        )}
        {discount > 0 && (
          <Chip
            label={`${discount}% OFF`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1
            }}
          />
        )}
        <CardMedia
          component="img"
          height="180"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'contain', p: 2, bgcolor: 'rgba(0,0,0,0.02)' }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pt: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {product.category}
        </Typography>
        
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          {product.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.generic}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} readOnly size="small" precision={0.1} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews})
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            ₹{product.discountPrice}
          </Typography>
          {discount > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              ₹{product.price}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}>
          <Chip 
            icon={product.prescription ? <VerifiedIcon /> : null} 
            label={product.prescription ? "Prescription Required" : "No Prescription Needed"} 
            size="small"
            color={product.prescription ? "info" : "success"}
            variant="outlined"
          />
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleDecrement}
              disabled={quantity <= 1}
              sx={{ minWidth: '40px', p: 0 }}
            >
              <RemoveIcon fontSize="small" />
            </Button>
            
            <Typography sx={{ mx: 2 }}>{quantity}</Typography>
            
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleIncrement}
              disabled={quantity >= product.stock}
              sx={{ minWidth: '40px', p: 0 }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Box>
          
          <Button 
            variant="contained" 
            fullWidth
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

const ShoppingCart = ({ open, onClose }) => {
  const { cart, totalAmount, credits, removeFromCart, updateQuantity, clearCart, checkout } = useCart();
  const [checkoutMessage, setCheckoutMessage] = useState(null);

  const handleCheckout = () => {
    const result = checkout();
    setCheckoutMessage(result);
    
    if (result.success) {
      // Clear message after 3 seconds
      setTimeout(() => {
        setCheckoutMessage(null);
        onClose();
      }, 3000);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 3
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Shopping Cart</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {checkoutMessage && (
        <Alert 
          severity={checkoutMessage.success ? "success" : "error"}
          sx={{ mb: 3 }}
        >
          {checkoutMessage.message}
        </Alert>
      )}
      
      <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
        <Typography variant="h6">Available Credits</Typography>
        <Typography variant="h4">₹{credits.toLocaleString()}</Typography>
      </Box>
      
      {cart.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6">Your cart is empty</Typography>
          <Typography variant="body2" color="text.secondary">
            Add medicines to your cart to see them here
          </Typography>
          <Button variant="outlined" sx={{ mt: 3 }} onClick={onClose}>
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <List sx={{ mb: 3 }}>
            {cart.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem 
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
                      <CloseIcon />
                    </IconButton>
                  }
                  sx={{ px: 0 }}
                >
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Box 
                      component="img" 
                      src={item.image} 
                      alt={item.name}
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        objectFit: 'contain',
                        mr: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1
                      }}
                    />
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" noWrap>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.generic}</Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          sx={{ minWidth: '30px', height: '30px', p: 0 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </Button>
                        
                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                        
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          sx={{ minWidth: '30px', height: '30px', p: 0 }}
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                        
                        <Box sx={{ flexGrow: 1 }} />
                        
                        <Typography variant="body1" fontWeight="bold">
                          ₹{(item.discountPrice * item.quantity).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Order Summary</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography>Subtotal</Typography>
              <Typography>₹{totalAmount.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography>Delivery</Typography>
              <Typography>Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">₹{totalAmount.toLocaleString()}</Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={clearCart}
            >
              Clear Cart
            </Button>
            <Button 
              variant="contained" 
              fullWidth
              onClick={handleCheckout}
              disabled={totalAmount > credits}
            >
              Checkout
            </Button>
          </Box>
          
          {totalAmount > credits && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              Insufficient credits for this purchase
            </Typography>
          )}
        </>
      )}
    </Drawer>
  );
};

const Medicines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Medicines');
  const [cartOpen, setCartOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '' });
  const { addToCart, totalItems } = useCart();
  
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };
  
  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    setNotification({ open: true, message: `${quantity} ${product.name} added to cart` });
  };
  
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Filter medicines based on search term and category
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = 
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.generic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Medicines' || medicine.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <NavBar />
      <PageHeader 
        title="Online Medicines" 
        subtitle="Order prescription and OTC medicines online with fast, reliable delivery to your doorstep."
        image={medicineHeaderImage}
      />
      
      <Container maxWidth="xl" sx={{ mb: 8 }}>
        {/* Search and Cart */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search medicines, generics, categories..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
            size="small"
          />
          
          <Badge badgeContent={totalItems} color="error">
            <Button 
              variant="outlined"
              startIcon={<ShoppingCartIcon />}
              onClick={() => setCartOpen(true)}
            >
              Cart
            </Button>
          </Badge>
        </Box>
        
        {/* Categories */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mb: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 'auto',
                px: 2,
              }
            }}
          >
            {categories.map((category) => (
              <Tab key={category} value={category} label={category} />
            ))}
          </Tabs>
        </Box>
        
        {/* Promotional Banner */}
        <Box 
          sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: 2, 
            bgcolor: 'primary.light',
            color: 'white',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              FREE Delivery on All Medicine Orders
            </Typography>
            <Typography variant="body1">
              Use your credits to purchase medicines with convenient home delivery
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Chip 
                icon={<LocalOfferIcon />} 
                label="Special Discounts" 
                color="secondary" 
              />
              <Chip 
                icon={<LocalShippingIcon />} 
                label="Fast Delivery" 
                color="secondary" 
              />
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => window.scrollTo({ top: document.getElementById('medicineGrid').offsetTop - 100, behavior: 'smooth' })}
          >
            Shop Now
          </Button>
        </Box>
        
        {/* Medicine Grid */}
        <Typography 
          variant="h5" 
          sx={{ mb: 3, fontWeight: 600 }}
          id="medicineGrid"
        >
          {selectedCategory} ({filteredMedicines.length} products)
        </Typography>
        
        <Grid container spacing={3}>
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={medicine.id}>
                <MedicineProductCard 
                  product={medicine} 
                  onAddToCart={handleAddToCart} 
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No medicines match your search criteria.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search terms or category selection.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
      
      {/* Shopping Cart Drawer */}
      <ShoppingCart open={cartOpen} onClose={() => setCartOpen(false)} />
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        message={notification.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default Medicines;