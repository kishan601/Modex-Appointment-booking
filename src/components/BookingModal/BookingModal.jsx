import {
  Modal,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { format } from "date-fns";

export default function BookingModal({
  setOpen,
  open,
  bookingDetails,
  showSuccessMessage,
}) {
  const [email, setEmail] = useState("");

  const handleBooking = (e) => {
    e.preventDefault();
    
    try {
      // Try to get bookings from localStorage with a fallback empty array
      let oldBookings = [];
      try {
        const bookingsStr = localStorage.getItem("bookings");
        if (bookingsStr) {
          oldBookings = JSON.parse(bookingsStr);
        }
      } catch (parseError) {
        console.error("Error parsing bookings from localStorage:", parseError);
        // Continue with empty array if parsing fails
        oldBookings = [];
      }

      // Try to save the updated bookings
      try {
        localStorage.setItem(
          "bookings",
          JSON.stringify([
            ...oldBookings,
            { ...bookingDetails, bookingEmail: email },
          ])
        );
      } catch (saveError) {
        console.error("Error saving to localStorage:", saveError);
        // Continue even if saving fails - at least try to give user feedback
      }
      
      // Safely trigger analytics event after storage operations
      setTimeout(() => {
        try {
          // Only trigger event if dataLayer exists
          if (window.dataLayer) {
            window.dataLayer.push({
              event: "first_visit",
              eventDate: new Date().toISOString()
            });
          }
        } catch (analyticsError) {
          console.error("Analytics error:", analyticsError);
          // Don't let analytics errors affect user experience
        }
      }, 0);
      
      showSuccessMessage(true);
      setEmail("");
      setOpen(false);
    } catch (error) {
      console.error("Error in booking process:", error);
      // Still try to close the modal and show success to prevent UI from hanging
      showSuccessMessage(true);
      setEmail("");
      setOpen(false);
    }
  };

  const formatDate = (day) => {
    if (!day) return "";
    
    try {
      const date = new Date(day);
      return format(date, "E, d LLL");
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(day); // Return the raw date as string if formatting fails
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          width: "95%",
          maxWidth: 600,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
          p: { xs: 3, md: 4 },
          outline: 0,
          bgcolor: "#fff",
          borderRadius: 2,
        }}
      >
        <Typography component="h3" variant="h3">
          Confirm booking
        </Typography>
        <Typography fontSize={14} mb={3}>
          <Box component="span">
            Please enter your email to confirm booking for{" "}
          </Box>
          <Box component="span" fontWeight={600}>
            {bookingDetails && bookingDetails.bookingTime && bookingDetails.bookingDate ? 
              `${bookingDetails.bookingTime} on ${formatDate(bookingDetails.bookingDate)}` : 
              "your appointment"}
          </Box>
        </Typography>
        <form onSubmit={handleBooking}>
          <Stack alignItems="flex-start" spacing={2}>
            <TextField
              type="email"
              label="Enter your email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Stack direction="row" spacing={1}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disableElevation
              >
                Confirm
              </Button>
              <Button
                variant="outlined"
                size="large"
                disableElevation
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}