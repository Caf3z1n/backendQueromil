import * as Yup from 'yup';

import User from '../models/User';
import Relation from '../models/Relation';
import Essay from '../models/Essay';
import EssayFile from '../models/EssayFile';

class EssayController {
  async store(req, res) {
    const schema = Yup.object().shape({
      theme: Yup.string().required(),
      essayfile_id: Yup.number().required(),
      professor_id: Yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (await User.findByPk(req.userId).provider) {
      return res.status(401).json({ error: 'User is not a student' })
    }

    const { theme, essayfile_id, professor_id } = req.body;

    const relation = await Relation.findOne({
      where: {
        professor_id,
        student_id: req.userId
      }
    })

    if (!relation) {
      return res.status(401).json({ error: 'User have not a relation with the professor' });
    }

    const essay = await Essay.create({
      theme,
      essayfile_id,
      student_id: req.userId,
      professor_id,
      status: "Pendente"
    })

    return res.json(essay);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      ajustedfile_id: Yup.number(),
      points: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (!(await User.findByPk(req.userId)).provider) {
      return res.status(401).json({ error: 'User is not a provider' })
    }

    const essay = await Essay.findByPk(req.params.essayId);

    const { adjustedfile_id, points } = req.body;

    essay.update({
      adjustedfile_id,
      status: "Corrigido",
      points,
      adjusted_at: new Date()
    })

    return res.json(essay);
  }

  async index(req, res) {
    const { provider } = await User.findByPk(req.userId);

    if (!provider) {
      const essays = await Essay.findAll({
        where: { student_id: req.userId },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'theme', 'status', 'points', 'created_at']
      });

      return res.json(essays);
    }

    const { adjusted } = req.query;

    if (!adjusted) {
      const essays = await Essay.findAll({
        where: { professor_id: req.userId, status: "Pendente" },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'theme', 'created_at'],
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'name']
          }
        ]
      });

      return res.json(essays);
    }

    const essays = await Essay.findAll({
      where: { professor_id: req.userId, status: "Corrigido" },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'theme', 'created_at'],
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name']
        }
      ]
    });

    return res.json(essays);
  }


  async show(req, res) {
    const essay = await Essay.findOne({
      where: { id: req.params.essayId },
      attributes: [
        'id',
        'theme',
        'status',
        'points',
        'adjusted_at',
        'canceled_at',
        'created_at'
      ],
      include: [
        {
          model: EssayFile,
          as: 'essayfile',
          attributes: ['id', 'name', 'path', 'url']
        },
        {
          model: EssayFile,
          as: 'adjustedfile',
          attributes: ['id', 'name', 'path', 'url']
        },
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'professor',
          attributes: ['id', 'name']
        }
      ]
    })

    return res.json(essay);
  }

  async delete(req, res) {
    const essay = await Essay.findByPk(req.params.essayId);

    essay.update({
      status: "Cancelado",
      canceled_at: new Date()
    });

    return res.json(essay);
  }
}

export default new EssayController();
