import Enrollment from "../models/Enrollment";
import Student from "../models/Student";
import Plan from "../models/Plan";
import * as Yup from 'yup';
import { parseISO, addMonths } from 'date-fns';
import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
    async index(req, res) {
      const enrollment = await Enrollment.findAll({
          attributes: ['id', 'start_date', 'end_date', 'price'],
          include: [
              {
                  model: Plan,
                  as: 'plan',
                  attributes: ['title', 'duration' ]
              },
              {
                model: Student,
                as: 'student',
                attributes: ['name', 'email', 'age', 'weigth', 'height' ]
            }
          ]
      });

      return res.json(enrollment);
    }

    async store(req, res) {
      const schema = Yup.object().shape({
        student_id: Yup.number().required(),
        plan_id: Yup.number().required(),
        start_date: Yup.date().required()
      });

      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validations Fails'});
      }

      const { student_id, plan_id, start_date } = req.body;

      const studentExists = await Student.findByPk(student_id);

      if (!studentExists) {
          return res.status(400).json({ error: "Student does not exists"});
      }

      const planExists = await Plan.findByPk(plan_id);

      if (!planExists) {
          return res.status(400).json({ error: "Plan does not exists"});
      }

      const { duration, price } = planExists;

      const enrollmentPrice = duration * price;
      const init_date = parseISO(start_date);
      const finish_date = addMonths(init_date, duration);

      const enrollment =  await Enrollment.create({
          student_id,
          plan_id,
          start_date: init_date,
          end_date: finish_date,
          price: enrollmentPrice
      });

      await Queue.add(RegistrationMail.key, {
        enrollment,
        student: studentExists,
        plan: planExists
      });

      return res.json(enrollment);
    }

    async update(req, res) {
      const schema = Yup.object().shape({
        student_id: Yup.number().required(),
        plan_id: Yup.number().required(),
        start_date: Yup.date().required()
      });

      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validations Fails'});
      }

      const enrollment = await Enrollment.findByPk(req.params.enrollment_id);

      if (!enrollment) {
          return res.status(400).json({ error: "Enrollment not found"});
      }

      const { student_id, plan_id, start_date } = req.body;

      const studentExists = await Student.findByPk(student_id);

      if (!studentExists) {
          return res.status(400).json({ error: "Student does not exists"});
      }

      const planExists = await Plan.findByPk(plan_id);

      if (!planExists) {
          return res.status(400).json({ error: "Plan does not exists"});
      }

      const { duration, price } = planExists;

      const enrollmentPrice = duration * price;
      const init_date = parseISO(start_date);
      const finish_date = addMonths(init_date, duration);

      const { id, end_date } = await enrollment.update({
        student_id,
        plan_id,
        start_date: init_date,
        end_date: finish_date,
        price: enrollmentPrice
      });

      return res.json({
        id,
        student_id,
        plan_id,
        start_date,
        end_date,
        price
      });
    }

    async delete(req, res) {
      const enrollment = await Enrollment.findByPk(req.params.enrollment_id);

      if (!enrollment) {
          return res.status(400).json({ error: "Enrollment does not exists"});
      }

      enrollment.destroy();

      return res.json(enrollment);
    }
}

export default new EnrollmentController();
