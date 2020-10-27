import Sequelize from 'sequelize';

import User from '../app/models/User';
import Relation from '../app/models/Relation';
import EssayFile from '../app/models/EssayFile';
import Essay from '../app/models/Essay';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, Relation, EssayFile, Essay, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
