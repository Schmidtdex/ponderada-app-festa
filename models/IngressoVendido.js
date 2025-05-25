const pool = require("../config/db");

class IngressoVendido {
  static async criar(tipo_ingresso_id, usuario_id, codigo_qr, status_pagamento = 'pendente') {
    const query = `
      INSERT INTO Ingressos_Vendidos (tipo_ingresso_id, usuario_id, codigo_qr, status_pagamento)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const values = [tipo_ingresso_id, usuario_id, codigo_qr, status_pagamento];
    try {
      // Ensure the corresponding TipoIngresso has available quantity before creating
      // This logic might be better placed in a service layer or controller
      // For now, assume quantity check happened before calling this model method

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao criar ingresso vendido:", err);
      throw err;
    }
  }

  static async buscarPorUsuarioId(usuario_id) {
    const query = `
      SELECT iv.*, ti.nome_tipo, ti.preco, e.nome_evento, e.data_hora_inicio
      FROM Ingressos_Vendidos iv
      JOIN Tipos_Ingresso ti ON iv.tipo_ingresso_id = ti.id
      JOIN Eventos e ON ti.evento_id = e.id
      WHERE iv.usuario_id = $1
      ORDER BY iv.data_compra DESC
    `;
    const values = [usuario_id];
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (err) {
      console.error("Erro ao buscar ingressos por ID do usuário:", err);
      throw err;
    }
  }

  static async buscarPorId(id) {
    const query = "SELECT * FROM Ingressos_Vendidos WHERE id = $1";
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao buscar ingresso vendido por ID:", err);
      throw err;
    }
  }

  static async buscarPorCodigoQR(codigo_qr) {
    const query = "SELECT * FROM Ingressos_Vendidos WHERE codigo_qr = $1";
    const values = [codigo_qr];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao buscar ingresso vendido por Código QR:", err);
      throw err;
    }
  }

  static async atualizarStatusPagamento(id, status_pagamento) {
    const query = `
      UPDATE Ingressos_Vendidos
      SET status_pagamento = $1
      WHERE id = $2 RETURNING *
    `;
    const values = [status_pagamento, id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao atualizar status de pagamento do ingresso:", err);
      throw err;
    }
  }

  // Deleting sold tickets might not be standard practice, maybe 'cancel' status?
}

module.exports = IngressoVendido;

