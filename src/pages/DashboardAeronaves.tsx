import { useNavigate } from "react-router";
import { PlusIcon } from "@phosphor-icons/react";

function DashboardAeronaves() {
    const navigate = useNavigate();

    const aeronaveClick = (aeronave) => {
        navigate(`../aeronave/${aeronave.id}`)
    };

    // Mock data das aeronaves
    const aeronaves = [
        {
            id: '007',
            nome: 'Caça F-39 Gripen',
            tipo: 'Militar',
            alcance: '4.000km',
            capacidade: 'X',
            quantidadePecas: 14
        },
        {
            id: '747',
            nome: 'Boeing 747',
            tipo: 'Comercial',
            alcance: '13.450km',
            capacidade: 'X',
            quantidadePecas: 14
        },
        {
            id: '747',
            nome: 'Boeing 747',
            tipo: 'Comercial',
            alcance: '13.450km',
            capacidade: 'X',
            quantidadePecas: 14
        },
        
        // Adicione mais aeronaves aqui...
    ];

    return (
        <>
            <div className="w-full flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Aeronaves</h2>
                <button className="flex bg-blue-500 text-white px-4 py-2 rounded gap-2.5 items-center font-semibold hover:bg-blue-600 cursor-pointer">
                    <PlusIcon size={24} weight="bold" />
                    Adicionar Aeronave
                </button>
            </div>

            {/* Grid de Aeronaves */}
            <div className="grid grid-cols-2 gap-4">
                {aeronaves.map((aeronave) => (
                    <div 
                        key={aeronave.id}
                        className="bg-zinc-100 rounded-lg shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => aeronaveClick(aeronave)}
                    >
                        {/* Cabeçalho do Card */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-zinc-900">
                                {aeronave.nome}
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
                                <span className="text-zinc-600">Alcance</span>
                                <span className="font-medium">{aeronave.alcance}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Capacidade</span>
                                <span className="font-medium">{aeronave.capacidade}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-600">Quantidade de Peças</span>
                                <span className="font-medium">{aeronave.quantidadePecas}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
export default DashboardAeronaves;
