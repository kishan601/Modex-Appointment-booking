import { Box, Container, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import offer1 from '../../../assets/offer1.png'
import offer2 from '../../../assets/offer2.png'

export default function Offers() {
    return (
        <Box py={3}>
            <Container maxWidth='xl'>
                {/* Add a title */}
                <Typography variant="h4" component="h2" textAlign="center" mb={3}>
                    Special Offers
                </Typography>
                
                <Swiper
                    slidesPerView={1}
                    spaceBetween={20}
                    modules={[Pagination]}
                    pagination={{
                        clickable: true
                    }}
                    style={{
                        height: 'auto', 
                        maxHeight: '280px',
                        marginBottom: '40px'
                    }}
                    breakpoints={
                        {
                            767: {
                                slidesPerView: 3
                            }
                        }
                    }
                >
                    <SwiperSlide>
                        <Box 
                            component={'img'} 
                            src={offer1}
                            sx={{ 
                                width: '100%', 
                                maxHeight: '240px', 
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }} 
                        />
                    </SwiperSlide>

                    <SwiperSlide>
                        <Box 
                            component={'img'} 
                            src={offer2}
                            sx={{ 
                                width: '100%', 
                                maxHeight: '240px', 
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }} 
                        />
                    </SwiperSlide>

                    <SwiperSlide>
                        <Box 
                            component={'img'} 
                            src={offer1}
                            sx={{ 
                                width: '100%', 
                                maxHeight: '240px', 
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }} 
                        />
                    </SwiperSlide>

                    <SwiperSlide>
                        <Box 
                            component={'img'} 
                            src={offer2}
                            sx={{ 
                                width: '100%', 
                                maxHeight: '240px', 
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }} 
                        />
                    </SwiperSlide>

                    <SwiperSlide>
                        <Box 
                            component={'img'} 
                            src={offer1}
                            sx={{ 
                                width: '100%', 
                                maxHeight: '240px', 
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }} 
                        />
                    </SwiperSlide>

                    <SwiperSlide>
                        <Box 
                            component={'img'} 
                            src={offer2}
                            sx={{ 
                                width: '100%', 
                                maxHeight: '240px', 
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }} 
                        />
                    </SwiperSlide>
                </Swiper>
            </Container>
        </Box>
    )
}