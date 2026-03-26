import { Router } from 'express';
import upload from '../config/multer.js';
import { authMiddleware } from '../middleware/index.js';

const router = Router();

const ALLOWED_FOLDERS = ['galeria', 'depoimentos', 'servicos', 'misc'];

router.post('/:folder', authMiddleware, (req, res) => {
  const { folder } = req.params;

  if (!ALLOWED_FOLDERS.includes(folder)) {
    return res.status(400).json({ error: 'Pasta inválida' });
  }

  req.uploadFolder = folder;

  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Cloudinary retorna a URL completa em req.file.path
    const url = req.file.path;
    res.status(201).json({ url });
  });
});

export default router;
