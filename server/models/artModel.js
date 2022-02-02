import dbConnect from '../config/db-config.js';

const getAll = () => {
  return new Promise((resolve, reject) => {
      dbConnect.query(`SELECT a.id, a.name, a.description, a.image,
      JSON_REMOVE(JSON_OBJECTAGG(IFNULL(u.id, 'null__'), u.username), '$.null__') AS user
      FROM artwork AS a
      LEFT JOIN user_artwork AS ua ON a.id = ua.artwork_id
      LEFT JOIN user AS u ON u.id = ua.user_id
      GROUP BY a.id`, (err, results) => {   
          if (err) reject(err);
          else resolve(results);
      })
  })
}

export default {getAll}