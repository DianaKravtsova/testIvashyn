module.exports = function (sequelize, DataTypes){
  const bcrypt = require('bcryptjs');
    const User = sequelize.define('User', {
      id: {type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, },
      email: {type: DataTypes.STRING, allowNull: false,},
      firstname: {type: DataTypes.STRING, allowNull: false, },
      lastname: {type: DataTypes.STRING, allowNull: false,},
      image: {type:DataTypes.STRING, allowNull: true},
      password: {type: DataTypes.STRING, allowNull: false},
      pdf: {type: DataTypes.STRING.BINARY, allowNull: true},
    }, {
      tableName: 'users'
    });
  
    User.beforeCreate((model, options) => {
      model.hashPassword();
    });
  
    User.prototype.hashPassword = function() {
      this.password = bcrypt.hashSync(this.password, 9);
    }
 
    User.prototype.toJSON = function(){
      return {
        id: +this.id,
        email: this.email,
        firstName: this.firstname,
        lastName: this.lastname,
        image: this.image,
        pdf: this.pdf,
        token: this.token
      };
    };
  
    return User;
  }