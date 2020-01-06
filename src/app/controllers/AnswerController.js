import HelpOrders from "../models/HelpOrders";
import Student from "../models/Student";
import * as Yup from 'yup';
import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
        answer: Yup.string().required()
    });

    if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validations Fails'});
    }

    const helpOrders = await HelpOrders.findByPk(req.params.help_order);

    if (!helpOrders) {
        return res.status(400).json({ error: "Help Order not found"});
    }

    const student = await Student.findByPk(helpOrders.student_id);

    if (!student) {
        return res.status(400).json({ error: "Student not found"});
    }

    const { answer } = req.body;

    await helpOrders.update({
      answer,
      answer_at: new Date()
    });

    await Queue.add(AnswerMail.key, {
      helpOrders,
      student
    });

    return res.json(helpOrders);
  }
}

export default new AnswerController();
