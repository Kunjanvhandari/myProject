import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendReservationNotification(user, book, reservation) {
  try {
    const mailOptions = {
      from: `"Librivista" <${process.env.EMAIL_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Book Reservation - ${book.title}`,
      html: `
        <h2>New Book Reservation</h2>
        <p><strong>User:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Book:</strong> ${book.title}</p>
        <p><strong>Author:</strong> ${book.author || "N/A"}</p>
        <p><strong>Price:</strong> $${reservation.totalPrice || book.price || 0}</p>
        <p><strong>Payment Method:</strong> ${reservation.paymentMethod || "N/A"}</p>
        <p><strong>Delivery Address:</strong> ${reservation.deliveryAddress || "N/A"}</p>
        <p><strong>Reserved On:</strong> ${new Date(reservation.reservedOn).toLocaleString()}</p>
        <p><strong>Expires:</strong> ${new Date(reservation.reserveExpiry).toLocaleString()}</p>
        <hr>
        <p style="color: #666;">This is an automated notification from Librivista Library Management System.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Reservation notification email sent successfully");
  } catch (error) {
    console.error("Failed to send reservation email:", error.message);
  }
}
