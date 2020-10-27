import * as Yup from 'yup';
import { Op } from 'sequelize';

import User from '../models/User';
import Relation from '../models/Relation';
import File from  '../models/File';


class RelationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (!(await User.findByPk(req.userId)).provider) {
      return res.status(401).json({ error: 'User is not a professor' })
    }

    const { student_id } = req.body;

     /**
     * Check if student_id is a Student
     */
    const student = await User.findByPk(student_id);

    if (!student || student.provider) {
      return res.status(400).json({ error: 'Student does not exists' })
    }

    /**
     * Check if student_id already have the Relation
     */
    const exists = await Relation.findOne({
      where: {
        professor_id: req.userId,
        student_id
      }
    })
    if (exists) {
      return res.status(400).json({ error: 'Student already have the Relation' })
    }

    const relation = await Relation.create({
      professor_id: req.userId,
      student_id
    })

    return res.json(relation);
  }

  async index(req, res) {
    if (!(await User.findByPk(req.userId)).provider) {
      const relation = await Relation.findOne({
        where: {student_id: req.userId}
      })

      if(relation) {
        return res.json({ relation: true });
      }

      return res.json({ relation: false });
    }

    const { myStudents, q } = req.query;

    if (myStudents) {
      const students = q ? await Relation.findAll({
        where: {professor_id: req.userId },
        attributes: ['id'],
        include: [
          {
            model: User,
            as: 'student',
            where: {name: { [Op.iLike]: `%${q}%` } },
            attributes: ['id', 'name', 'email'],
          },
        ],
      }) : await Relation.findAll({
        where: {professor_id: req.userId },
        attributes: ['id'],
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'name', 'email'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['id', 'path', 'url']
              },
            ],
          },
        ],
      })

      return res.json(students);
    }

    const students = await Relation.findAll({
      where: { professor_id: req.userId },
      attributes: [],
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id'],
        },
      ],
    });

    const array = [];
    students.map((student) => array.push(student.student.id))

    const addStudents = q ? await User.findAll({
      where: {
        id: { [Op.notIn]: array },
        provider: false,
        name: { [Op.iLike]: `%${q}%` }
      },
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        },
      ],
    }) : await User.findAll({
      where: {
        id: { [Op.notIn]: array },
        provider: false,
      },
      order: ['name'],
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        },
      ],
    })

    return res.json(addStudents);
  }

  async delete(req, res) {
    const relation = await Relation.findByPk(req.params.relationId);

    if (!relation) {
      return res.status(400).json({ error: 'Relation does not exists' });
    }

    if (!(await User.findByPk(req.userId)).provider) {
      return res.status(401).json({ error: 'User is not a provider' })
    }

    await relation.destroy();

    return res.json(relation);
  }
}

export default new RelationController();
