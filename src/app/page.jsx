"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { IngredientModal } from "../components/ui/IngredientModal"; 
import axios from "axios";
import { format } from 'date-fns';

export default function Estoque() {
  const [stockItems, setStockItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/estoques");
        const response2 = await axios.get("/api/pedidos");
        setStockItems(response.data);
        setOrders(response2.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [refreshPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleSaveItem = async (item) => {
    try {
      if (editingItem) {
        console.log(editingItem)
        await axios.put(`/api/estoques/${editingItem.id}`, {
          nomeIngrediente: item.nomeIngrediente,
          quantidadeDisponivel: item.quantidadeDisponivel,
          unidadeMedida: item.unidadeMedida,
        });

        const updatedItems = stockItems.map((i) =>
          i.nomeIngrediente === editingItem.nomeIngrediente
            ? {
                ...i,
                quantidadeDisponivel: item.quantidadeDisponivel,
                unidadeMedida: item.unidadeMedida,
              }
            : i
        );
        setStockItems(updatedItems);
        setRefreshPage(generateRandomNumber())
      } else {
        await axios.post("/api/estoques", {
          nomeIngrediente: item.nomeIngrediente,
          quantidadeDisponivel: item.quantidadeDisponivel,
          unidadeMedida: item.unidadeMedida,
        });

        setStockItems([...stockItems, item]);
      }
      setShowModal(false);
      setRefreshPage(generateRandomNumber())
    } catch (err) {
      console.error("Failed to save item:", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-red-500 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Pizzaria-bot</h1>
      </header>
      <main className="flex-1 p-6">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Estoque</h2>
            <Button onClick={handleAddItem}>Adicionar Ingrediente</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stockItems.map((item) => (
              <div
                key={item.nomeIngrediente}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
                onClick={() => handleEditItem(item)}
              >
                <div>
                  <h3 className="text-lg font-bold mb-2">{item.nomeIngrediente}</h3>
                  <p className="text-gray-600 mb-2">
                    Quantidade: {item.quantidadeDisponivel}
                  </p>
                  <p className="text-sm font-medium text-green-500">
                    {item.unidadeMedida}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-4">Pedidos Pendentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold mb-2">Pedido #{order.id}</h3>
                  <p className="text-gray-600 mb-2">Hora: {formatDate(order.dataHora)}</p>
                  <ul className="list-disc pl-4 text-gray-600">
                    {order.itensPedido && order.itensPedido.length > 0 ? (
                      order.itensPedido.map((item, index) => (
                        <li key={index}>
                          Sabor: {item.sabor} - Quantidade: {item.quantidade}
                        </li>
                      ))
                    ) : (
                      <li>Nenhum item disponível</li>
                    )}
                  </ul>
                  <p className="text-sm font-medium text-orange-300">{order.situacao}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      {showModal && (
        <IngredientModal
          open={showModal}
          onClose={handleCloseModal}
          onSave={handleSaveItem}
          initialData={editingItem}
        />
      )}
    </div>
  );
}
