import nodemailer from 'nodemailer';

const forgotPasswordEmail = async (data) => {
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
        subject: "Reset your password",
        text: "Reset your password",
        html: `
            <p>Hi, ${name}. You requested to reset your password.</p>
            <p>Click the following link to reset your password: 
            <a href="${process.env.FRONTEND_URL}/forgot/${token}">Reset password</a></p>

            <p>If you didn't make this request, you can ignore this message</p>
        `
    });

    console.log("Email sent: %s", info.messageId);
}

export default forgotPasswordEmail;