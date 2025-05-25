const pool = require("../config/db");

class EventoAtracao {
  static async adicionarAtracaoAoEvento(evento_id, atracao_id, horario_apresentacao) {
    const query = `
      INSERT INTO Eventos_Atracoes (evento_id, atracao_id, horario_apresentacao)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const values = [evento_id, atracao_id, horario_apresentacao];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao adicionar atração ao evento:", err);
      throw err;
    }
  }

  static async buscarAtracoesPorEventoId(evento_id) {
    const query = `
      SELECT a.*, ea.horario_apresentacao
      FROM Atracoes a
      JOIN Eventos_Atracoes ea ON a.id = ea.atracao_id
      WHERE ea.evento_id = $1
    `;
    const values = [evento_id];
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (err) {
      console.error("Erro ao buscar atrações por ID do evento:", err);
      throw err;
    }
  }

  static async removerAtracaoDoEvento(evento_id, atracao_id) {
    const query = "DELETE FROM Eventos_Atracoes WHERE evento_id = $1 AND atracao_id = $2 RETURNING *";
    const values = [evento_id, atracao_id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Returns the deleted relation
    } catch (err) {
      console.error("Erro ao remover atração do evento:", err);
      throw err;
    }
  }

  // Add other necessary methods, e.g., update presentation time
}

module.exports = EventoAtracao;

