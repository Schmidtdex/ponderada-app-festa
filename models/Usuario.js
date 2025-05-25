const pool = require("../config/db");
const bcrypt = require('bcrypt'); // Assuming bcrypt will be used for hashing in controller/service

class Usuario {
  static async criar(nome_completo, email, senha_hash, tipo_usuario) {
    const query = 'INSERT INTO Usuarios (nome_completo, email, senha_hash, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [nome_completo, email, senha_hash, tipo_usuario];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      throw err;
    }
  }

  static async buscarPorEmail(email) {
    const query = 'SELECT * FROM Usuarios WHERE email = $1';
    const values = [email];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Erro ao buscar usuário por email:', err);
      throw err;
    }
  }

  static async buscarPorId(id) {
    const query = 'SELECT id, nome_completo, email, tipo_usuario, data_criacao FROM Usuarios WHERE id = $1'; // Exclude password hash
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Erro ao buscar usuário por ID:', err);
      throw err;
    }
  }

  // Add other necessary methods like update, delete, etc.
}

module.exports = Usuario;

