const prisma = require('../prisma');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const problems = await prisma.problem.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(problems);
    }

    if (req.method === 'POST') {
      const { title, theme, topic, grade, story, question, hint, solutionSteps, correctAnswer, displayAnswer, authorId } = req.body || {};

      if (!title || !story || !question || !correctAnswer) {
        return res.status(400).json({ error: 'Başlık, hikaye, soru ve cevap alanları gereklidir.' });
      }

      const newProblem = await prisma.problem.create({
        data: {
          title,
          theme: theme || 'minecraft',
          topic: topic || 'fractions',
          grade: grade || '6. Sınıf',
          story,
          question,
          hint: hint || '',
          solutionSteps: solutionSteps || '',
          correctAnswer,
          displayAnswer: displayAnswer || correctAnswer,
          date: new Date().toISOString().split('T')[0],
          authorId: authorId || null
        }
      });

      return res.status(201).json(newProblem);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'ID parametresi gereklidir.' });
      }

      await prisma.problem.delete({
        where: { id }
      });

      return res.status(200).json({ message: 'Kayıt silindi.' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Problems API Error:', error);
    return res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
  }
};
