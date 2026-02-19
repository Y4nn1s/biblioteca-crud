const express = require('express');
const router = express.Router();
const miembroController = require('../controllers/miembroController');

router.get('/', miembroController.getAllMiembros);
router.get('/:id', miembroController.getMiembroById);
router.post('/', miembroController.createMiembro);
router.put('/:id', miembroController.updateMiembro);
router.delete('/:id', miembroController.deleteMiembro);

module.exports = router;