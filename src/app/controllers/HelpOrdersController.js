import HelpOrders from "../models/HelpOrders";
import Student from "../models/Student";
import * as Yup from 'yup';

class HelpOrdersController {
  async index(req, res) {
    const helpOrders = await HelpOrders.findAll({
        attributes: ['id', 'question', 'created_at', 'answer', 'answer_at'],
        include: [
            {
              model: Student,
              as: 'student',
              attributes: ['name', 'email', 'age', 'weigth', 'height' ]
          }
        ]
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
        question: Yup.string().required()
    });

    if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validations Fails'});
    }

    const student = await Student.findByPk(req.params.student_id);

    if (!student) {
        return res.status(400).json({ error: "Student not found"});
    }

    const { question } = req.body;

    const helpOrders =  await HelpOrders.create({
      student_id: req.params.student_id,
      question: question
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrdersController();
