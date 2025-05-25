const pool = require("../config/db");

class Atracao {
  static async criar(nome_atracao, genero_musical) {
    const query = `
      INSERT INTO Atracoes (nome_atracao, genero_musical)
      VALUES ($1, $2) RETURNING *
    `;
    const values = [nome_atracao, genero_musical];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao criar atração:", err);
      throw err;
    }
  }

  static async buscarTodas() {
    const query = "SELECT * FROM Atracoes ORDER BY nome_atracao";
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (err) {
      console.error("Erro ao buscar todas as atrações:", err);
      throw err;
    }
  }

  static async buscarPorId(id) {
    const query = "SELECT * FROM Atracoes WHERE id = $1";
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao buscar atração por ID:", err);
      throw err;
    }
  }

  static async atualizar(id, nome_atracao, genero_musical) {
    const query = `
      UPDATE Atracoes
      SET nome_atracao = $1, genero_musical = $2
      WHERE id = $3 RETURNING *
    `;
    const values = [nome_atracao, genero_musical, id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao atualizar atração:", err);
      throw err;
    }
  }

  static async deletar(id) {
    const query = "DELETE FROM Atracoes WHERE id = $1 RETURNING *";
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Returns the deleted attraction
    } catch (err) {
      console.error("Erro ao deletar atração:", err);
      throw err;
    }
  }
}

module.exports = Atracao;

