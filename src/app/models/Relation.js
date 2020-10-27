import { Model } from 'sequelize';

class Relation extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'professor_id',
      as: 'professor',
    });
    this.belongsTo(models.User, {
      foreignKey: 'student_id',
      as: 'student',
    });
  }
}

export default Relation;
