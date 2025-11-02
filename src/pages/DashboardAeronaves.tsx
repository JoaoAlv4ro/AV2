import { useNavigate } from "react-router";
import { PlusIcon } from "@phosphor-icons/react";
import { useAeronaves } from "../contexts/data/AeronaveContext";

function DashboardAeronaves() {
    const navigate = useNavigate();
    const { aeronaves, loading } = useAeronaves();

    const aeronaveClick = (codigo: string) => {
        navigate(`../aeronave/${codigo}`)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando aeronaves...</p>
                </div>
            </div>
        );
    }


    return (
        <>
            <div className="w-full flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Aeronaves</h2>
                <button className="flex bg-blue-500 text-white p-4  rounded gap-2.5 items-center font-semibold hover:bg-blue-600 cursor-pointer">
                    <PlusIcon size={24} weight="bold" />
                    Adicionar Aeronave
                </button>
            </div>


            {/* If para caso de nenhuma aeronave encontrada */}
            {aeronaves.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-600">Nenhuma aeronave encontrada.</p>
                </div>
            )}

            {/* Grid de Aeronaves */}
            <div className="grid grid-cols-2 gap-4">
                {aeronaves.map((aeronave) => (
                    <div 
                        key={aeronave.codigo}
                        className="bg-zinc-100 rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => aeronaveClick(aeronave.codigo)}
                    >
                        {/* Cabeçalho do Card */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-zinc-900">
                                {aeronave.modelo}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                aeronave.tipo === 'Militar' 
                                    ? 'bg-green-100 text-green-800 border border-green-300' 
                                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}>
                                {aeronave.tipo}
                            </span>
                        </div>

                        {/* Informações */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Código</span>
                                <span className="font-medium">{aeronave.codigo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Alcance</span>
                                <span className="font-medium">{aeronave.alcance.toLocaleString()} km</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Capacidade</span>
                                <span className="font-medium">
                                    {aeronave.capacidade.toLocaleString()} {aeronave.tipo === 'Militar' ? 'tripulantes' : 'passageiros'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Quantidade de Peças</span>
                                <span className="font-medium">{aeronave.pecas.length}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
export default DashboardAeronaves;
