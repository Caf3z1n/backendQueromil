import Sequelize, { Model } from 'sequelize';

class Essay extends Model {
  static init(sequelize) {
    super.init(
      {
        theme: Sequelize.STRING,
        status: Sequelize.STRING,
        points: Sequelize.NUMBER,
        adjusted_at: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.EssayFile, {
      foreignKey: 'essayfile_id',
      as: 'essayfile',
    });
    this.belongsTo(models.EssayFile, {
      foreignKey: 'adjustedfile_id',
      as: 'adjustedfile',
    });
    this.belongsTo(models.User, {
      foreignKey: 'student_id',
      as: 'student',
    });
    this.belongsTo(models.User, {
      foreignKey: 'professor_id',
      as: 'professor',
    });
  }
}

export default Essay;
