import icon from "../../assets/hospitalicon.png";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import thumb from "../../assets/thumbsup.png";
import Calendar from "../Calendar/Calendar";
import { useState } from "react";
import { format } from "date-fns";

export default function HospitalCard({
  details,
  availableSlots,
  handleBooking,
  booking = false,
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleCancelBooking = () => {
    try {
      // Get current bookings
      let bookings = [];
      try {
        const bookingsStr = localStorage.getItem("bookings");
        if (bookingsStr) {
          bookings = JSON.parse(bookingsStr);
        }
      } catch (error) {
        console.error("Error getting bookings:", error);
        return;
      }

      // Remove the current booking
      const updatedBookings = bookings.filter(
        (booking) => booking["Hospital Name"] !== details["Hospital Name"]
      );

      // Save updated bookings
      try {
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));
        // Force page refresh to show updated bookings
        window.location.reload();
      } catch (error) {
        console.error("Error saving updated bookings:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    } catch (error) {
      console.error("Error in cancel booking process:", error);
    }
  };

  return (
    <Box sx={{ borderRadius: 2, bgcolor: "#fff", p: { xs: 2, md: 4 } }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1, md: 4 }}
        flexWrap={"wrap"}
      >
        <Box
          component="img"
          src={icon}
          width={{ xs: 64, md: 130 }}
          height="auto"
          sx={{ flexShrink: 0, alignSelf: "start" }}
          alt="Hospital Icon"
        />
        <Box flex={1}>
          <Typography
            component="h3"
            color="primary.main"
            fontWeight={600}
            fontSize={{ xs: 18, md: 20 }}
            mb={1}
            textTransform="capitalize"
            lineHeight={1}
          >
            {details["Hospital Name"].toLowerCase()}
          </Typography>
          <Typography
            textTransform="capitalize"
            color="#414146"
            fontSize={14}
            fontWeight={700}
          >
            {`${details["City"].toLowerCase()}, ${details["State"]}`}
          </Typography>
          <Typography fontSize={14} mb={1}>
            {details["Hospital Type"]}
          </Typography>
          <Stack direction="row" flexWrap="wrap" spacing="4px" mb={2}>
            <Typography
              fontWeight={800}
              textTransform="uppercase"
              color="primary.green"
            >
              Free
            </Typography>
            <Typography
              sx={{ textDecoration: "line-through", color: "#787887" }}
            >
              ₹500
            </Typography>
            <Typography>Consultation fee at clinic</Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed", mb: 2 }} />
          <Stack
            direction="row"
            alignItems="center"
            bgcolor="primary.green"
            py="4px"
            px={1}
            borderRadius={1}
            width="fit-content"
            spacing="4px"
          >
            <Box
              component={"img"}
              src={thumb}
              width={{ xs: 16, md: 20 }}
              height={{ xs: 16, md: 20 }}
              alt="Thumbs Up"
            />
            <Typography
              fontWeight={700}
              fontSize={{ xs: 14, md: 16 }}
              color="#fff"
              sx={{ opacity: 0.5 }}
            >
              {details["Hospital overall rating"] == "Not Available"
                ? 0
                : details["Hospital overall rating"]}
            </Typography>
          </Stack>
        </Box>

        <Stack
          justifyContent={booking ? "flex-start" : "flex-end"}
          minWidth="23%"
        >
          {!booking && (
            <>
              <Typography
                textAlign="center"
                color="primary.green"
                fontSize={14}
                fontWeight={500}
                mb={1}
              >
                Available Today
              </Typography>
              <Button
                variant="contained"
                disableElevation
                onClick={() => setShowCalendar((prev) => !prev)}
              >
                {!showCalendar
                  ? "Book FREE Center Visit"
                  : "Hide Booking Calendar"}
              </Button>
            </>
          )}

          {booking && (
            <>
              <Stack direction="row" spacing={1} mt={{ xs: 2, md: 0 }}>
                <Chip
                  label={details.bookingTime}
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: 1,
                    fontSize: 14,
                  }}
                />
                <Chip
                  label={format(new Date(details.bookingDate), "dd MMMM yyyy")}
                  variant="outlined"
                  color="success"
                  sx={{
                    borderRadius: 1,
                    fontSize: 14,
                  }}
                />
              </Stack>
              {/* Cancel Booking Button */}
              <Button
                variant="outlined"
                color="error"
                size="medium"
                sx={{ mt: 2 }}
                onClick={handleCancelBooking}
              >
                Cancel Booking
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      {showCalendar && (
        <Calendar
          details={details}
          availableSlots={availableSlots}
          handleBooking={handleBooking}
        />
      )}
    </Box>
  );
}