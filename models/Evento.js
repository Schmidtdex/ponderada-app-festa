const pool = require("../config/db");

class Evento {
  static async criar(organizador_id, nome_evento, descricao, data_hora_inicio, data_hora_fim, local_evento, capacidade_maxima, url_imagem_capa) {
    const query = `
      INSERT INTO Eventos (organizador_id, nome_evento, descricao, data_hora_inicio, data_hora_fim, local_evento, capacidade_maxima, url_imagem_capa)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const values = [organizador_id, nome_evento, descricao, data_hora_inicio, data_hora_fim, local_evento, capacidade_maxima, url_imagem_capa];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      throw err;
    }
  }

  static async buscarTodos() {
    const query = "SELECT * FROM Eventos ORDER BY data_hora_inicio";
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (err) {
      console.error("Erro ao buscar todos os eventos:", err);
      throw err;
    }
  }

  static async buscarPorId(id) {
    const query = "SELECT * FROM Eventos WHERE id = $1";
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao buscar evento por ID:", err);
      throw err;
    }
  }

  static async atualizar(id, nome_evento, descricao, data_hora_inicio, data_hora_fim, local_evento, capacidade_maxima, url_imagem_capa) {
    const query = `
      UPDATE Eventos
      SET nome_evento = $1, descricao = $2, data_hora_inicio = $3, data_hora_fim = $4, local_evento = $5, capacidade_maxima = $6, url_imagem_capa = $7
      WHERE id = $8 RETURNING *
    `;
    const values = [nome_evento, descricao, data_hora_inicio, data_hora_fim, local_evento, capacidade_maxima, url_imagem_capa, id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao atualizar evento:", err);
      throw err;
    }
  }

  static async deletar(id) {
    const query = "DELETE FROM Eventos WHERE id = $1 RETURNING *";
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Returns the deleted event
    } catch (err) {
      console.error("Erro ao deletar evento:", err);
      throw err;
    }
  }

  // Add methods to find events by organizer, etc.
}

module.exports = Evento;

