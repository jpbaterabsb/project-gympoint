import Plan from "../models/Plan";
import * as Yup from 'yup';

class PlanController {
    async index(req, res) {
      const plans = await Plan.findAll({
          attributes: ['id', 'title', 'duration', 'price']
      });

      return res.json(plans);
    }

    async store(req, res) {
      const schema = Yup.object().shape({
          title: Yup.string().required(),
          duration: Yup.number().required(),
          price: Yup.number().required()
      });

      if(!(await schema.isValid(req.body))) {
          return res.status(400).json({ error: 'Validations Fails'});
      }

      const { title, duration, price } = req.body;

      const planExists = await Plan.findOne({ where: {title:title}});

      if (planExists) {
          return res.status(401).json({ error: "Plan already exists"});
      }

      const plan =  await Plan.create({
        title,
        duration,
        price
      });

      return res.json(plan);
    }

    async update(req, res) {
      const schema = Yup.object().shape({
          title: Yup.string().required(),
          duration: Yup.number().required(),
          price: Yup.number().required()
      });

      if(!(await schema.isValid(req.body))) {
          return res.status(400).json({ error: 'Validations Fails'});
      }

      const plan = await Plan.findByPk(req.params.plan_id);

      if (!plan) {
          return res.status(400).json({ error: "Plan not found"});
      }

      const { id, title, duration, price } = await plan.update(req.body);

      return res.json({
          id,
          title,
          duration,
          price
      });
    }

    async delete(req, res) {
      const plan = await Plan.findByPk(req.params.plan_id);

      if (!plan) {
        return res.status(400).json({ error: "Plan does not exists"});
    }


      plan.destroy();

      return res.json(plan);

    }
}

export default new PlanController();
