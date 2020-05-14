const pool = require("../../config/database");

module.exports = {
    create: (data, callback) => {
        pool.query(
            `insert into registration
                (firstname, lastname, gender, email, password)
            values
                (?,?,?,?,?)`,
            [
                data.firstname,
                data.lastname,
                data.gender,
                data.email,
                data.password
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results);
            }
        );
    },
    getUserByUserEmail: (email, callback) => {
        pool.query(
            `select * from registration where email = ?`,
            [email],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results[0]);
            }
        );
    },
    getUserByUserId: (id, callback) => {
        pool.query(
            `select id,firstname,lastname,gender,email from registration where id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results[0]);
            }
        );
    },
    getUsers: callback => {
        pool.query(
            `select id,firstname,lastname,gender,email from registration`,
            [],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results);
            }
        );
    },
    updateUser: (data, callback) => {
        pool.query(
            `update registration set firstname=?, lastname=?, gender=?, email=?, password=? where id = ?`,
            [
                data.firstname,
                data.lastname,
                data.gender,
                data.email,
                data.password,
                data.id
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results[0]);
            }
        );
    },
    deleteUser: (data, callback) => {
        pool.query(
            `delete from registration where id = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results[0]);
            }
        );
    }
};
