import Mail from '../../lib/Mail';

class AnswerMail {
    get key() {
        return 'AnswerMail';
    }

    async handle({ data }) {
        const { helpOrders, student } = data;

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Resposta de GymPoint',
            template: 'answer',
            context: {
                student_name: student.name,
                question: helpOrders.question,
                answer: helpOrders.answer
            },
        });
    }
}

export default new AnswerMail();
