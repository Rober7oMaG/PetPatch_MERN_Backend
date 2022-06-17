import nodemailer from 'nodemailer';

const registerEmail = async (data) => {
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {name, email, token} = data;

    // Send email
    const info = await transporter.sendMail({
        from: 'PetPatch',
        to: email,
        subject: "Confirm your PetPatch account",
        text: "Confirm your PetPatch account",
        html: `
            <p>Hi, ${name}. Confirm your PetPatch account.</p>
            <p>Your account is ready, you only have to confirm it in the following link: 
            <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm account</a></p>

            <p>If you didn't create this account, you can ignore this message</p>
        `
    });

    console.log("Email sent: %s", info.messageId);
}

export default registerEmail;