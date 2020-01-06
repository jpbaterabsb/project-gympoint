import Sequelize, { Model } from 'sequelize';

class Student extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            age: Sequelize.INTEGER,
            weigth: Sequelize.DECIMAL(5,2),
            height: Sequelize.DECIMAL(5,2),
        }, {
            sequelize
        });

        return this;
    }
}

export default Student;
