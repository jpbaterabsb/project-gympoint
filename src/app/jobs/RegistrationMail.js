import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
    get key() {
        return 'RegistrationMail';
    }

    async handle({ data }) {
        const { enrollment, student, plan } = data;

        console.log(student);
        console.log(plan);

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Bem-vindo a GymPoint',
            template: 'enrollment',
            context: {
                student_name: student.name,
                plan_title: plan.title,
                start_date: format(
                    parseISO(enrollment.start_date),
                    "'dia' dd 'de' MMMM ', às ' H:mm'h'",
                    { locale: pt }
                ),
                end_date: format(
                    parseISO(enrollment.end_date),
                    "'dia' dd 'de' MMMM ', às ' H:mm'h'",
                    { locale: pt }
                ),
                price: enrollment.price
            },
        });
    }
}

export default new RegistrationMail();
