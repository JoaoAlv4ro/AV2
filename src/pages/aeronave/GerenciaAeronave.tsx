import { DownloadSimpleIcon, NotePencilIcon, TrashIcon } from "@phosphor-icons/react";
import { FactoryIcon, PuzzlePieceIcon, TestTubeIcon } from "@phosphor-icons/react";
import { useParams } from "react-router";

function GerenciaAeronave() {
  const { aeronaveId } = useParams();

  // Mock data da aeronave (futuramente virá de uma API ou contexto)
  const aeronaveData = {
    id: aeronaveId,
    codigo: `AV-${aeronaveId}`,
    nome: aeronaveId === '007' ? 'Caça F-39 Gripen' : 'Boeing 747',
    alcance: aeronaveId === '007' ? '4.000km' : '13.450km',
    capacidade: aeronaveId === '007' ? '1 Piloto' : '416 Passageiros',
    etapas: [
      { id: 1, nome: 'Montagem da Fuselagem' },
      { id: 2, nome: 'Instalação das Asas' },
      { id: 3, nome: 'Sistema Hidráulico' },
      { id: 4, nome: 'Avionics' },
      { id: 5, nome: 'Testes Finais' }
    ],
    pecas: [
      { id: 1, nome: 'Motor Turbofan' },
      { id: 2, nome: 'Trem de Pouso' },
      { id: 3, nome: 'Flaps' },
      { id: 4, nome: 'Aileron' },
      { id: 5, nome: 'Rudder' },
      { id: 6, nome: 'Elevador' }
    ],
    testes: [
      { id: 1, nome: 'Teste de Pressurização' },
      { id: 2, nome: 'Teste de Motores' },
      { id: 3, nome: 'Teste de Avionics' }
    ]
  };

  return (
    <>
        <div className="flex flex-col">
            <span className="w-full font-base text-zinc-400">{aeronaveData.codigo}</span>
            <div className="flex justify-between w-full">
                <h1 className="font-semibold text-4xl">{aeronaveData.nome}</h1>
                <div className="flex gap-3">
                    <button className="p-2.5 bg-blue-500 text-white rounded flex items-center hover:bg-blue-600 cursor-pointer">
                        <NotePencilIcon size={32} weight="bold"/>
                    </button>
                    <button className="p-2.5 bg-zinc-300 rounded flex items-center hover:bg-zinc-400 cursor-pointer">
                        <DownloadSimpleIcon size={32} weight="bold"/>
                    </button>
                    <button className="p-2.5 bg-red-300 text-red-950 rounded flex items-center hover:bg-red-400 cursor-pointer">
                        <TrashIcon size={32} weight="bold"/>
                    </button>
                </div>
            </div>
            <div className="w-full flex gap-6 text-lg">
                <p className="text-zinc-600">
                    Alcance: 
                    <span className="font-medium text-zinc-950"> {aeronaveData.alcance}</span>
                </p>
                <p className="text-zinc-600">
                    Capacidade:
                    <span className="font-medium text-zinc-950"> {aeronaveData.capacidade}</span>
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
                    <span className="text-3xl font-bold">{aeronaveData.etapas.length}</span>
                </div>
                <div className="bg-zinc-700 p-3 rounded-lg">
                    <FactoryIcon size={32} weight="fill" />
                </div>
            </div>

            {/* Card Total de Peças */}
            <div className="flex-1 bg-zinc-900 text-white rounded-lg p-6 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-zinc-300 text-sm font-medium">Total de Peças</span>
                    <span className="text-3xl font-bold">{aeronaveData.pecas.length}</span>
                </div>
                <div className="bg-zinc-700 p-3 rounded-lg">
                    <PuzzlePieceIcon size={32} weight="fill" />
                </div>
            </div>

            {/* Card Total de Testes */}
            <div className="flex-1 bg-zinc-900 text-white rounded-lg p-6 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-zinc-300 text-sm font-medium">Total de Testes</span>
                    <span className="text-3xl font-bold">{aeronaveData.testes.length}</span>
                </div>
                <div className="bg-zinc-700 p-3 rounded-lg">
                    <TestTubeIcon size={32} weight="fill" />
                </div>
            </div>
        </div>

    </>
  );
}

export default GerenciaAeronave;