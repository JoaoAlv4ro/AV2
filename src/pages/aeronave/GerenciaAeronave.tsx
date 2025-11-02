import { DownloadSimpleIcon, NotePencilIcon, TrashIcon } from "@phosphor-icons/react";
import { FactoryIcon, PuzzlePieceIcon, TestTubeIcon } from "@phosphor-icons/react";
import { useParams } from "react-router";
import { useAeronaves } from "../../contexts/data/AeronaveContext";

function GerenciaAeronave() {
    const { aeronaveId } = useParams();
    const { getAeronaveById } = useAeronaves();

    const aeronave = aeronaveId ? getAeronaveById(aeronaveId) : null;

    if (!aeronave) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600">Aeronave não encontrada</h2>
                    <p className="text-gray-500">A aeronave com código "{aeronaveId}" não existe.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col">
                <span className="w-full font-base text-zinc-400">{aeronave.codigo}</span>
                <div className="flex justify-between w-full">
                    <div className="flex gap-3 items-center">
                        <h1 className="font-semibold text-4xl">{aeronave.modelo}</h1>
                        <span className={`px-2 py-1 rounded-2xl inline-flex items-center text-xs font-medium whitespace-nowrap ${aeronave.tipo === 'Militar'
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}>
                            {aeronave.tipo}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2.5 bg-blue-500 text-white rounded flex items-center hover:bg-blue-600 cursor-pointer">
                            <NotePencilIcon size={32} weight="bold" />
                        </button>
                        <button className="p-2.5 bg-zinc-300 rounded flex items-center hover:bg-zinc-400 cursor-pointer">
                            <DownloadSimpleIcon size={32} weight="bold" />
                        </button>
                        <button className="p-2.5 bg-red-300 text-red-950 rounded flex items-center hover:bg-red-400 cursor-pointer">
                            <TrashIcon size={32} weight="bold" />
                        </button>
                    </div>
                </div>
                <div className="w-full flex gap-6 text-lg">
                    <p className="text-zinc-600">
                        Alcance:
                        <span className="font-medium text-zinc-950"> {aeronave.alcance.toLocaleString()} km</span>
                    </p>
                    <p className="text-zinc-600">
                        Capacidade:
                        <span className="font-medium text-zinc-950"> {aeronave.capacidade.toLocaleString()} {aeronave.tipo === 'Militar' ? 'tripulantes' : 'passageiros'}</span>
                    </p>
                    <p className="text-zinc-600">
                        Tipo:
                        <span className="font-medium text-zinc-950"> {aeronave.tipo}</span>
                    </p>
                </div>
            </div>

            <div className="w-full h-px bg-zinc-400" />

            {/* Cards de Estatísticas */}
            <div className="flex gap-4 w-full">
                {/* Card Total de Etapas */}
                <div className="flex-1 bg-zinc-900 text-white rounded-lg p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-zinc-300 text-sm font-medium">Total de Etapas</span>
                        <span className="text-3xl font-bold">{aeronave.etapas.length}</span>
                    </div>
                    <div className="bg-zinc-700 p-3 rounded-lg">
                        <FactoryIcon size={32} weight="fill" />
                    </div>
                </div>

                {/* Card Total de Peças */}
                <div className="flex-1 bg-zinc-900 text-white rounded-lg p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-zinc-300 text-sm font-medium">Total de Peças</span>
                        <span className="text-3xl font-bold">{aeronave.pecas.length}</span>
                    </div>
                    <div className="bg-zinc-700 p-3 rounded-lg">
                        <PuzzlePieceIcon size={32} weight="fill" />
                    </div>
                </div>

                {/* Card Total de Testes */}
                <div className="flex-1 bg-zinc-900 text-white rounded-lg p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-zinc-300 text-sm font-medium">Total de Testes</span>
                        <span className="text-3xl font-bold">{aeronave.testes.length}</span>
                    </div>
                    <div className="bg-zinc-700 p-3 rounded-lg">
                        <TestTubeIcon size={32} weight="fill" />
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-zinc-400" />
            
            {/* 🚧 Lista de Equipe (Funcionários associados a todas as etapas desta aeronave.) */}
            <div>🚧 Lista de Equipe Em Construção 🚧</div>
        </>
    );
}

export default GerenciaAeronave;