import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import img from '../../assets/home.webp'
import { Box, Stack, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function HeroSlider() {
    return (
        <Swiper
            modules={[Autoplay]}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
            }}
            // Add these props to control the height
            style={{ height: '500px', maxHeight: '500px' }}
        >
            <SwiperSlide>
                <Stack 
                    direction={{ xs: 'column', md: "row" }} 
                    spacing={6} 
                    alignItems="center" 
                    pt={2}
                    // Add this to ensure proper height
                    height="100%"
                >
                    <Box flex={1} maxWidth={{ xs: '100%', md: '50%' }}>
                        <Typography variant='h3' component='h1'>Skip the travel! Find Online</Typography>
                        <Typography variant='h1' component='h1' mb={1}>Medical <span style={{ color: '#2AA7FF' }}>Centers</span></Typography>
                        <Typography color="#5C6169" fontSize={{ md: 20 }} mb={3}>
                            Connect instantly with a 24x7 specialist or choose to video visit a particular doctor.
                        </Typography>
                        <Link to='/search'>
                            <Button variant='contained' size="large" disableElevation>
                                Find Centers
                            </Button>
                        </Link>
                    </Box>
                    <Box
                        component={'img'}
                        src={img}
                        sx={{
                            width: { xs: '100%', md: '45%' },
                            height: { xs: 'auto', md: '450px' },
                            objectFit: 'contain'
                        }}
                    />
                </Stack>
            </SwiperSlide>
        </Swiper>
    )
}