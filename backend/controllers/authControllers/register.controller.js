const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");

// @desc    Registro de nuevos usuarios
// @route   POST /api/auth/register
// @access  Publico
const registerUser = async (req, res) => {
    try {
        const { username, name, email, password, profileImageUrl, bio, adminAccessToken } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const existingUsername = await User.findOne({ username: req.body.username });
        if (existingUsername) {
            return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
        }

        const normalizedUsername = username.trim().toLowerCase();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determinamos el rol del usuario: Admin si es correcto el token enviado, de otra manera member / cambiar debido a que ahora existiran superadmins
        let role = "member";
        if (adminAccessToken && adminAccessToken == process.env.ADMIN_ACCESS_TOKEN) {
            role = "admin";
        }

        // Generamos el Token de verificación
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const vfTokenExpires = Date.now() + 5 * 60 * 1000; // 5 minutos

        const user = await User.create({
            username: normalizedUsername,
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            bio,
            isVerified: false,
            verificationToken,
            vfTokenExpires
        });

        const verifyLink = `${process.env.BACKEND_URL}/api/auth/verify/${verificationToken}`;

        await sendEmail(
            email,
            "Verifica tu cuenta",
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
                    <h2 style="color: #333; text-align: center">Hola ${name}</h2>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                    <p style="color: #555; font-size: 16px; line-height: 1.5;">
                        Gracias por registrarte en <strong>Tecno Blog</strong>.
                        Para completar tu registro, por favor verifica tu cuenta haciendo clic en el botón de abajo:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a 
                            href="${verifyLink}"
                            style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 6px; font-size: 16px;"
                        >
                            Verificar mi cuenta
                        </a>
                    </div>
                    <p style="color: #777; font-size: 14px;">
                        Si el botón no funciona, puedes copiar y pegar o cliquear el siguiente enlace en tu navegador:
                    </p>
                    <p style="word-break: break-all; color: #2563ab; font-size: 14px;">
                        ${verifyLink}
                    </p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © ${new Date().getFullYear()} Tecno Blog. Todos los derechos reservados.
                    </p>
                </div>
            `
        );

        res.status(201).json({
            message: "Usuario registrado exitosamente. Revisa tu email para continuar con la verificación de la cuenta"
        });

    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern?.username) {
                return res.status(400).json({ message: "El nombre de usuario ya esta en uso" });
            }
            if (error.keyPattern?.email) {
                return res.status(400).json({ message: "El email ya esta registrado" });
            }
        }
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};