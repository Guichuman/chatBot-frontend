import React, { useState, useEffect } from 'react';
import './IngredientModal.css';

export function IngredientModal({ open, onClose, onSave, initialData }) {
  const [nomeIngrediente, setNomeIngrediente] = useState('');
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0);
  const [unidadeMedida, setUnidadeMedida] = useState('');

  useEffect(() => {
    if (initialData) {
      setNomeIngrediente(initialData.nomeIngrediente || '');
      setQuantidadeDisponivel(initialData.quantidadeDisponivel || 0);
      setUnidadeMedida(initialData.unidadeMedida || '');
    }
  }, [initialData]);

  const handleSave = () => {
    onSave({
      nomeIngrediente,
      quantidadeDisponivel,
      unidadeMedida,
    });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Editar Ingrediente' : 'Adicionar Ingrediente'}</h2>
          <button className="close-button" onClick={onClose}>✖</button>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <label htmlFor="nomeIngrediente">Nome do Ingrediente</label>
            <input
              id="nomeIngrediente"
              type="text"
              value={nomeIngrediente}
              onChange={(e) => setNomeIngrediente(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label htmlFor="quantidadeDisponivel">Quantidade Disponível</label>
            <input
              id="quantidadeDisponivel"
              type="number"
              value={quantidadeDisponivel}
              onChange={(e) => setQuantidadeDisponivel(Number(e.target.value))}
            />
          </div>
          <div className="modal-field">
            <label htmlFor="unidadeMedida">Unidade de Medida</label>
            <input
              id="unidadeMedida"
              type="text"
              value={unidadeMedida}
              onChange={(e) => setUnidadeMedida(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="save-button" onClick={handleSave}>Salvar</button>
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
