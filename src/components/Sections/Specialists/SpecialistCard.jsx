import { Box, Typography } from "@mui/material";

export default function SpecialistCard({ img, title, designation }) {
    return (
        <Box textAlign='center' sx={{ maxHeight: '270px' }}>
            <Box
                component='img'
                src={img}
                sx={{ 
                    width: '100%',
                    maxWidth: '180px',
                    height: 'auto',
                    maxHeight: '180px',
                    boxShadow: '0 10px 25px -10px rgba(0,0,0,0.09)', 
                    borderRadius: '180px 180px 4px 4px',
                    objectFit: 'cover'
                }}
                mb={1}
            />
            <Typography
                fontSize={{ xs: 14, md: 16 }}
                fontWeight="bold"
                color='#1B3C74'
                sx={{ lineHeight: 1.2 }}
            >
                {title}
            </Typography>
            <Typography
                fontSize={{ xs: 12, md: 14 }}
                fontWeight={500}
                color='primary.main'
            >
                {designation}
            </Typography>
        </Box>
    )
}