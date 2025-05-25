const pool = require("../config/db");

class TipoIngresso {
  static async criar(evento_id, nome_tipo, preco, quantidade_total) {
    // Initially, quantidade_disponivel is the same as quantidade_total
    const query = `
      INSERT INTO Tipos_Ingresso (evento_id, nome_tipo, preco, quantidade_total, quantidade_disponivel)
      VALUES ($1, $2, $3, $4, $4) RETURNING *
    `;
    const values = [evento_id, nome_tipo, preco, quantidade_total];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao criar tipo de ingresso:", err);
      throw err;
    }
  }

  static async buscarPorEventoId(evento_id) {
    const query = "SELECT * FROM Tipos_Ingresso WHERE evento_id = $1 ORDER BY nome_tipo";
    const values = [evento_id];
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (err) {
      console.error("Erro ao buscar tipos de ingresso por ID do evento:", err);
      throw err;
    }
  }

  static async buscarPorId(id) {
    const query = "SELECT * FROM Tipos_Ingresso WHERE id = $1";
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao buscar tipo de ingresso por ID:", err);
      throw err;
    }
  }

  static async atualizar(id, nome_tipo, preco, quantidade_total, quantidade_disponivel) {
    const query = `
      UPDATE Tipos_Ingresso
      SET nome_tipo = $1, preco = $2, quantidade_total = $3, quantidade_disponivel = $4
      WHERE id = $5 RETURNING *
    `;
    const values = [nome_tipo, preco, quantidade_total, quantidade_disponivel, id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao atualizar tipo de ingresso:", err);
      throw err;
    }
  }

  static async decrementarDisponivel(id, quantidade = 1) {
    const query = `
      UPDATE Tipos_Ingresso
      SET quantidade_disponivel = quantidade_disponivel - $1
      WHERE id = $2 AND quantidade_disponivel >= $1
      RETURNING *
    `;
    const values = [quantidade, id];
    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        throw new Error("Quantidade de ingressos indisponível ou tipo de ingresso não encontrado.");
      }
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao decrementar quantidade disponível do ingresso:", err);
      throw err;
    }
  }

  static async deletar(id) {
    // Consider implications: should only be possible if no tickets sold?
    const query = "DELETE FROM Tipos_Ingresso WHERE id = $1 RETURNING *";
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Returns the deleted ticket type
    } catch (err) {
      console.error("Erro ao deletar tipo de ingresso:", err);
      throw err;
    }
  }
}

module.exports = TipoIngresso;

