import { DownloadSimpleIcon, NotePencilIcon, TrashIcon } from "@phosphor-icons/react";

function GerenciaAeronave() {
  return (
    <>
    
        <div className="flex flex-col">
            <span className="w-full font-base text-zinc-400">[Código Aeronave]</span>
            <div className="flex justify-between w-full">
                <h1 className="font-semibold text-4xl">[Nome Aeronave]</h1>
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
                    <span className="font-medium text-zinc-950"> [Valor Alcance]</span>
                </p>
                <p className="text-zinc-600">
                    Capacidade:
                    <span className="font-medium text-zinc-950"> [Valor Capacidade]</span>
                </p>
            </div>
        </div>

        <div className="w-full h-[1px] bg-zinc-400" />

    </>
  );
}

export default GerenciaAeronave;