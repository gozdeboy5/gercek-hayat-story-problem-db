const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'storymath_super_secret_jwt_key_2026';

module.exports = async function handler(req, res) {
  // CORS Headers for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, username, password, role } = req.body || {};

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'E-posta, kullanıcı adı ve parola gereklidir.' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Parola en az 4 karakter olmalıdır.' });
    }

    // Check existing email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return res.status(400).json({ error: 'Bu e-posta adresi zaten kayıtlı.' });
      }
      return res.status(400).json({ error: 'Bu kullanıcı adı zaten alınmış.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userRole = role === 'TEACHER' ? 'TEACHER' : 'STUDENT';
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: username.trim(),
        password: hashedPassword,
        role: userRole
      }
    });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Kullanıcı kaydı başarıyla oluşturuldu!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Register API Error:', error);
    return res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
  }
};
