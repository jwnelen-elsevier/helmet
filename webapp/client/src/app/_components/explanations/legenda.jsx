const Legenda = () => {
  return (
    <div className="border rouned p-2 flex flex-col space-y-2 items-center w-64">
      <h3>Legenda</h3>
      <div className="w-full flex bg-gradient-to-r from-red-500 via-white to-blue-500 py-1 px-2 rounded ">
        <span className="text-xs">Neg imp</span>
        <div class="flex-grow text-xs">No imp</div>
        <span className="text-xs">Pos imp</span>
      </div>
      <span className="bg-slate-400 rounded p-1 text-sm max-w-32">
        Selected Token
      </span>
    </div>
  );
};

export default Legenda;
