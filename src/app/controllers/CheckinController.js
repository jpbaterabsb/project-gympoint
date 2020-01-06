import Checkin from "../models/Checkin";
import Student from "../models/Student";
import { subDays } from 'date-fns';
import { Op } from 'sequelize';

class CheckinController {
    async index(req, res) {
      const checkin = await Checkin.findAll({
          attributes: ['id', 'created_at'],
          include: [
              {
                model: Student,
                as: 'student',
                attributes: ['name', 'email', 'age', 'weigth', 'height' ]
            }
          ]
      });

      return res.json(checkin);
    }

    async store(req, res) {
      const student = await Student.findByPk(req.params.student_id);

      if (!student) {
          return res.status(400).json({ error: "Student not found"});
      }

      const parsedDate = new Date();

      const checkins = await Checkin.findAll({
          where: {
              student_id: req.params.student_id,
              created_at: {
                  [Op.between]: [
                      subDays(parsedDate, 7),
                      parsedDate
                  ]
              }
          }
      });

      if (checkins.length > 5) {
        return res.status(400).json({ error: "Too much checkins"});
      }

      const checkin =  await Checkin.create({
        student_id: req.params.student_id
      });

      return res.json(checkin);

    }
}

export default new CheckinController();
